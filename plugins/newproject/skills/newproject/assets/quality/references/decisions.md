# Design Decisions & Alternatives

---

## Why Ruff over flake8 + black + isort?

Ruff is a single tool that replaces flake8 (linting), black (formatting), isort
(import sorting), and 50+ flake8 plugins. It runs 10–100× faster than the
individual tools, has a single config file (`ruff.toml`), and is actively
maintained by Astral.

**Choose flake8 + black if:** you have existing configuration that migration
would disrupt, or you need plugins that Ruff doesn't support yet.

---

## Why ESLint flat config (v9 format)?

The legacy `.eslintrc.*` format is deprecated in ESLint v9+. The flat config
(`eslint.config.js`) is the current format with better composition, clearer
inheritance, and native ES module support.

All new projects should use the flat config. Only use `.eslintrc.*` for projects
locked to ESLint v8.

---

## Why Prettier with `semi: false`?

This is a stylistic choice. `semi: false` (no semicolons) is common in modern
JS/TS projects and relies on automatic semicolon insertion (ASI). It's the
prettier standard for many popular frameworks (Nuxt, Astro).

To use semicolons, change `semi: true` in `prettier.config.js`. Both work fine —
the important thing is consistency, not which style.

---

## Why lint-staged instead of running ESLint on the whole project?

Pre-commit hooks that run ESLint on the entire project slow down commits as the
codebase grows. lint-staged only runs linters on git-staged files — the files
being committed — which keeps the hook fast regardless of project size.

---

## Why check if husky is already installed before running `husky init`?

The release setup in this package may have already installed husky for the
`commit-msg` hook. Running `husky init` again would overwrite the existing
`.husky/pre-commit` file. This package checks first and appends to the existing
hook if present.

---

## Why `golangci-lint` over `go vet` alone?

`go vet` catches only a subset of issues. `golangci-lint` runs multiple linters
in parallel (`gofmt`, `goimports`, `errcheck`, `staticcheck`, etc.) and is the
standard tool for Go code quality in production teams.

---

## Why markdownlint in every project?

Markdown is ubiquitous — README, CHANGELOG, docs, PR templates. Inconsistent
heading levels, broken link references, and trailing spaces accumulate over time.
markdownlint catches these automatically with zero cognitive load on developers.

The config disables MD013 (line length) because long lines in markdown tables and
code blocks are unavoidable and flagging them creates more noise than value.
