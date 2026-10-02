# cache-timer

`cache-timer` is a Claude Code mod that shows how long the prompt cache of the
current conversation stays warm, and compacts a large conversation just before
that cache expires, so returning to it does not re-send the whole context at
the cache-write price.

It runs only in Claude Code, which loads its function hooks (an early-access
plugin API). Other agent tools do not load it.

## What It Does

- **Status line countdown**: `缓存 54:12 (1h?) · 612k/500k · 剩 5:00 时压缩`
  reads as the time left on the cache, the cache lifetime in use (`?` while it
  is assumed rather than observed), the tokens the next request re-sends
  against the threshold, and, above the threshold, when compaction will start.
- **Compaction before expiry**: when the context holds at least the threshold,
  it runs the same compaction `/compact` runs once the cache has the lead time
  left, at most once per idle period, and reports the result in a toast. A
  running turn keeps the cache warm on its own, so no compaction runs then.
- **Cache lifetime inference**: plugins cannot read whether the cache lives 5
  minutes or 1 hour. With `auto`, it starts from 1 hour and, after a gap of
  5.5 to 58 minutes on the same model, a cache hit confirms 1 hour and a miss
  switches to 5 minutes. A cache miss with another cause, such as an edited
  system prompt or `CLAUDE.md`, also reads as 5 minutes until the next hit;
  pin the lifetime when you know it.

## Settings

Each field is a row under `/config`; a change reloads the mod.

| Field | Default | Meaning |
| --- | --- | --- |
| `threshold_k` | `500` | Compact only when the context holds at least this many thousand tokens |
| `cache_ttl` | `auto` | `auto`, `1h`, or `5m` |
| `lead_seconds_1h` | `300` | Seconds before a 1-hour cache expires to start compacting |
| `lead_seconds_5m` | `60` | Seconds before a 5-minute cache expires to start compacting |

## Layout

```text
.claude-plugin/plugin.json   Name, settings, and the state type contract
hooks/hooks.json             Names the hooks module
hooks/register.ts            Countdown, inference, and compaction
hooks/register.test.ts       Mock-clock tests: claude plugin test plugins/cache-timer
types/index.d.ts             Type of the state the mod keeps per session
```

## License

MIT
