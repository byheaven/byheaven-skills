# Plan: `newproject` Plugin Architecture

## Context

The current `github-workflow` plugin has a single skill (`github-release-workflow`) that handles release automation. The user wants to expand this into a comprehensive `newproject` plugin that covers **all essential setup aspects** when starting a new project. The release workflow becomes one of several skills.

**Problem**: Setting up a production-grade project involves many independent concerns (CI, linting, templates, dependency updates, security scanning, etc.). Each of these is a distinct setup task that benefits from opinionated templates and step-by-step guidance.

**Outcome**: A `newproject` plugin with 7 skills covering the full project setup lifecycle, orchestrated by a `/newproject` command.

---

## Migration: `github-workflow` → `newproject`

The existing `github-workflow` plugin is **absorbed** into `newproject` and removed:

- `github-release-workflow` skill → renamed to `release-workflow`
- Content, assets, and references remain identical (only frontmatter `name` changes)
- `marketplace.json` replaces the `github-workflow` entry with `newproject`
- `plugins/github-workflow/` is deleted after migration

---

## Skills (7 total, 3 priority tiers)

### Tier 1 — Core (build first)

| Skill | Purpose |
|-------|---------|
| **`project-scaffold`** | README, LICENSE, .gitignore, .editorconfig, directory structure |
| **`release-workflow`** | release-please, conventional commits, changelogs, tag-triggered GitHub Releases *(migrated)* |
| **`ci-pipeline`** | GitHub Actions CI: tests, build, lint, caching, matrix strategies |

### Tier 2 — Essential (build second)

| Skill | Purpose |
|-------|---------|
| **`code-quality`** | Linters, formatters, pre-commit hooks (ESLint/Prettier, Ruff, gofmt, rustfmt) |
| **`github-repo-setup`** | PR template, issue templates (YAML form), CODEOWNERS, branch protection via `gh api` |
| **`dependency-management`** | Dependabot config with grouped updates, auto-merge workflow |

### Tier 3 — Advanced (build third)

| Skill | Purpose |
|-------|---------|
| **`security-scanning`** | CodeQL analysis, dependency review workflow, secret scanning guidance |

### Why not more skills?

- **Testing infrastructure**: Deeply coupled with `ci-pipeline` (which runs tests). Framework choice is too project-specific for templates.
- **Devcontainer / Docker**: Too opinionated per project type. Claude's general knowledge is better here.
- **Documentation (CONTRIBUTING, architecture)**: Content-heavy, not config-heavy. `project-scaffold` creates a minimal CONTRIBUTING.md; anything more is custom.

---

## Directory Tree

```
plugins/newproject/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── newproject.md              # Orchestrator command
├── skills/
│   ├── project-scaffold/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── gitignore/         # node.gitignore, python.gitignore, go.gitignore, rust.gitignore, generic.gitignore
│   │   │   ├── editorconfig/      # .editorconfig
│   │   │   └── templates/         # README.md.template, CONTRIBUTING.md.template, LICENSE-MIT.template
│   │   └── references/
│   │       └── decisions.md
│   │
│   ├── release-workflow/          # ← migrated from github-workflow
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── config/            # commitlint.config.js, release-please-config.json
│   │   │   ├── scripts/           # extract-release-notes.sh
│   │   │   └── workflows/         # commitlint-check.yml, release.yml, release.yml, release-please.yml
│   │   └── references/
│   │       ├── changelog-style-guide.md
│   │       ├── changelog-editing-workflow.md
│   │       └── decisions.md
│   │
│   ├── ci-pipeline/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   └── workflows/         # ci-node.yml, ci-python.yml, ci-go.yml, ci-rust.yml, ci-generic.yml
│   │   └── references/
│   │       └── decisions.md
│   │
│   ├── code-quality/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── config/            # prettier.config.js, eslint.config.js, ruff.toml, .markdownlint.json
│   │   │   └── hooks/             # pre-commit
│   │   └── references/
│   │       └── decisions.md
│   │
│   ├── github-repo-setup/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── templates/         # pull-request-template.md, bug-report.yml, feature-request.yml, CODEOWNERS.template
│   │   │   └── scripts/           # configure-branch-protection.sh
│   │   └── references/
│   │       └── decisions.md
│   │
│   ├── dependency-management/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── config/            # dependabot-node.yml, dependabot-python.yml, etc.
│   │   │   └── workflows/         # dependabot-auto-merge.yml
│   │   └── references/
│   │       └── decisions.md
│   │
│   └── security-scanning/
│       ├── SKILL.md
│       ├── assets/
│       │   └── workflows/         # codeql.yml, dependency-review.yml
│       └── references/
│           └── decisions.md
│
├── README.md
└── LICENSE
```

---

## Orchestrator: `/newproject` Command

**Why a command, not a skill?** A skill triggers implicitly when Claude detects a matching scenario. The full project setup is an explicit user action — commands are user-invocable with clear intent. Individual skills remain independently triggerable for standalone use.

