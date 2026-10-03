export type CacheTtl = '5m' | '1h'

export type CacheClock = {
  /** When the last main-thread model request was sent (ms since epoch); null after a compaction or before the first response. */
  lastAt: number | null
  /** Prompt tokens the next request re-sends. */
  tokens: number
  /** Model that answered last; a switch forfeits the cache, so inference skips it. */
  model: string | null
  /** Cache lifetime, and whether it is confirmed (by the transcript or a hit or miss) or assumed. */
  ttl: CacheTtl
  isTtlObserved: boolean
  /** True once the transcript reported the lifetime of a cache write; inference then stands aside. */
  isTtlExact: boolean
  /** The lastAt value an automatic compaction was already attempted for. */
  handledAt: number | null
}

