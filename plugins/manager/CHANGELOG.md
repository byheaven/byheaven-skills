# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/manager-0.1.0...HEAD)

- **Evidence** High-risk predicates (authentication, money, deletion,
  privacy, irreversible actions, and changes to a Vision or a rule) always get
  an independent verifier from another model family by default, with no
  blind-spot reason required; terminal evidence names each predicate's judge
  so a later audit can check the choice

## [0.1.0](https://github.com/byheaven/byheaven-skills/compare/a5b412ebb6d4e4c31be99fda1adb6165460347f7...manager-0.1.0) (2026-10-05)

- **Manager role** A `manager` agent that discusses first, delivers only on
  an explicit request, and closes every Acceptance predicate through a
  qualified judge before claiming completion; it carries the full role and
  the principles from the first turn, and a `manager` skill loads it in
  runtimes that cannot select the agent
- **Principles** The `principles` skill holds the Human-Agent Principles
  P1-P3, project-foundation guidance with first-principles derivation as the
  default, and the operational baseline; CI fails when the agent's copy
  drifts from it
- **Intent** Defines Goal, Boundary, Approach, and Acceptance, the four
  dimensions a settled direction locks
- **Grill** Ships the `grilling` skill, so question rounds work the same on
  every machine
- **Sub-agents** `verifier`, `code-worker`, and `knowledge-worker` agents plus
  a shared `code-production` skill for bounded, independently judged work;
  workers report a material assumption the Acceptance leaves open instead of
  deciding it
- **Evidence** Defines commitment identity: a repair inside the same locked
  Intent and Acceptance keeps it, a change to what is promised does not
- **Governed changes** A temporary capability patch carries its review date
  and exit condition
- **Codex startup** Loads the Manager role in Codex through a session hook,
  without changing Claude Code's agent-based startup
- **Claude worktree note** Describes what the worktree command guard in
  Claude Code 2.1.289 actually refuses
- **Plugin page** Shows the plugin's description on Claude Code's plugin page
  when it is installed from the marketplace
