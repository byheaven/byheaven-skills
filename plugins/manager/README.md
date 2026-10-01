# manager

`manager` packages a project-collaboration method as a Claude Code plugin. The
`manager` skill discusses a request until the direction is settled, delivers
only on an explicit request, and closes every Acceptance predicate through a
qualified judge before it claims completion.

## What It Includes

```text
skills/principles         Human-Agent Principles P1-P3 and operational baseline
skills/manager            Manager role: Discussion, Delivery, Coordination,
                          Continuation, Completion
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

This installs the skills only. The `verifier`, `code-worker`, and
`knowledge-worker` agents are not installed this way; Manager then
self-produces or uses the tool's own sub-agents.

## Usage

Invoke the `manager` skill at the start of a project conversation, or make it
the default for a repository by naming it in that repository's `CLAUDE.md` or
`AGENTS.md`.
