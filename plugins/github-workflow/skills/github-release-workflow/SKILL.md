---
name: github-release-workflow
description: "Sets up a complete automated GitHub release workflow for any project. Use this skill whenever the user wants to automate releases, set up changelogs, configure release-please, generate release notes, or establish a versioning workflow on a GitHub project. Also use when the user mentions semantic versioning, conventional commits, CHANGELOG.md, release automation, or wants GitHub Releases to be created automatically. This skill sets up the full pipeline: conventional commits enforcement → release-please manages Release PRs and tags → AI-assisted changelog editing → automated GitHub Release creation from the edited CHANGELOG.md."
---

# GitHub Release Workflow Skill

Sets up a complete, production-ready release automation pipeline on a GitHub project. The workflow combines release-please for versioning automation with a human-in-the-loop AI editing step for Linear-quality changelogs.

## Overview of What Gets Set Up

```
Conventional commits (enforced by commitlint + husky)
    │
    ▼
Push to main → release-please maintains a Release PR
    │             (auto-updates CHANGELOG.md draft + bumps version)
    ▼
Developer edits CHANGELOG.md in the PR
    │  → Uses AI to rewrite raw commits into Linear-style prose
    │  → References: references/ai-changelog-guide.md for the AI prompt
    ▼
Merge Release PR → release-please creates tag
    │
    ▼
publish.yml triggers on tag push
    │  → Reads CHANGELOG.md, extracts this version's section
    │  → Creates GitHub Release with the human-edited content
    │  → Runs publish step (npm / pip / go / custom)
    └
```

---

## Step 0: Read the Project First

Before doing anything, understand the project:

```bash
# Detect project type
ls package.json pyproject.toml setup.py go.mod Cargo.toml 2>/dev/null

# Check if git is initialized
git remote -v

# Check existing CI
ls .github/workflows/ 2>/dev/null
```

Determine:
- **Project type**: node / python / go / rust / other
- **Primary branch name**: main / master (check `git remote show origin`)
- **Package name**: from package.json / pyproject.toml / go.mod
- **Existing workflows**: avoid overwriting anything

Ask the user if anything is ambiguous before proceeding.

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

### Non-Node projects — commitlint via npm (no package.json required)

If the project doesn't use Node, install commitlint globally or use a GitHub Action
to validate commit messages on PRs instead of local hooks.

Use the workflow at `assets/workflows/commitlint-check.yml` as an optional CI check.

### Commit types reference

| Type | Triggers version bump | Description |
|------|----------------------|-------------|
| `feat` | minor (0.x.0) | New feature |
| `fix` | patch (0.0.x) | Bug fix |
| `BREAKING CHANGE` | major (x.0.0) | Breaking change (in footer) |
| `docs/chore/refactor/test/ci` | none | Internal |

---

## Step 2: release-please Configuration

### Copy workflow files

Copy `assets/workflows/release-please.yml` to `.github/workflows/release-please.yml`.

Then create `release-please-config.json` in the project root.
Use `assets/config/release-please-config.json` as the base, then edit:

- Set `"release-type"` to match the project: `node` / `python` / `go` / `rust` / `simple`
- Verify `"changelog-sections"` match the team's commit type conventions

Also create `.release-please-manifest.json` in the project root:
```json
{
  ".": "0.0.0"
}
```
Replace `"0.0.0"` with the current version if the project already has releases.

### Permissions required

In the GitHub repo → Settings → Actions → General:
- Workflow permissions: **Read and write**
- Allow GitHub Actions to create and approve pull requests: **enabled**

Remind the user to check these settings — they are off by default on new repos.

---

## Step 3: Tag-Triggered Publish Workflow

Copy `assets/workflows/publish.yml` to `.github/workflows/publish.yml`.

Then customize the **Publish step** at the bottom of the file for the project type:

**Node.js:**
```yaml
- name: Publish to npm
  run: npm ci && npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Python:**
```yaml
- name: Publish to PyPI
  run: pip install build twine && python -m build && twine upload dist/*
  env:
    TWINE_USERNAME: __token__
    TWINE_PASSWORD: ${{ secrets.PYPI_TOKEN }}
```

**Go / Rust / Other:**
```yaml
- name: Build release binary
  run: go build -o myapp-${{ github.ref_name }} ./cmd/myapp
- name: Upload binary to release
  uses: softprops/action-gh-release@v2
  with:
    files: myapp-${{ github.ref_name }}
```

**No publish needed (open source library / internal tool):**
Remove the publish step entirely. The workflow already creates the GitHub Release.

---

## Step 4: Extract-Release-Notes Script

Copy `assets/scripts/extract-release-notes.sh` to `scripts/extract-release-notes.sh`.
Make it executable:

```bash
chmod +x scripts/extract-release-notes.sh
git add scripts/extract-release-notes.sh
```

This script is called by `publish.yml` to parse `CHANGELOG.md` and extract the
section for the current tag version. It exits with an error if the version is not
found, which will fail the CI run and alert the developer.

---

## Step 5: AI Changelog Guide

Copy `references/ai-changelog-guide.md` to `docs/ai-changelog-guide.md` (or wherever
the team keeps internal docs).

This file is the system prompt / instructions for using AI to edit Release PR changelogs.
Point the user to: **references/changelog-editing-workflow.md** for the step-by-step
human workflow of how to use it.

---

## Step 6: Initial CHANGELOG.md

If no `CHANGELOG.md` exists, create one:

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Versions follow [Semantic Versioning](https://semver.org).

<!-- Entries below are maintained automatically by release-please and edited manually -->
```

Commit everything:
```bash
git add .
git commit -m "chore: set up automated release workflow"
git push
```

---

## Step 7: Verify the Setup

Walk the user through a dry run:

1. Make a test commit: `git commit --allow-empty -m "feat: test release workflow"`
2. Push to main
3. Check GitHub Actions → the release-please workflow should run
4. A "Release PR" should appear in the repo's pull requests
5. The PR title should be something like `chore(main): release 0.1.0`

If the PR doesn't appear within 2 minutes, check:
- Workflow permissions (Step 2)
- The `release-please.yml` syntax (check Actions tab for errors)
- That `.release-please-manifest.json` exists

---

## Step 8: Teach the Release Flow

Explain the ongoing workflow to the user:

### Normal development
```bash
# Commit with conventional format
git commit -m "feat(auth): add magic link login"
git push origin main
# → release-please silently updates the Release PR
```

### Editing the Release PR (before merging)
1. Open the Release PR on GitHub
2. Find the `CHANGELOG.md` change in the diff
3. Click "..." → "Edit file" on the CHANGELOG.md
4. Use the AI changelog guide (`docs/ai-changelog-guide.md`) as a prompt:
   - Feed the raw diff to Claude with the guide as context
   - Review and adjust the AI output
   - Paste the result back, keeping the `## [x.x.x] - YYYY-MM-DD` header unchanged
5. Merge the PR when satisfied

### What happens after merge
- release-please creates a git tag
- `publish.yml` triggers automatically
- It reads your edited `CHANGELOG.md` and creates the GitHub Release
- Runs the publish step

---

## Reference Files

Read these when you need more detail:

- `references/changelog-editing-workflow.md` — Human workflow for editing changelogs with AI
- `references/ai-changelog-guide.md` — Full AI prompt/instructions for Linear-style rewrites
- `references/decisions.md` — Why each tool was chosen; useful when user asks about alternatives

---

## Project Type Quick Reference

| Type | release-type | Version file | Notes |
|------|-------------|--------------|-------|
| Node.js | `node` | `package.json` | Auto-bumps version field |
| Python | `python` | `pyproject.toml` | Also updates `__version__` if present |
| Go | `go` | `version.go` or tag only | Often tag-only is fine |
| Rust | `rust` | `Cargo.toml` | Auto-bumps version field |
| Other | `simple` | `version.txt` | Creates/updates `version.txt` |

---

## Common Issues

**release-please PR never appears**
→ Check workflow permissions in repo Settings → Actions → General

**Tag created but publish.yml doesn't trigger**
→ Verify the tag pattern in publish.yml matches: `'[0-9]+.[0-9]+.[0-9]+'` catches `1.0.0`

**extract-release-notes.sh exits with "version not found"**
→ The CHANGELOG.md section header doesn't match the tag. Ensure format is
  `## [1.2.3] - YYYY-MM-DD` (no `v` prefix inside brackets)

**release-please creates wrong version (e.g., 1.0.0 instead of 0.2.0)**
→ Edit `.release-please-manifest.json` to set the current version correctly
