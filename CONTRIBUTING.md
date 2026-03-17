# Contributing to Byheaven Skills

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Commit using [conventional commits](https://www.conventionalcommits.org/): `git commit -m "feat: add your feature"`
5. Push and open a pull request

## Adding a Plugin

1. Create `plugins/<name>/` with the required structure (see [CLAUDE.md](CLAUDE.md))
2. Add an entry to `.claude-plugin/marketplace.json`
3. Include a `README.md` and `LICENSE` in the plugin directory

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
|------|-------------|
| `feat` | New feature or plugin |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change, no feature/fix |
| `chore` | Maintenance, dependencies |

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Update documentation if needed
- Ensure CI passes before requesting review

## Release Workflow

This project uses [release-please](https://github.com/googleapis/release-please) for automated releases.

### How it works

1. Every `feat:` or `fix:` commit pushed to `main` is picked up by release-please
2. release-please maintains an open **Release PR** (titled `chore(main): release x.x.x`)
3. The Release PR auto-updates `CHANGELOG.md` with raw commit entries
4. When you merge the Release PR → release-please creates a git tag → the tag triggers a GitHub Release

### Before merging a Release PR

Edit `CHANGELOG.md` in the PR to produce human-readable release notes:

1. Find the Release PR: `gh pr list --label "autorelease: pending"`
2. Check out the branch: `gh pr checkout <number>`
3. Open `CHANGELOG.md` and find the new `## [x.x.x] - YYYY-MM-DD` section
4. Rewrite it following [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md)
5. Update the `[unreleased]` link definition at the bottom of `CHANGELOG.md`
   to compare from the new version tag (e.g., `...compare/byheaven-skills-1.2.0...HEAD`)
6. Commit and push: `git commit -am "docs: polish changelog for x.x.x" && git push`
7. Merge the PR: `gh pr merge --merge`

> **Claude users:** say "release" or "发版" — Claude reads this workflow from CLAUDE.md and executes it automatically.

### After merge

- A git tag is created automatically
- The tag-triggered workflow creates a GitHub Release with your edited changelog content

## Changelog Style

Changelogs follow [Linear-style prose](docs/changelog-style-guide.md) — user-centric, not commit-centric.

Key principles:

- **User benefit first**: describe what users *get*, not what developers *did*
- **Bold headlines**: 1–3 punchy feature titles for the most significant changes
- **Never modify the version header**: `## [x.x.x] - YYYY-MM-DD` is parsed by automation
- **Omit internal changes**: `chore`, `ci`, `refactor`, `docs` commits are hidden by default

See [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md) for the full guide with examples.

## Reporting Issues

Use the GitHub issue tracker. For bugs, include:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Claude Code version)
