---
description: "Orchestrates full project setup by detecting project type, inventorying existing configuration, and running selected skills in dependency order. Run this command to set up a new project end-to-end."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
argument-hint: "[--tier1 | --all | skill-name]"
---

# /newproject Command

Sets up a new or existing project end-to-end by orchestrating all newproject skills
in the correct dependency order.

---

## Step 1: Detect

```bash
# Project type indicators
ls package.json pyproject.toml setup.py go.mod Cargo.toml 2>/dev/null

# Web framework (if Node)
ls next.config.* nuxt.config.* vite.config.* angular.json svelte.config.* astro.config.* 2>/dev/null

# Package manager lockfile (if Node)
ls package-lock.json yarn.lock pnpm-lock.yaml bun.lockb 2>/dev/null

# Existing foundation files
ls README.md LICENSE .gitignore .editorconfig CONTRIBUTING.md 2>/dev/null

# Existing GitHub configuration
ls .github/workflows/ .github/pull_request_template.md .github/ISSUE_TEMPLATE/ .github/CODEOWNERS .github/dependabot.yml 2>/dev/null
ls .github/workflows/ci* .github/workflows/release* .github/workflows/codeql* .github/workflows/dependency-review* 2>/dev/null

# Code quality tooling
ls .eslintrc* eslint.config.* prettier.config.* ruff.toml .golangci.yml rustfmt.toml .husky/ .pre-commit-config.yaml 2>/dev/null

# Release workflow
ls release-please-config.json .release-please-manifest.json 2>/dev/null

# Git status
git remote -v 2>/dev/null || echo "no remote"
```

---

## Step 2: Branch on Project State

### Path A — Brand new project (empty or near-empty directory)

**Trigger:** no package manifest, no README, no `.github/`, no git remote.

Gather the essentials before showing any checklist:

- If project name is not clear from the directory name, use the AskUserQuestion tool: "What is the project name?"
- Use the AskUserQuestion tool: "Short description (1–2 sentences):"

Based on the project name and description, reason about the most suitable tech stack
(language, framework, tooling) and present a recommendation with rationale. For example:

> "Based on your description, I'd suggest a **Node.js + TypeScript** project using
> Vitest for testing and ESLint/Prettier for code quality. This fits well for [reason].
> Does this sound right, or would you prefer a different stack?"

Then use the AskUserQuestion tool to confirm: "Confirm tech stack, or describe what you'd prefer:"

Use the confirmed stack to determine the project type (node / python / go / rust / other)
for all subsequent skill steps.

Then present the checklist (all items unchecked) and confirm:

```
New [type] project: [name] — all skills selected by default

Tier 1 — Foundation:
  ☑ project-scaffold   — README, LICENSE (MIT), .gitignore, .editorconfig
  ☑ release-workflow   — conventional commits + release-please + changelogs
  ☑ ci-pipeline        — GitHub Actions CI with test, lint, build

Tier 2 — Quality & Governance:
  ☑ code-quality       — ESLint/Prettier/Ruff + pre-commit hooks
  ☑ github-repo-setup  — PR template, issue forms, CODEOWNERS, branch protection
  ☑ dependency-management — Dependabot + auto-merge

Tier 3 — Security:
  ☑ security-scanning  — CodeQL + dependency vulnerability review
```

Use the AskUserQuestion tool: "Press Enter to run all skills, or specify what to skip: e.g. 'skip security-scanning' or 'tier1 only'"

### Path B — Existing project

**Trigger:** one or more project files already exist.

Mark what is already configured with ✅, then present the checklist:

