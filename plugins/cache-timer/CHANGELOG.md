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
- **Band controls** Moves the countdown from the status line to a band above
  the prompt with an on/off switch for automatic compaction and a threshold
  picker (500k to 800k), and keeps the countdown across the reload a settings
  change causes
- **Band redesign** Shows the countdown with a bar and the tokens against the
  threshold, with state icons and a gear that opens the settings row
- **Expiry notification** Sends a push notification with the session's last
  question shortly before a 1-hour cache expires, with its own switch and
  lead time
- **Desktop settings** Keeps band changes in the mod's store in desktop-app
  sessions, which have no `/config` rows for plugins
- **Desktop app** Drops the `types` manifest field, which the desktop app's
  plugin loader rejects, and keeps the cache clock in the module instead
