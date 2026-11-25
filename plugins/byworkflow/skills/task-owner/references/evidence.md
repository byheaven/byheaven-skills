# Evidence assignment

P2 in the deployment's always-loaded rules sets the evidence standard. This page lists what the evidence for a delivery must show; reviewers check these outcomes.

## Highest-standard bar

Every task—self-produced or dispatched—sets its concrete highest-standard bar before producing, combining all applicable core dimensions below with any domain-specific dimensions from [Practitioner's bar](direction.md#practitioners-bar) and owning standards (such as author stance in writing or causal-claim support in knowledge work). Producers, QA, and independent reviewers all judge against that same settled rubric, never omitting an applicable dimension:

1. **Core premise and value truth:** every artifact, example, or claim genuinely proves the product promise rather than staging a hollow stand-in.
2. **Factual and third-party asset authenticity:** facts, citations, brands, icons, and third-party assets come from verified primary sources; zero fabricated marks or invented data.
3. **Target-audience, locale, and ecosystem fit:** language, idioms, references, and supported platforms or ecosystems match the actual target reader or user in every supported locale.
4. **Craft of design, motion, copy, and code:** visual hierarchy, motion, prose, and code reach leading-finished-work polish with zero explanatory source comments or unnecessary bloat.
5. **Functional, edge-case, and runtime soundness:** real-layer behavior, error paths, hard states, responsiveness, and migrations work cleanly end to end.
6. **Adherence to locked intent and authorities:** settled user decisions, scope bounds, rules, and owning product/architecture documents hold throughout.

Every QA pass and independent review closes with an explicit **Highest-standard verdict** scoring every applicable dimension in the task's rubric using four states:

- `MEETS BAR`: directly observed at leading-finished-work quality on the exact candidate.
- `BELOW BAR`: observed gap, naming the concrete defect and impact.
- `UNVERIFIED`: applicable dimension whose judging layer or prerequisite was blocked or not observed, naming the missing observation and next owner (never counts as passing).
- `N/A`: genuinely inapplicable to this change, with a one-line reason.

Never trade quality for delivery speed. Producers and the task owner iterate across as many rounds as needed until every applicable dimension reaches `MEETS BAR`. Read-only verifiers and QA judge honestly and return `BELOW BAR` or `UNVERIFIED` findings for the task owner to settle and drive repairs (single-round high-risk review settles findings without re-review; human-facing interactive surfaces and always-QA classes repeat repair-and-QA rounds until every applicable dimension passes).

## Owner acceptance

Acceptance predicates state observable real-world behaviors (who, under what real conditions, acts and observes what result), including for infrastructure, CI, and dependency changes. Engineering checks (green CI, unit tests, builds, wiring, deploy logs) are engineering prerequisites, never Acceptance predicates or completion proof. Before completion or completion-stage user judgment, the task owner closes every agent-reachable behavioral predicate at the **earliest real layer** that exhibits it: on the PR head or local real runtime before merge when local runtime suffices; on the live/deployed target or distributed build before closing when the behavior depends on deployed environment, live bindings or secrets, external vendors, or a distributed build. Perform accessible checks; request only unavoidable user-only actions or observations, with needed evidence. Unobserved predicates stay unknown and owned. The user judges only value, taste, risk or irreversible authorization after objective checks; mark those predicates `judged by the user`.

For each predicate, the evidence shows:

1. **The predicate and the exact state** it was judged on: candidate, environment, and representative input or stored state.
2. **Its true judge:** a machine, live authority, independent judge, or the user for value, taste, risk and irreversible authorization. The owner classifies semantic effect: **high-risk** means irreversible (money, deleting data that cannot be restored) or reaching real users (their authentication, permissions, payments, privacy or data), and requires cross-family judgment regardless of labels. A rule, skill, definition or plugin edit is not high-risk: it can be reverted and reaches no other user, so it closes on its `writing-for-agents` self-check and deterministic checks unless the user names a judge. The deployment's model routing lists the concrete cases and selects the required judge, and also decides the case with no cross-family carrier; the [report](../SKILL.md#records-and-closure) names the gap. Other predicates use producer checks, deterministic evidence and any user-named judge. The user or product owner judges pre-implementation design value/taste; requested derivation or critique adds input, not acceptance. Authentication, money, deletion and privacy cases derive from locked Acceptance before implementation is seen.
3. **Discriminating power:** expected outcomes come from the predicate's authority, never the implementation, and the check is shown able to tell the required outcome from a relevant failure (preferably by failing on a subject that lacks the behavior); for a root fix, the subjects include a new case of the problem's class, though one case does not replace P3's evidence that every path producing the class is blocked or its cause is gone. A stand-in proves only the layer it actually exercised. Reworded prose is judged by a qualified reader, not a test.
4. **A settled result:** missing, empty, refused, timed-out, pending, stale, or wrong-state evidence is unknown and blocks completion.

A claim that a change is safe states the strongest level its deciding fact reached: asserted, located at a cited line, failure path walked through, shown by running the real code, or reproduced in the running product. Independent judgment means a fresh verifier is the judge; the task owner's own reading never replaces it; the owner then settles its findings under [Verifier dispatch](#verifier-dispatch).

## Predicate closure

Each predicate closes as **confirmed**, **refuted**, or **unjudgeable**. A refuted predicate blocks completion until repair or reopened Direction settles it. Refusal of a required action leaves the unchanged Goal incomplete until the user cancels, pauses or revises it. A predicate is unjudgeable only when its judging layer is objectively unreachable by agents (such as physical device feel, an external human or vendor approval gate, or users who do not exist yet — never a live environment, test account, or vendor round-trip agents can exercise within a declared budget); it names the missing layer and the observation that would settle it. When every agent-reachable predicate is confirmed and any required behavioral predicate remains unjudgeable, the delivery must **not** close as complete or ready for direct use: it closes as a clearly labeled **staged handoff** that leads with each unverified real behavior, why it was unreachable, and its named next owner and observation.

Only a remaining value, taste, risk, or irreversible-authorization predicate keeps a blocking completion gate, with three answers: done, needs adjustment, pause. "Pause" releases ownership until the user resumes. Otherwise a reversible delivery whose reachable behavioral predicates are confirmed may close asynchronously (as complete when none remain unjudgeable, or as a labeled staged handoff when an unreachable behavior remains).

Distinguish **delivery-time live behavior** (observable on the deployed target or distributed build immediately after landing, with test accounts and a declared small budget — part of delivery closure) from **later-real-use effects** (outcomes only accumulated real usage can show, such as retention or multi-run efficiency). Only later-real-use effects sit outside delivery Acceptance: record each as an observation in the project's task store (or linked evidence) with its baseline, refuting observation, and keep, adjust, and withdraw conditions, and hand it to the project's Manager in the delivery report when one exists so a live owner tracks it under [After delivery](../../manager/SKILL.md#after-delivery).

A defect known to have reached a user or production completes only when it is fixed at its root and the evidence says why it escaped, classified with the [`diagnosing-bugs` skill](../../diagnosing-bugs/SKILL.md).

## Evidence reuse

Evidence carries to a new state only when every input and observation condition it depends on is unchanged. Across a rebase, equal `git patch-id --verbatim` values for the judged range show the change's own content is unchanged; the composed result is still observed on the new head by its deterministic checks. At release, bind receipts to the exact released artifact; re-observe only what deployment can change.

## Verifier dispatch

A verifier receives the locked commitment, the exact artifact state, the authority and Acceptance, scope, the writing brief and the approved review object where they apply, the excerpts of this skill it needs, and the [global-rules excerpt](production.md#topology) when it does not load the user's rules; it never receives producer reasoning. When a predicate judges what the user decided, quote the user's words with date and place. The task owner joins all findings once, gives each a stable id, checks each finding's evidence on the exact artifact state (rerunning a code finding's command), and settles each as fixed, wrong, intentional, or immaterial; a finding without the evidence the verifier's [Finding filter](../../../agents/verifier.md#checklist) requires, or whose check shows no failure of locked Intent or Acceptance, is wrong.

Every review is one round, with no follow-up, and concludes with an explicit [Highest-standard bar](#highest-standard-bar) verdict across every applicable dimension with none omitted (`MEETS BAR`, `BELOW BAR`, `UNVERIFIED`, or `N/A`). As a read-only judge, the verifier returns findings honestly; the task owner settles every finding, fixes and diff-checks each repair against its finding, and iterates whenever any dimension remains below bar; a finding it cannot settle within its authority goes to the user. A gate reads `no open critical or high finding on <object>`, never an approve verdict.

## Failure diagnosis

When a predicate fails or a defect recurs, find the cause before the next action: a changed commitment, an implementation defect, an environment fault, stale evidence, or a correlated reasoning failure. After two fixes resting on the same premise fail the same check, test that premise directly before a third. The `diagnosing-bugs` skill holds a method for a hard or recurring bug. Reopen Direction only when the remedy changes a user-owned dimension. Judge assignment follows Owner acceptance.

## Dependency waits

Before repairing a blocking fault, check whether another agent is already repairing it. If so, keep this task owned and arm a wait that resumes this conversation, bound to the dependency's terminal result and a bounded deadline; on success, verify the result at its live authority and continue. A timeout wakes the task owner to act, never to mark success. If no one is repairing it, diagnose and repair it within current authority; scope, value, and risk choices go back to the direction owner under [Handoff](direction.md#handoff).
