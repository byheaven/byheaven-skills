# manager

`manager` packages one project-collaboration method for any agent host that
loads skills. The `manager` skill is the delivery role: it delivers a locked Intent that the
direction owner (the conversation where you settle project direction) hands it
with your explicit authorization, and closes every Acceptance predicate through a qualified judge
before it claims completion.

## What It Includes

```text
skills/manager            Manager role: Intake, Delivery, Coordination,
                          Continuation, Completion; reads skills/principles
skills/principles         Human-Agent Principles P1-P3 and operational baseline
  references/             direction (Grill, handoff), experience gates,
                          production topology, evidence, repository
                          integration, and the capabilities a host
                          provides
skills/code-production    Code editing and checking method
skills/experience-design  From the job and the journey down to screens
                          that need fewer words, and the words that remain
skills/grilling           Question rounds that converge a direction (Grill)
skills/roundtable         One question to several model families, compared
                          in one saved file (user-invoked)
skills/writing-for-agents How to write skills, rules, and directives agents
                          follow
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

The Codex manifest enables a `SessionStart` hook only for `startup`. It assigns
no role: in an interactive session whose git checkout is behind its remote, or
whose refresh failed, it only says so; otherwise it adds nothing. A `codex exec` run, such as a scripted
writer or judge, gets nothing from the hook. Review and trust the hook through
Codex's `/hooks` interface before it can run. Python 3 is required. Codex reads
it from `hooks/codex.json`, named in `.codex-plugin/plugin.json`.

The role, principles, and references are the same files used by Claude Code.
The hook creates no task record and adds no task-store or machine-specific
binding.

Plugin hooks are not supported in cloud-orchestrated ChatGPT Work. A cloud
host loads the `manager` skill, with its sibling skills, through its own
skill-loading entry; with the skills alone the role works, but the worker and
verifier agents are absent.
See [plugin support](https://learn.chatgpt.com/docs/plugins).

### Other skill-based tools

```bash
npx skills add byheaven/byheaven-skills
```

This installs the skills only, without the plugin's `agents/` directory or
hooks. The `manager` skill still carries the whole Manager role; invoke it at
the start of a delivery conversation. The worker and verifier agents come only
with the full plugin, so without them Manager produces each slice itself and
finds another carrier for independent verification.

`skills/grilling` and `skills/writing-for-agents` are adapted from
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

The plugin assigns no role when a session starts. There is no `manager` agent:
remove any `"agent": "manager:manager"` setting or `--agent manager:manager`
flag left from an earlier version.

In Claude Code, the plugin's `hooks/hooks.json` runs the `SessionStart` hook on
new, resumed, cleared, compacted, and forked sessions. In a session it
recognises as interactive (the terminal, VS Code, or the desktop app), it
refreshes the remote-tracking refs and adds a notice when the checkout is
behind, or when the refresh failed and whether it is current is unknown;
otherwise it adds nothing. A `claude -p` or Agent
SDK run, such as a scripted writer or judge, and any session the hook cannot
place get nothing from it. To opt out, disable the plugin or set
`disableAllHooks`.

### Host mechanisms

`skills/manager/references/runtimes.md` states what Manager needs from a host
(loading, asking, sub-agent dispatch, isolation, verification, waiting, a
review carrier, merging, completion) as requirements only. Manager meets each
with the host's own native mechanism, or with a binding your instructions
name, and reports a requirement the host cannot meet as blocked. Which bots,
agent ids, machines, and model CLIs your setup uses belong in that binding;
the plugin carries none of them.
