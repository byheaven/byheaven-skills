# Design Decisions & Alternatives

---

## Why YAML issue forms over markdown templates?

GitHub issue forms (YAML) create structured forms with dropdowns, text areas,
and validation. Markdown templates are plain text that users can ignore entirely.

YAML forms:

- Enforce required fields
- Provide dropdowns for structured data (priority, category)
- Automatically apply labels
- Auto-populate the PR title prefix (`title: "bug: "`)

The main drawback is that YAML forms are slightly more complex to author. The
templates in this skill make that a one-time cost.

---

## Why `gh api` for branch protection instead of documenting the UI?

The GitHub UI for branch protection changes frequently and varies by plan tier.
`gh api` is:

- Reproducible and scriptable
- Works the same across all plan tiers
- Can be committed as a script and re-run after repo recreation
- Faster than clicking through nested settings pages

---

## Why leave `required_status_checks.contexts` empty initially?

Status check names are only known after a workflow has run at least once.
GitHub requires exact check names (e.g., `CI (Node 20)`) that come from the
`name` field of the GitHub Actions job. Running branch protection setup before
the first CI run would require hardcoding names that may not match.

The recommended workflow: apply protection without status checks → push to main →
check Actions tab for job names → update protection with those exact names.

---

## Why `dismiss_stale_reviews: true`?

When new commits are pushed to a PR after approval, the approval is dismissed.
This prevents the "approve now, change later" pattern where a reviewer approves
a clean PR and the author then pushes breaking changes before merging.

---

## Why one PR template at `.github/pull_request_template.md`?

GitHub supports multiple PR templates but requires users to select them manually.
A single template that covers all PR types is simpler and has higher adoption.
Teams that genuinely need different templates for different PR types (e.g., release
vs. feature) can add multiple templates after the default is established.

---

## Why CODEOWNERS in `.github/` instead of the root?

GitHub checks three locations for CODEOWNERS in this priority order:
`.github/`, root, and `docs/`. `.github/` is the most explicit and conventional
location for all GitHub-specific configuration files.
