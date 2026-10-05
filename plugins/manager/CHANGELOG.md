# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/commits/main/plugins/manager)

- **Intent** Defines Goal, Boundary, Approach, and Acceptance, the four
  dimensions a settled direction locks; the rules used these names without
  saying what each holds
- **Grill** Ships the `grilling` skill with the plugin, so question rounds
  work the same on every machine instead of depending on a local install
- **Evidence** Defines commitment identity: a repair inside the same locked
  Intent and Acceptance keeps it, a change to what is promised does not
- **Knowledge worker** Reports a material assumption the Acceptance leaves
  unsettled instead of deciding it silently, as the code worker already does
- **Codex startup** Loads the shared Manager role through a Codex-only
  session hook, without changing Claude Code's agent-based startup
- **Governed changes** Restores the review and exit conditions for temporary
  capability patches across projects
- **Plugin page** Shows the plugin's description on Claude Code's plugin page
  when it is installed from the marketplace
- **Principles** Project foundations now state first-principles derivation
  as the default: start from the foundations and current evidence, and judge
  existing artifacts against them
- **Manager agent** Adds a `manager` agent that carries the full role and the
  principles in its own text, so a session started as `manager:manager` has
  them from the first turn without loading a skill; reference links point to
  files inside the plugin
- **Manager skill** Turns the `manager` skill into a loader for runtimes that
  cannot select the agent; it reads `agents/manager.md`
- **CI** Fails when the agent's principles copy drifts from the `principles`
  skill

- **Manager role** Adds the `manager` skill: a project collaborator that
  discusses first, delivers only on an explicit request, and closes every
  Acceptance predicate through a qualified judge before claiming completion
- **Sub-agents** Adds `verifier`, `code-worker`, and `knowledge-worker` agents
  plus a shared `code-production` skill for bounded, independently judged work
