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

// The band's text, set by the clock's tick; undefined before anything is known.
let line: string | undefined

const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

const formatK = (tokens: number): string => `${Math.round(tokens / 1000)}k`

let isCompacting = false

const setLine = ($: EngineInterface, next: string | undefined): void => {
  if (next !== line) {
    line = next
    $.ui.invalidate('ui.render')
  }
}

const THRESHOLD_PRESETS_K = [500, 600, 700, 800]

/** The `/config` key of one of this plugin's fields, as the engine names it. */
async function configKey($: EngineInterface, field: string): Promise<string | undefined> {
  const rows = await $.config.list()

  return rows.find(row => row.key.startsWith('cache-timer') && row.key.endsWith(`.${field}`))?.key
}

async function setOption($: EngineInterface, field: string, value: boolean | number): Promise<void> {
  const key = await configKey($, field)
  const result = key === undefined ? { deny: 'no such setting' } : await $.config.set({ key, value })

  if ('deny' in result && result.deny !== undefined) {
    $.ui.toast(`cache-timer: ${field} not changed (${result.deny})`)
  }
}

async function compactBeforeExpiry($: EngineInterface, s: CacheClock): Promise<void> {
  isCompacting = true
  setLine($, `cache expiring · compacting ${formatK(s.tokens)}…`)

  try {
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
  const isAutoCompact = options.auto_compact !== false
  const thresholdK = Number(options.threshold_k ?? 500)
  const thresholdTokens = thresholdK * 1000
  const ttlMode = String(options.cache_ttl ?? 'auto')
  const leadMs: Record<CacheTtl, number> = {
    '1h': Number(options.lead_seconds_1h ?? 300) * 1000,
    '5m': Number(options.lead_seconds_5m ?? 60) * 1000,
  }

  const effectiveTtl = (s: CacheClock): { ttl: CacheTtl; label: string } => {
    if (ttlMode === '1h' || ttlMode === '5m') {
      return { ttl: ttlMode, label: ttlMode }
    }

    return { ttl: s.ttl, label: s.isTtlObserved ? s.ttl : `${s.ttl}?` }
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
  on('classic.Stop', async ($, e, next) => {
    const result = await next(e)

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

  on('session.start', async ($, e, next) => {
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
        setLine($, s.tokens > 0 ? `cache — · ${formatK(s.tokens)}` : undefined)

        return
      }

      const remaining = TTL_MS[ttl] - ((await $.clock.now()) - s.lastAt)
      const isLarge = isAutoCompact && s.tokens >= thresholdTokens

      if (remaining <= 0) {
        setLine($, `cache expired (${label}) · ${formatK(s.tokens)}`)

        return
      }

      const plan = isLarge && s.handledAt !== s.lastAt ? ` · compacts at ${formatRemaining(leadMs[ttl])} left` : ''
      setLine($, `cache ${formatRemaining(remaining)} (${label}) · ${formatK(s.tokens)}${plan}`)

      if (isLarge && remaining <= leadMs[ttl] && s.handledAt !== s.lastAt) {
        await compactBeforeExpiry($, s)
      }
    })

    return next(e)
  })

  // The band above the prompt: the countdown, the auto-compaction switch, and
  // the threshold. A press writes the setting, which reloads the mod.
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    // The mobile app has no Select; it has not drawn mod UI so far either.
    if (e.props.hasSurvey || e.surface === 'mobile') {
      return next(e)
    }

    const { Box, Button, Select, Text } = $.ui.resolve(e)
    const presets = THRESHOLD_PRESETS_K.includes(thresholdK) ? THRESHOLD_PRESETS_K : [...THRESHOLD_PRESETS_K, thresholdK]

    return (
      <Box flexDirection="row" gap={1}>
        <Text dimColor>
          {line ?? 'cache —'}
        </Text>
        <Button
          key="auto"
          label={isAutoCompact ? 'on' : 'off'}
          onPress={() => setOption($, 'auto_compact', !isAutoCompact)}
        />
        <Select
          key="threshold"
          options={presets.map(k => ({ value: String(k), label: `${k}k` }))}
          value={String(thresholdK)}
          onSelect={(value: string) => setOption($, 'threshold_k', Number(value))}
        />
      </Box>
    )
  })
}
