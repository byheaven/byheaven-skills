import type { EngineInterface, Register } from 'claude-code'

import type { CacheClock, CacheTtl } from '../types'

const TTL_MS: Record<CacheTtl, number> = { '5m': 5 * 60_000, '1h': 60 * 60_000 }

// A gap inside this window tells the two lifetimes apart: a 5m cache has
// lapsed, a 1h cache has not.
const INFER_MIN_GAP_MS = 5.5 * 60_000
const INFER_MAX_GAP_MS = 58 * 60_000
const INFER_MIN_TOKENS = 20_000

const initial: CacheClock = {
  lastAt: null,
  tokens: 0,
  model: null,
  ttl: '1h',
  isTtlObserved: false,
  isTtlExact: false,
  handledAt: null,
  notifiedAt: null,
  title: null,
  question: null,
}

// The tail of the transcript read after each turn: enough to reach the
// turn's last response, well under what one host command returns.
const TRANSCRIPT_TAIL_BYTES = 512 * 1024

/**
 * The lifetime of the last main-conversation cache write recorded in the
 * transcript tail, or null when none is found. The transcript format is
 * Claude Code's own and may change; callers fall back to inference.
 */
export function ttlFromTranscriptTail(tail: string): CacheTtl | null {
  const lines = tail.split('\n')

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    let entry: unknown
    try {
      entry = JSON.parse(lines[i])
    } catch {
      continue
    }
    const row = entry as {
      type?: string
      isSidechain?: boolean
      message?: { usage?: { cache_creation?: { ephemeral_1h_input_tokens?: number; ephemeral_5m_input_tokens?: number } } }
    }
    const written = row.type === 'assistant' && row.isSidechain !== true ? row.message?.usage?.cache_creation : undefined

    if ((written?.ephemeral_1h_input_tokens ?? 0) > 0) {
      return '1h'
    }
    if ((written?.ephemeral_5m_input_tokens ?? 0) > 0) {
      return '5m'
    }
  }

  return null
}

// The session's cache clock. Module state, saved to the plugin's store under
// the session id on each change, so a reload (a /config change, a press in
// the band) restores it in session.start instead of starting over.
let clock: CacheClock = initial

const storeKey = (sessionId: string): string => `clock:${sessionId}`

const update = ($: EngineInterface, fn: (prev: CacheClock) => CacheClock): void => {
  clock = fn(clock)
  const saved = clock
  void (async () => {
    await $.store.set(storeKey(await $.session.id()), saved)
  })().catch(() => {
    // An unsaved clock only costs the countdown after a reload.
  })
}

const QUESTION_MAX = 140

/**
 * The question a reply leaves the user with: its last sentence that ends in a
 * question mark, or else its last paragraph, without Markdown marks and cut to
 * fit a push notification. Null for an empty reply.
 */
