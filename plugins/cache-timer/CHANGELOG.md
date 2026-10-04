# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/cache-timer-0.2.0...HEAD)

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
