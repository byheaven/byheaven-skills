# Design Decisions & Alternatives

Why this workflow is designed the way it is, and what alternatives exist.

---

## Why release-please instead of semantic-release?

**release-please** creates a Release PR that acts as a natural review gate.
The developer merges the PR when ready — this is the editing window for the changelog.
It also supports all languages (not just JS).

**semantic-release** publishes automatically on every push to main. No PR,
no review step, no changelog editing window. Great for fully automated pipelines,
but incompatible with the human-in-the-loop changelog goal.

**Choose semantic-release if:** you want zero human intervention, pure CI/CD,
and don't care about changelog quality. JS/TS projects only.

---

## Why not git-cliff for changelog generation?

git-cliff is excellent at generating changelogs from commits and offers the most
flexible templating. However, in this workflow the changelog is *immediately*
going to be rewritten by a human + AI anyway, so the generation quality matters
less than the editing ergonomics.

release-please's generated draft is good enough as a raw input for AI rewriting,
and avoids adding another tool to the pipeline.

**Choose git-cliff if:** you want high-quality auto-generated changelogs without
the AI editing step, or you need a non-standard format that release-please can't produce.

---

## Why not changie or changesets?

Both require developers to write a change fragment file in every PR.
This produces the highest quality changelogs (each item is written in context)
but adds friction to every PR.

**Choose changie/changesets if:** you have a team of 5+ people, changelog quality
is paramount, and you can enforce the discipline of writing change fragments per PR.
changie works for any language; changesets is JS/monorepo-focused.

---

## Why "CHANGELOG.md as single source of truth"?

Alternative: maintain CHANGELOG.md separately from GitHub Release notes.
Problem: they inevitably diverge. Someone updates one and forgets the other.

By having `release.yml` parse `CHANGELOG.md` to generate the GitHub Release body,
there's only one file to maintain. The GitHub Release is always a subset of the
changelog, never independent.

---

## Why a bash script to extract release notes instead of a GitHub Action?

Several Actions exist for this (e.g., `actions/github-release`), but they add
external dependencies and often have their own parsing quirks.

The `extract-release-notes.sh` script is 15 lines of `awk` + `sed`. It's readable,
debuggable, and owned by the project. If parsing breaks, it's obvious why.

---

## Why split release-please and publish into two workflows?

A single workflow that does both would work, but splitting them:

- Makes each workflow's responsibility clear
- Allows the publish step to be triggered by other means (e.g., manual workflow dispatch)
- Means a failed publish doesn't prevent the release from being created
- Makes it easy to test the publish step independently

---

## Branch protection recommendations

For this workflow to function well:

- Protect `main` / `master`
- Require PR reviews (at minimum 1)
- Require status checks: commitlint (if configured), tests
- Allow the release-please bot to bypass branch protection for its commits

The release-please bot uses the `GITHUB_TOKEN` and is recognized as a trusted actor
for its own commits (version bumps, changelog updates).

---

## Why a single release.yml instead of separate publish/release-only files?

A single `release.yml` handles all project types. Web apps that deploy via
Vercel or Netlify need no publish step — the workflow creates the GitHub Release
and stops. Projects that publish packages append a publish step to the same file.
This is simpler than maintaining two templates with nearly identical content.
