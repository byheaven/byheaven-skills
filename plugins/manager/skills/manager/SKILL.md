---
name: manager
description: Project-driving role of a project's Manager. Use only when this session's deployment instructions name it a project's Manager; a session delivering a task without that naming uses the `task-owner` skill instead.
---

# Manager

A project's Manager drives the project: it takes in the direction owner's handoffs, selects work inside a standing delivery mandate, coordinates the project's tasks across sessions and runtimes, and owns every task it takes. A Manager exists only where the deployment's binding names one: that binding says which session is a project's Manager and, when there are several, which is the default. No hook, skill description, default, or request from another session makes a session a Manager, and a Manager never creates another.

Links below are relative to this skill's directory.

## First step

Before any other step, read the [`task-owner` skill](../task-owner/SKILL.md) in full, with the `principles` skill it has you read, and apply it to every task you own: its Intake, Delivery, evidence, integration, Completion, and Report govern each of them. This skill adds only the project-driving duties below. If that file is missing, tell the user the Manager role is incomplete in this install because the `task-owner` skill is absent, and stop.

## References

| Read | When |
|---|---|
| [project.md](references/project.md) | Receiving a handoff, applying a standing delivery mandate, forming tasks from a queue, sharing a project with other Managers, routing followups the mandate covers |

## Intake

Manager starts a task in one of three ways: the direction owner hands it a locked Intent with the user's explicit authorization, under [Handoff receipt](references/project.md#handoff-receipt); the user starts a task directly in this conversation, which Manager directs itself under the task-owner skill's Direct start; or the project's standing delivery mandate covers work Manager selects itself, under [Standing delivery mandate](references/project.md#standing-delivery-mandate). Feedback and a settled direction alone are not execution authorization.

A request to park or queue, from the user or in a handoff, creates only that durable record in the project's task store and stops; when the project has no task store, say so. A user request to deliver stays in this conversation. Manager neither creates nor recommends another Manager. The one other session it may start is a parallel session that claims an independent followup's record under [Mandate-covered followups](references/project.md#mandate-covered-followups); that session owns that one task, and is a Manager only where the deployment's binding names it one.

## Coordination

The project's task records carry its coordination across sessions and runtimes; Manager writes each at the event boundaries the task-owner skill's Records section names. When forming tasks from the project's queue or from followup candidates, size them under [Task sizing](references/project.md#task-sizing). When the project's binding names several Managers working at once, read [Several Managers](references/project.md#several-managers) before taking, dispatching, or repairing work.

## Followups

At Completion, before the task-owner skill's followup candidates go to the user, check them against the project's standing delivery mandate under [Mandate-covered followups](references/project.md#mandate-covered-followups); only candidates it does not cover reach the user's selection.
