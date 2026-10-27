# Evidence assignment

P2 in the [principles skill](../../principles/SKILL.md) sets the evidence standard. This page lists what the evidence for a delivery must show; reviewers check these outcomes.

## Owner acceptance

The task owner closes every objective Acceptance predicate before any completion claim, terminal write, or completion-stage request for user judgment. The user is never the test carrier: missing access or private state leaves a predicate unknown and the task owned, not handed to the user. User judgment is the true judge only for a predicate irreducibly about value, taste, risk, or irreversible authorization, and it comes after every objective predicate is current. When taste or value judges the outcome, the judge is the user, and the task owner marks that predicate `judged by the user`.

For each predicate, the evidence shows:

1. **The predicate and the exact state** it was judged on: candidate, environment, and representative input or stored state.
2. **Its true judge:** a deterministic machine, an external live authority, independent judgment, or the user for a user-owned predicate. A **high-risk** predicate (authentication, money, deletion, privacy, an irreversible action, a material Vision change, or a change to the user's global or role rules, a hard floor, or an agent's permissions) gets an independent judge from another model family, same-family only when no cross-family carrier is available, and the [report](../SKILL.md#report) names that gap. Other rule changes can be rolled back and are not high-risk. Any other predicate gets a cross-family judge only when the producer's blind spots would likely change the result. Documentation and records no agent follows as a rule, a correction that changes no meaning, a hash-proven mirror, version metadata, and a test-path repair need no independent judge: the producer's check and deterministic evidence close them. For authentication, money, deletion, or privacy, the judge derives acceptance cases from the locked Acceptance without seeing the implementation.
3. **Discriminating power:** expected outcomes come from the predicate's authority, never the implementation, and the check is shown able to tell the required outcome from a relevant failure (preferably by failing on a subject that lacks the behavior); for a root fix, the subjects include a new case of the problem's class, though one case does not replace P3's evidence that every path producing the class is blocked or its cause is gone. A stand-in proves only the layer it actually exercised. Reworded prose is judged by a qualified reader, not a test.
4. **A settled result:** missing, empty, refused, timed-out, pending, stale, or wrong-state evidence is unknown and blocks completion.

A claim that a change is safe states the strongest level its deciding fact reached: asserted, located at a cited line, failure path walked through, shown by running the real code, or reproduced in the running product. Independent judgment means a fresh verifier is the judge; the task owner's own reading never closes it.

## Predicate closure

Each predicate closes as **confirmed**, **refuted**, or **unjudgeable**. A refuted predicate blocks completion until repair or reopened Direction settles it. A predicate is unjudgeable only when its judging layer is unreachable from this task at all: users who do not exist yet, an external gate outside the work, or an authorization the user refused; it names the missing layer and the observation that would settle it. A delivery whose unclosed predicates are all unjudgeable completes and names them in the linked evidence.

Only a remaining value, taste, risk, or irreversible-authorization predicate keeps a blocking completion gate, with three answers: done, needs adjustment, pause. "Pause" releases ownership until the user resumes. Otherwise a reversible delivery with complete evidence may complete asynchronously.

An effect only later real use can show is never a delivery predicate; it becomes an observation in the project's task store with its refuting observation and keep, adjust, and withdraw conditions, or is recorded in the linked evidence.

A defect known to have reached a user or production completes only when it is fixed at its root and the evidence says why it escaped, classified with the [`diagnosing-bugs` skill](../../diagnosing-bugs/SKILL.md) (when this install lacks it, read it at <https://github.com/byheaven/byheaven-skills/blob/main/plugins/manager/skills/diagnosing-bugs/SKILL.md>).

## Evidence reuse

Evidence carries to a new state only when every input and observation condition it depends on is unchanged. Across a rebase, equal `git patch-id --verbatim` values for the judged range show the change's own content is unchanged; the composed result is still observed on the new head by its deterministic checks. At a release, carry receipts bound to the exact released artifact, and observe again only what the deployment can change.

## Verifier dispatch

A verifier receives the locked commitment, the exact artifact state, the authority and Acceptance, scope, the approved writing brief and review object where they apply, the excerpts of this skill it needs, and the [global-rules excerpt](production.md#topology) when it does not load the user's rules; it never receives producer reasoning. When a predicate judges what the user decided, quote the user's words with date and place. Each finding names severity (critical, high, medium, or low), scenario, evidence, impact, and the smallest sufficient repair; the task owner joins all findings once, gives each a stable id, and settles each as fixed, wrong, intentional, or immaterial.

A delivery gets one review round. A medium or low finding is fixed or settled without another round, and a repair applied as the verifier prescribed closes on the task owner's diff check. A bounded follow-up runs only for an unresolved critical or high finding, or a repair that changed behavior beyond its prescription, and judges only that case. After two follow-ups, stop and return each open question to the user. A gate reads `no open critical or high finding on <object>`, never an approve verdict.

## Producer-routed verification

The task owner may delegate verification to a producing worker in its directive, which names the verifier endpoint, the producer the endpoint returns repairable findings to, and the repair wait (24 hours when it names none). An artifact the task owner produces itself stays with the task owner.

- **Classify.** The producer classifies each predicate under [Owner acceptance](#owner-acceptance) item 2 and names the fact that places it there. Exempt only when everything falls in item 2's no-judge list; when unsure, or when the directive mandates it, verify.
- **Verify.** Send the exact artifact state (for code: repository root, commit SHA, comparison base) and the directive's fields unchanged to the endpoint, with the producer's model family and no producer reasoning. The endpoint runs a fresh [Verification carrier](runtimes.md#verification-carrier), sends repairable findings to the producer for one repair round, routes scope, direction, and taste findings to the task owner, and returns every finding with its state and the final verdict to the task owner. A timeout is never a pass.
- **Exempt.** Deliver marked `not verified: <class>, <predicate and classifying fact>`, with the producer's check.

The task owner keeps acceptance, merging, and any further repair, and may still send an unverified artifact to a verifier.

## Failure diagnosis

When a predicate fails or a defect recurs, find the cause before the next action: a changed commitment, an implementation defect, an environment fault, stale evidence, or a correlated reasoning failure. After two fixes resting on the same premise fail the same check, test that premise directly before a third. A hard or recurring bug follows the `diagnosing-bugs` skill. Reopen Direction only when the remedy changes a user-owned dimension. Semantic rule conflicts go to the `verifier` agent.

## Dependency waits

Before repairing a blocking fault, check whether another agent is already repairing it. If so, keep this task owned and arm a wait that resumes this conversation, bound to the dependency's terminal result and a deadline under [External waits](../../principles/SKILL.md#external-waits); on success, verify the result at its live authority and continue. A timeout wakes the task owner to act, never to mark success. If no one is repairing it, diagnose and repair it within current authority; scope, value, and risk choices go back to the direction owner under [Handoff](direction.md#handoff).
