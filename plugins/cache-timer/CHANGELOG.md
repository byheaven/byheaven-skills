# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/commits/main/plugins/cache-timer)

- **Cache countdown** Shows in the status line how long the prompt cache of
  the conversation stays warm, and how many tokens the next request re-sends
- **Compaction before expiry** Compacts a conversation above a configurable
  token threshold shortly before its cache expires, so returning to it later
  does not pay to re-cache the whole context
- **Exact cache lifetime** Reads whether the cache lasts 1 hour or 5 minutes
  from the session transcript after each turn, and infers it from cache hits
  and misses only when the transcript has no answer
- **Desktop app** Drops the `types` manifest field, which the desktop app's
  plugin loader rejects, and keeps the cache clock in the module instead
