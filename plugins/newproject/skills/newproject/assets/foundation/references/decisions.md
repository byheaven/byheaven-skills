# Design Decisions & Alternatives

---

## Why .editorconfig instead of per-tool formatting config?

`.editorconfig` is the only formatting config that works universally across editors
without plugins (VS Code, JetBrains, Vim, Emacs all support it natively). It handles
the baseline: indentation, line endings, and trailing whitespace.

Per-tool configs (Prettier, gofmt, rustfmt) layer on top of .editorconfig for
language-specific concerns. The foundation step adds `.editorconfig`; the quality
step adds the language-specific tools.

---

## Why MIT as the default license?

MIT is the most permissive common open-source license: short, readable, and widely
understood. It imposes minimal obligations on users.

For projects that need copyleft protections, GPL-3.0 is the alternative. For
corporate contributors who want patent protection, Apache-2.0 is preferred.

The skill defaults to MIT and asks — rather than assuming — for other choices.

---

## Why create these specific directories?

`src/`, `tests/`, `docs/`, `scripts/` are the conventional minimum that signals
a well-organized project to contributors. They're not enforced by any tool —
they're a social convention that makes navigation predictable.

The skill only creates empty directories for languages where the convention is
strong. Go, for example, gets `cmd/`, `internal/`, and `pkg/` because those
are near-universal in the Go ecosystem.

---

## Why check for existing files before creating?

Overwriting an existing README or .gitignore would destroy user work. The skill
always inventories first and only creates what's missing. For .gitignore
specifically, it may append missing sections rather than replacing the file.

---

## Why a minimal CONTRIBUTING.md template?

A minimal template sets the right expectations without being prescriptive.
Teams with complex contribution workflows will customize it anyway — a 200-line
CONTRIBUTING.md template would just create noise to delete.

The template intentionally points to conventional commits and a simple PR flow.
It assumes the project will use the release setup in this package for versioning.

---

## Why initialize with `main` as the default branch?

`main` has been the GitHub default since 2020. Starting with `main` avoids
a rename operation later and aligns with current GitHub conventions.

If the project already exists and uses `master`, skip `git init` entirely —
renaming an active branch is out of scope for this skill.
