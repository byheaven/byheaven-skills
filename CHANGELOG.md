# Changelog (Archive)

> **Note**: This changelog covers monorepo-level releases up through 1.1.0.
> Each plugin now maintains its own changelog at `plugins/<name>/CHANGELOG.md`.

All notable changes to this project will be documented in this file.
Versions follow [Semantic Versioning](https://semver.org).

<!-- Archived — no longer updated by release-please -->

## [Unreleased]

## [1.1.0](https://github.com/byheaven/byheaven-skills/compare/byheaven-skills-1.0.0...byheaven-skills-1.1.0) (2026-03-17)

**Smarter Project Initialization** — a complete workflow for initializing any new
project from scratch, replacing the earlier github-workflow plugin. Seven skills cover
the full stack: project scaffold, CI pipeline, release workflow, code quality, GitHub
repo setup, dependency management, and security scanning.

**Smarter `/newproject` command** — the command now detects whether you're starting
from an empty folder or an existing project and adapts accordingly. For brand-new
projects it asks for a name and description first, then suggests a tech stack with
reasoning before showing the checklist. For existing projects it inventories what's
already configured and only asks about the rest. New projects default to running all
skills; you specify exceptions rather than choosing what to add.

**Fewer interruptions** — reduced AskUserQuestion prompts from 21 to 9. Defaults are
now applied for license (MIT), Dependabot schedule (weekly), minor-version auto-merge,
required reviewers (1), and branch protection admin exemption. Files that already exist
(README, ESLint config) are updated to meet standards automatically without asking.
CodeQL simply skips unsupported languages instead of prompting.

**CI failures prevented at setup time** — the ci-pipeline skill now detects missing
lockfiles and runs `npm install` automatically, and checks which scripts (`lint`,
`build`) are defined in `package.json` before including those steps in the workflow.
This prevents the most common class of CI failures on freshly scaffolded projects.

**GitHub settings automated** — after skills complete, the command configures Actions
write permissions, auto-merge, and secret scanning via `gh api`, eliminating the
manual Settings UI steps that previously appeared in the summary.

**Skills are independently runnable** — each skill now handles CLAUDE.md creation in
full, covering all three cases (file missing, section missing, section exists). No
skill references another skill's steps.

<!-- Link definitions -->
[unreleased]: https://github.com/byheaven/byheaven-skills/compare/byheaven-skills-1.1.0...HEAD
