---
name: roundtable
disable-model-invocation: true
description: Ask several real model families the same question independently, then compare their answers in one saved file.
---

# Roundtable

The current session is the **Host**. It asks one question of several real model families (**Seats**), collects each Seat's independent visible answer, shows them like a group chat, lets the user steer an optional response round, and writes everything to one **session file**.

A roundtable is user-steered model contrast. Manager verification, CI review, and artifact approval stay with the verifier workflow.

## Seats

A Seat is one real model family, labelled `@<Family>`. The Host writes its own family's Seat directly; every other Seat comes from a real one-shot route. The Seat roster, each Seat's source mode, and its routes are in [seat-routes.md](references/seat-routes.md). Default room: every Seat in that roster the session can actually reach. Same-model role-play never fills a Seat.

Every Seat contributes independently and is weighed by its evidence, not its family: the Host's own Seat gets no extra weight. A conclusion the user adopts applies to all models alike. When it changes a rule, skill, or prompt, the change goes to the shared, runtime-neutral source that every model loads, never to one model's private configuration.

## Steps

Every question to the user in this skill uses the host's user-question tool and follows any format or route the user's global rules set for messages that need the user's reply, including any free-text option they require on its option cards. Where the host's own instructions route the user's questions elsewhere, that route is the user-question tool. Plain-text questions are only for a host with neither.

1. **Open the session file.** Name the question, the Host runtime, the selected Seats with their source modes, and the output path. Create the file before any Seat runs, at `~/tmp/roundtable/<YYYYMMDD-HHmm>-<slug>.md`, or at a project path only when the user asks for one. Structure: [session-file.md](references/session-file.md). Done when the file holds the Brief and one Seat Status row per selected Seat.
2. **Build the shared packet** (below). Done when the three substantive fields are fixed and identical for every Seat.
3. **Collect independent first turns.** Run each Seat once, from the packet alone, before any Seat sees another's answer. Check each route first; a selected Seat whose route fails is recorded as failed, and the user-question tool asks whether to continue with the Seats that answered. Done when every selected Seat has an answer or a recorded failure.
4. **Render the group chat.** Show each answer under its Seat label as the Seat wrote it. Host remarks carry the `Host` label.
5. **Let the user steer.** After the group chat, use the user-question tool to ask whether to interject, have named Seats respond, or go to synthesis. A response round starts only on the user's explicit request or verbatim interjection, carries only the first-turn answers the user names, and runs at most once unless the user asks for more.
6. **Synthesize.** Write a labelled Host synthesis after the independent turns: agreements, real disagreements with each side's evidence, and what would settle them. Collect every valuable reference with its Seat and why it matters. Follow-up ideas stay candidates in the file; task creation belongs to the project's own workflow.

Done when the session file holds the Brief, Seat Status, Transcript, Host Synthesis, References, and Follow-up Candidates.

## Shared packet

Every Seat receives exactly these four fields:

1. **User Question**: the user's question, byte for byte as the user wrote it.
2. **Objective Context** (optional, omitted by default): only facts needed to make the question answerable, each traced to a user statement or a named original source.
3. **Original Sources**: one list of links or paths to the original material, the same for every Seat. Seats read the originals themselves.
4. **Operational Constraints**: Seat label, source mode, reply language, read-only limits, allowed search surface, and how to report sources.

User Question, Objective Context, and Original Sources are identical across Seats; Operational Constraints differ only by Seat label, source mode, and search surface. The Host's own goals, criteria, suspicions, preferred lenses, or summaries of the sources stay out of the packet: they anchor the answers before the Seats have reasoned. When choosing the source list could change the answer, confirm it through the user-question tool before any Seat runs.

Private material stays out of public search queries unless the user approves sending it. When the question itself cannot safely reach a search Seat, use the user-question tool to ask whether to disable that Seat for the run; the User Question is never edited to make it safe.

## Defaults

- Seats reply in Simplified Chinese, and the session file is written in Simplified Chinese, unless the user asks for another language; labels, links, paths, and identifiers stay as written.
- One session file per invocation.
- Seats are read-only contributors: they read the packet's sources and their direct references, and leave files, tasks, and dispatch to the Host. The Host keeps task ownership.
- Visible answers only; hidden reasoning stays out of the file.

On resume, read the session file and continue from its last completed section ([session-file.md](references/session-file.md#resume)).