```
Project: [detected type] — [project name]

Tier 1 — Foundation:
  [✅ or □] project-scaffold   — README, LICENSE, .gitignore, .editorconfig
  [✅ or □] release-workflow   — conventional commits + release-please + changelogs
  [✅ or □] ci-pipeline        — GitHub Actions CI with test, lint, build

Tier 2 — Quality & Governance:
  [✅ or □] code-quality       — ESLint/Prettier/Ruff + pre-commit hooks
  [✅ or □] github-repo-setup  — PR template, issue forms, CODEOWNERS, branch protection
  [✅ or □] dependency-management — Dependabot + auto-merge

Tier 3 — Security:
  [✅ or □] security-scanning  — CodeQL + dependency vulnerability review
```

Use the AskUserQuestion tool: "Which skills do you want to run? (Press Enter to run all unchecked Tier 1 items, or specify: 'all', 'tier2', 'all tiers', or specific skill names)"

If the user passes an argument at invocation time:

- `--tier1` / `tier1`: run only Tier 1 skills that aren't done
- `--all` / `all`: run all skills that aren't done
- Skill name (e.g., `ci-pipeline`): run that single skill

---

## Step 3: Execute Skills in Dependency Order

Run the selected skills in this exact order (skip already-done items):

1. `project-scaffold` — no dependencies
2. `code-quality` — uses .editorconfig from project-scaffold
3. `release-workflow` — may share husky with code-quality
4. `ci-pipeline` — needs project type (detected in Step 1)
5. `github-repo-setup` — references CI status checks
6. `dependency-management` — needs ecosystem detection
7. `security-scanning` — adds alongside CI workflows

For each skill, invoke it by loading the corresponding SKILL.md and following its steps.

**Shared dependency: husky**
If both `code-quality` and `release-workflow` are in the run list, both may use husky.
The `code-quality` skill checks for existing husky before running `husky init`.
Run `code-quality` before `release-workflow`.

---

## Step 4: Automate GitHub Repository Settings

After all skills are committed and pushed, configure GitHub settings via `gh api`.

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
```

**If `release-workflow` was run** — enable Actions write permissions:

```bash
gh api --method PUT "repos/${REPO}/actions/permissions/workflow" \
  --field default_workflow_permissions=write \
  --field can_approve_pull_request_reviews=true \
  && echo "✅ Actions write permissions enabled" \
  || echo "⚠️  Could not set Actions permissions"
```

**If `dependency-management` was run** — enable auto-merge:

```bash
gh api --method PATCH "repos/${REPO}" \
  --field allow_auto_merge=true \
  && echo "✅ Auto-merge enabled" \
  || echo "⚠️  Could not enable auto-merge"
```

**If `security-scanning` was run** — attempt to enable secret scanning:

```bash
gh api --method PATCH "repos/${REPO}" \
  --field "security_and_analysis[secret_scanning][status]=enabled" \
  --field "security_and_analysis[secret_scanning_push_protection][status]=enabled" \
  && echo "✅ Secret scanning enabled" \
  || echo "⚠️  Secret scanning needs manual setup (Settings → Security & analysis)"
```

---

## Step 5: Summary

```
✅ Setup complete for [project name] ([type] project)

Configured:
  ✅ project-scaffold    — README.md, LICENSE (MIT), .gitignore, .editorconfig
  ✅ release-workflow    — commitlint + release-please + release.yml
  ✅ ci-pipeline         — .github/workflows/ci.yml (Node [version] matrix)
  ✅ code-quality        — ESLint + Prettier + lint-staged + husky pre-commit
  ✅ github-repo-setup   — PR template + issue forms + branch protection
  ✅ dependency-management — Dependabot weekly updates + auto-merge
  ✅ security-scanning   — CodeQL + dependency-review

GitHub settings automated:
  ✅ Actions write permissions — release-please can open Release PRs
  ✅ Auto-merge enabled — Dependabot patch/minor updates merge automatically
  [✅ or ⚠️] Secret scanning — check output above

Manual steps remaining:
  □ After first CI run: copy the CI check name to branch protection required checks
  [□ if ⚠️ above] Settings → Security & analysis → Enable Secret scanning
```

List only items relevant to the skills that were actually run. Show ⚠️ items from
Step 4 that failed and still need manual attention.
