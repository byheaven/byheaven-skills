---
name: dependency-management
description: "Sets up Dependabot for automated dependency updates with grouped update strategies and auto-merge workflows. Use this skill when the user wants to automate dependency updates, configure Dependabot, group dependency PRs to reduce noise, set up auto-merge for minor and patch updates, or keep dependencies current automatically. Also use when the user mentions outdated packages, wanting to reduce manual dependency maintenance, securing the supply chain against known vulnerabilities, or managing GitHub Actions version updates."
---

# Dependency Management Skill

Sets up Dependabot to automatically open PRs for outdated dependencies, with grouped
updates to reduce PR noise and an auto-merge workflow for safe minor/patch updates.

## Step 0: Read the Project

```bash
# Detect package ecosystems
ls package.json pyproject.toml setup.py go.mod Cargo.toml 2>/dev/null

# Check for existing Dependabot config
ls .github/dependabot.yml 2>/dev/null

# Check existing GitHub Actions workflows (always add github-actions ecosystem)
ls .github/workflows/ 2>/dev/null
```

Identify **all ecosystems** in the project:

- `npm` — package.json present
- `pip` — pyproject.toml or requirements.txt present
- `gomod` — go.mod present
- `cargo` — Cargo.toml present
- `github-actions` — always include (updates Action versions in workflows)

---

## Step 1: Create Dependabot Configuration

Create `.github/dependabot.yml` from the appropriate template in `assets/config/`:

| Project type | Base template |
|-------------|--------------|
| Node.js / Web | `dependabot-node.yml` |
| Python | `dependabot-python.yml` |
| Go | `dependabot-go.yml` |
| Rust | `dependabot-rust.yml` |
| Other / generic | `dependabot-generic.yml` |

**Always add the `github-actions` ecosystem** even if it's not in the template.

For projects with multiple ecosystems (e.g., a Python project with GitHub Actions),
combine the relevant sections into one `dependabot.yml`.

---

## Step 2: Configure Update Schedule

Use the AskUserQuestion tool: "How often should Dependabot check for updates? weekly (default) / monthly / daily"

The templates default to weekly. Change `interval: "weekly"` to `"monthly"` or
`"daily"` as requested.

---

## Step 3: Auto-Merge Workflow

Copy `assets/workflows/dependabot-auto-merge.yml` to `.github/workflows/`.

This workflow:

1. Triggers when Dependabot opens or updates a PR
2. Checks the update type (patch, minor, major)
3. Auto-approves and merges patch and minor updates
4. Leaves major updates for manual review

Use the AskUserQuestion tool: "Should minor version updates also be auto-merged? Semver guarantees backwards compatibility for minor bumps. (yes/no, default: yes)"

**Note:** Auto-merge requires the repository setting "Allow auto-merge" to be enabled:
Settings → General → Pull Requests → Allow auto-merge

---

## Step 4: Commit

```bash
git add .github/dependabot.yml .github/workflows/dependabot-auto-merge.yml
git commit -m "chore: add Dependabot dependency management"
git push
```

---

## Step 5: Enable Auto-merge in Repository Settings

Remind the user to enable auto-merge in the GitHub repository settings:

1. Go to Settings → General
2. Scroll to "Pull Requests"
3. Enable "Allow auto-merge"

Without this, the auto-merge workflow will approve PRs but GitHub will not
automatically merge them.

---

## Step 6: Verify

After pushing:

1. Go to GitHub → Insights → Dependency graph → Dependabot to see the schedule
2. On the next scheduled run (or trigger manually), a Dependabot PR should appear
3. Verify the PR has the `dependencies` label and grouped updates appear together

---

## Step 7: Update CLAUDE.md

Add a Dependabot pointer to `CLAUDE.md` so Claude knows how dependency updates
are handled in this project.

Check if `CLAUDE.md` has a `## Contributor Conventions` section:

- **If it doesn't exist**: create the section first (see project-scaffold Step 9 for the base template)
- **Then add** the following line to the section (if not already present):

> `Dependencies: Dependabot opens PRs for updates automatically. Patch and minor updates are auto-merged; major updates require manual review.`

---

## Reference Files

- `references/decisions.md` — Why Dependabot over Renovate, why grouped updates, why auto-merge only for minor/patch
- `assets/config/` — Language-specific dependabot.yml templates
- `assets/workflows/dependabot-auto-merge.yml` — Auto-merge workflow
