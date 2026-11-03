# manager

`manager` packages one project-collaboration method for any agent host that
loads skills. The `task-owner` role and checklist are the delivery method of any session that
owns a task: it locks the task's Intent, or takes one the direction owner (the
conversation where you settle project direction) hands over with your explicit
authorization, and closes every Acceptance predicate through a qualified judge
before it claims completion. The `manager` skill adds the duties of a project's
Manager, which exists only where your deployment's own instructions name one.

## What It Includes

```text
skills/task-owner         Task delivery: Intake, Records, Delivery,
                          Completion, Report; uses always-loaded P1-P3
  references/             direction (Grill, handoff), experience gates,
                          production topology, evidence, repository
                          integration, and the capabilities a host
                          provides
skills/manager            A project's Manager: handoff receipt, standing
                          mandate, task sizing, several Managers;
                          loads skills/task-owner first
skills/code-production    Code editing and checking method
skills/diagnosing-bugs    Feedback loop for a hard bug; classifies escaped
                          bugs
skills/experience-design  From the job and the journey down to screens
                          that need fewer words, and the words that remain
skills/grilling           Question rounds that converge a direction (Grill)
skills/roundtable         One question to several model families, compared
                          in one saved file (user-invoked)
skills/writing-for-agents How to write skills, rules, and directives agents
                          follow
agents/task-owner         Accountable task owner; self-production or P3 dispatch
agents/verifier           Independent verifier with its checklist
agents/code-worker        Bounded code-production slice
agents/designer           Bounded design slice: flow, screen, states, or
                          interface copy
agents/knowledge-worker   Bounded research or document artifact
```

The method is store-neutral: task records, standing delivery mandates, and
merge grants are used only when the project or the user has defined them.
Pull requests are merged without asking only under a standing grant the user
has recorded in their own instructions.

The `verifier` and `code-worker` agents pin no model or effort, so they run on
the model your deployment's model routing names, or else the host's default;
add `model` or `effort` to the agent frontmatter to choose
another.

## Installation

### Claude Code plugin

```text
/plugin marketplace add byheaven/byheaven-skills
/plugin install manager
```

### Codex

Codex reads this repository's Claude-format marketplace:

```bash
codex plugin marketplace add https://github.com/byheaven/byheaven-skills.git
codex plugin add manager@byheaven-skills
```

P1–P3 come from the deployment's always-loaded rules; the plugin carries no copy.
The plugin creates no task record and adds no task-store or machine-specific
binding.

In cloud-orchestrated ChatGPT Work, a cloud host loads the `task-owner` skill, with its sibling skills, through its own
skill-loading entry; with the skills alone the task-owner checklist reads its role from the repository, and the worker and
verifier agents are absent.
See [plugin support](https://learn.chatgpt.com/docs/plugins).

### Other skill-based tools

```bash
npx skills add byheaven/byheaven-skills
```

This installs the skills only, without the plugin's `agents/` directory.
Invoke the `task-owner` skill at the start of a delivery conversation,
and the `manager` skill only in a session your deployment names a project's
Manager. The worker and verifier agents come only with the full plugin;
without them the task owner uses focused writer directives and finds
another carrier for independent verification.

`skills/grilling`, `skills/writing-for-agents`, and `skills/diagnosing-bugs`
are adapted from
[mattpocock/skills](https://github.com/mattpocock/skills) under the MIT
license; each skill's notice is in its own `LICENSE` file.
`writing-for-agents` keeps the upstream text at commit `6fd9479`, widens its
description to cover rules and directives, adds one sentence on blinding
the no-op test run, and states that each host's packaging declares a
skill's invocation.

The performance method in `skills/code-production/references/performance.md`
and the verifier's safety-fact check adapt ideas from the `benchmark-checklist`
and `blast-radius` skills of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack) under the MIT
license; its notice is in `skills/code-production/LICENSE-pstack`.

## Usage

Three responsibilities stay separate: the deployment defines its coordinator,
`agents/task-owner.md` owns one task, and `agents/verifier.md` judges it. Worker
charters are optional bounded slices. The `manager` skill remains for deployments
with project queues or recurring delivery loops; it assigns no coordinator.

Claude Code loads the role through its own `agent` setting (`"agent": "manager:task-owner"` in
`settings.json`) or `claude --agent manager:task-owner`; the plugin injects
nothing at session start. The plugin's `hooks/hooks.json` adds context before an
action: publication, merge, dispatch, and edits to the rule paths the deployment
lists. Completion requests one checklist pass only for a session the host started
as the task owner that has received such a reminder; `stop_hook_active` permits the
next stop. Workers and verifiers receive no extra completion pass. Deployment
options sit in `settings.json` under `pluginConfigs["manager@<marketplace>"].options`:
`rule_paths`, regular expressions matched against an edited file's path, and
`routing_table`, a file whose text the dispatch reminder appends. Pi uses the registered
`.pi-plugin/task-lifecycle.ts` extension at the corresponding event boundaries.
Use `pi --manager-role task-owner` for the owning main session. Its completion
check requests at most one continuation per active completed run; other roles
and unclassified sessions receive none.
These are reminders, not semantic or merge validators. A read, shell command or
MCP call outside the adapters' recognized names may bypass an action reminder;
repository gates and the continuing role remain authoritative. Claude session
activity is kept in the plugin data directory and reset at each completion.

Codex can consume the role through `model_instructions_file` in a separate
profile (this replaces built-in instructions), or through an additive
SessionStart hook. No Codex hook manifest is shipped in this change. Trust and
embedding-host adoption must be verified for the chosen carrier. Hooks never
select a model or inference source; the dispatcher reads the deployment's
Model routing and records its choice. Owners invoke verifiers through their
harness, or the verification launcher their deployment binds, under
Verification carrier: pinned state, read-only artifacts, unchanged-artifact
checks and non-zero/no-verdict handling. Existing sessions require a confirmed
reload before relying on changed instructions.

### Host mechanisms

`skills/task-owner/references/runtimes.md` states what a task owner needs from a host
(loading, asking, sub-agent dispatch, isolation, verification, waiting, a
review carrier, merging, completion) and from the deployment's always-loaded
rules (its Deployment rules section) as requirements only. The task owner meets each
with the host's own native mechanism, or with a binding your instructions
name, and reports a requirement the host cannot meet as blocked. Which bots,
agent ids, machines, and model CLIs your setup uses belong in that binding;
the plugin carries none of them.
