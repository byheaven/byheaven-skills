# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/newproject-0.3.0...HEAD)

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
