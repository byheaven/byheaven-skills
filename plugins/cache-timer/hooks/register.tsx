import type { EngineInterface, Register, SessionCompacted, SessionMessage } from 'claude-code'

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
      entry = JSON.parse(lines[i] ?? '')
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
// the session id on each change, so a reload (a /config change, one made
// through /cache-timer) restores it in session.start instead of starting over.
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

const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

const formatK = (tokens: number): string => `${Math.round(tokens / 1000)}k`

// The status line under the prompt: the time left and the tokens the next
// request re-sends (`54:12 · 612k`), none before a request. A status line,
// unlike a band, stays drawn in the desktop app between turns. Null until this
// process first sets it, so a line left by an earlier load is replaced.
let status: string | undefined | null = null

const setStatus = ($: EngineInterface, next: string | undefined): void => {
  if (next !== status) {
    status = next
    $.ui.status(next)
  }
}

// While Claude Code holds a summary it wrote ahead of a compaction (as its idle
// compaction does while you are away), the tokens the next request is
// estimated to send once the summary replaces the conversation; the status
// line shows it after an arrow. Not saved: a new process has no summary.
let summaryTokens: number | null = null

/** A message's size as the estimate weighs it: its text and tool blocks, in characters. */
const charsOf = (messages: readonly SessionMessage[]): number =>
  messages.reduce((sum, m) => sum + m.text.length + JSON.stringify(m.toolUses).length + JSON.stringify(m.toolResults ?? []).length, 0)

/**
 * What the next request will send once a precomputed summary replaces the
 * conversation, from the last request's size: the fixed part (system prompt,
 * tools, memory) as /context counts it, the summary as its writer reported
 * it, and the messages the summary keeps, by their share of the old messages'
 * characters. An estimate: /context counts locally and characters stand in for
 * tokens.
 */
async function estimateAfterSummary($: EngineInterface, before: number, old: readonly SessionMessage[], summary: SessionCompacted): Promise<number> {
  const handles = new Set(old.map(m => m.handle))
  const kept = summary.messages.filter(m => m.handle !== undefined && handles.has(m.handle))
  const written = summary.messages.filter(m => m.handle === undefined || !handles.has(m.handle))
  const writtenTokens = summary.usage?.output_tokens ?? Math.round(charsOf(written) / 4)
  let fixed = 0

  try {
    const breakdown = (await $.session.usage({ breakdown: 'summary' })).context.breakdown
    const messagesRow = breakdown?.categories.find(c => c.name === 'Messages')

    if (breakdown !== undefined && messagesRow !== undefined) {
      fixed = Math.max(0, breakdown.totalTokens - messagesRow.tokens)
    }
  } catch {
    // No breakdown: the estimate leaves the fixed part out.
  }

  const oldChars = charsOf(old)
  const keptShare = oldChars === 0 ? 0 : charsOf(kept) / oldChars

  return Math.round(fixed + writtenTokens + Math.max(0, before - fixed) * keptShare)
}

const THRESHOLD_PRESETS_K = [300, 500, 700]
const NOTIFY_LEAD_PRESETS_MIN = [10, 15, 20]

/** The `/config` key of one of this plugin's fields, as the engine names it. */
async function configKey($: EngineInterface, field: string): Promise<string | undefined> {
  const rows = await $.config.list()

  return rows.find(row => row.key.startsWith('cache-timer') && row.key.endsWith(`.${field}`))?.key
}

// Settings changed through /cache-timer where `/config` has no rows for them (a
// session the desktop app runs). Kept in the plugin store across sessions; a `/config`
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

async function setOption($: EngineInterface, field: string, value: boolean | number): Promise<boolean> {
  const key = await configKey($, field)

  if (key === undefined) {
    overrides = { ...overrides, [field]: value }
    await saveOverrides($)
  } else {
    const result = await $.config.set({ key, value })

    if ('deny' in result && result.deny !== undefined) {
      $.ui.toast(`cache-timer: ${field} not changed (${result.deny})`)

      return false
    }
  }

  if (field === 'threshold_k') {
    await applyThreshold($, Number(value))
  }

  return true
}

// Claude Code's own idle compaction compacts a long conversation shortly
// before its 1-hour cache expires. Its /config row exists only where the
// engine runs it; the row's value is the person's switch.
type IdleCompaction = 'on' | 'off' | 'unavailable'

const IDLE_ROW = 'idleCompaction'

// Claude Code raises a lower idle-compaction minimum to this floor, and uses
// its default when the variable is unset or not a positive whole number.
const IDLE_FLOOR_K = 100
const IDLE_DEFAULT_K = 200

// The minimum Claude Code reads now, in thousands of tokens: what /cache-timer
// shows, whether or not the mod's own write went through.
let appliedK = IDLE_DEFAULT_K

