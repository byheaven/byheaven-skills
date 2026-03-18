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
2. Set the initial plugin version in `plugins/<name>/.claude-plugin/plugin.json` to `0.1.0`
3. Add an entry to `.claude-plugin/marketplace.json` (no `version` field)
4. Create `plugins/<name>/CHANGELOG.md` with a linked `## [Unreleased](compare-url)` header
5. Include a `README.md` and `LICENSE` in the plugin directory

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

This project uses a single tag-triggered workflow for manually curated per-plugin releases.

### How it works

1. Day-to-day PRs merge into `main` normally. No Release PR is created and `CHANGELOG.md` is not rewritten automatically.
2. When you want to release a plugin, manually edit `plugins/<name>/CHANGELOG.md` and add a new linked section header `## [x.y.z](compare-url) (YYYY-MM-DD)`.
3. Update `## [Unreleased](compare-url)` so it points from the new tag to `HEAD`, and link the new version header from the previous plugin tag to the new plugin tag.
4. Bump `plugins/<name>/.claude-plugin/plugin.json` to the same version.
5. Commit those changes on `main` in one human-authored release commit.
6. Create and push tag `<plugin>-<version>` on that same commit, for example `newproject-0.2.1`.
7. The tag triggers `.github/workflows/release.yml`, which validates the version and changelog section, extracts the release notes, and creates or updates the GitHub Release.

### Release checklist

1. Edit `plugins/<name>/CHANGELOG.md` following [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md)
2. Bump `plugins/<name>/.claude-plugin/plugin.json`
3. Commit the release changes on `main`
4. Tag that exact commit: `git tag <plugin>-<version>`
5. Push the commit and tag: `git push origin main --follow-tags`

> **AI assistant users:** when the user says "release", "ship", or "发版", follow this workflow from `CONTRIBUTING.md`.

## Changelog Style

Changelogs follow [Linear-style prose](docs/changelog-style-guide.md) — user-centric, not commit-centric.

Key principles:

- **User benefit first**: describe what users *get*, not what developers *did*
- **Bold headlines**: 1–3 punchy feature titles for the most significant changes
- **Use linked headers**: `## [x.x.x](compare-url) (YYYY-MM-DD)` for every released version
- **Omit internal changes**: `chore`, `ci`, `refactor`, `docs` should usually stay out unless they matter to plugin users

See [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md) for the full guide with examples.

## Reporting Issues

Use the GitHub issue tracker. For bugs, include:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Claude Code version)
