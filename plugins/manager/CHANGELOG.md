# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.1...HEAD)

## [0.6.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.0...manager-0.6.1) (2026-10-08)

- **Followups at every close** Manager now runs its closing steps before
  reporting any finished delivery, including work with no task record, and
  ends that report with its followups, or a line saying there are none.
  Before, these steps were only reached when the agent opened a
  separate reference file, and in practice they were skipped

## [0.6.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.5.0...manager-0.6.0) (2026-10-08)

- **Content creator, bundled** The `content-creator` skill now ships with the
  plugin in Claude Code, cloud sessions, and Codex. It drafts posts, essays,
  and governance documents in the author's voice, and the knowledge worker
  loads it for user-authored content. This plugin is now its only source
- **Codex startup only** Manager's loading reminder now runs only when a new
  Codex session starts. Resuming, clearing, or compacting the session no longer
  injects it again. Claude Code's startup behavior is unchanged.

## [0.5.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.4.0...manager-0.5.0) (2026-10-07)

- **Performance numbers you can trust** Before reporting or acting on a
  performance number, code production now names what limits it, counts
  errors, confirms the timed work actually ran, alternates at least five runs
  per side, and states the share of the end-to-end wait; otherwise the result
  is reported as inconclusive
- **Safety fact** The verifier now names the one fact a code or configuration
  change is safe because of, proves it by running real code, and looks for
  breakage that a symbol search misses

## [0.4.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.3.0...manager-0.4.0) (2026-10-07)

- **Startup hook for Claude Code** Every Claude Code session with the plugin
  enabled now gets the same `SessionStart` reminder Codex uses, so Manager is
  the default role even where the host ignores the `agent` setting, such as
  Claude Code project threads on claude.ai
- **Writing for agents, bundled** The `writing-for-agents` skill now ships
  with the plugin in both Claude Code and Codex, and Manager loads it before
  writing any skill, rule, agent instruction, sub-agent directive, or task
  Acceptance another agent will execute
- **Performance changes** Code production now measures a baseline before the
  first edit, tries remedies cheapest first, keeps only those that move the
  number, and reports baseline, result, delta, and conditions

## [0.3.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.2.0...manager-0.3.0) (2026-10-06)

- **Principles** Derivation anchors only on the principles and the
  commitments of the project's Vision, and begins by stating the red lines
  they or the user draw; current facts (including those a Vision records),
  decision history, and existing practice are references that test a
  conclusion, never its starting point. A recorded
  preference, rule, or past decision settles an owner decision in Grill only
  when it agrees with that derivation; a divergence goes to the user with both

## [0.2.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.1.0...manager-0.2.0) (2026-10-05)

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