### Command Flow

1. **Detect** — Project type (web / node / python / go / rust / other), framework, existing configs
2. **Inventory** — Check what is already set up (README? .github/? linters? dependabot?)
3. **Propose** — Present checklist with smart defaults:
   - Already-configured items shown as done
   - Tier 1 skills recommended by default
   - Tier 2-3 offered but not pre-selected for existing projects
4. **Execute** — Run selected skills in dependency order
5. **Summary** — What was set up + remaining manual steps (e.g., "enable workflow permissions in GitHub Settings")

---

## Skill Dependency Order

```
project-scaffold          (no dependencies — always first)
    │
    ├── code-quality      (uses husky if Node; needs .editorconfig context)
    │
    ├── release-workflow   (may share husky with code-quality)
    │
    ├── ci-pipeline        (needs project type + test commands)
    │       │
    │       └── security-scanning  (adds alongside CI workflows)
    │
    ├── github-repo-setup  (references CI status checks for branch protection)
    │
    └── dependency-management  (needs to know package ecosystem)
```

**Execution order in `/newproject`:**

1. `project-scaffold`
2. `code-quality`
3. `release-workflow`
4. `ci-pipeline`
5. `github-repo-setup`
6. `dependency-management`
7. `security-scanning`

**Shared dependency handling (husky):** Both `code-quality` and `release-workflow` may install husky. Each skill's Step 0 detects if husky is already installed and only adds its specific hook (`pre-commit` vs `commit-msg`).

---

## Supported Project Types

All skills support: **web** / **node** / **python** / **go** / **rust** / **other**

Each skill detects the project type independently (3-4 lines of bash). Duplicating detection across skills is intentional — skills must be self-contained since they can be invoked independently.

---

## Skill Design Summaries

### project-scaffold

- Detects project type, checks for existing README/LICENSE/.gitignore
- Creates missing files from language-specific templates in assets
- Asks user for project name, description, license preference (default MIT)
- Initializes git if needed, sets default branch to `main`

### release-workflow

- **Migrated directly** from existing `github-release-workflow`
- Only change: frontmatter `name: release-workflow` (was `github-release-workflow`)
- All assets, references, and SKILL.md body remain identical

### ci-pipeline

- Per-language workflow templates: test, lint, build with matrix strategies
- Caching (node_modules, pip, Go modules, Cargo)
- Concurrency groups to cancel stale CI runs
- `decisions.md`: why one CI file per language, not composable fragments

### code-quality

- **Node/TS**: ESLint (flat config) + Prettier + lint-staged + husky pre-commit
- **Python**: Ruff (lint + format in one) + pre-commit framework
- **Go**: gofmt/goimports + golangci-lint config
- **Rust**: rustfmt.toml + clippy config
- **All**: .markdownlint.json

### github-repo-setup

- PR template (checklist-style), issue templates (YAML forms for bug/feature)
- CODEOWNERS from user input about team structure
- Branch protection via `gh api` (programmatic, not just documentation)

### dependency-management

- Dependabot config with grouped updates per ecosystem
- Always includes `github-actions` ecosystem
- Auto-merge workflow for minor/patch
- `decisions.md`: why Dependabot over Renovate (built-in, zero app install)

### security-scanning

- CodeQL workflow with correct language matrix
- Dependency review workflow (blocks PRs with known-vulnerable deps)
- Guidance on enabling secret scanning in repo settings

---

## Implementation Phases

### Phase 1 — Foundation

1. Create `plugins/newproject/` structure + `plugin.json`
2. Migrate `release-workflow` from `github-workflow` (copy + rename frontmatter)
3. Build `project-scaffold` skill
4. Build `ci-pipeline` skill
5. Create `/newproject` command (orchestrates available skills)
6. Update `marketplace.json` + root `README.md`
7. Remove `plugins/github-workflow/`

### Phase 2 — Quality & Governance

1. Build `code-quality` skill
2. Build `github-repo-setup` skill
3. Build `dependency-management` skill
4. Update `/newproject` command to include new skills

### Phase 3 — Security

1. Build `security-scanning` skill
2. Final command update

Each phase produces a **shippable plugin**. After Phase 1, `/newproject` works with 3 skills.

---

## Files Changed

### New

- `plugins/newproject/` — entire new plugin directory (see tree above)

### Modified

- `.claude-plugin/marketplace.json` — replace `github-workflow` entry with `newproject`
- Root `README.md` — update plugin listing

### Deleted

- `plugins/github-workflow/` — absorbed into `newproject`

---

## Verification

1. Run `/newproject` mentally against a fresh Next.js project — all 7 skills should produce valid output
2. Run each skill independently — verify self-contained detection and setup
3. Verify `release-workflow` SKILL.md is identical to old `github-release-workflow` except frontmatter name
4. Verify `marketplace.json` is valid JSON with correct source path
5. Verify no cross-references between files are broken after migration
