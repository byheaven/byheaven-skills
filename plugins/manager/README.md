# manager

`manager` packages one project-collaboration method for Claude Code and Codex. The
`manager` agent discusses a request until the direction is settled, delivers
only on an explicit request, and closes every Acceptance predicate through a
qualified judge before it claims completion.

## What It Includes

```text
agents/manager            Manager role: Discussion, Delivery, Coordination,
                          Continuation, Completion, plus a verbatim copy of
                          the principles (CI checks it matches)
skills/principles         Human-Agent Principles P1-P3 and operational baseline
skills/manager            Loader that points runtimes without the agent to
                          agents/manager.md
  references/             direction (Grill), experience gates,
                          production topology, evidence, repository
                          integration, Claude Code runtime notes
skills/code-production    Code editing and checking method
skills/grilling           Question rounds that converge a direction (Grill)
agents/verifier           Independent verifier with its checklist
agents/code-worker        Bounded code-production slice
agents/knowledge-worker   Bounded research or document artifact
```

The method is store-neutral: task records, standing delivery mandates, and
merge grants are used only when the project or the user has defined them.
Pull requests are merged without asking only under a standing grant the user
has recorded in their own instructions.

The `verifier` and `code-worker` agents pin `model: opus`; change the agent
frontmatter if you prefer another model.

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

The Codex manifest enables a `SessionStart` hook that points each new or
resumed session at the installed `manager:manager` skill. Review and trust
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

This installs the skills only, without the plugin's `agents/` directory, so
the Manager role is not available this way: the `manager` skill reports an
incomplete install instead of loading a role. Use the `principles`,
`code-production`, and `grilling` skills on their own, or install the full
plugin.

`skills/grilling` is adapted from
[mattpocock/skills](https://github.com/mattpocock/skills) under the MIT
license; its notice is in `skills/grilling/LICENSE`.

## Usage

In Claude Code, start sessions as the `manager:manager` agent so the role and
principles are in the system prompt from the first turn:

```json
{ "agent": "manager:manager" }
```

Put that in `~/.claude/settings.json` for every session, or run
`claude --agent manager:manager` for one session. A skill cannot be preloaded
into a main-session agent, so the agent file carries the role text itself.

The plugin's `hooks/hooks.json` also runs the Codex `SessionStart` hook in
every Claude Code session where the plugin is enabled, so Manager is the
default role there: each new, resumed, cleared, or compacted session is told
to load the `manager` skill. This covers hosts that replace the main-session
system prompt with their own and so ignore the `agent` setting, such as
Claude Code project threads on claude.ai. The hook adds a context line rather
than a system prompt, so the model still has to follow it. A session already
running as the `manager` agent keeps its role. To opt out, disable the plugin
or set `disableAllHooks`.

Codex sessions use the trusted plugin hook to load the `manager` skill.
Where neither an agent nor plugin hooks are available, invoke the `manager`
skill at the start of a project conversation, or name its complete installed
path in the repository's `CLAUDE.md` or `AGENTS.md`.
