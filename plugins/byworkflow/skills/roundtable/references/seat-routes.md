# Seat routes

How the Host chooses the Seats, resolves their models and efforts, and reaches each one. Read when choosing the Seats and before running any Seat other than the Host's own.

## Seats

The Seat roster comes from the deployment's instructions when they name one: each Seat's model family, its source mode (packet-only, web search, or X search), whether that search is required on every run, and its route. Without a named roster, offer every real model family the session can reach, each packet-only unless the user or caller asks a Seat to search; in interactive mode, ask the user to confirm the room before any Seat runs.

## Route kinds

- **Host-native child dispatch**: a fresh, read-only sub-agent or child session launched through the host's native cross-family dispatch capability, given the Seat prompt alone, with no persistent session or write authority. Prefer this route when the host natively dispatches that model family, so Seats run concurrently with clean context isolation and structured receipts.
- **Native**: the Host's own model family. The Host writes that Seat's answer directly, separately from its Host synthesis, before reading other Seats' answers — or uses host-native child dispatch for its own family when fresh-context isolation from Host reasoning is needed.
- **CLI one-shot**: a logged-in model CLI run once in print or exec mode, read-only, with no persistent session, from a working directory that holds the packet's sources. The Host may run it on any machine the session can reach where that CLI is installed and logged in, or through the host's configured cross-model launcher when one exists. The roster names each CLI's one-shot shape when it has one.
- **Manual paste** (interactive mode only): the Host prints one exact prompt per Seat, the user runs it in that model's product, and the user pastes the visible answer back. A valid route that needs no API key.
- **Browser** (interactive mode only): only when the user prefers it or nothing else exists. Use a fresh chat, enable only the Seat's source surface, and copy back only the visible answer and references.

Check a CLI before use: `command -v <cli>`, its live `--help` for the one-shot and read-only flags, and a tiny harmless probe when the CLI is migrating or plan-gated. A shape the roster records is a claim to confirm against `--help`, not a fact about any machine. Install or update a CLI only when the user asks. Each Seat run is one-shot and ends with the roundtable: no resumed session, persistent chat bridge, or task-owning agent.

Resolve each Seat's model and reasoning effort dynamically at run time from the deployment's model routing table when the deployment names one, otherwise from that route's configured default; keep hardcoded model version strings out of routine prompts and rosters. Record the actual resolved model, effort, and route in Seat Status.

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

A Seat whose source mode requires search searches its surface on every run, reporting the surface used, valuable links with one line each, and any search limits. A Host answering natively for such a Seat uses its own search tool for that surface. A route that cannot search marks that Seat failed for the run; it never stands in as packet-only.

## Failure

A selected Seat that still cannot be reached after the retries worth making is recorded as `failed` with its failure layer and reason. A multi-family room needs at least two real model families.

- **Interactive mode**: stop and report the failure. For a default room, ask the user whether to continue with the Seats that answered; a Seat the user named as required stops the run unless the user accepts a smaller room. Credentials, logins, captchas, paywalls, and usage limits stay with the user: report the block, and offer manual paste.
- **Unattended mode**: continue without blocking on a user prompt whenever at least two real model families answered. When fewer than two real model families answered, record the single-family or failed limitation explicitly in Seat Status and Host Synthesis and return it to the caller; never substitute another family or simulate a missing Seat.
