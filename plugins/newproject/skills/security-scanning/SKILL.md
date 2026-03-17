---
name: security-scanning
description: "Sets up security scanning workflows: CodeQL static analysis, dependency vulnerability review, and secret scanning guidance. Use this skill when the user wants to add security scanning, set up CodeQL, block PRs with known-vulnerable dependencies, enable secret scanning, detect hardcoded credentials, or comply with security best practices. Also use when the user mentions CVEs, supply chain security, SAST tools, static analysis, vulnerability scanning, or wanting to fail PRs that introduce vulnerable dependencies."
---

# Security Scanning Skill

Sets up GitHub's built-in security tooling: CodeQL for static analysis,
dependency review to block vulnerable dependencies in PRs, and guidance on
enabling secret scanning.

## Step 0: Read the Project

```bash
# Detect project type (for CodeQL language selection)
ls package.json pyproject.toml go.mod Cargo.toml 2>/dev/null

# Check existing security workflows
ls .github/workflows/ 2>/dev/null

# Check if CodeQL is already configured
ls .github/workflows/codeql* 2>/dev/null
```

Determine the **CodeQL language** from the project type:

- Node.js / Web → `javascript-typescript`
- Python → `python`
- Go → `go`
- Rust → Rust is not yet supported by CodeQL; skip CodeQL, add other tools
- Other → use the AskUserQuestion tool: "CodeQL doesn't natively support this language. Skip CodeQL, or would you like guidance on alternative SAST tools? (skip/alternatives)"

---

## Step 1: CodeQL Static Analysis

Copy `assets/workflows/codeql.yml` to `.github/workflows/codeql.yml`.

Customize the `language` matrix:

```yaml
strategy:
  matrix:
    language: ['javascript-typescript']  # Change for your project
    # Options: javascript-typescript, python, go, java-kotlin, csharp, cpp, ruby, swift
```

The workflow runs on:

- Push to `main`
- Pull requests to `main`
- Weekly schedule (catches vulnerabilities in dependencies that were safe when first added)

**Note for Rust projects:** CodeQL does not yet support Rust. Instead:

- Use `cargo audit` for dependency vulnerability scanning:

  ```bash
  cargo install cargo-audit
  cargo audit
  ```

- Add a `cargo-audit` step to `ci-rust.yml`

---

## Step 2: Dependency Review

Copy `assets/workflows/dependency-review.yml` to `.github/workflows/`.

This workflow:

- Runs on every pull request
- Scans new/changed dependencies for known CVEs
- Fails the PR if any dependency has a high or critical vulnerability
- Works for all ecosystems GitHub supports (npm, pip, go, cargo, etc.)

No language-specific customization needed.

---

## Step 3: Secret Scanning (Manual Setup)

Secret scanning cannot be configured via workflow files — it's a repository setting.
Guide the user through enabling it:

1. Go to the GitHub repo → **Settings** → **Security & analysis**
2. Enable **Secret scanning** (detects accidentally committed API keys, tokens, etc.)
3. Enable **Push protection** (blocks pushes that contain known secret patterns)

Push protection is available on:

- Public repositories: free
- Private repositories: requires GitHub Advanced Security (paid)

Inform the user of the plan tier requirement before suggesting push protection for
private repos.

---

## Step 4: Commit

```bash
git add .github/workflows/codeql.yml .github/workflows/dependency-review.yml
git commit -m "ci: add CodeQL and dependency review security scanning"
git push
```

---

## Step 5: Review the First CodeQL Results

After the first run:

1. Go to GitHub → **Security** tab → **Code scanning**
2. Review any alerts CodeQL found
3. Triage: mark known false positives as "dismissed" with a reason
4. Fix real issues before they accumulate

---

## Step 6: Update CLAUDE.md

Add a security scanning pointer to `CLAUDE.md` so Claude knows what security
checks are in place for this project.

Check if `CLAUDE.md` has a `## Contributor Conventions` section:

- **If it doesn't exist**: create the section first (see project-scaffold Step 9 for the base template)
- **Then add** the following line to the section (if not already present):

> `Security: CodeQL runs on every push and PR. Dependency review blocks PRs that introduce high/critical CVEs. Check the Security tab for any open alerts.`

---

## Reference Files

- `references/decisions.md` — Why CodeQL over alternatives, why dependency-review, secret scanning limitations
- `assets/workflows/codeql.yml` — CodeQL workflow template
- `assets/workflows/dependency-review.yml` — Dependency review workflow
