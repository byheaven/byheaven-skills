---
name: newproject
description: "End-to-end project setup for Codex, Claude Code, and other AI tools. Use this when the user wants to scaffold a new project, upgrade an existing repository to a production-ready baseline, or configure project foundation, code quality, release automation, CI, GitHub repository settings, dependency management, and security scanning in one run. It includes its own templates, workflows, and scripts under `assets/`."
---

# newproject

Sets up a new or existing project end-to-end.
It includes the templates, workflows, and scripts it needs under its own `assets/`
directory.

When this setup needs structured user input, first detect which question tool is
available in the current host environment:

- if `AskUserQuestion` is available, use `AskUserQuestion`
- otherwise, if `request_user_input` is available, use `request_user_input`
- if neither structured question tool is available, ask the user directly in plain text

Do this detection before the first question and keep using the same question tool
for the rest of the run.

## What This Skill Sets Up

```text
Tier 1 — Foundation
  project scaffold      README, LICENSE, .gitignore, .editorconfig, CONTRIBUTING.md
  AGENTS.md baseline    shared AI instructions + CLAUDE.md symlink
  release workflow      conventional commits, changelog-driven releases, release.yml
  ci pipeline           GitHub Actions CI for the detected project type

Tier 2 — Quality and Governance
  code quality          ESLint/Prettier or Ruff/golangci-lint/rustfmt + markdownlint
  GitHub repo setup     PR template, issue forms, CODEOWNERS, branch protection
  dependencies          Dependabot + auto-merge workflow

Tier 3 — Security
  security scanning     CodeQL when supported, dependency review, secret scanning guidance
```

## Asset Layout

All required files live inside this package:

- `assets/foundation/` — README, LICENSE, CONTRIBUTING, .gitignore, .editorconfig
- `assets/quality/` — ESLint, Prettier, Ruff, markdownlint, pre-commit hook
- `assets/ci/` — GitHub Actions CI templates
- `assets/release/` — commitlint config, release workflow, extract script, references
- `assets/github/` — PR template, issue forms, CODEOWNERS, branch protection script
- `assets/dependencies/` — Dependabot templates and auto-merge workflow
- `assets/security/` — CodeQL and dependency review workflows

---

## Step 1: Detect the Project and Current State

Inspect the repo before asking anything:

```bash
# Project type indicators
ls package.json pyproject.toml setup.py requirements.txt go.mod Cargo.toml 2>/dev/null

# Web framework indicators
ls next.config.* nuxt.config.* vite.config.* angular.json svelte.config.* astro.config.* remix.config.* 2>/dev/null

# Existing foundation files
ls README.md LICENSE .gitignore .editorconfig CONTRIBUTING.md CHANGELOG.md AGENTS.md CLAUDE.md 2>/dev/null
file AGENTS.md CLAUDE.md 2>/dev/null

# Existing GitHub configuration
ls .github/ 2>/dev/null
ls .github/workflows/ 2>/dev/null
ls .github/pull_request_template.md .github/ISSUE_TEMPLATE/ .github/CODEOWNERS .github/dependabot.yml 2>/dev/null

# Existing tooling
ls eslint.config.* .eslintrc* prettier.config.* .prettierrc* ruff.toml .pre-commit-config.yaml .golangci.yml rustfmt.toml .markdownlint.json 2>/dev/null
ls .husky/ 2>/dev/null

# Existing release / CI / security workflows
ls .github/workflows/ci* .github/workflows/release* .github/workflows/commitlint* .github/workflows/codeql* .github/workflows/dependency-review* 2>/dev/null

# Package manager and scripts for Node projects
ls package-lock.json yarn.lock pnpm-lock.yaml bun.lockb 2>/dev/null
node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts||{}, null, 2))" 2>/dev/null || true

# Git state
git status --short 2>/dev/null || echo "git not initialized"
git remote -v 2>/dev/null || echo "no remote"
git branch --show-current 2>/dev/null || true
```

