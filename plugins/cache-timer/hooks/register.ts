import { atom, read, update } from 'claude-code'
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
  handledAt: null,
}

const clock = atom({ plugin: 'cache-timer', key: 'clock' } as const, initial)

const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

const formatK = (tokens: number): string => `${Math.round(tokens / 1000)}k`

let isCompacting = false

async function compactBeforeExpiry($: EngineInterface, s: CacheClock): Promise<void> {
  isCompacting = true
  $.ui.status(`缓存即将过期 · 正在压缩 ${formatK(s.tokens)}…`)

  try {
    const result = await $.session.compact()

    if (result.skip !== undefined) {
      await update($, clock, prev => ({ ...prev, handledAt: s.lastAt }))
      $.ui.toast(`缓存计时：自动压缩被跳过（${result.skip}）`)
    } else {
      // The engine skips the caller's own session.compact hook, so the reset
      // that hook does for other compactions happens here.
      await update($, clock, prev => ({ ...prev, lastAt: null, tokens: result.tokensAfter ?? 0, handledAt: null }))
      const after = result.tokensAfter === undefined ? '' : ` → ${formatK(result.tokensAfter)}`
      $.ui.toast(`缓存过期前已自动压缩：${formatK(s.tokens)}${after}`)
    }
  } catch {
    // A turn is running: compact rejects until it ends, and handledAt stays
    // unset so a later tick tries again if the turn ends without a response.
  } finally {
    isCompacting = false
  }
}

export const register: Register = (on, options) => {
  const thresholdTokens = Number(options.threshold_k ?? 500) * 1000
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

    await update($, clock, prev => {
      let { ttl, isTtlObserved } = prev
      const gap = prev.lastAt === null ? 0 : sentAt - prev.lastAt
      const isComparable =
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
      await update($, clock, prev => ({
        ...prev,
        lastAt: null,
        tokens: result.tokensAfter ?? 0,
        handledAt: null,
      }))
    }

    return result
  })

  // A /clear or resume starts another conversation in the same process.
  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear' || e.reason === 'resume') {
      await update($, clock, prev => ({ ...initial, ttl: prev.ttl, isTtlObserved: prev.isTtlObserved }))
    }

    return next(e)
  })

  on('session.start', async ($, e, next) => {
    $.clock.every(1000, async () => {
      if (isCompacting) {
        return
      }

      const s = await read($, clock)
      const { ttl, label } = effectiveTtl(s)

      if (s.lastAt === null) {
        $.ui.status(s.tokens > 0 ? `缓存 — · ${formatK(s.tokens)}` : undefined)

        return
      }

      const remaining = TTL_MS[ttl] - ((await $.clock.now()) - s.lastAt)
      const isLarge = s.tokens >= thresholdTokens

      if (remaining <= 0) {
        $.ui.status(`缓存已过期 (${label}) · ${formatK(s.tokens)}`)

        return
      }

      const plan = isLarge && s.handledAt !== s.lastAt ? ` · 剩 ${formatRemaining(leadMs[ttl])} 时压缩` : ''
      $.ui.status(
        `缓存 ${formatRemaining(remaining)} (${label}) · ${formatK(s.tokens)}/${formatK(thresholdTokens)}${plan}`,
      )

      if (isLarge && remaining <= leadMs[ttl] && s.handledAt !== s.lastAt) {
        await compactBeforeExpiry($, s)
      }
    })

    return next(e)
  })
}
