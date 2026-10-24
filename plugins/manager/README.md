# manager

`manager` packages one project-collaboration method for Claude Code, Codex, and
Grok Bot. The
`manager` skill is the delivery role: it delivers a locked Intent that the
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
                          integration, runtime notes per host
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
the host's default; add `model` or `effort` to the agent frontmatter to choose
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

The Codex manifest enables a `SessionStart` hook only for `startup`, pointing
each new session at the installed `manager:manager` skill. Resume, clear, and
compaction do not run this loader again, and a `codex exec` run, such as a
scripted writer or judge, gets nothing from the hook. Review and trust
the hook through Codex's `/hooks` interface before it can run. Python 3 is
required. Codex reads it from `hooks/codex.json`, named in
`.codex-plugin/plugin.json`.

The hook carries only the loading instruction. The role, principles, and
references remain the same files used by Claude Code. It creates no task
record and adds no task-store or machine-specific binding.

Plugin hooks are not supported in cloud-orchestrated ChatGPT Work. A cloud
host must make the complete plugin available and provide its own supported
skill-loading entry. Installing the skills alone omits the Manager role.
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
the no-op test run, and names each host's user-invoked metadata.

The performance method in `skills/code-production/references/performance.md`
and the verifier's safety-fact check adapt ideas from the `benchmark-checklist`
and `blast-radius` skills of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack) under the MIT
license; its notice is in `skills/code-production/LICENSE-pstack`.

## Usage

In Claude Code, the plugin's `hooks/hooks.json` runs the `SessionStart` hook in
every session where the plugin is enabled, so Manager is the default delivery
role: each new, resumed, cleared, or compacted session is told to load the
`manager` skill, which is the whole role. The hook adds a context line rather
than a system prompt, so the model still has to follow it. There is no
`manager` agent: remove any `"agent": "manager:manager"` setting or
`--agent manager:manager` flag left from an earlier version. A `claude -p` or Agent SDK run,
such as a scripted writer or judge, gets nothing from the hook. The hook's
branch-currency fetch runs only in a session it recognises as interactive
(the terminal, VS Code, or the desktop app); any other session gets the
loading line without it. To opt out, disable the plugin or set
`disableAllHooks`.

Codex sessions use the trusted plugin hook to load the `manager` skill.
Where plugin hooks are not available, invoke the `manager`
skill at the start of a delivery conversation, or name its complete installed
path in the repository's `CLAUDE.md` or `AGENTS.md`.

### Grok Bot

Grok Bot has no plugin hook. A Manager there is one persistent bot per project
with one long-lived conversation; it receives handoffs from the direction
owner bot as agent-to-agent messages. Load the `manager` skill at the start, which is
the role, and read `skills/manager/references/runtime-grokbot.md` before a
native action. The role, principles, and other references are the same files
Claude Code and Codex use. Which bots own direction, take your questions,
write, and verify, with their agent ids and machines, belong in your own
deployment binding, which your bots' instructions name; the plugin carries
none of them.

### Other hosts

Each host's mechanics live in one runtime binding, listed in
`skills/manager/references/runtimes.md`. On a host without one, Manager maps
each requirement to that host's own mechanism and reports a requirement the
host cannot meet as blocked.