Determine:

- **Project type**:
  - `web` if `package.json` exists and a web framework config exists
  - `node` if `package.json` exists without a web framework config
  - `python` if `pyproject.toml`, `setup.py`, or `requirements.txt` exists
  - `go` if `go.mod` exists
  - `rust` if `Cargo.toml` exists
  - `other` otherwise
- **Project state**:
  - brand new if there is no package manifest, no README, no `.github/`, and no git remote
  - existing otherwise
- **Package manager** for Node projects:
  - `npm` if `package-lock.json` exists
  - `yarn` if `yarn.lock` exists
  - `pnpm` if `pnpm-lock.yaml` exists
  - `bun` if `bun.lockb` exists
  - if none exist, default to `npm`
- **Available scripts** for Node projects:
  - note whether `lint`, `test`, and `build` exist
- **Version source of truth**:
  - `package.json` for Node and web
  - `pyproject.toml` or `setup.py` for Python
  - `Cargo.toml` for Rust
  - tag-only unless another version file already exists for Go or other projects

---

## Step 2: Choose the Run Scope

### Path A — Brand New Project

For a brand-new directory, collect the basic project context before recommending a stack.

Use the `AskUserQuestion`/`request_user_input` tool explicitly:

- if the project name is not obvious from the directory name:
  - "What is the project name?"
- always:
  - "Please provide a short description (1-2 sentences)."

Then use the project name and description to suggest the best default stack, for example:

> "Based on your description, I suggest a Node.js + TypeScript setup with Vitest,
> ESLint, and Prettier. That gives you a fast default for libraries and apps.
> Confirm this stack or tell me what you prefer."

Use the `AskUserQuestion`/`request_user_input` tool explicitly to confirm or override the stack.

Then show the checklist:

```text
New [type] project: [name]

Tier 1 — Foundation
  [x] scaffold and repo baseline
  [x] release workflow
  [x] CI pipeline

Tier 2 — Quality and Governance
  [x] code quality
  [x] GitHub repository setup
  [x] dependency management

Tier 3 — Security
  [x] security scanning
```

Use the `AskUserQuestion`/`request_user_input` tool explicitly:

- "Press Enter to run everything, or tell me what to skip: for example `skip security`, `tier1 only`, or `code quality only`."

### Path B — Existing Project

For an existing repository, do not ask for the project name or description.
Read the repository and infer the context first.

Before showing the checklist, read the most relevant files that describe the project:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md` if it exists and is not just a symlink to `AGENTS.md`
- package metadata such as `package.json`, `pyproject.toml`, `go.mod`, or `Cargo.toml`
- `CHANGELOG.md`
- existing workflow files under `.github/workflows/`

Then present a short understanding summary to the user before asking for scope.
That summary should include:

- the inferred project name
- what the project appears to do
- the detected tech stack
- what setup already appears to exist
- the highest-value gaps that `newproject` could fill

After that summary, mark what already appears configured and default to the
unchecked Tier 1 items first:

```text
Project: [detected type] — [project name]

Tier 1 — Foundation
  [done or empty] scaffold and repo baseline
  [done or empty] release workflow
  [done or empty] CI pipeline

Tier 2 — Quality and Governance
  [done or empty] code quality
  [done or empty] GitHub repository setup
  [done or empty] dependency management

Tier 3 — Security
  [done or empty] security scanning
