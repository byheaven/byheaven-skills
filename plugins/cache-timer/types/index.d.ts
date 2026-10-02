export type CacheTtl = '5m' | '1h'

export type CacheClock = {
  /** When the last main-thread model response arrived (ms since epoch); null after a compaction or before the first response. */
  lastAt: number | null
  /** Prompt tokens the next request re-sends. */
  tokens: number
  /** Model that answered last; a switch forfeits the cache, so inference skips it. */
  model: string | null
  /** Inferred cache lifetime and whether a cache hit or miss has confirmed it. */
  ttl: CacheTtl
  isTtlObserved: boolean
  /** The lastAt value an automatic compaction was already attempted for. */
  handledAt: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'cache-timer': { clock: CacheClock }
  }
}
