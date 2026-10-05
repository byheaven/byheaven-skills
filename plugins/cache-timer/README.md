# cache-timer

`cache-timer` is a Claude Code mod that shows how long the prompt cache of the
current conversation stays warm, and compacts a large conversation just before
that cache expires, so returning to it does not re-send the whole context at
the cache-write price.

It runs only in Claude Code, which loads its function hooks (an early-access
plugin API). Other agent tools do not load it.

## What It Does

- **Countdown band above the prompt**: `54:12 ━━━━━━──── 1h · 612k/500k`
  reads as the time left on the cache, a bar of the lifetime left, the cache
  lifetime, and the tokens the next request re-sends against the compaction
  threshold (the threshold is left out while auto-compaction is off). Icons on
  the right show whether auto-compaction and notifications are on; the gear
  opens a row with a switch and threshold picker (300k, 500k, or 700k) for
  compaction, and a switch and lead-time picker (10, 15, or 20 minutes) for
  notifications. In the terminal, click them or press ctrl+x tab to focus the
  band. The band shows in the terminal and in sessions the desktop app runs;
  viewers that attach over Remote Control, including the iOS app, do not draw
  mod UI.
- **Notification before expiry**: when a 1-hour cache has the notification
  lead time left, it sends one push notification per idle period with the
  session's name and the question its last reply asked, for example
  `Mod check / 「Shall I release 0.2.0?」 / — cache expires in 10 min`. It goes
  through Claude Code's own push notification, so it reaches the phone only
  while the session has Remote Control on and you are not active in it. A
  5-minute cache does not notify.
- **Compaction before expiry**: when it is on and the context holds at least the threshold,
  it runs the same compaction `/compact` runs once the cache has the lead time
  left, at most once per idle period, and reports the result in a toast. A
  running turn keeps the cache warm on its own, so no compaction runs then.
  Sessions without a person at the prompt (the desktop app, the SDK, `-p`)
  do not let a mod compact directly, so there the mod runs `/compact` as if
  you typed it.
- **Exact cache lifetime**: Claude Code gives status-line scripts the
  lifetime as `prompt_cache.ttl`, but the function-hook API does not expose it.
  After each turn the mod reads the tail of the session transcript, where each
  response records whether its cache write was 1-hour or 5-minute, and uses
  that. The transcript format is Claude Code's own and may change; when no
  write is found there, the mod falls back to inference: it starts from 1 hour
  and, after a gap of 5.5 to 58 minutes on the same model, a cache hit confirms
  1 hour and a miss switches to 5 minutes. Pinning `cache_ttl` overrides both.

## Settings

Each field is a row under `/config`; a change there or in the band reloads the
mod, and the countdown carries over the reload. Sessions the desktop app runs
have no `/config` rows for plugins, so a change made in the band there is kept
in the mod's own store and applies to later sessions too; a later `/config`
change to the same field replaces it.

| Field | Default | Meaning |
| --- | --- | --- |
| `auto_compact` | `true` | Compact before expiry at all |
| `threshold_k` | `500` | Compact only when the context holds at least this many thousand tokens |
| `notify` | `true` | Send a push notification before a 1-hour cache expires |
| `notify_lead_minutes` | `10` | Minutes before a 1-hour cache expires to notify |
| `cache_ttl` | `auto` | `auto` (transcript, then inference), `1h`, or `5m` |
| `lead_seconds_1h` | `300` | Seconds before a 1-hour cache expires to start compacting |
| `lead_seconds_5m` | `60` | Seconds before a 5-minute cache expires to start compacting |

## Layout

```text
.claude-plugin/plugin.json   Name and settings
hooks/hooks.json             Names the hooks module
hooks/register.tsx           Countdown, inference, compaction, and the band
hooks/register.test.tsx      Mock-clock tests: claude plugin test plugins/cache-timer
types/index.d.ts             Type of the cache clock the module keeps
```

## License

MIT