```

Use the `AskUserQuestion`/`request_user_input` tool explicitly:

- "Which parts should I run? Press Enter to run unchecked Tier 1 items, or say `all`, `tier2`, or specific parts."

Treat the selected scope as the source of truth for the rest of the run.

---

## Step 3: Foundation and Repository Baseline

Run this section when the user selected scaffold and repo baseline.

### 3.1 Initialize Git if Needed

If the directory is not a git repo:

```bash
git init
git checkout -b main
```

If git already exists, skip this step.

### 3.2 Create or Update the Foundation Files

Use only the vendored assets in this package:

- `assets/foundation/templates/README.md.template`
- `assets/foundation/templates/LICENSE-MIT.template`
- `assets/foundation/templates/CONTRIBUTING.md.template`
- `assets/foundation/gitignore/`
- `assets/foundation/editorconfig/.editorconfig`

Apply these rules:

- `README.md`
  - if missing, create it from the template
  - replace `{{PROJECT_NAME}}`, `{{DESCRIPTION}}`, and `{{PROJECT_TYPE}}`
  - if it already exists, add only missing standard sections such as installation, usage, and contributing
- `LICENSE`
  - default to MIT when missing
  - replace `{{YEAR}}` with the current year
  - replace `{{AUTHOR}}` with the user's name
  - if the name is unknown, use the `AskUserQuestion`/`request_user_input` tool explicitly
- `.gitignore`
  - if missing, copy the language-appropriate template
  - if present, append only clearly missing language-specific sections
- `.editorconfig`
  - if missing, copy the vendored template
- `CONTRIBUTING.md`
  - if missing, create it from the template
  - if present, preserve existing content and add any missing sections later in the release workflow step

### 3.3 Create Standard Directories

Create only the directories that are missing:

- Node or web: `src/`, `tests/`, `docs/`, `scripts/`
- Python: `src/<package_name>/`, `tests/`, `docs/`, `scripts/`
- Go: `cmd/<project_name>/`, `internal/`, `pkg/`, `docs/`, `scripts/`
- Rust: `docs/`, `scripts/`
- Other: `src/`, `tests/`, `docs/`, `scripts/`

For Python, also create `src/<package_name>/__init__.py` when the package directory is new.

### 3.4 Make `AGENTS.md` the Source of Truth

Unify `AGENTS.md` and `CLAUDE.md` so all AI tools read the same guidance.

Detect the current state:

```bash
[ -L CLAUDE.md ] && echo "CLAUDE.md is a symlink" || echo "CLAUDE.md is not a symlink"
[ -f AGENTS.md ] && echo "AGENTS.md exists" || echo "AGENTS.md missing"
[ -f CLAUDE.md ] && echo "CLAUDE.md exists" || echo "CLAUDE.md missing"
```

Handle each state:

- **Already unified**: `CLAUDE.md` is a symlink to `AGENTS.md`
  - keep it as-is
- **Neither file exists**
  - create a minimal `AGENTS.md`:

    ```markdown
    # AGENTS.md

    This file provides guidance to AI coding assistants (Claude Code, OpenAI Codex,
    and others) when working with code in this repository.

    ## Contributor Conventions

    Follow [CONTRIBUTING.md](CONTRIBUTING.md) for all contribution conventions.
    ```

  - then run `ln -s AGENTS.md CLAUDE.md`
- **Only `CLAUDE.md` exists as a regular file**
  - move it to `AGENTS.md`
  - if its title is `# CLAUDE.md`, rename it to `# AGENTS.md`
  - then create the symlink with `ln -s AGENTS.md CLAUDE.md`
- **Only `AGENTS.md` exists**
  - create the symlink with `ln -s AGENTS.md CLAUDE.md`
- **Both exist as regular files**
  - use the `AskUserQuestion`/`request_user_input` tool explicitly before merging
  - keep `AGENTS.md` as the base
  - append only the sections from `CLAUDE.md` that are not already present
  - normalize the title to `# AGENTS.md`
  - replace `CLAUDE.md` with the symlink

After the file state is correct, ensure `AGENTS.md` includes a `## Contributor Conventions`
section that points to `CONTRIBUTING.md`.

---

## Step 4: Code Quality and Release Workflow

Run this section when the user selected code quality, release workflow, or both.
If both are selected for a Node project, set up code quality before release workflow
so husky can be shared cleanly.

### 4.1 Code Quality

Use only the vendored assets in this package:

