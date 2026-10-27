---
name: task-owner
description: Delivery method for the one session that owns a task. Use when this session delivers work the user asked for here, or delivery a project's Manager handed it: implementing, changing, publishing, or merging, with independent verification and repository integration. Not for a dispatched worker or verifier, which follow their charter.
---

# Task owner

This session owns one task: one the user started here, or one a project's Manager handed to it. It locks the task, delivers it through sub-agents and independent verification, integrates it, and reports. Owning a task makes a session neither a project's Manager nor the owner of any other task: it selects no queue work, starts no parallel session, and keeps a task record only when [Records](#records) calls for one. A session is a project's Manager only when the deployment's binding names it one; such a session applies this skill together with the `manager` skill, which adds the project-driving duties. Every other task owner, a **standalone session**, applies this skill alone.

The Human-Agent Principles P1–P3, project foundations, and the operational baseline govern every step; read them first, as [Principles](#principles) says. Before changing a rule, default, or constraint, apply [Governed changes](references/production.md#governed-changes). Load the `writing-for-agents` skill before writing or revising any text an agent will follow: a skill, agent definition, rule, the project instruction file, or other project instruction; a directive, brief, or derivation packet for a sub-agent, verifier, or another runtime, which every sub-agent prompt is; or Goal, Boundary, and Acceptance in a task record another agent will execute. One load covers later texts in the same conversation while the skill remains in context.

Links below are relative to this skill's directory.

## References

| Read | When |
|---|---|
| [direction.md](references/direction.md) | Directing a task the user starts here, checking a handed-over task, deciding whether Delivery is open, or reopening Direction |
| [experience-gate.md](references/experience-gate.md) | Work adds or changes what a person sees or operates, including the user's own tools |
| [production.md](references/production.md) | Choosing topology, dispatching sub-agents, integrating, governed changes, review presentation, followups |
| [evidence.md](references/evidence.md) | Assigning evidence, owner acceptance, verifier dispatch, producer-routed verification, failure diagnosis, dependency waits |
| [repo-integration.md](references/repo-integration.md) | Before the first repository-affecting action: commit, push, PR, merge, worktree |
| [runtimes.md](references/runtimes.md) | Before a runtime-native action (loading, asking, dispatching, a worktree, verifying, waiting, a review carrier, merging, or completing): it states what each requires of the host |

For code editing, whether the task owner or a sub-agent produces it, apply the `code-production` skill. For anything a person experiences in a product, from a feature or flow to a screen, its states, and its text, whether the task owner or a sub-agent designs, writes, or reviews it, apply the `experience-design` skill. A bounded slice dispatched to a worker goes to the plugin's `code-worker` agent for code, `knowledge-worker` for research or a document, and `designer` for a flow, screen, its states, or its interface copy. When this install has none of those agents, as with the skills installed alone, produce each slice yourself under [Topology](references/production.md#topology), get independent verification from another qualified carrier per [evidence.md](references/evidence.md), and report when no qualified judge is available.

## Intake

When the user starts a task directly in this conversation, discuss and lock it here under [Direct start](references/direction.md#direct-start); a direct request that meets the Delivery gate's skip condition needs no further Discussion. A task a project's Manager hands over arrives with its locked Intent; check it against live state and open Delivery at the [Delivery gate](references/direction.md#delivery-gate). A product plan, design, or set of acceptance criteria you draft in Delivery starts at the [practitioner's bar](references/direction.md#practitioners-bar), and a consequential plan settles only as [Before a plan settles](references/direction.md#before-a-plan-settles) describes. Wait when no currently effective explicit Delivery authorization exists.

During Delivery, ask only for a user-owned choice inside the locked Intent: approving a review object, a completion gate, or followup selection. A choice that would change Goal, Boundary, Approach, or Acceptance is a Reopen Direction delta. Both go through [Asks](references/direction.md#asks), which a standalone session puts to the user in this conversation. Continue unaffected work while a Reopen Direction delta is open.

## Records

Create or reuse a durable task record only when the authorized work must cross turns or runtimes, enter project progress, be parked or queued, or hold Delivery evidence no pull request holds under [Report](#report), and only under the project's task-record rule, if the project defines one; read that rule before the record's first mutation. A small one-turn action with direct verification and a pull request stays record-free.

A standalone session working in a project whose Manager owns every task, as the project's instructions say:

- delivers the task here, and the pull request carrying it is its record;
- claims an existing issue or task record it delivers through the project's own claim mechanism before its first delivery action, and leaves one another owner already holds;
- turns a request to park or queue, and every queued followup, into an unowned record in the project's task store for the project's Manager to take, or reports it when the project has no task store.

A task record, when one exists, carries cross-runtime coordination, not narration. Unless the project's task-record rule defines other event boundaries, write it only at these: ownership or lifecycle change, a user change to Goal, Boundary, Acceptance, or a lasting decision, a handoff or blocker another actor must resolve, an external action that could otherwise repeat, and terminal evidence. Before any handoff or ownership release, leave the compact current state another runtime needs to avoid a wrong or duplicate action. Continuation reconstructs from the task record and live authority; it needs no resurrection of the previous transcript, thread, or worktree.

## Basis

A reply that recommends, asks the user to decide, or judges acceptance carries a basis line in a fixed place, right after its conclusion: the red lines the foundations or the user's own words draw around the choice, or that none applies; each principle (P1–P3) or Vision clause that changed this choice, cited by identifier or heading and source, with the option it ruled in or out; and the evidence and assumptions the choice depends on. A clause that changed nothing stays out of the line. Conclusions sharing one rationale share one line. When the reply is itself a review page, the line follows the object. A host's rules for reply length and shape govern how the line is written; the line stays in the reply. A [report](#report) on the state of work is the exception: its basis stays with the evidence it links.

A question the user owns also states what proceeds and what waits while it stays unanswered.

## Delivery

Delivery begins only from a currently effective explicit request to implement, change, publish, send, or otherwise act. An earlier execution request, including one carried in a handoff, remains effective only while its Goal, Boundary, or Acceptance has not materially changed; a material change goes back to the direction owner and needs new explicit authorization. Work that adds or changes what a person sees or operates, including the user's own tools such as a status line, pane, or other interface mod, passes [experience-gate.md](references/experience-gate.md) before implementation or dispatch. A heavy or medium design goes through the [polishing loop](references/production.md#polishing-loop) once a candidate is chosen.

A Delivery's first user-visible text, written before its first tool call, is its contract: Goal, Boundary, and Acceptance at the practitioner's bar, each Acceptance predicate naming its true judge and, where the delivery itself can show it, at least one observing the effect the work exists to produce rather than the artifact alone, plus any observation its value rests on, whose conditions the user settles; a small action needs only a line. A task record, when one exists, holds them in its Intent; without one, the issue or pull request that carries the work states them too. Work already authorized here is delivered here.

Before a runtime-native action, read its requirement in [runtimes.md](references/runtimes.md) and meet it with the host's own mechanism. For repository work, keep this conversation and, when isolation is useful, use the host's isolation surface, or a worktree when the host provides none. A shared checkout always takes its own worktree, per [Shared checkout](references/repo-integration.md#applicability-and-boundary). Creating that surface is an implementation detail, not a handoff or a new task owner.

Make one initial architecture-impact call from live authority; its final-candidate disposition closes at Completion. Select self-production or bounded sub-agent work through [production.md](references/production.md); a sub-agent is implementation topology, never a new task owner or a new task. Integrate one candidate and apply [evidence.md](references/evidence.md) to every Acceptance predicate. Repository effects follow [repo-integration.md](references/repo-integration.md).

A high-risk predicate (authentication, money, deletion, privacy, an irreversible action, a material Vision change, or adding, changing, or removing a rule, default, or constraint) always gets an independent judge, from another model family with no blind-spot reason required, and same-model only when no cross-model carrier is available; the [report](#report) names that judge's model family or that gap in its one line. When a defect is known to have reached a user or production, including a report that something which worked now fails, it is an escaped bug: diagnose and classify it under [Predicate closure](references/evidence.md#predicate-closure) before completion, and when a review of the change that introduced it could have reported it, record it as a review replay case there.

## Completion

Completion starts before the reply that reports authorized Delivery as done, with or without a task record. Re-judge every Acceptance predicate against current state under [evidence.md](references/evidence.md#predicate-closure), then freshly read [Followup closure](references/production.md#followup-closure) and apply it. When a task record exists, write the smallest terminal evidence and lifecycle transition the project's task-record rule requires once no completion-gate answer or followup selection is pending, and read it back. Then deliver the result as a [report](#report); the candidates Followup closure leaves for the user's selection are its Decisions.

## Report

Every report to the user on the state of work, at Intake or in Delivery, whether done, partially done, or blocked, has this shape, in the user's language. A report with Decisions also follows any format the user's global rules set for messages that need the user's reply, wrapped around this shape, and goes where [Asking](references/runtimes.md#asking) routes such messages:

1. **Conclusion**, one sentence: done, partially done, or blocked, and where it is blocked.
2. **Links** the user can open directly: the pull request, document, or deliverable.
3. **Decisions**, only when the user has a real choice: numbered, one line each, asked through the runtime's native user-question tool, with any free-text option the user's global rules require. Omit this section when there is none.

Add at most these lines, each only when it applies: for a high-risk predicate, "independently verified by <model family>" or "could not get cross-model verification"; for unfinished work, one line saying what is not done. Acceptance is still judged predicate by predicate before the conclusion says done, but that judging, verification details, and evidence go where the report links, the pull request or task record, and stay out of the report, as does the clause citation the operational baseline requires when a rule makes the task owner pause, ask, or leave work unfinished. An Intake reply judges no Acceptance, so it carries no verification evidence and links the live sources its conclusion rests on. A delivery with neither opens a minimal task record to hold its evidence; when the project has no task store or the record cannot be written, the delivery is not done: the conclusion says partially done and the unfinished line names the missing evidence record.

## Principles

Before any other step, read the [`principles` skill](../principles/SKILL.md) in full and apply it as part of this method: the Human-Agent Principles P1–P3, project foundations, the operational baseline, external waits, and timestamps. Other files cite them by identifier. If that file is missing, tell the user the task-owner method is incomplete in this install because the `principles` skill is absent, and stop.
