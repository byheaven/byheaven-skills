# Evidence assignment

P2 in the deployment's always-loaded rules sets the evidence standard. This page lists what the evidence for a delivery must show; reviewers check these outcomes.

## Owner acceptance

Before completion or completion-stage user judgment, the task owner closes objective predicates on the exact state. Perform accessible checks; request only unavoidable user-only actions or observations, with needed evidence. Unobserved predicates stay unknown and owned. The user judges only value, taste, risk or irreversible authorization after objective checks; mark those predicates `judged by the user`.

For each predicate, the evidence shows:

1. **The predicate and the exact state** it was judged on: candidate, environment, and representative input or stored state.
2. **Its true judge:** a machine, live authority, independent judge, or the user for value, taste, risk and irreversible authorization. The owner classifies semantic effect: **high-risk** means irreversible (money, deleting data that cannot be restored) or reaching real users (their authentication, permissions, payments, privacy or data), and requires cross-family judgment regardless of labels. A rule, skill, definition or plugin edit is not high-risk: it can be reverted and reaches no other user, so it closes on its `writing-for-agents` self-check and deterministic checks unless the user names a judge. The deployment's model routing lists the concrete cases and selects the required judge, and also decides the case with no cross-family carrier; the [report](../../../agents/task-owner.md#records-and-closure) names the gap. Other predicates use producer checks, deterministic evidence and any user-named judge. The user or product owner judges pre-implementation design value/taste; requested derivation or critique adds input, not acceptance. Authentication, money, deletion and privacy cases derive from locked Acceptance before implementation is seen.
3. **Discriminating power:** expected outcomes come from the predicate's authority, never the implementation, and the check is shown able to tell the required outcome from a relevant failure (preferably by failing on a subject that lacks the behavior); for a root fix, the subjects include a new case of the problem's class, though one case does not replace P3's evidence that every path producing the class is blocked or its cause is gone. A stand-in proves only the layer it actually exercised. Reworded prose is judged by a qualified reader, not a test.
4. **A settled result:** missing, empty, refused, timed-out, pending, stale, or wrong-state evidence is unknown and blocks completion.

A claim that a change is safe states the strongest level its deciding fact reached: asserted, located at a cited line, failure path walked through, shown by running the real code, or reproduced in the running product. Independent judgment means a fresh verifier is the judge; the task owner's own reading never replaces it; the owner then settles its findings under [Verifier dispatch](#verifier-dispatch).

## Predicate closure

Each predicate closes as **confirmed**, **refuted**, or **unjudgeable**. A refuted predicate blocks completion until repair or reopened Direction settles it. A predicate is unjudgeable only when its judging layer is unreachable from this task at all: users who do not exist yet, an external gate outside the work, or an authorization the user refused; it names the missing layer and the observation that would settle it. A delivery whose unclosed predicates are all unjudgeable completes and names them in the linked evidence.

Only a remaining value, taste, risk, or irreversible-authorization predicate keeps a blocking completion gate, with three answers: done, needs adjustment, pause. "Pause" releases ownership until the user resumes. Otherwise a reversible delivery with complete evidence may complete asynchronously.

An effect only later real use can show is never a delivery predicate; it becomes an observation in the project's task store with its refuting observation and keep, adjust, and withdraw conditions, or is recorded in the linked evidence.

A defect known to have reached a user or production completes only when it is fixed at its root and the evidence says why it escaped, classified with the [`diagnosing-bugs` skill](../../diagnosing-bugs/SKILL.md).

## Evidence reuse

Evidence carries to a new state only when every input and observation condition it depends on is unchanged. Across a rebase, equal `git patch-id --verbatim` values for the judged range show the change's own content is unchanged; the composed result is still observed on the new head by its deterministic checks. At release, bind receipts to the exact released artifact; re-observe only what deployment can change.

## Verifier dispatch

A verifier receives the locked commitment, the exact artifact state, the authority and Acceptance, scope, the approved writing brief and review object where they apply, the excerpts of this skill it needs, and the [global-rules excerpt](production.md#topology) when it does not load the user's rules; it never receives producer reasoning. When a predicate judges what the user decided, quote the user's words with date and place. The task owner joins all findings once, gives each a stable id, and settles each as fixed, wrong, intentional, or immaterial.

Every review is one round, with no follow-up. The task owner settles every finding, fixes and diff-checks each repair against its finding, and records the result; a finding it cannot settle within its authority goes to the user. A gate reads `no open critical or high finding on <object>`, never an approve verdict.

## Failure diagnosis

When a predicate fails or a defect recurs, find the cause before the next action: a changed commitment, an implementation defect, an environment fault, stale evidence, or a correlated reasoning failure. After two fixes resting on the same premise fail the same check, test that premise directly before a third. A hard or recurring bug follows the `diagnosing-bugs` skill. Reopen Direction only when the remedy changes a user-owned dimension. Judge assignment follows Owner acceptance.

## Dependency waits

Before repairing a blocking fault, check whether another agent is already repairing it. If so, keep this task owned and arm a wait that resumes this conversation, bound to the dependency's terminal result and a bounded deadline; on success, verify the result at its live authority and continue. A timeout wakes the task owner to act, never to mark success. If no one is repairing it, diagnose and repair it within current authority; scope, value, and risk choices go back to the direction owner under [Handoff](direction.md#handoff).
