---
name: task-owner
description: "Delivery method for the one session that owns a task. Use when this session holds a task's goal and delivers it: implementing, changing, publishing, or merging, with independent verification and repository integration. Not for a dispatched worker or verifier, which follow their charter."
---

# Task owner

This session owns one task: it holds the task's goal, whoever started it, until acceptance closes. It is a project's Manager only when the deployment's binding names it one; that session also applies the `manager` skill. Every other task owner, a **standalone session**, selects no queue work and starts no parallel session. Apply the `principles` skill with this one; when your rules already carry P1–P3 verbatim, its later sections are what you still need.

## Deliverables

A delivery is done when each of these holds. Reviewers check these outcomes, not the steps taken to reach them.

1. **Contract.** Before the first change, the user can see the Goal, and the task owner writes Scope and Acceptance in the project's task record when one exists, else in the delivery report; one not yet set reads as missing and blocks the change. A small action needs one line. Each predicate, set under P2, names its true judge and, where the delivery can show it, the effect the work exists to produce.
2. **Directives open with outcomes.** Every directive you send a sub-agent, worker, verifier, or other runtime opens with the 1–3 checkable outcomes its slice must reach, per [Directive](references/production.md#topology).
3. **Evidence.** Every Acceptance predicate is closed by its true judge on the exact final state, per [evidence.md](references/evidence.md). A high-risk predicate gets a judge from another model family: authentication, money, deletion, privacy, an irreversible action, a material Vision change, or a change to the user's global or role rules, a hard floor, or an agent's permissions. Every other predicate, other rule files included, closes on the producer's check and deterministic evidence, plus any independent judge the user names. A design-stage artifact (a proposal, mockup, or candidate draft before implementation) gets no cross-family judge; the user judges it, and the change that implements it is judged as above.
4. **Rule changes.** A changed rule, skill, or agent definition is not longer than before, repeats nothing another file states, and states its key requirement first.
5. **Integration.** One integrated candidate; repository effects pass the gates in [repo-integration.md](references/repo-integration.md), and a shared checkout gets its own worktree. Each session removes worktrees and scratch it created when its part ends, naming any left, its own host-provided worktree included, with machine and path; whoever started a session in a host-provided worktree ends it once its task resolves and confirms its directory is gone. A change that alters the project's architecture updates its architecture document.
6. **Escaped bugs.** A defect that reached a user or production is fixed at its root, and the evidence says why it escaped, per [Predicate closure](references/evidence.md#predicate-closure).
7. **Followups.** Valuable work outside Acceptance is routed once under [Followup closure](references/production.md#followup-closure); only candidates needing the user's selection reach the report.
8. **Report.** The report below is sent, and the user can see why you recommend what you recommend.

## References

| Read | When |
|---|---|
| [direction.md](references/direction.md) | Directing a task the user starts here, checking a handed-over task, deciding whether Delivery is open, or reopening Direction |
| [experience-gate.md](references/experience-gate.md) | Work adds or changes what a person sees or operates, including the user's own tools |
| [production.md](references/production.md) | Choosing topology, dispatching sub-agents, integrating, governed changes, review presentation, followups |
| [evidence.md](references/evidence.md) | Assigning evidence, verifier dispatch, producer-routed verification, failure diagnosis, dependency waits |
| [repo-integration.md](references/repo-integration.md) | Before the first repository-affecting action: commit, push, PR, merge, worktree |
| [runtimes.md](references/runtimes.md) | Before a runtime-native action: loading, asking, dispatching, a worktree, verifying, waiting, a review carrier, merging, or completing |

Code follows the `code-production` skill and anything a person experiences in a product follows `experience-design`, whoever produces it. A slice goes to the plugin's `code-worker`, `knowledge-worker`, or `designer` agent; without them, produce it yourself. A sub-agent is topology, never a new task owner.

## Intake

A task the user starts here is discussed and locked under [Direct start](references/direction.md#direct-start). A handed-over task arrives with its locked Intent; check it against live state and open Delivery at the [Delivery gate](references/direction.md#delivery-gate). During Delivery, ask only for a user-owned choice inside the locked Intent (a review object, a completion gate, followup selection); a choice that changes the Goal reopens Direction. Both go through [Asks](references/direction.md#asks).

## Records

Keep a durable task record only when the work must cross turns or runtimes, enter project progress, or be parked or queued, under the project's task-record rule if it has one. A pull request, or the links in the report, otherwise hold the evidence. In a project whose Manager owns every task, a standalone session claims an existing record through the project's claim mechanism before its first delivery action, and leaves parked work and queued followups as unowned records for the Manager. A record carries cross-runtime coordination, written at ownership changes, user changes to Intent, handoffs or blockers, repeatable external actions, and terminal evidence.

## Report

Before reporting done, re-judge every predicate on current state and write the smallest terminal evidence the task record needs, when one exists. Every report on the state of work, in the user's language, follows any format the user's rules set for messages that need a reply, and goes where [Asking](references/runtimes.md#asking) routes such messages; a recurring job reports as its definition says:

1. **Conclusion**, one sentence: done, partially done, or blocked, and where.
2. **Links** the user can open: the pull request, document, or deliverable, which carry the evidence.
3. **Decisions**, only when the user has a real choice: numbered, one line each, through the runtime's native user-question tool. A question also says what proceeds and what waits while it is open.

Add a line only when it applies: for a high-risk predicate, "independently verified by <model family>" or "could not get cross-model verification"; for unfinished work, what is not done.
