# Seat routes

How the Host reaches each selected Seat. Read before running any Seat other than the Host's own.

## Route kinds

- **Native**: the Host's own model family. The Host writes that Seat's answer directly, separately from its Host synthesis.
- **CLI one-shot**: a logged-in model CLI run once in print or exec mode, read-only, with no persistent session and no sub-agents, from a working directory that holds the packet's sources. The Host may run it on any machine the session can reach where that CLI is installed and logged in, or through the host's configured cross-model launcher when one exists.
- **Manual paste**: the Host prints one exact prompt per Seat; the user runs it in that model's product and pastes the visible answer back. A valid route that needs no API key.
- **Browser**: only when the user prefers it or nothing else exists. Use a fresh chat, enable only the Seat's source surface, and copy back only the visible answer and references.

Check a CLI before use: `command -v <cli>`, its live `--help` for the one-shot and read-only flags, and a tiny harmless probe when the CLI is migrating or plan-gated. Install or update a CLI only when the user asks. Each Seat run is one-shot and ends with the roundtable: no resumed session, persistent chat bridge, or task-owning agent.

## Current routes

Shapes to confirm against `--help`, not a claim about any machine:

| Seat | Native when the Host is | CLI one-shot shape |
|---|---|---|
| `@Codex` | Codex | `codex exec --sandbox read-only --skip-git-repo-check --ephemeral -` |
| `@Grok` | Grok Bot or Grok CLI | `grok -p "<prompt>" --output-format plain --permission-mode plan --no-subagents` (keep web and X search enabled) |
| `@Gemini` | (none) | `agy --print "<prompt>" --sandbox` |
| `@Claude` | Claude Code | `claude -p` with edit tools disabled and no session persistence; paused, so seat it only on the user's request |

A Grok Bot Host answering as `@Grok` uses its own X search tool for the required X search.

## Seat prompt

Wrap the shared packet in this envelope, filled per Seat:

```text
You are @<Seat> in a cross-model roundtable. Answer only as @<Seat>.
Reply in <language>.
Source mode: <packet-only | web search | X search>
Read the paths in Original Sources and their direct references with read-only tools.
Leave files, tasks, and agents untouched.
This is a single-shot reply: state assumptions instead of asking questions.
<web search Seat: Search the web, and list valuable links with one line each on why they matter.>
<X search Seat: Search X, and list valuable X or public links found through X with one line each.>
Report your source mode and source notes before your answer. Give your visible answer only.

User Question: <verbatim>
Objective Context: <facts, or omitted>
Original Sources: <the common list>
Operational Constraints: <language, read-only, search surface, reporting>
```

## Required search Seats

`@Gemini` must search the web and `@Grok` must search X on every run, reporting the surface used, valuable links with one line each, and any search limits. A route that cannot search marks that Seat failed for the run; it never stands in as packet-only.

## Failure

A selected Seat that cannot be reached is recorded as failed with the reason, and the Host stops and reports it. For a default room, the host's user-question tool asks whether to continue with the Seats that answered; a Seat the user named as required stops the run unless the user accepts a smaller room. A room needs at least two real model families. Credentials, logins, captchas, paywalls, and usage limits stay with the user: report the block and offer manual paste.
