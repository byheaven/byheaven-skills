---
name: release-workflow
description: "Sets up a manual curated GitHub release workflow for a single-project repository. Use this skill whenever the user wants conventional commits, a changelog-driven release process, GitHub Releases published from edited release notes, or a clear semantic versioning workflow without release-please. The workflow is: enforce conventional commits, maintain a linked-header CHANGELOG.md, prepare a human-authored release commit when ready, tag that exact commit, and let release.yml publish the GitHub Release from the changelog."
---

# GitHub Release Workflow Skill

Sets up a production-ready release workflow for a normal project repository. Day-to-day
development stays on `main`, and releases happen only when a human prepares a curated
changelog section, bumps the project version, tags that exact commit, and lets GitHub
Actions publish the release from `CHANGELOG.md`.

## Overview of What Gets Set Up

```text
Conventional commits (commitlint + optional husky / CI check)
    │
    ▼
Normal development on main
    │  → no release PRs
    │  → no automatic changelog rewrites
    ▼
Developer prepares a release commit
    │  → edits CHANGELOG.md with linked headers
    │  → bumps the project version file
    ▼
Developer tags that exact commit
    │
    ▼
Tag-triggered workflow (release.yml)
    │  → validates version metadata
    │  → extracts the matching CHANGELOG.md section
    │  → creates or updates the GitHub Release
    │  → runs publish step if needed (npm / PyPI / binaries / custom)
```

---

## Step 0: Read the Project First

Before making changes, inspect the repository:

```bash
# Detect project type
ls package.json pyproject.toml setup.py go.mod Cargo.toml 2>/dev/null

# Detect web framework (if package.json exists)
ls next.config.* nuxt.config.* vite.config.* angular.json svelte.config.* astro.config.* remix.config.* 2>/dev/null

# Check Git metadata
git remote -v
git branch --show-current

# Check existing CI / release files
ls .github/workflows/ 2>/dev/null
ls CHANGELOG.md CONTRIBUTING.md AGENTS.md 2>/dev/null
```

Determine:

- **Project type**: web / node / python / go / rust / other
  - If a Node project has a web framework config file, classify as **web**
  - If ambiguous, use the AskUserQuestion tool: "Is this a web app or a Node.js library/tool?"
- **Primary branch name**: `main` / `master`
- **Current version source of truth**:
  - Node/web: `package.json`
  - Python: `pyproject.toml` / `setup.py`
  - Rust: `Cargo.toml`
  - Go/other: existing version file if one already exists, otherwise tag-only
- **Existing workflows and changelog state**: avoid overwriting useful files blindly

If anything is ambiguous, resolve it with the AskUserQuestion tool before proceeding.

---

## Step 1: Conventional Commits Enforcement

### Node.js projects — commitlint + husky

```bash
npm install --save-dev \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky

npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

Create `commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

### Non-Node projects — commitlint in CI

If the project does not use Node, prefer a GitHub Actions check instead of forcing
local npm tooling. Use `assets/workflows/commitlint-check.yml` as the optional CI check.

### Commit type reference

| Type | Typical bump | Description |
|------|--------------|-------------|
| `feat` | minor | New feature |
| `fix` | patch | Bug fix |
| `BREAKING CHANGE` / `!` | major | Breaking change |
| `docs/chore/refactor/test/ci` | none | Internal |

---

## Step 2: Release Workflow

Copy `assets/workflows/release.yml` to `.github/workflows/release.yml`.

This workflow should be the only release workflow. It triggers on matching release tags,
validates the version file, extracts the matching changelog section, and publishes the
GitHub Release from that section.

### Configure the tag pattern

Edit the `on.push.tags` pattern in `release.yml` to match the project's tag format:

- **No prefix**: `'*.*.*'`
- **Prefix `myapp-`**: `'myapp-*.*.*'`

The workflow itself should enforce the exact semantic version shape during parsing, so
the tag trigger can stay broad.

### Configure the version file

Set the workflow's version validation step to read the project's actual version source:

- Node/web: `package.json`
- Python: `pyproject.toml` or another established version file
- Rust: `Cargo.toml`
- Go/other: skip version-file validation if the project is intentionally tag-only

If the project publishes packages or binaries, append the publish step after the
GitHub Release step in `release.yml`.

---

## Step 3: Extract Release Notes Script

Copy `assets/scripts/extract-release-notes.sh` to `scripts/extract-release-notes.sh`:

```bash
mkdir -p scripts
cp assets/scripts/extract-release-notes.sh scripts/extract-release-notes.sh
chmod +x scripts/extract-release-notes.sh
```

This script parses `CHANGELOG.md`, extracts the section for the current tag version,
and writes:

- `RELEASE_NOTES.md`
- `RELEASE_TITLE.txt`

It must fail loudly when the target version section is missing.

---

## Step 4: Changelog Style Guide

Copy `references/changelog-style-guide.md` to `docs/changelog-style-guide.md`:

