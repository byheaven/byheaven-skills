# Project driving

These are the project-driving methods of a Manager.

## Handoff receipt

The direction owner hands a project's work to its Manager. Receive the handoff as the task-owner skill's direction reference says: check it against live authority with safe read-only investigation rather than re-confirming it with the user, then open Delivery at its Delivery gate, sending one precise question for a gap, a contradiction with live state, or an open owner decision. A park or queue request in the handoff creates only that record in the project's task store, as [Taking work](../SKILL.md#taking-work) says.

## Standing delivery mandate

A standing delivery mandate the project records, if any, may remain effective across iterations. Read it and later user decisions before deriving a finite Intent; a new task inside the mandate needs no new selection. New user-owned dimensions still pass the Delivery gate before merging, shipping, or creating external effects; reversible exploratory pre-work under [Taking work](../SKILL.md#taking-work) prepares concrete evidence for that gate without crossing it. A wake prompt or favorable finding cannot supply or expand the mandate. Manager selects work under the mandate only within its own limits, such as tasks in flight and quota.

## Task sizing

When a Manager forms tasks, from a project's queue of open issues, parent epics, task records, or followup candidates, size them so tightly coupled small work stays together, independent work runs in parallel, and multi-pillar features split vertically for craft depth. Size before a task's scope is locked; once it is locked, its task owner sizes the pull requests under the task-owner method's delivery unit.

- **Group.** Put tightly coupled small edits, follow-ups, or closely related items in one task when they touch the same surface, shared interface, or code area and are judged by similar acceptance, so one producer, one setup, and one review cover them without merge conflicts.
- **Split for parallelism.** Decompose large approved parent epics or multi-surface goals into non-conflicting parallel tracks—disjoint surfaces, modules, or independent prototype and research slices with clear boundaries—and dispatch them concurrently within the active-task concurrency target instead of serializing independent work behind one parent ticket.
- **Split for craft depth.** Sharing one UI surface does not mean cramming multiple independent experience pillars (such as core loop, first-time onboarding, motion, audio, and haptics, additional themes, retention or social hooks, and edge or offline states) into one monolithic pull request. For complex multi-dimension features or games, split vertically into focused craft milestones—1–2 pillars per milestone—and sequence them autonomously under [Multi-unit delivery](../../task-owner/references/production.md#multi-unit-delivery) so each pillar hits the highest-standard bar instead of shipping a shallow skeleton.
- **Alone.** An urgent fix, or an item that blocks other work, may go out on its own rather than wait for a group.

## Several Managers

A project's binding names its peer Managers, each in its own session, and any default. Its claim mechanism records each task's Manager. Without a default, take each duty otherwise assigned to it as a task; the first recorded claim wins.

- **Claims.** Take only a task no other Manager has claimed; the task owner you dispatch it to carries it to closure. A task stays with its Manager while any of its claims remains, and is unclaimed again once all are released. When a claim attempt meets an existing claim whose record does not name you, leave the task; when claims of two Managers land on one task, the Manager whose claim was recorded later releases its own.
- **Limits.** The cap on tasks in flight counts each Manager's own dispatches, unless the deployment says the Managers share it.
- **One owner per duty.** A duty the project gives its Manager falls to exactly one Manager, decided in this order: for a task, the Manager that owns it; for a pull request, the Manager that dispatched it or took over that dispatch, else the owner of the first task it references; for other work, a named default, otherwise the first Manager to claim it as a task. Other work includes the one list of user questions, unclaimed tasks, records a standalone session left, and otherwise-unassigned pull requests.
- **Shared target failure.** When the shared target branch fails its verification and the task that merged the failing commit has closed, the Manager that commit falls to repairs or reverts it, without waiting for blame, and the other Managers leave that failure to it. That Manager is the one the pull request behind the commit the failing run checked falls to under the order above; a commit no pull request produced follows the same ownership rule for other work.
- **A Manager stops.** The user decides who takes over its active work and claims, and any default role it held. The outgoing session hands them over with current state under the task-owner role's Records and closure.

## Mandate-covered followups

For continue-now and blocked candidates from [Followup routing](../../task-owner/references/closure.md#followup-routing), first check the project's standing delivery mandate. Work covered by an effective mandate is already authorized: cite its scope fit and apply that section's defaults within its bounds, as this Manager's next dispatch sized under [Task sizing](#task-sizing), without asking the user to select it; candidates the mandate does not cover go to the user for selection there. When the mandate permits parallel sessions, covered candidates that depend neither on this delivery nor on that continuation instead become parent-linked records, sized under [Task sizing](#task-sizing), unowned and startable now, for a new session to claim; Manager requests that session through the runtime's available channel within the mandate's concurrency limit, and otherwise leaves the record for the mandate's next claim run.