export function questionOf(reply: string): string | null {
  const plain = reply
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_`#>]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  const paragraphs = plain.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(p => p !== '')

  if (paragraphs.length === 0) {
    return null
  }

  // A full stop inside a word (a version, a path) does not end a sentence.
  const sentences = paragraphs.flatMap(p => p.split(/(?<=[。！？])|(?<=[.!?])\s+/)).map(t => t.trim()).filter(t => t !== '')
  const asked = [...sentences].reverse().find(t => /[?？]$/.test(t))
  const text = asked ?? paragraphs[paragraphs.length - 1] ?? ''

  return text.length > QUESTION_MAX ? `${text.slice(0, QUESTION_MAX - 1)}…` : text
}

/** What the band shows, set by the clock's tick. */
type View = {
  /** Time left (`54:12`), `expired`, `compacting…`, or `—` before a request. */
  time: string
  /** Lifetime and tokens against the threshold: `1h · 612k/500k`. */
  detail: string
  /** Share of the cache lifetime left, 0 to 1; null when no countdown runs. */
  left: number | null
}

let view: View = { time: '—', detail: '', left: null }

// Whether the band shows its settings row; per process, closed after a reload.
let isExpanded = false

const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

const formatK = (tokens: number): string => `${Math.round(tokens / 1000)}k`

let isCompacting = false

const setView = ($: EngineInterface, next: View): void => {
  if (next.time !== view.time || next.detail !== view.detail || next.left !== view.left) {
    view = next
    $.ui.invalidate('ui.render')
  }
}

const THRESHOLD_PRESETS_K = [300, 500, 700]
const NOTIFY_LEAD_PRESETS_MIN = [10, 15, 20]

const BAR_CELLS = 10

// Icons for the desktop band; the terminal draws text instead.
const ON = '#1D9E75'
const OFF = '#888780'
const icon = (paths: string, color: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
const CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'
const COMPRESS = '<path d="M5 9h4V5M15 5v4h4M5 15h4v4M15 19v-4h4"/>'
const BELL = '<path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/>'
const bar = (left: number): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="4" viewBox="0 0 80 4"><rect width="80" height="4" rx="2" fill="${OFF}" fill-opacity="0.35"/><rect width="${Math.round(80 * left)}" height="4" rx="2" fill="${left > 0.2 ? ON : '#BA7517'}"/></svg>`

/** The `/config` key of one of this plugin's fields, as the engine names it. */
async function configKey($: EngineInterface, field: string): Promise<string | undefined> {
  const rows = await $.config.list()

  return rows.find(row => row.key.startsWith('cache-timer') && row.key.endsWith(`.${field}`))?.key
}

// Settings changed in the band where `/config` has no rows for them (a session
// the desktop app runs). Kept in the plugin store across sessions; a `/config`
// change to the same field drops the entry.
const OVERRIDES_KEY = 'settings'
let overrides: Record<string, boolean | number> = {}

const saveOverrides = async ($: EngineInterface): Promise<void> => {
  try {
    await $.store.set(OVERRIDES_KEY, overrides)
  } catch {
    // Unsaved: the change holds for this process only.
  }
}

async function setOption($: EngineInterface, field: string, value: boolean | number): Promise<void> {
  const key = await configKey($, field)

  if (key === undefined) {
    overrides = { ...overrides, [field]: value }
    $.ui.invalidate('ui.render')
    await saveOverrides($)

    return
  }

  const result = await $.config.set({ key, value })

  if ('deny' in result && result.deny !== undefined) {
    $.ui.toast(`cache-timer: ${field} not changed (${result.deny})`)
  }
}

// A session with no person at the prompt (-p, the SDK, and so every
// desktop-app session) refuses $.session.compact(): compaction there runs as
// a /compact prompt, which $.command.run queues as if the person typed it.
let isHeadless = false

async function queueCompact($: EngineInterface, s: CacheClock): Promise<void> {
  // One attempt per idle period: the /compact that runs resets the clock
  // through the session.compact hook; one that never runs is not repeated.
  update($, prev => ({ ...prev, handledAt: s.lastAt }))

  try {
    await $.command.run({ command: 'compact' })
    $.ui.toast(`cache-timer: ran /compact before cache expiry (${formatK(s.tokens)})`)
  } catch (err) {
    $.ui.toast(`cache-timer: could not run /compact (${String(err)})`)
  }
}

async function compactBeforeExpiry($: EngineInterface, s: CacheClock): Promise<void> {
  isCompacting = true
  setView($, { time: 'compacting…', detail: formatK(s.tokens), left: null })

  try {
    if (isHeadless) {
      await queueCompact($, s)

      return
    }

    const result = await $.session.compact()

    if (result.skip !== undefined) {
      update($, prev => ({ ...prev, handledAt: s.lastAt }))
      $.ui.toast(`cache-timer: auto-compaction skipped (${result.skip})`)
    } else {
      // The engine skips the caller's own session.compact hook, so the reset
      // that hook does for other compactions happens here.
      update($, prev => ({ ...prev, lastAt: null, tokens: result.tokensAfter ?? 0, handledAt: null }))
      const after = result.tokensAfter === undefined ? '' : ` → ${formatK(result.tokensAfter)}`
      $.ui.toast(`compacted before cache expiry: ${formatK(s.tokens)}${after}`)
    }
  } catch {
    // A turn is running: compact rejects until it ends, and handledAt stays
    // unset so a later tick tries again if the turn ends without a response.
  } finally {
    isCompacting = false
  }
}

export const register: Register = (on, options) => {
  const option = (field: string, fallback: boolean | number) => overrides[field] ?? options[field] ?? fallback
  const isAutoCompact = () => option('auto_compact', true) !== false
  const isNotify = () => option('notify', true) !== false
  const notifyLeadMin = () => Number(option('notify_lead_minutes', 10))
  const thresholdK = () => Number(option('threshold_k', 500))
  const ttlMode = String(options.cache_ttl ?? 'auto')
  const leadMs: Record<CacheTtl, number> = {
    '1h': Number(options.lead_seconds_1h ?? 300) * 1000,
    '5m': Number(options.lead_seconds_5m ?? 60) * 1000,
  }

  // Tokens against the compaction threshold while auto-compaction is on.
  const tokensOf = (tokens: number): string => (isAutoCompact() ? `${formatK(tokens)}/${thresholdK()}k` : formatK(tokens))

  const effectiveTtl = (s: CacheClock): { ttl: CacheTtl; label: string } => {
    if (ttlMode === '1h' || ttlMode === '5m') {
      return { ttl: ttlMode, label: ttlMode }
    }

    return { ttl: s.ttl, label: s.ttl }
  }

  on('turn.step', async function* ($, e, next) {
    // The cache entry is refreshed when the request is processed, not when
    // the response ends, so the countdown starts from the send time.
    const sentAt = await $.clock.now()
    const result = yield* next(e)
    const usage = result.usage

    if (e.agentId !== undefined || usage === null) {
      return result
    }

    const tokens =
      usage.input_tokens +
      usage.cache_read_input_tokens +
      usage.cache_creation_input_tokens +
      usage.output_tokens

    update($, prev => {
      let { ttl, isTtlObserved } = prev
      const gap = prev.lastAt === null ? 0 : sentAt - prev.lastAt
      const isComparable =
        !prev.isTtlExact &&
        prev.lastAt !== null &&
        prev.model === usage.model &&
        prev.tokens >= INFER_MIN_TOKENS &&
        gap >= INFER_MIN_GAP_MS &&
        gap <= INFER_MAX_GAP_MS

      if (isComparable) {
        if (usage.cache_read_input_tokens >= prev.tokens * 0.5) {
          ttl = '1h'
          isTtlObserved = true
        } else if (usage.cache_read_input_tokens <= prev.tokens * 0.1) {
          ttl = '5m'
          isTtlObserved = true
        }
      }

      return { ...prev, lastAt: sentAt, tokens, model: usage.model, ttl, isTtlObserved }
    })

    return result
  })

  // Any compaction (manual, automatic, ours) replaces the cached prefix.
  on('session.compact', async ($, e, next) => {
    const result = await next(e)

    if (e.trigger !== 'precompute' && result.messages !== undefined && e.agentId === undefined) {
      update($, prev => ({
        ...prev,
        lastAt: null,
        tokens: result.tokensAfter ?? 0,
        handledAt: null,
      }))
    }

    return result
  })

  // At the end of each main turn, take the exact lifetime from the transcript.
  // The session's name, for the notification.
  on('classic.UserPromptSubmit', async ($, e, next) => {
    if (e.session_title !== undefined && e.session_title !== clock.title) {
      update($, prev => ({ ...prev, title: e.session_title ?? null }))
    }

    return next(e)
  })

  on('classic.Stop', async ($, e, next) => {
    const result = await next(e)
    update($, prev => ({ ...prev, question: questionOf(e.last_assistant_message ?? '') }))

    try {
      const ran = await $.process.run(['tail', '-c', String(TRANSCRIPT_TAIL_BYTES), e.transcript_path])
      const ttl = ran.exitCode === 0 ? ttlFromTranscriptTail(ran.stdout) : null

      if (ttl !== null) {
        update($, prev => ({ ...prev, ttl, isTtlObserved: true, isTtlExact: true }))
      }
    } catch {
      // No tail command or no transcript: inference keeps the estimate.
    }

    return result
  })

  // A /clear or resume starts another conversation in the same process.
  on('session.end', async ($, e, next) => {
    try {
      await $.store.delete(storeKey(e.sessionId))
    } catch {
      // A leftover entry is only read back by a session with this id.
    }

    if (e.reason === 'clear' || e.reason === 'resume') {
      update($, prev => ({ ...initial, ttl: prev.ttl, isTtlObserved: prev.isTtlObserved, isTtlExact: prev.isTtlExact }))
    }

    return next(e)
  })

  // A change made in /config wins over one the band kept in the store.
  on('config.set', async ($, e, next) => {
    const result = await next(e)
    const field = e.key.startsWith('cache-timer') ? e.key.slice(e.key.lastIndexOf('.') + 1) : undefined

    if (field !== undefined && field in overrides && !('deny' in result && result.deny !== undefined)) {
      const { [field]: _dropped, ...rest } = overrides
      overrides = rest
      await saveOverrides($)
    }

    return result
  })

  on('session.start', async ($, e, next) => {
    isHeadless = !e.isInteractive

    try {
      const saved = await $.store.get(OVERRIDES_KEY)

      if (saved !== null && typeof saved === 'object') {
        overrides = saved as Record<string, boolean | number>
        $.ui.invalidate('ui.render')
      }
    } catch {
      // No saved settings: the manifest's values apply.
    }

    try {
      const saved = (await $.store.get(storeKey(await $.session.id()))) as CacheClock | undefined

      if (saved !== undefined) {
        clock = { ...initial, ...saved }
      }
    } catch {
      // Nothing saved: the next request sets the clock.
    }

    $.clock.every(1000, async () => {
      if (isCompacting) {
        return
      }

      const s = clock
      const { ttl, label } = effectiveTtl(s)

      if (s.lastAt === null) {
        setView($, { time: '—', detail: s.tokens > 0 ? tokensOf(s.tokens) : '', left: null })

        return
      }

      const remaining = TTL_MS[ttl] - ((await $.clock.now()) - s.lastAt)
      const isLarge = isAutoCompact() && s.tokens >= thresholdK() * 1000

      if (remaining <= 0) {
        setView($, { time: 'expired', detail: `${label} · ${tokensOf(s.tokens)}`, left: 0 })

        return
      }

      const willCompact = isLarge && s.handledAt !== s.lastAt
      setView($, { time: formatRemaining(remaining), detail: `${label} · ${tokensOf(s.tokens)}`, left: remaining / TTL_MS[ttl] })

      // A 1h cache only: a 5m cache would notify after nearly every reply.
      if (isNotify() && ttl === '1h' && remaining <= notifyLeadMin() * 60_000 && s.notifiedAt !== s.lastAt) {
        update($, prev => ({ ...prev, notifiedAt: s.lastAt }))
        const message = [s.title, s.question === null ? null : `「${s.question}」`, `— cache expires in ${Math.ceil(remaining / 60_000)} min`]
          .filter(line => line !== null && line !== '')
          .join('\n')
        void $.tool
          .call({ tool: 'PushNotification', message, status: 'proactive' } as never)
          .catch(() => {
            // No push tool or a refused call: the band still shows the countdown.
          })
      }

      if (isLarge && remaining <= leadMs[ttl] && s.handledAt !== s.lastAt) {
        await compactBeforeExpiry($, s)
      }
    })

    return next(e)
  })

  // The band above the prompt: the countdown, two state icons, and a gear that
  // opens a row with the compaction and notification settings. A change
  // writes the setting, which reloads the mod.
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    // The mobile app has no Select; it has not drawn mod UI so far either.
    if (e.props.hasSurvey || e.surface === 'mobile') {
      return next(e)
    }

    const isDesktop = e.surface === 'desktop'
    const { Box, Button, Select, Text } = $.ui.resolve(e)
    const Svg = isDesktop ? $.ui.resolve(e).Svg : undefined
    const auto = isAutoCompact()
    const notify = isNotify()
    const thresholdNow = thresholdK()
    const leadNow = notifyLeadMin()
    const thresholds = THRESHOLD_PRESETS_K.includes(thresholdNow) ? THRESHOLD_PRESETS_K : [...THRESHOLD_PRESETS_K, thresholdNow]
    const leads = NOTIFY_LEAD_PRESETS_MIN.includes(leadNow) ? NOTIFY_LEAD_PRESETS_MIN : [...NOTIFY_LEAD_PRESETS_MIN, leadNow]
    const filled = view.left === null ? 0 : Math.round(BAR_CELLS * view.left)

    const state = (paths: string, isOn: boolean, word: string, alt: string) =>
      Svg !== undefined ? (
        <Svg source={icon(paths, isOn ? ON : OFF)} alt={`${alt} ${isOn ? 'on' : 'off'}`} width={14} height={14} />
      ) : (
        <Text color={isOn ? 'success' : 'inactive'}>{word}</Text>
      )

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" justifyContent="space-between" gap={2}>
          <Box flexDirection="row" alignItems="center" gap={1}>
            {Svg !== undefined ? <Svg source={icon(CLOCK, OFF)} alt="cache" width={14} height={14} /> : <Text dimColor>cache</Text>}
            <Text bold>{view.time}</Text>
            {view.left === null ? null : Svg !== undefined ? (
              <Svg source={bar(view.left)} alt={`${Math.round(view.left * 100)}% left`} width={80} height={4} />
            ) : (
              <Text>
                <Text color={view.left > 0.2 ? 'success' : 'warning'}>{'━'.repeat(filled)}</Text>
                <Text dimColor>{'─'.repeat(BAR_CELLS - filled)}</Text>
              </Text>
            )}
            <Text dimColor>{view.detail}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={1}>
            {state(COMPRESS, auto, 'compact', 'auto-compact')}
            {state(BELL, notify, 'notify', 'notify')}
            <Button key="settings" label="⚙" plain dimColor={!isExpanded} onPress={() => {
              isExpanded = !isExpanded
              $.ui.invalidate('ui.render')
            }} />
          </Box>
        </Box>
        {isExpanded ? (
          <Box flexDirection="row" alignItems="center" gap={1}>
            <Button key="auto" label="compact" variant={auto ? 'primary' : 'secondary'} onPress={() => setOption($, 'auto_compact', !auto)} />
            <Select
              key="threshold"
              options={thresholds.map(k => ({ value: String(k), label: `≥${k}k` }))}
              value={String(thresholdNow)}
              onSelect={(value: string) => setOption($, 'threshold_k', Number(value))}
            />
            <Text dimColor>│</Text>
            <Button key="notify" label="notify" variant={notify ? 'primary' : 'secondary'} onPress={() => setOption($, 'notify', !notify)} />
            <Select
              key="notify_lead"
              options={leads.map(m => ({ value: String(m), label: `${m}m before` }))}
              value={String(leadNow)}
              onSelect={(value: string) => setOption($, 'notify_lead_minutes', Number(value))}
            />
          </Box>
        ) : null}
      </Box>
    )
  })
}