```bash
mkdir -p docs
cp references/changelog-style-guide.md docs/changelog-style-guide.md
```

This guide is both:

- the human writing standard for release notes
- the AI prompt reference when rewriting rough notes into polished changelog prose

The first bold line in a version section becomes the GitHub Release title.
If no bold line exists, the release title falls back to the tag name.

---

## Step 5: Update CONTRIBUTING.md

Add a release workflow section describing the ongoing process:

- normal merges to `main` do not publish releases
- release happens only when a human:
  - edits `CHANGELOG.md`
  - bumps the version file
  - commits those changes
  - tags that exact commit
- the tag triggers `release.yml`, which publishes the GitHub Release

If `CONTRIBUTING.md` already exists, update or replace its release section.
If it does not exist, create a minimal one that includes:

- Getting Started
- Commit Convention
- Release Workflow
- Changelog Style
- Reporting Issues

Use the linked-header changelog format described below.

---

## Step 6: Initial CHANGELOG.md

If no `CHANGELOG.md` exists, create one.

First derive:

```bash
git remote get-url origin
# Example: https://github.com/OWNER/REPO.git
```

Use this template:

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Versions follow [Semantic Versioning](https://semver.org).

## [Unreleased](https://github.com/OWNER/REPO/compare/v0.0.0...HEAD)
```

Then, for each real release, use linked version headers:

```markdown
## [1.2.0](https://github.com/OWNER/REPO/compare/v1.1.0...v1.2.0) (2026-03-18)
```

Rules:

- `Unreleased` is always a linked header to `compare/<latest-tag>...HEAD`
- Each release header links to `compare/<previous-tag>...<new-tag>`
- Keep the section body under `Unreleased` empty between releases

---

## Step 7: Verify the Setup

Walk the user through a non-destructive verification:

1. Confirm `commitlint` is wired locally or in CI
2. Confirm `release.yml` exists and has the intended tag pattern
3. Confirm `scripts/extract-release-notes.sh` is executable
4. Confirm `CHANGELOG.md` uses linked headers:
   - `## [Unreleased](compare-url)`
   - `## [x.y.z](compare-url) (YYYY-MM-DD)`
5. Dry-run the extract script against an existing changelog version if one exists:

   ```bash
   CHANGELOG_FILE=CHANGELOG.md ./scripts/extract-release-notes.sh v1.2.0
   ```

If the extract script fails, fix the changelog format before calling the setup done.

---

## Step 8: Teach the Release Flow

Explain the ongoing workflow to the user:

### Normal development

```bash
git commit -m "feat(auth): add magic link login"
git push origin main
```

What happens:

- normal CI runs
- no release PR is created
- `CHANGELOG.md` is not rewritten automatically

### Release day

When ready to release:

1. Edit `CHANGELOG.md`
   - Add a new linked version header
   - Rewrite the release notes in polished user-facing prose
   - Update `Unreleased` to compare from the new tag to `HEAD`
2. Bump the project's version file if the project uses one
3. Commit the release changes
4. Tag that exact commit
5. Push the commit and tag

Example:

```bash
git commit -m "chore(release): prepare 1.2.0"
git tag v1.2.0
git push origin main --follow-tags
```

What happens next:

- `release.yml` runs on the tag
- it validates the version metadata if configured
- it extracts the `1.2.0` section from `CHANGELOG.md`
- it creates or updates the GitHub Release
- it runs the publish step if the project has one

---

## Reference Files

Read these when you need more detail:

- `references/changelog-editing-workflow.md` — release-day changelog editing process
- `references/changelog-style-guide.md` — writing standard for changelog prose
- `references/decisions.md` — tradeoffs versus other release tools

---

## Project Type Quick Reference

| Type | Version source | Notes |
|------|----------------|-------|
| Web app | `package.json` | `release.yml` publishes GitHub Release; hosting platform deploys separately |
| Node.js | `package.json` | Validate `package.json` version against the tag |
| Python | `pyproject.toml` / project convention | Validate the existing version file if one exists |
| Go | Tag-only or project convention | Tag-only is fine when there is no stable version file |
| Rust | `Cargo.toml` | Validate `Cargo.toml` version against the tag |
| Other | Existing version file or tag-only | Prefer tag-only unless the project already has a version file convention |

---

## Common Issues

**Tag pushed but release workflow does not run**
→ Check the tag glob in `.github/workflows/release.yml`

**Workflow fails with version mismatch**
→ The tag version and the configured version file do not match

**extract-release-notes.sh exits with "version not found"**
→ The matching `CHANGELOG.md` section is missing or the header does not match the tag version

**Release title is just the tag**
→ There is no bold headline at the top of the release section

---

## Step 9: Update AGENTS.md

Add a contributor-conventions pointer so AI coding assistants know where the release
workflow is documented.

Ensure `AGENTS.md` includes guidance equivalent to:

> `Release: when the user says "release" or "ship", follow the Release Workflow section in CONTRIBUTING.md. Use docs/changelog-style-guide.md for changelog rewriting.`
