# byworkflow

`byworkflow` packages one project-collaboration method for any agent host that
loads skills. The `task-owner` role and checklist are the delivery method of any session that
owns a task: it locks the task's Intent, or takes one the direction owner (the
conversation where you settle project direction) hands over with your explicit
authorization, and closes every Acceptance predicate through a qualified judge
before it claims completion. The `manager` skill adds the duties of a project's
Manager, which exists only where your deployment's own instructions name one.

## What It Includes

```text
skills/task-owner         The task owner role and its checklist: Intake,
                          Records, Delivery, Completion, Report; uses
                          always-loaded P1-P3
  references/             direction (Grill, handoff), experience gates,
                          production topology, evidence, repository
                          integration, and the capabilities a host
                          provides
skills/manager            A project's Manager, which drives without producing:
                          handoff receipt, standing mandate, task sizing,
                          several Managers
skills/code-production    Code editing and checking method
skills/diagnosing-bugs    Feedback loop for a hard bug; classifies escaped
                          bugs
skills/qa                 QA of a change on the real build: verdicts,
                          regression of touched features, first-time-user
                          walkthroughs; a project overlay supplies
                          environments and test identities
skills/experience-design  From the job and the journey down to screens
                          that need fewer words, and the words that remain
skills/grilling           Question rounds that converge a direction (Grill)
skills/roundtable         One question to several model families, compared
                          in one saved file (user-invoked)
skills/writing-for-agents How to write skills, rules, and directives agents
                          follow
agents/worker             Bounded sub-agent slice: code, design, or knowledge
agents/verifier           Independent verifier with its checklist
```

The method is store-neutral: task records, standing delivery mandates, and
merge grants are used only when the project or the user has defined them.
Pull requests are merged without asking only under a standing grant the user
has recorded in their own instructions.

No agent pins a model or effort: each runs on what your deployment's model
routing names, or else the host's default; add `model` or `effort` to an agent's
frontmatter to choose another.

## Installation

### Claude Code plugin

```text
/plugin marketplace add byheaven/byheaven-skills
/plugin install byworkflow
```

### Codex

Codex reads this repository's Claude-format marketplace:

```bash
codex plugin marketplace add https://github.com/byheaven/byheaven-skills.git
codex plugin add byworkflow@byheaven-skills
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

Each role has one definition. `skills/task-owner` owns one task, `skills/manager`
drives a project without producing, `agents/worker` produces one bounded slice,
and `agents/verifier` judges it. Roles a session holds for its whole life are
skills so every host can load them; worker and verifier are agents because they
only run as sub-agents.

Claude Code loads a skill role as its session agent: link
`~/.claude/agents/<role>.md` to that skill's `SKILL.md` in the marketplace clone and
set `"agent": "<role>"` in `settings.json`, or pass `claude --agent <role>`; the
plugin registers no hook there. The checklist routes each action to its method:
production for dispatch and the deployment's model routing, repository integration
for publication and merge, governed changes for rule edits, closure for completion.
Pi loads the role through the registered `.pi-plugin/task-owner-role.ts` extension,
which adds the `task-owner` skill body to every run's system prompt; it adds no
reminder or completion check.

Codex reads the role through the `task-owner` skill and registers `worker` and
`verifier` as deployment profiles; its manifest registers no hooks or agents. The dispatcher reads the deployment's
Model routing and records its choice. Owners invoke verifiers through their
harness, or the verification launcher their deployment binds, under
Verification carrier: pinned state, read-only artifacts, unchanged-artifact
checks and non-zero/no-verdict handling.
Deployment bindings invoke `skills/task-owner/scripts/pr_wait.py` to wait on one
pull request; it prints one verdict with a fixed exit code.

### Host mechanisms

`skills/task-owner/references/runtimes.md` states what a task owner needs from a host
(loading, asking, sub-agent dispatch, isolation, verification, waiting, a
review carrier, merging, completion) and from the deployment's always-loaded
rules (its Deployment rules section) as requirements only. The task owner meets each
with the host's own native mechanism, or with a binding your instructions
name, and reports a requirement the host cannot meet as blocked. Which bots,
agent ids, machines, and model CLIs your setup uses belong in that binding;
the plugin carries none of them.
