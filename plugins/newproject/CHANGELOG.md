# Changelog

## [0.3.0](https://github.com/byheaven/byheaven-skills/compare/newproject-0.2.0...newproject-0.3.0) (2026-03-18)

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

<!-- Link definitions -->
