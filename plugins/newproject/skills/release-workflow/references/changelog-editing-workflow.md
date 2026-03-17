# Changelog Editing Workflow

How to edit the auto-generated `CHANGELOG.md` in a Release PR before merging,
using AI to produce Linear-style release notes.

---

## When to Do This

After release-please creates or updates a Release PR, you have a window to edit
`CHANGELOG.md` before merging. This is the only place you need to edit —
the GitHub Release body will be extracted automatically from this file.

**One source of truth:** edit `CHANGELOG.md` → GitHub Release matches it automatically.

---

## Step-by-Step

### 1. Open the Release PR

Find the PR titled something like:
> `chore(main): release 1.2.0`

It was created automatically by release-please.

### 2. Find the CHANGELOG.md diff

In the PR's "Files changed" tab, locate the `CHANGELOG.md` change.
The new section will look like:

```markdown
## [1.2.0] - 2026-03-15

### Features

* feat(auth): implement OAuth2 PKCE flow with state parameter validation (#228)
* feat(api): support batch processing with configurable chunk size (#234)

### Bug Fixes

* fix(pool): memory leak after 8+ hours continuous operation (#250)
```

This is the raw auto-generated version — commit-centric, developer-focused.

### 3. Copy the raw section

Copy everything **below** the `## [1.2.0] - YYYY-MM-DD` header line.
(Don't copy the header itself — you'll paste it back unchanged.)

### 4. Use AI to rewrite it

Open Claude and use this prompt:

---

**Prompt template:**

```
I need you to rewrite a raw auto-generated changelog section into
Linear-style release notes. Follow the guidelines in this document:

[paste the full contents of docs/changelog-style-guide.md here]

---

Here is the raw changelog section to rewrite:

## [1.2.0] - 2026-03-15

[paste the raw section here]
```

---

### 5. Review the AI output

Check that:

- The 1–3 headline features are written from the user's perspective
- No commit message syntax (`feat:`, `fix:`) remains
- Internal changes (refactor, chore, ci) have been removed
- The complete changes list is still present (Improvements + Bug Fixes)
- Nothing has been invented — all items trace back to real commits

Adjust freely. The AI output is a draft, not final.

### 6. Edit the CHANGELOG.md in the PR

On GitHub, in the Files Changed tab:

1. Click the `...` menu on `CHANGELOG.md` → **Edit file**
2. Find the new version section
3. Keep the header line exactly as-is:

   ```
   ## [1.2.0] - 2026-03-15
   ```

4. Replace everything below the header (until the next `## [` line)
   with your edited content
5. Commit directly to the PR branch

### 6.5. Update the `[unreleased]` link definition

At the very bottom of `CHANGELOG.md`, update the `[unreleased]:` reference-style link
to compare from the **new** version's tag:

```markdown
<!-- Link definitions -->
[unreleased]: https://github.com/OWNER/REPO/compare/TAG_PREFIX-1.2.0...HEAD
```

The tag doesn't exist yet while you're editing — it's created on merge. This is
expected and normal. Commit this change to the same PR branch.

### 7. Merge when satisfied

Once you're happy with the changelog entry, merge the PR.

What happens next (automatically):

- release-please creates the git tag `v1.2.0`
- The tag-triggered workflow runs (`release.yml`)
- It parses `CHANGELOG.md`, extracts the `[1.2.0]` section
- Creates the GitHub Release with your edited content
- Runs the publish step (if applicable)

---

## Tips

**Rotate who writes the changelog** — the person who built the feature knows best
what it means to users. This is how Linear does it.

**Don't overthink the headlines** — 1–3 punchy sentences per headline feature.
If a release is mostly bug fixes, skip headlines entirely and go straight to the list.

**Keep the full list** — don't delete small fixes just because you elevated something
to a headline. Users with that specific bug care about it.

**The header line is sacred** — `## [1.2.0] - 2026-03-15` must be untouched.
The extract script and the release automation depend on this exact format.
