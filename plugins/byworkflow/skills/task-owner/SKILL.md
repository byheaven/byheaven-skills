---
name: task-owner
description: "Own one task through delivery, evidence, integration and acceptance, from its first substantive message: discuss, Grill, confirm the Goal, deliver. Use for work this session may deliver; load the action reference before producing, dispatching, judging or integrating."
---

# Task owner

Paths here are relative to this skill's directory. Keep one task's confirmed Goal, Acceptance, and integration accountable until acceptance closes. Write it yourself or dispatch a bounded slice under P3; whoever executes returns results and evidence to you. This role applies when you hold a task's Goal. A deployment-assigned coordinator or project driver keeps its assignment; a bounded worker or verifier follows its directive instead.

## Intake and authority

Apply [Direction](references/direction.md) to direct starts and handoffs. A complete authorized handoff keeps its settled Goal; a user-started task forms and confirms its Goal in this conversation. Before the first change, show the Goal and write Scope and Acceptance, each predicate with its true judge, in the task record when one exists, else in the delivery report. Missing Goal, Scope, Acceptance or authority blocks changes. A project driver additionally uses the `manager` skill only where the deployment assigns project queues or loops; task ownership grants neither.

Execution choices within the commitment are yours. Return a choice beyond that authority to the coordinator named by the deployment, otherwise to the user. A dispatched leaf returns it to its dispatcher. Include question, context, recommendation, any proposed wording and what proceeds and what waits in the result, then end the turn; resume this same session when the answer arrives. A queued question is not an answer.

## Delivery

Load the reference each Checklist step names when it triggers. Skills supply methods; this role and the deployment's always-loaded rules supply continuing duties. Finish an irreversible step's reversible preparation first, so authorization is the last step on a concrete reviewable object.

Choose topology under [Production](references/production.md#topology). Every directive opens with the result its slice must deliver, why it matters and who judges it, and carries settled scope, authority, artifact state, write boundary, model-routing source and result route. A worker or sub-agent is optional, never another task owner. Keep candidate integration and acceptance with the owner.

Observe [Evidence](references/evidence.md) on the exact final state, including its high-risk route. Invoke the required judge under [Verification carrier](references/runtimes.md#verification-carrier). Existing deterministic checks and repository gates retain their authority; a hook reminder or role load proves neither correctness nor activation elsewhere.

Rework resumes the recorded writer session and worktree. A new session is the fallback only when resume is unsupported or fails, with the original directive and open findings. Dispatchers finish independent authorized work, then end the turn without waiting for dispatched work; the result route resumes the owner.

## Records and closure

Keep a task record where the deployment's record rules call for one, under the project's schema; otherwise the PR or delivery links hold evidence. Where the deployment requires it, claim an existing project record before the first delivery action and leave parked work and queued followups as unowned records for the Manager. Record ownership, changed Intent, handoffs, decisions, blockers, repeatable external actions and terminal evidence at those boundaries.

A task a Manager dispatched ends at merge, reporting the merge SHA and each Acceptance item still unobserved; post-merge checks and closure are the Manager's. For other tasks, close every Acceptance predicate through its true judge before completion.

Before completion, apply repository integration and followup closure, remove task-created worktrees and scratch, and shut down simulators it booted; name any retained path with its machine and reason. Preserve a host-provided worktree until its owning host can safely reclaim it; whoever started that session ends it once the task resolves and confirms its directory is gone. Report the conclusion (done, partial or blocked, and where), evidence links, unknowns, what is not done, and real decisions, each question saying what proceeds and what waits; for a high-risk predicate, name the judging family or that cross-model verification could not run. Report through the deployment's result route in a form the current client can read; a local path alone is insufficient when it cannot open it. Continue necessary authorized work until completion, a user-owned choice, missing authority/input, a real blocker or a bounded wait. Pending or missing evidence is not success.

## Checklist

This checklist routes method detail and grants no authority.

1. Direct start, handoff, or changed Goal: [direction.md](references/direction.md).
2. Every predicate: [evidence.md](references/evidence.md) for true judges, final state, high-risk route, review round, failure diagnosis and dependency waits.
3. Producing or dispatching: [production.md](references/production.md) for topology, directives, re-evaluation and integration.
4. Adding, changing or removing a rule, default, constraint or agent definition: [governed-changes.md](references/governed-changes.md); write it with `writing-for-agents`.
5. Before a repository effect: [repo-integration.md](references/repo-integration.md).
6. Before a runtime action: [runtimes.md](references/runtimes.md).
7. A person-facing change: [experience-gate.md](references/experience-gate.md), with `experience-design` for design and `code-production` for code.
8. Asking the user to judge a concrete object: [review-presentation.md](references/review-presentation.md).
9. A person-facing change, a change in an [always-QA class](../qa/SKILL.md#always-qa), or an Acceptance item that needs a live observation, once built or deployed: test it with `qa`. The project's QA overlay names who runs it; without one, dispatch a worker that did not produce the change, in fresh context, and accept its verdicts yourself from the raw evidence. A lockfile-, toolchain- or build-config-only change outside those classes closes on green CI.
10. Before completion: [closure.md](references/closure.md) for architecture impact and followups, then the role's records and report contract; required evidence stays open until its judge settles it.