let idle: IdleCompaction = 'unavailable'

const setIdleState = (next: IdleCompaction): void => {
  idle = next
}

async function readIdle($: EngineInterface): Promise<void> {
  try {
    const row = (await $.config.list()).find(r => r.key === IDLE_ROW)
    setIdleState(row === undefined ? 'unavailable' : row.value === false ? 'off' : 'on')
  } catch {
    // An unreadable menu leaves the last state shown.
  }
}

async function setIdle($: EngineInterface, value: boolean): Promise<void> {
  try {
    const result = await $.config.set({ key: IDLE_ROW, value })

    if ('deny' in result && result.deny !== undefined) {
      $.ui.toast(`cache-timer: idle compaction not changed (${result.deny})`)

      return
    }
    setIdleState(value ? 'on' : 'off')
  } catch (err) {
    $.ui.toast(`cache-timer: idle compaction not changed (${String(err)})`)
  }
}

async function readThreshold($: EngineInterface): Promise<void> {
  try {
    const raw = await $.env.get('CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS')
    const tokens = raw !== undefined && /^\d+$/.test(raw) && Number(raw) >= 1 ? Number(raw) : IDLE_DEFAULT_K * 1000
    appliedK = Math.max(IDLE_FLOOR_K, Math.round(tokens / 1000))
  } catch {
    // An unreadable environment leaves the last value shown.
  }
}

// Claude Code reads its idle-compaction minimum from this process's
// environment on every check, so setting it takes effect at once.
async function applyThreshold($: EngineInterface, k: number): Promise<void> {
  try {
    const result = await $.env.set('CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS', String(Math.round(Math.max(IDLE_FLOOR_K, k) * 1000)))

    if (result.deny !== undefined) {
      $.ui.toast(`cache-timer: idle-compaction threshold not set (${result.deny})`)
    }
  } catch (err) {
    $.ui.toast(`cache-timer: idle-compaction threshold not set (${String(err)})`)
  }

  await readThreshold($)
}

/** The notification settings the dialog starts from. */
type Notify = { isOn: boolean; leadMinutes: number }

/**
 * `/cache-timer`: asks which setting to change, then its new value, in the
 * engine's own question dialog, writes it, and says what changed. Dismissing
 * the dialog, or typing an answer it cannot read, changes nothing.
 */
async function changeSetting($: EngineInterface, notify: Notify): Promise<string | undefined> {
  const idleChoice = `Idle compaction (${idle})`
  const thresholdChoice = `Threshold (${appliedK}k)`
  const notifyChoice = `Notification (${notify.isOn ? `${notify.leadMinutes} min before` : 'off'})`

  try {
    const which = await $.ui.ask('Which setting?', [...(idle === 'unavailable' ? [] : [idleChoice]), thresholdChoice, notifyChoice])

    if (which === idleChoice) {
      const value = await $.ui.ask('Idle compaction?', ['On', 'Off'])

      if (value !== 'On' && value !== 'Off') {
        return undefined
      }
      await setIdle($, value === 'On')

      return `Idle compaction ${idle}`
    }

    if (which === thresholdChoice) {
      const value = await $.ui.ask('Compact an idle conversation from how many tokens?', THRESHOLD_PRESETS_K.map(k => `${k}k`))
      const k = Number(value.trim().toLowerCase().replace(/k$/, ''))

      if (!Number.isFinite(k) || k <= 0 || !(await setOption($, 'threshold_k', k))) {
        return undefined
      }

      return `Threshold ${appliedK}k`
    }

    if (which === notifyChoice) {
      const value = await $.ui.ask('Notify before the cache expires?', ['Off', ...NOTIFY_LEAD_PRESETS_MIN.map(m => `${m} min before`)])

      if (value === 'Off') {
        return (await setOption($, 'notify', false)) ? 'Notification off' : undefined
      }

      const minutes = Number(value.replace(/\s*min before$/, ''))

      if (!Number.isFinite(minutes) || minutes <= 0) {
        return undefined
      }
      if (minutes !== notify.leadMinutes && !(await setOption($, 'notify_lead_minutes', minutes))) {
        return undefined
      }
      if (!notify.isOn && !(await setOption($, 'notify', true))) {
        return undefined
      }

      return `Notification ${minutes} min before`
    }
  } catch {
    // Dismissed: nothing changes.
  }

  return undefined
}