- `assets/quality/config/eslint.config.js`
- `assets/quality/config/prettier.config.js`
- `assets/quality/config/ruff.toml`
- `assets/quality/config/.markdownlint.json`
- `assets/quality/hooks/pre-commit`

#### Node or Web

Install the baseline tooling:

```bash
npm install --save-dev \
  eslint \
  @eslint/js \
  prettier \
  eslint-config-prettier \
  lint-staged \
  husky
```

For TypeScript projects, also install:

```bash
npm install --save-dev \
  typescript-eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser
```

Then:

- copy `assets/quality/config/eslint.config.js` to `eslint.config.js` if no flat config exists
- copy `assets/quality/config/prettier.config.js` to `prettier.config.js` if missing
- add a `lint-staged` block to `package.json`:

  ```json
  {
    "lint-staged": {
      "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
      "*.{json,css,md,yml,yaml}": ["prettier --write"],
      "*.md": ["markdownlint-cli2 --fix"]
    }
  }
  ```

- initialize husky only if `.husky/` does not already exist:

  ```bash
  ls .husky/ 2>/dev/null || npx husky init
  ```

- ensure `.husky/pre-commit` runs `npx lint-staged`

#### Python

Install and configure Ruff:

```bash
pip install ruff pre-commit
```

Then:

- copy `assets/quality/config/ruff.toml` to `ruff.toml` if missing
- copy `assets/quality/hooks/pre-commit` to `.pre-commit-config.yaml` if missing
- run `pre-commit install`

#### Go

Install `golangci-lint` and create `.golangci.yml` if missing:

```bash
brew install golangci-lint
```

Use this baseline config:

```yaml
run:
  timeout: 5m

linters:
  enable:
    - gofmt
    - goimports
    - govet
    - errcheck
    - staticcheck
    - unused
    - gosimple

issues:
  exclude-rules:
    - path: _test\.go
      linters: [errcheck]
```

#### Rust

Ensure the standard tooling is installed:

```bash
rustup component add rustfmt clippy
```

Create `rustfmt.toml` if missing:

```toml
edition = "2021"
max_width = 100
tab_spaces = 4
```

#### All Project Types

Configure markdown linting:

```bash
npm install --save-dev markdownlint-cli2
```

Copy `assets/quality/config/.markdownlint.json` to `.markdownlint.json` if missing.

Add this line to `AGENTS.md` if it is not already present:

> `Code quality: run the configured formatter and linter before committing.`

### 4.2 Release Workflow

Use only the vendored assets in this package:

- `assets/release/config/commitlint.config.js`
- `assets/release/workflows/commitlint-check.yml`
- `assets/release/workflows/release.yml`
- `assets/release/scripts/extract-release-notes.sh`
- `assets/release/references/changelog-style-guide.md`

#### Conventional Commits

For Node or web projects, install commitlint locally:

```bash
npm install --save-dev \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky
```

Copy `assets/release/config/commitlint.config.js` to `commitlint.config.js`.

Ensure `.husky/commit-msg` exists and runs:

```bash
npx --no -- commitlint --edit $1
```

For non-Node projects, copy
`assets/release/workflows/commitlint-check.yml` to
`.github/workflows/commitlint-check.yml`.

#### Release Workflow Files

Copy these files:

- `assets/release/workflows/release.yml` → `.github/workflows/release.yml`
- `assets/release/scripts/extract-release-notes.sh` → `scripts/extract-release-notes.sh`
- `assets/release/references/changelog-style-guide.md` → `docs/changelog-style-guide.md`

Then:

- make `scripts/extract-release-notes.sh` executable
- configure the tag glob in `release.yml`
  - use `'*.*.*'` for no prefix
  - use `'myapp-*.*.*'` if the repo already uses a tag prefix
- configure version validation in `release.yml`
  - `package.json` for Node or web
  - `pyproject.toml` or existing version file for Python
  - `Cargo.toml` for Rust
  - skip version-file validation for tag-only Go or generic repos

#### CHANGELOG.md

