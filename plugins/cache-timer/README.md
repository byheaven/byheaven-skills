# cache-timer

`cache-timer` is a Claude Code mod that shows how long the prompt cache of the
current conversation stays warm, shows and sets Claude Code's own idle
compaction, and can push a reminder to your phone before the cache expires.
The mod itself never compacts a conversation.

It runs only in Claude Code, which loads its function hooks (an early-access
plugin API). Other agent tools do not load it.

## What It Does

- **Countdown status line**: `54:12 · 612k` under the prompt reads as the
  time left on the cache and the tokens the next request re-sends; it shows
  `0:00` once the cache has expired, and nothing before the first request or
  after a compaction. It shows in the terminal and in sessions the desktop
  app runs, including between turns; viewers that attach over Remote Control,
  including the iOS app, do not draw mod UI.
- **`/cache-timer`**: asks which setting to change, each shown with its
  current value, then the new value, in Claude Code's own question dialog:
  idle compaction on or off, the idle-compaction threshold (300k, 500k, 700k,
  or a number typed under Other), and the notification (off, or 10, 15, or 20
  minutes before expiry). Idle compaction is left out where `/config` offers
  no `Idle compaction` row in this session: Claude Code does not run idle
  compaction there, or a settings file other than your own sets it.
- **Claude Code's idle compaction**: Claude Code itself can compact a long
  conversation shortly before its 1-hour cache expires (about 54 minutes into
  an idle period), so your next message does not re-send the whole context.
  Where your account has it, `/config` lists an `Idle compaction` row;
  `/cache-timer` changes that same setting. The mod gives the session the
  threshold as `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`, so idle compaction runs
  only from that many tokens; a value under 100k is raised to 100k. Where the
  variable cannot be set, `/cache-timer` shows the threshold Claude Code uses.
  Leave that variable out of your own settings' `env`, or a change to the
  settings file sets it back.
- **Notification before expiry**: when a 1-hour cache has the notification
  lead time left, it sends one push notification per idle period with the
  session's name and the question its last reply asked, for example
  `Mod check / 「Shall I release 0.2.0?」 / — cache expires in 10 min`. It goes
  through Claude Code's own push notification, so it reaches the phone only
  while the session has Remote Control on and you are not active in it. A
  5-minute cache does not notify.
- **Exact cache lifetime**: Claude Code gives status-line scripts the
  lifetime as `prompt_cache.ttl`, but the function-hook API does not expose it.
  After each turn the mod reads the tail of the session transcript, where each
  response records whether its cache write was 1-hour or 5-minute, and uses
  that. The transcript format is Claude Code's own and may change; when no
  write is found there, the mod falls back to inference: it starts from 1 hour
  and, after a gap of 5.5 to 58 minutes on the same model, a cache hit confirms
  1 hour and a miss switches to 5 minutes. Pinning `cache_ttl` overrides both.

## Settings

Each field is a row under `/config`; a change there or through `/cache-timer`
reloads the mod, and the countdown carries over the reload. Sessions the
desktop app runs have no `/config` rows for plugins, so a change made through
`/cache-timer` there is kept in the mod's own store and applies to later sessions too; a later `/config`
change to the same field replaces it. The idle-compaction switch is Claude
Code's own `Idle compaction` row, not one of these fields.

| Field | Default | Meaning |
| --- | --- | --- |
| `threshold_k` | `500` | Idle compaction runs only when the context holds at least this many thousand tokens |
| `notify` | `true` | Send a push notification before a 1-hour cache expires |
| `notify_lead_minutes` | `10` | Minutes before a 1-hour cache expires to notify |
| `cache_ttl` | `auto` | `auto` (transcript, then inference), `1h`, or `5m` |

## Layout

```text
.claude-plugin/plugin.json   Name and settings
hooks/hooks.json             Names the hooks module
hooks/register.tsx           Countdown, inference, idle-compaction settings, the status line, and /cache-timer
hooks/register.test.tsx      Mock-clock tests: claude plugin test plugins/cache-timer
types/index.d.ts             Type of the cache clock the module keeps
```

## License

MIT
