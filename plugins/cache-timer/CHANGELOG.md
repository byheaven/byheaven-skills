# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/cache-timer-0.3.0...HEAD)

- **Threshold picker** The band's compaction threshold picker now offers
  300k, 500k, and 700k, so a conversation can be compacted from 300k tokens;
  the default stays 500k, and a threshold set to another value in `/config`
  is still shown and kept

## [0.3.0](https://github.com/byheaven/byheaven-skills/compare/cache-timer-0.2.0...cache-timer-0.3.0) (2026-10-05)

- **Compaction in the desktop app** Compaction before expiry now works in
  desktop-app sessions, including Claude.ai project threads, by running
  `/compact` there; before, those sessions refused it and nothing was
  compacted
- **Plugin page** Shows the plugin's description on Claude Code's plugin page
  when it is installed from the marketplace

## [0.2.0](https://github.com/byheaven/byheaven-skills/compare/cea1807a2b2d41400effca6ca91f454065dd7c5e...cache-timer-0.2.0) (2026-10-04)

- **Cache countdown** A band above the prompt shows how long the
  conversation's prompt cache stays warm, with a bar of the time left and the
  context size against the compaction threshold, in the terminal and in
  desktop-app sessions
- **Compaction before expiry** Compacts a conversation above the threshold
  five minutes before a 1-hour cache expires (60 seconds for a 5-minute
  cache), so coming back to it does not pay to re-cache the whole context
- **Expiry notification** Pushes the session's name and its last question to
  your phone shortly before a 1-hour cache expires, when the session has
  Remote Control on
- **Settings in the band** A gear opens switches for compaction and
  notifications, a 500k to 800k threshold picker, and a 10, 15, or 20 minute
  notification lead time; changes made in a desktop-app session carry over to
  later sessions
- **Exact cache lifetime** Reads whether the cache lasts 1 hour or 5 minutes
  from the session transcript, and infers it from cache hits only when the
  transcript has no answer
