# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/commits/main/plugins/cache-timer)

- **Cache countdown** Shows in the status line how long the prompt cache of
  the conversation stays warm, and how many tokens the next request re-sends
- **Compaction before expiry** Compacts a conversation above a configurable
  token threshold shortly before its cache expires, so returning to it later
  does not pay to re-cache the whole context
