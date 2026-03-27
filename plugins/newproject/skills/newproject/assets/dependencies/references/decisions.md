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

## Why add a 7-day cooldown before auto-merging patch and minor updates?

SemVer alone is not a supply-chain control. A compromised maintainer account,
malicious publish, or poisoned package release can still ship as a patch or minor
update and pass ordinary CI before the broader ecosystem notices.

A 7-day cooldown is a practical default: it gives package authors, ecosystem
maintainers, GitHub advisories, and the wider community time to surface yanks,
reverts, and incident reports before the repository adopts a fresh release.
After that waiting period, patch and minor updates can still auto-merge to keep
maintenance overhead low.

The remaining safeguards are:

- Required status checks must pass before auto-merge
- Major updates still require manual review
- Human review remains opt-in for teams that want stricter merge policy
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