export const register: Register = (on, options) => {
  const option = (field: string, fallback: boolean | number) => overrides[field] ?? options[field] ?? fallback
  const isNotify = () => option('notify', true) !== false
  const notifyLeadMin = () => Number(option('notify_lead_minutes', 10))
  const thresholdK = () => Number(option('threshold_k', 500))
  const ttlMode = String(options.cache_ttl ?? 'auto')

  const effectiveTtl = (s: CacheClock): CacheTtl => (ttlMode === '1h' || ttlMode === '5m' ? ttlMode : s.ttl)

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
    // The request either used a waiting summary or went out without it; its
    // size is now the real one.
    summaryTokens = null

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

  // Any compaction (manual, automatic, idle) replaces the cached prefix.
  on('session.compact', async ($, e, next) => {
    const result = await next(e)

    if (result.messages === undefined || e.agentId !== undefined) {
      return result
    }

    if (e.trigger === 'precompute') {
      // Kept for the next compaction; nothing changes until it runs.
      summaryTokens = await estimateAfterSummary($, clock.tokens, e.messages, result)
    } else {
      summaryTokens = null
      update($, prev => ({
        ...prev,
        lastAt: null,
        tokens: result.tokensAfter ?? 0,
      }))
    }

    return result
  })

  // The session's name, for the notification.
  on('classic.UserPromptSubmit', async ($, e, next) => {
    if (e.session_title !== undefined && e.session_title !== clock.title) {
      update($, prev => ({ ...prev, title: e.session_title ?? null }))
    }

    return next(e)
  })

  // At the end of each main turn, take the exact lifetime from the transcript,
  // and look again whether idle compaction runs.
  on('classic.Stop', async ($, e, next) => {
    const result = await next(e)
    update($, prev => ({ ...prev, question: questionOf(e.last_assistant_message ?? '') }))
    await readIdle($)

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
      summaryTokens = null
      update($, prev => ({ ...initial, ttl: prev.ttl, isTtlObserved: prev.isTtlObserved, isTtlExact: prev.isTtlExact }))
    }

    return next(e)
  })

  // A change made in /config wins over one /cache-timer kept in the store; the
  // idle-compaction switch flipped there shows in /cache-timer.
  on('config.set', async ($, e, next) => {
    const result = await next(e)
    const isWritten = !('deny' in result && result.deny !== undefined)
    const field = e.key.startsWith('cache-timer') ? e.key.slice(e.key.lastIndexOf('.') + 1) : undefined

    if (field !== undefined && field in overrides && isWritten) {
      const { [field]: _dropped, ...rest } = overrides
      overrides = rest
      await saveOverrides($)
    }

    if (e.key === IDLE_ROW && isWritten) {
      setIdleState(e.value === false ? 'off' : 'on')
    }

    return result
  })

  on('session.start', async ($, e, next) => {
    try {
      const saved = await $.store.get(OVERRIDES_KEY)

      if (saved !== null && typeof saved === 'object') {
        overrides = saved as Record<string, boolean | number>
      }
    } catch {
      // No saved settings: the manifest's values apply.
    }

    await applyThreshold($, thresholdK())
    await readIdle($)

    try {
      const saved = (await $.store.get(storeKey(await $.session.id()))) as CacheClock | undefined

      if (saved !== undefined) {
        clock = { ...initial, ...saved }
      }
    } catch {
      // Nothing saved: the next request sets the clock.
    }

    $.command.register({ name: 'cache-timer', description: 'Change idle compaction, its threshold, or the expiry notification' }).catch(() => {
      // No command: /config still holds the settings.
    })

    $.clock.every(1000, async () => {
      const s = clock
      const ttl = effectiveTtl(s)

      if (s.lastAt === null) {
        setStatus($, undefined)

        return
      }

      const remaining = TTL_MS[ttl] - ((await $.clock.now()) - s.lastAt)
      const after = summaryTokens === null ? '' : ` → ~${formatK(summaryTokens)}`
      setStatus($, `${formatRemaining(remaining)} · ${formatK(s.tokens)}${after}`)

      if (remaining <= 0) {
        return
      }

      // A 1h cache only: a 5m cache would notify after nearly every reply.
      if (isNotify() && ttl === '1h' && remaining <= notifyLeadMin() * 60_000 && s.notifiedAt !== s.lastAt) {
        update($, prev => ({ ...prev, notifiedAt: s.lastAt }))
        const message = [s.title, s.question === null ? null : `「${s.question}」`, `— cache expires in ${Math.ceil(remaining / 60_000)} min`]
          .filter(line => line !== null && line !== '')
          .join('\n')
        void $.tool
          .call({ tool: 'PushNotification', message, status: 'proactive' } as never)
          .catch(() => {
            // No push tool or a refused call: the status line still shows the countdown.
          })
      }
    })

    return next(e)
  })

  on('command.run', { command: 'cache-timer' }, async $ => ({
    text: (await changeSetting($, { isOn: isNotify(), leadMinutes: notifyLeadMin() })) ?? 'No change',
  }))
}
