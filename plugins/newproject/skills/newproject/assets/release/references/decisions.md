# Design Decisions & Alternatives

Why this workflow is designed the way it is, and what alternatives exist.

---

## Why manual curated releases instead of release-please?

This workflow keeps release publication explicit:

- normal development continues on `main`
- no release PR is created
- no bot rewrites the changelog
- release happens only when a human prepares a curated changelog section and tags that commit

This preserves an intentional editing window without adding a second PR flow.

Choose `release-please` if you specifically want a bot-managed release PR and are
comfortable with generated drafts and extra repository state.

---

## Why not semantic-release?

`semantic-release` is strong when the goal is full automation:

- every qualifying merge to `main` can publish immediately
- changelog content is generated from commit history

That is a poor fit when the team wants to decide *when* to release and rewrite the
notes manually before publication.

Choose `semantic-release` if you want zero manual release coordination and are fine
with every qualifying merge becoming a release candidate.

---

## Why keep `CHANGELOG.md` as the source of truth?

Alternative: maintain GitHub Release notes separately from the changelog.

Problem: the two inevitably drift.

By extracting the GitHub Release body from `CHANGELOG.md`, the team only writes one
release narrative and the published release always matches the repository history.

---

## Why a local extract script instead of another GitHub Action?

A small repo-owned script is:

- easy to read
- easy to debug
- easy to adapt to the project's exact header format

It avoids depending on third-party release-note parsing behavior.

---

## Why one `release.yml`?

A single release workflow is easier to explain and maintain.

It covers:

- GitHub Release publication
- optional package publishing
- optional binary uploads

Projects that need extra publish logic can append steps without changing the core release model.

---

## Branch protection recommendations

For this workflow to function well:

- protect `main` / `master`
- require PR reviews
- require status checks such as tests and commitlint
- do not require special bot bypasses for release automation, because the release commit is human-authored

---

## Why linked changelog headers?

Linked headers make the changelog directly navigable:

- `Unreleased` shows everything since the latest tag
- each version header links to the exact compare view for that release

This removes the need for separate link definitions at the bottom of the file and
keeps the release context visible at the point of reading.
