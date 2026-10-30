# Session file

One file per roundtable holds the question, Seat status, transcript, synthesis, references, and follow-up candidates. Localize the headings into the session language; keep Seat labels, links, paths, and identifiers as written.

```markdown
# Roundtable: <title>

## Brief
<the four shared-packet fields, Host runtime, selected Seats, output path>

## Seat Status
| Seat | Route | Status | Source mode | Notes |
|---|---|---|---|---|
<one row per selected Seat; Status is pending, ok, failed, or disabled>

## Transcript
<first-turn answers, user interjections, and any response round>

## Host Synthesis
<labelled Host synthesis, written after the independent turns>

## References
| URL | Source label | Seat | Why it matters |
|---|---|---|---|

## Follow-up Candidates
<candidate notes only>
```

## Seat turns

Record each answer under `### @<Seat> Round <n>`, with the Seat's own structure, preceded by its source notes:

```markdown
### @<Seat> Round 1

**Source mode**: <mode>
**Source notes**: <search surfaces used, limits>
**Valuable references**:
- <url> - <why it matters>

<the Seat's answer>
```

Record user interjections verbatim. A response-round prompt carries the four packet fields, the user's verbatim interjection, and only the first-turn answers the user named; it carries the Host synthesis only when the user steers with it. Response turns are shorter than first turns.

## References

De-duplicate the links from every Seat answer into the References table, each with its contributing Seat and why it mattered. A Seat that searched but found nothing useful gets that limit in its Seat Status notes; references are only ever copied from Seat answers.

## Resume

1. Read the session file.
2. Continue from the last completed section:
   - Brief only: run the independent first turns.
   - First turns, no synthesis: ask whether to interject or synthesize.
   - Synthesis present: show it, and ask whether to reopen.
3. Keep every recorded Seat turn; rerun one only when the user asks for a fresh take.
