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
2. Add an entry to `.claude-plugin/marketplace.json` with `name`, `version`, `category`, `tags`, `keywords`, `description`, and `source`
3. Set the initial plugin version in that marketplace entry to `0.1.0`
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

## Language Policy

- Use English for code, comments, plans, changelogs, skill content, and plugin metadata.
- Documentation defaults to English.
- The only standing bilingual exception is the repository README documentation, such as `README.md` and `README.zh-CN.md`.
- Any other non-English documentation should be added only when a user explicitly asks for it.

## Release Workflow

A plugin is released by the pull request that changes it: merging that PR to `main` publishes the release.

### How it works

1. A PR that changes what a plugin's users get also releases it. In the same PR:
   - add a linked version section `## [x.y.z](compare-url) (YYYY-MM-DD)` to `plugins/<name>/CHANGELOG.md`, link it from the previous plugin tag to the new one, and point `## [Unreleased](compare-url)` from the new tag to `HEAD`;
   - bump the matching plugin `version` in `.claude-plugin/marketplace.json` to the same version.
2. A PR that should not release yet (docs, CI, or a change to batch with later work) keeps its notes under `## [Unreleased]` and leaves the version alone.
3. On every push to `main`, `.github/workflows/release.yml` finds each plugin whose marketplace version changed in that push and has no tag yet. For each one it validates the version and changelog section, tags the pushed commit `<plugin>-<version>`, and creates the GitHub Release from that changelog section. A push with no version change releases nothing.
4. Two open PRs that pick the same version conflict in `marketplace.json` and `CHANGELOG.md`; the second rebases and takes the next version before it merges.
5. Pushing a `<plugin>-<version>` tag by hand still publishes that tag's Release, for re-running a failed release.

### Release checklist (inside the PR)

1. Write the user-facing notes following [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md)
2. Put them under the new linked version section and reset `Unreleased` to point from the new tag to `HEAD`
3. Bump the matching plugin `version` field in `.claude-plugin/marketplace.json`
4. Merge the PR; check that the Release workflow run on `main` created the tag and Release

> **AI assistant users:** when the user says "release", "ship", or "发版", follow this workflow from `CONTRIBUTING.md`.

## Changelog Style

Changelogs follow [Linear-style prose](docs/changelog-style-guide.md) — user-centric, not commit-centric.

Key principles:

- **User benefit first**: describe what users *get*, not what developers *did*
- **Bold headlines**: 1–3 punchy feature titles for the most significant changes
- **Use linked headers**: `## [x.x.x](compare-url) (YYYY-MM-DD)` for every released version
- **Maintain `Unreleased` continuously**: every merge to `main` should add a short note under `## [Unreleased]`
- **Omit internal changes**: `chore`, `ci`, `refactor`, `docs` should usually stay out unless they matter to plugin users

See [`docs/changelog-style-guide.md`](docs/changelog-style-guide.md) for the full guide with examples.

## Reporting Issues

Use the GitHub issue tracker. For bugs, include:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Claude Code version)
