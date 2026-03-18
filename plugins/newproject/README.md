# newproject

A Claude Code plugin that sets up production-ready projects end-to-end: scaffolding,
CI pipelines, code quality, release automation, GitHub repository configuration,
dependency management, and security scanning.

## What It Does

The `newproject` skill orchestrates 7 specialized skills to configure everything
a production project needs, in the correct dependency order.

```
project-scaffold       README, LICENSE, .gitignore, .editorconfig
    │
    ├── code-quality      ESLint/Prettier/Ruff + pre-commit hooks
    │
    ├── release-workflow  conventional commits + release-please + changelogs
    │
    ├── ci-pipeline       GitHub Actions CI with test, lint, build
    │       │
    │       └── security-scanning   CodeQL + dependency vulnerability review
    │
    ├── github-repo-setup PR template + issue forms + CODEOWNERS + branch protection
    │
    └── dependency-management   Dependabot grouped updates + auto-merge
```

Each skill also works **independently** — run them standalone when you only need
one piece.

## Installation

```bash
npx skills add byheaven/byheaven-skills
```

## Usage

### Full project setup

Just ask Claude:

```
Set up my new project
/newproject
```

Claude will detect your project type, show what's already configured, present a
checklist, and run the selected skills in order.

### Run a single skill

Just ask Claude naturally:

```
Set up CI for this project
Add Dependabot to this repo
Set up CodeQL security scanning
Configure ESLint and Prettier
```

## Skills

| Skill | Purpose | Project types |
|-------|---------|--------------|
| `project-scaffold` | README, LICENSE, .gitignore, .editorconfig, directory structure | All |
| `release-workflow` | release-please, conventional commits, AI changelog editing | All |
| `ci-pipeline` | GitHub Actions CI: test, lint, build, matrix strategies, caching | All |
| `code-quality` | ESLint+Prettier, Ruff, gofmt, rustfmt, pre-commit hooks, markdownlint | Node/Web/Python/Go/Rust |
| `github-repo-setup` | PR template, issue YAML forms, CODEOWNERS, branch protection via gh | All |
| `dependency-management` | Dependabot grouped updates + auto-merge workflow | Node/Python/Go/Rust |
| `security-scanning` | CodeQL, dependency vulnerability review, secret scanning guidance | All |

## Supported Project Types

- **Web** (Next.js, Nuxt, Astro, Remix, SvelteKit, etc.)
- **Node.js** (libraries, APIs, CLIs)
- **Python** (applications, libraries, data science)
- **Go** (services, CLIs, libraries)
- **Rust** (systems, CLIs, WebAssembly)
- **Generic** (any other language)

## License

MIT
