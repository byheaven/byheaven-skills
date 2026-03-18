# Changelog Editing Workflow

How to prepare a curated release commit and tag it, using AI to produce polished
release notes from rough engineering inputs.

---

## When to Do This

Do this when the team has decided a release is ready.

Normal merges to `main` do not publish releases and do not rewrite `CHANGELOG.md`.
The release happens only after a human prepares the release commit.

**One source of truth:** edit `CHANGELOG.md` and let `release.yml` publish from it.

---

## Step-by-Step

### 1. Gather the release inputs

Collect the commits, PRs, or notes that should be covered in this release.

You are preparing one new version section, for example:

```markdown
## [1.2.0](https://github.com/OWNER/REPO/compare/v1.1.0...v1.2.0) (2026-03-18)
```

### 2. Draft the section with AI

Use the changelog style guide as the instruction set and provide the rough release inputs.

The AI should produce only the section body, not the header.

### 3. Edit `CHANGELOG.md`

Add or update:

```markdown
## [Unreleased](https://github.com/OWNER/REPO/compare/v1.2.0...HEAD)

## [1.2.0](https://github.com/OWNER/REPO/compare/v1.1.0...v1.2.0) (2026-03-18)
```

Then paste the rewritten release notes below the `1.2.0` header.

Rules:

- keep `Unreleased` empty
- keep the version header linked
- make sure the first bold line can serve as the GitHub Release title

### 4. Bump the project version

Update the project's real version source if it has one:

- `package.json`
- `pyproject.toml`
- `Cargo.toml`
- another established version file

If the project is tag-only, there may be no version file to edit.

### 5. Commit the release changes

Example:

```bash
git commit -m "chore(release): prepare 1.2.0"
```

### 6. Tag that exact commit

Example:

```bash
git tag v1.2.0
git push origin main --follow-tags
```

### 7. What happens next

After the tag is pushed:

- `release.yml` runs
- it validates the configured version metadata if applicable
- it extracts the `1.2.0` section from `CHANGELOG.md`
- it creates or updates the GitHub Release
- it runs any optional publish step

---

## Tips

**Rotate changelog ownership** — the person closest to the work usually writes the best user-facing summary.

**Skip headlines when the release is small** — if a release is mostly bug fixes, go straight to the list sections.

**Do not invent details** — if a metric or precise behavior is unknown, write conservatively.

**The header matters** — the extract script depends on the version header matching the tag version exactly.
