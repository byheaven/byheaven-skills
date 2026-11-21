---
name: roundtable
description: "Ask several real model families the same question independently and synthesize their answers in one saved file. Use only when the user, a routine, or a Manager explicitly invokes a roundtable or multi-family independent run."
---

# Roundtable

The current session is the **Host**. It asks one question of several real model families (**Seats**), collects each Seat's independent visible answer, synthesizes them, and writes everything to one **session file**.

A roundtable runs in **interactive** mode by default (showing answers like a group chat and letting the user steer an optional response round) or **unattended** mode for scheduled routines and Manager-invoked runs (running end to end from the caller's fixed packet without interactive pauses). Task-owner verification, CI review, and artifact approval stay with the verifier workflow.

## Seats

A Seat is one real model family, labelled `@<Family>`. The Host writes its own family's Seat directly (or dispatches a fresh read-only child of that family when context isolation from Host reasoning is needed); every other Seat comes from a real isolated read-only route. Where the Seat roster, each Seat's source mode, model and effort resolution, and route come from is in [seat-routes.md](references/seat-routes.md). Default room: every Seat in that roster the session can actually reach, minus any Seat excluded by privacy rules or the caller's room selection. Same-model role-play never fills a Seat.

Every Seat contributes independently and is weighed by its evidence, not its family: the Host's own Seat gets no extra weight. A conclusion adopted from the roundtable applies to all models alike. When it changes a rule, skill, or prompt, the change goes to the shared, runtime-neutral source that every model loads, never to one model's private configuration.

## Steps

Every question to the user in interactive mode is asked as [Asking](../task-owner/references/runtimes.md#asking) says.

1. **Open the session file.** Name the question, mode (`interactive` or `unattended`), the Host runtime, the selected Seats with their source modes and resolved routes, and the output path. Create the file before any Seat runs, as `<YYYYMMDD-HHmm>-<slug>.md` in a scratch directory outside the repository, or at a project path when the user or caller names one. Structure: [session-file.md](references/session-file.md). Done when the file holds the Brief and one Seat Status row per selected Seat.
2. **Build the shared packet** (below). Done when the three substantive fields are fixed and identical for every Seat.
3. **Collect independent first turns.** Run each Seat once, from the packet alone, before any Seat sees another's answer (Seats may run concurrently when their routes allow). Check each route first and record any selected Seat whose route fails as `failed` with its reason. In interactive mode, ask the user: `"@<Seat> could not run (<reason>). Continue with the Seats that answered?"`. In unattended mode, continue without pausing whenever at least two real model families answered; if fewer than two answered, record the single-family or failed limitation explicitly in Seat Status and Host Synthesis rather than waiting for user input. Done when every selected Seat has an answer or a recorded failure.
4. **Render the group chat** (interactive mode). Show each answer under its Seat label as the Seat wrote it. Host remarks carry the `Host` label. Unattended mode records each Seat's full visible turn in the session file and skips inline group-chat rendering.
5. **Let the user steer** (interactive mode only). After the group chat, ask the user: `"Interject, have named Seats respond to each other, or go to synthesis?"`. A response round starts only on the user's explicit request or verbatim interjection, carries only the first-turn answers the user names, and runs at most once unless the user asks for more. Unattended mode skips this step and goes straight to synthesis.
6. **Synthesize.** Write a labelled Host synthesis after the independent turns: agreements (checking shared premises), real disagreements with each side's evidence, complementary findings, and what would settle open questions. Collect every valuable reference with its Seat and why it matters. Follow-up ideas stay candidates in the file; authorized landing or task creation belongs to the caller's or project's own workflow.

Done when the session file holds the Brief, Seat Status, Transcript, Host Synthesis, References, and Follow-up Candidates.

## Shared packet

Every Seat receives exactly these four fields:

1. **User Question**: the user's or caller's question, byte for byte as given.
2. **Objective Context** (optional, omitted by default): only facts needed to make the question answerable, each traced to a user statement or a named original source.
3. **Original Sources**: one list of links or paths to the original material, the same for every Seat. Seats read the originals themselves.
4. **Operational Constraints**: Seat label, source mode, reply language, read-only limits, allowed search surface, and how to report sources.

User Question, Objective Context, and Original Sources are identical across Seats; Operational Constraints differ only by Seat label, source mode, and search surface. The Host's own goals, criteria, suspicions, preferred lenses, or summaries of the sources stay out of the packet: they anchor the answers before the Seats have reasoned. In interactive mode, when choosing the source list could change the answer, ask the user before any Seat runs: `"These are the sources every Seat will read: <list>. Use them as they are?"`. In unattended mode, use the caller's fixed packet and source list without pausing.

Private material stays out of public search queries unless the user approves sending it. In interactive mode, when the question cannot safely reach a public-search Seat, ask the user: `"The question would reach public search through @<Seat>. Disable @<Seat> for this run?"`; the User Question is never edited to make it safe. In unattended mode, automatically disable any public-search Seat (`disabled` in Seat Status with the privacy reason) whenever the packet carries private material or public search is not explicitly authorized.

## Defaults

- Seats reply in the user's language, and the session file is written in it, unless the user or caller asks for another language; labels, links, paths, and identifiers stay as written.
- One session file per invocation.
- Seats are read-only contributors: they read the packet's sources and their direct references, and leave files, tasks, and dispatch to the Host. The Host keeps task ownership.
- Visible answers only; hidden reasoning stays out of the file.

On resume, read the session file and continue from its last completed section ([session-file.md](references/session-file.md#resume)).
