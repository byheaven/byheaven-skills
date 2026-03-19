# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/newproject-0.5.0...HEAD)

## [0.5.0](https://github.com/byheaven/byheaven-skills/compare/newproject-0.4.0...newproject-0.5.0) (2026-03-19)

**Single-skill newproject** — The plugin now ships only the self-contained
`newproject` entrypoint. Installation and discovery are simpler because the
setup flow, templates, workflows, and references now live under one skill.

### Improvements

- **Docs** Removes references to the deleted helper skills from the plugin docs,
  metadata, and packaged references
- **Assets** Renames the internal asset groups to neutral module names so the
  package no longer reads like a multi-skill bundle

## [0.4.0](https://github.com/byheaven/byheaven-skills/compare/newproject-0.3.0...newproject-0.4.0) (2026-03-18)

**Manual curated releases** — the `release-workflow` skill now teaches a human-first
release process instead of a `release-please` PR flow. You keep normal development on
`main`, prepare a polished changelog section when ready, tag that exact commit, and let
the GitHub workflow publish the release from the changelog.

**Release assets now match the workflow** — the bundled workflow, extract script, and
reference guides now all follow the same tag-based model. This makes the skill easier to
apply to a normal project repository without translating between competing release systems.

### Improvements

- **Changelog format** Standardizes linked `Unreleased` headers and linked version
  headers so compare views stay visible directly in the changelog
- **Skill package** Removes legacy `version.txt` guidance and obsolete `release-please`
  assets to keep the release setup simpler and more consistent

## [0.3.0](https://github.com/byheaven/byheaven-skills/compare/922be9937d3bc5cbf535624346331832b63f14a1...newproject-0.3.0) (2026-03-18)

**newproject is now a skill** — the orchestrator moves from a slash command into a
first-class skill, so it works consistently across Claude Code and other AI tools.
All 8 skills (including the orchestrator) can be invoked independently or together.

**AGENTS.md and CLAUDE.md unified** — all 7 setup skills now consolidate both files
into a single source of truth using a symlink, covering all three states: file missing,
section missing, or already present.

**Fewer questions, more reliable CI** — the init flow asks fewer questions by applying
smarter defaults. The CI skill now detects missing lockfiles and available scripts before
generating workflows, preventing the most common class of CI failures at setup time.

### Bug Fixes

- **release-workflow** Release PRs are now created as drafts by default, giving you
  time to edit the changelog before the PR is visible for review
- Fixed two prompts that were skipping the `AskUserQuestion` tool and asking inline

## [0.2.0](https://github.com/byheaven/byheaven-skills/compare/5c8fef40a5740b516b85f9d732da438372710600...922be9937d3bc5cbf535624346331832b63f14a1) (2026-03-18)

**Smarter project initialization** — the setup flow now asks fewer questions,
applies stronger defaults, and adapts more reliably to both empty folders and
existing repositories.

**AGENTS.md and CLAUDE.md unified** — all seven setup skills now converge on a
single AGENTS-first configuration model, including migration logic when either
file already exists.

**Codex-ready skills** — every bundled skill now ships with Codex metadata and
icons, making the plugin easier to discover and use across supported AI coding
tools.

### Improvements

- **CI pipeline** Detects missing lockfiles and available scripts before
  generating workflows, avoiding the most common first-run CI failures
- **Release workflow** Adds an `Unreleased` section and a safer draft-first
  changelog editing flow
- **Prompts** Uses `AskUserQuestion` consistently for skill selection and
  follow-up configuration

## [0.1.0](https://github.com/byheaven/byheaven-skills/commit/5c8fef40a5740b516b85f9d732da438372710600) (2026-03-17)

**One plugin for project setup** — `newproject` replaces the earlier GitHub
workflow plugin with a single orchestrator that can scaffold a project and set
up the surrounding automation in one run.

**Seven setup skills** — the initial release bundles project scaffold, release
workflow, CI pipeline, code quality, GitHub repository setup, dependency
management, and security scanning so you can run the full baseline or invoke
individual pieces independently.
