# Design Decisions & Alternatives

---

## Why Dependabot over Renovate?

**Dependabot** is built into GitHub — no app installation, no third-party service,
no additional secrets or access grants required. It works on day one with zero
configuration for public repos, and the configuration format is stable and
well-documented.

**Renovate** is more powerful: it supports more ecosystems, has richer grouping
options, and can self-host. But it requires either a GitHub App installation or
running a self-hosted bot, which adds setup friction and external dependencies.

**Choose Renovate if:** you have many ecosystems to manage, need monorepo support,
want to automerge based on test results (Renovate has better merge confidence
integration), or need ecosystems Dependabot doesn't support.

---

## Why group minor and patch updates together?

Without grouping, Dependabot opens one PR per package per update. A project with
50 npm dependencies might get 30 PRs in a single week. Grouped updates consolidate
all minor/patch bumps into one or two PRs, which is manageable.

Major updates are left ungrouped because each one needs individual attention —
they may have breaking changes that affect different parts of the codebase.

---

## Why auto-merge minor updates, not just patch?

Semantic versioning guarantees that minor updates are backwards-compatible.
A library bumping from `2.3.0` to `2.4.0` added features but did not break
existing interfaces. If your CI is passing, auto-merging minor updates is safe.

The risk is that libraries don't always follow semver perfectly. Mitigating this:

- CI must pass before auto-merge (GitHub's branch protection requirement)
- Auto-merge only runs `--merge` (not `--squash` or `--rebase`), preserving history

---

## Why always include the `github-actions` ecosystem?

Outdated GitHub Actions (e.g., `actions/checkout@v2`) introduce security risks:
known vulnerabilities in old versions, deprecated features, and action runner
compatibility issues. Keeping Actions updated is low-risk (they typically only
change behavior between major versions) and high-value for security.

---

## Why `commit-message.prefix: "chore(deps)"`?

Conventional commit prefixes on Dependabot commits ensure that:

1. Release-please correctly classifies them as non-release-triggering (chore)
2. The commits appear in the changelog if desired (under a `### Refactoring` section)
3. Commit history is consistent with the rest of the project