If `CHANGELOG.md` is missing, create it with linked headers:

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Versions follow [Semantic Versioning](https://semver.org).

## [Unreleased](https://github.com/OWNER/REPO/compare/v0.0.0...HEAD)
```

For real releases, use this format:

```markdown
## [1.2.0](https://github.com/OWNER/REPO/compare/v1.1.0...v1.2.0) (2026-03-18)
```

Rules:

- `Unreleased` must always be a linked header
- every commit or merge to `main` must manually add a short user-facing changelog entry under `Unreleased`
- each release header must compare the previous tag to the new tag
- the first bold line in a release section becomes the GitHub Release title

#### CONTRIBUTING.md and AGENTS.md

Ensure `CONTRIBUTING.md` documents this release flow:

1. every change merged to `main` must update `CHANGELOG.md`
2. add the new entry under the `Unreleased` section before or as part of the merge commit
3. keep `Unreleased` current throughout normal development
4. on release day, convert the accumulated `Unreleased` notes into the new version section
5. bump the version file if the project uses one
6. commit the release changes
7. tag that exact commit
8. push the commit and tag

Add this line to `AGENTS.md` if missing:

> `Release: every change merged to main must update CHANGELOG.md under the Unreleased section. When the user says "release" or "ship", follow the Release Workflow section in CONTRIBUTING.md and use docs/changelog-style-guide.md for changelog editing.`

#### Verification

If the repo already has a version section in `CHANGELOG.md`, dry-run the extract script:

```bash
CHANGELOG_FILE=CHANGELOG.md ./scripts/extract-release-notes.sh v1.2.0
```

If the script fails, fix the changelog format before calling the release setup done.

Also verify that `Unreleased` already contains ongoing development notes and is not left empty after normal feature or fix work lands on `main`.

---

## Step 5: CI Pipeline and GitHub Repository Setup

Run this section when the user selected CI pipeline, GitHub repository setup, or both.

### 5.1 CI Pipeline

Use only the vendored assets in this package:

- `assets/ci/workflows/ci-node.yml`
- `assets/ci/workflows/ci-python.yml`
- `assets/ci/workflows/ci-go.yml`
- `assets/ci/workflows/ci-rust.yml`
- `assets/ci/workflows/ci-generic.yml`

Create `.github/workflows/` if needed.

#### Node or Web

If `package.json` exists but no lockfile exists, generate one before writing CI:

```bash
npm install
```

Copy `assets/ci/workflows/ci-node.yml` to `.github/workflows/ci.yml`.

Then customize the workflow:

- set the Node matrix
  - libraries and CLIs: `[18, 20, 22]`
  - web apps: a single current LTS version is fine
- set the package manager install command:
  - `npm ci`
  - `yarn install --frozen-lockfile`
  - `pnpm install --frozen-lockfile`
  - `bun install --frozen-lockfile`
- remove or comment out the lint step if there is no `lint` script
- remove or comment out the test step if there is no `test` script
- remove or comment out the build step if there is no `build` script
- if the test command cannot be inferred from `package.json`, use the `AskUserQuestion`/`request_user_input` tool explicitly

#### Python

Copy `assets/ci/workflows/ci-python.yml` to `.github/workflows/ci.yml`.

Then customize:

- Python matrix: default to `["3.11", "3.12", "3.13"]`
- install command: usually `pip install -e ".[dev]"` or `pip install -r requirements-dev.txt`
- test command: usually `pytest`
- lint command: `ruff check .` when Ruff is configured

#### Go

Copy `assets/ci/workflows/ci-go.yml` to `.github/workflows/ci.yml`.

Then:

- set the Go version based on `go.mod`
- keep `go test ./...`
- keep `go build ./...`
- if `.golangci.yml` exists, add the official golangci-lint action

#### Rust

Copy `assets/ci/workflows/ci-rust.yml` to `.github/workflows/ci.yml`.

Then:

- keep the stable toolchain unless the project clearly requires nightly
- keep `cargo fmt --check`, `cargo clippy`, `cargo test`, and `cargo build`
- if security scanning is selected too, add `cargo audit` only when the user wants Rust dependency auditing in CI

#### Other

Copy `assets/ci/workflows/ci-generic.yml` to `.github/workflows/ci.yml`.

Then replace the placeholder install, test, lint, and build commands with the real commands.
If the repo does not reveal them, use the `AskUserQuestion`/`request_user_input` tool explicitly.

Add this line to `AGENTS.md` if missing:

> `CI: keep .github/workflows/ci.yml aligned with the repository's real install, lint, test, and build commands.`

### 5.2 GitHub Repository Setup

Use only the vendored assets in this package:

- `assets/github/templates/pull-request-template.md`
- `assets/github/templates/bug-report.yml`
- `assets/github/templates/feature-request.yml`
- `assets/github/templates/CODEOWNERS.template`
- `assets/github/scripts/configure-branch-protection.sh`

Before making GitHub API changes, confirm:

```bash
gh auth status
git remote -v
gh repo view --json nameWithOwner --jq .nameWithOwner
```

If `gh` is not installed or authenticated, guide the user to install and log in.

Then:

- copy the PR template to `.github/pull_request_template.md` if missing
- copy the issue templates to `.github/ISSUE_TEMPLATE/`
- if the issue label prefix is not obvious, use the `AskUserQuestion`/`request_user_input` tool explicitly and update `labels:` in both YAML files
- create `.github/CODEOWNERS`
  - use `* @username` for solo repos
  - use directory or file-type ownership only when the repo layout clearly supports it
  - if ownership is ambiguous, use the `AskUserQuestion`/`request_user_input` tool explicitly
- apply branch protection to the primary branch
  - require 1 approval
  - dismiss stale reviews
  - disable force pushes and deletions
  - leave required status check contexts empty until CI has run once

You can either run the vendored script after customizing it, or call `gh api` directly:

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

gh api \
  --method PUT \
  "repos/${REPO}/branches/main/protection" \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

Add this line to `AGENTS.md` if missing:

> `PRs: all pull requests must use the PR template (.github/pull_request_template.md). Branch protection requires at least 1 approving review before merge.`

---

## Step 6: Dependency Management and Security Scanning

Run this section when the user selected dependency management, security scanning, or both.

### 6.1 Dependency Management

Use only the vendored assets in this package:

- `assets/dependencies/config/dependabot-node.yml`
- `assets/dependencies/config/dependabot-python.yml`
- `assets/dependencies/config/dependabot-go.yml`
- `assets/dependencies/config/dependabot-rust.yml`
- `assets/dependencies/config/dependabot-generic.yml`
- `assets/dependencies/workflows/dependabot-auto-merge.yml`

Determine every ecosystem present:

- `npm` from `package.json`
- `pip` from `pyproject.toml`, `setup.py`, or `requirements.txt`
- `gomod` from `go.mod`
- `cargo` from `Cargo.toml`
- `github-actions` always

Create `.github/dependabot.yml` from the matching base template, then ensure the
`github-actions` ecosystem is also included. For polyglot repositories, merge the
relevant sections into a single file.

Use the default schedule:

- weekly grouped updates
- auto-merge only for patch and minor updates

Copy `assets/dependencies/workflows/dependabot-auto-merge.yml` to
`.github/workflows/dependabot-auto-merge.yml`.

After the workflows are pushed, enable auto-merge if the repo supports it:

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh api --method PATCH "repos/${REPO}" --field allow_auto_merge=true
```

Add this line to `AGENTS.md` if missing:

> `Dependencies: Dependabot opens PRs for updates automatically. Patch and minor updates are auto-merged; major updates require manual review.`

### 6.2 Security Scanning

Use only the vendored assets in this package:

- `assets/security/workflows/codeql.yml`
- `assets/security/workflows/dependency-review.yml`

Determine the CodeQL language:

- Node or web → `javascript-typescript`
- Python → `python`
- Go → `go`
- Rust or other unsupported languages → skip CodeQL

If CodeQL is supported:

- copy `assets/security/workflows/codeql.yml` to `.github/workflows/codeql.yml`
- update the matrix language to the detected language

Always copy `assets/security/workflows/dependency-review.yml` to
`.github/workflows/dependency-review.yml`.

For Rust projects, explain that CodeQL is not supported and recommend:

```bash
cargo install cargo-audit
cargo audit
```

Secret scanning is a repo setting, not a workflow file. Guide the user:

1. GitHub repo → Settings → Security & analysis
2. Enable Secret scanning
3. Enable Push protection when available

If the repository is public, you can attempt to enable secret scanning through `gh api`:

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh api --method PATCH "repos/${REPO}" \
  --field "security_and_analysis[secret_scanning][status]=enabled" \
  --field "security_and_analysis[secret_scanning_push_protection][status]=enabled"
```

Add this line to `AGENTS.md` if missing:

> `Security: CodeQL runs on supported languages, dependency review blocks high and critical CVEs in PRs, and the Security tab must stay clean.`

---

## Step 7: GitHub Permissions, Commit Strategy, and Verification

### 7.1 Automate GitHub Repository Settings

After the selected files are committed and pushed, automate the matching GitHub settings.

If release workflow was configured, ensure Actions can write releases:

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

gh api --method PUT "repos/${REPO}/actions/permissions/workflow" \
  --field default_workflow_permissions=write \
  --field can_approve_pull_request_reviews=true
```

If dependency management was configured, ensure auto-merge is enabled:

```bash
gh api --method PATCH "repos/${REPO}" --field allow_auto_merge=true
```

If security scanning was configured, attempt secret scanning as described above,
but report clearly when GitHub plan limits block it.

### 7.2 Commit the Work

Default to focused conventional commits after each selected section unless the user
explicitly asks for one squashed setup commit.

Suggested commit messages:

- scaffold and repo baseline → `chore: initialize project scaffold`
- code quality → `chore: add code quality tooling`
- release workflow → `ci: add release workflow automation`
- CI pipeline → `ci: add project CI pipeline`
- GitHub repository setup → `chore: add GitHub repository configuration`
- dependency management → `chore: add Dependabot dependency management`
- security scanning → `ci: add security scanning workflows`

### 7.3 Verify Before Declaring Success

Check only the sections that were selected:

- Foundation
  - `README.md`, `LICENSE`, `.gitignore`, `.editorconfig`, and `CONTRIBUTING.md` exist
  - `AGENTS.md` exists and `CLAUDE.md` is a symlink
- Code quality
  - the config files exist
  - husky or pre-commit is installed when expected
- Release workflow
  - `release.yml` exists
  - `scripts/extract-release-notes.sh` is executable
  - `CHANGELOG.md` uses linked headers
- CI
  - `.github/workflows/ci.yml` matches the real install, lint, test, and build commands
- GitHub repo setup
  - PR template, issue forms, and `CODEOWNERS` exist
  - branch protection was applied or the failure reason is clearly reported
- Dependency management
  - `.github/dependabot.yml` exists
  - `dependabot-auto-merge.yml` exists
- Security
  - `codeql.yml` exists when the language is supported
  - `dependency-review.yml` exists
  - secret scanning follow-up steps are explicit if automation could not enable it

### 7.4 Final Summary

End with a concrete summary that lists only the sections that actually ran, for example:

```text
Setup complete for [project name] ([type] project)

Configured
  [x] scaffold and repo baseline
  [x] release workflow
  [x] CI pipeline
  [x] code quality
  [x] GitHub repository setup
  [x] dependency management
  [x] security scanning

Manual follow-up
  [ ] add required status checks to branch protection after the first CI run
  [ ] enable secret scanning manually if GitHub plan limits blocked automation
```

Only list the relevant sections, failures, and follow-up items.
