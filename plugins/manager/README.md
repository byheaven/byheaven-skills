# manager

`manager` packages a project-collaboration method as a Claude Code plugin. The
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

### Other skill-based tools

```bash
npx skills add byheaven/byheaven-skills
```

This installs the skills only, without the plugin's `agents/` directory, so
the Manager role is not available this way: the `manager` skill reports an
incomplete install instead of loading a role. Use the `principles` and
`code-production` skills on their own, or install the full plugin.

## Usage

In Claude Code, start sessions as the `manager:manager` agent so the role and
principles are in the system prompt from the first turn:

```json
{ "agent": "manager:manager" }
```

Put that in `~/.claude/settings.json` for every session, or run
`claude --agent manager:manager` for one session. A skill cannot be preloaded
into a main-session agent, so the agent file carries the role text itself.

Where the agent cannot be selected (Codex, or a hosted session that does not
take an agent), invoke the `manager` skill at the start of a project
conversation, or name it in the repository's `CLAUDE.md` or `AGENTS.md`.
