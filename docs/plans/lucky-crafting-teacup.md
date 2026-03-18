# Add Codex Metadata (agents/openai.yaml) to All Skills

## Context

Codex (OpenAI's CLI) supports an optional `agents/openai.yaml` metadata file for skills, enabling UI metadata (display name, description, icons, brand color), invocation policy, and tool dependencies. This change adds the metadata file to all 8 skills across 2 plugins, making them compatible with the Codex app.

## Logo Strategy

- Copy `favicon.jpg` from iCloud (`~/Library/Mobile Documents/com~apple~CloudDocs/Pics/favicon.jpg`) to:
  1. **Root**: `assets/favicon.jpg` (single source of truth)
  2. **Each skill**: `plugins/<plugin>/skills/<skill>/agents/favicon.jpg` (local copy for Codex runtime)
- Each `openai.yaml` references `./favicon.jpg` (co-located copy)
- Future convention: when creating new skills, always copy favicon.jpg into `agents/`

## Files to Create

### Root asset (1 file)

- `assets/favicon.jpg` — copied from iCloud

### Per-skill files (8 skills × 2 files = 16 files)

Each skill gets an `agents/` directory with `openai.yaml` and `favicon.jpg`.

#### Plugin: xhs-publisher

| Skill | display_name | short_description |
|-------|-------------|-------------------|
| xhs-publisher | XHS Publisher | Automates Xiaohongshu (Little Red Book) content publishing with step-by-step Creator Platform workflows |

- `plugins/xhs-publisher/skills/xhs-publisher/agents/openai.yaml`
- `plugins/xhs-publisher/skills/xhs-publisher/agents/favicon.jpg`

#### Plugin: newproject

| Skill | display_name | short_description |
|-------|-------------|-------------------|
| project-scaffold | Project Scaffold | Scaffolds foundational project files: README, LICENSE, .gitignore, .editorconfig, and directory structure |
| ci-pipeline | CI Pipeline | Sets up GitHub Actions CI pipelines for any project type |
| code-quality | Code Quality | Configures linters, formatters, and pre-commit hooks for consistent code quality |
| dependency-management | Dependency Management | Sets up Dependabot with grouped update strategies and auto-merge workflows |
| security-scanning | Security Scanning | Configures CodeQL static analysis, dependency vulnerability review, and secret scanning |
| github-repo-setup | GitHub Repo Setup | Configures GitHub repository settings: PR templates, issue templates, CODEOWNERS, and branch protection |
| release-workflow | Release Workflow | Sets up automated GitHub releases with conventional commits, release-please, and changelog generation |

Files per skill:

- `plugins/newproject/skills/<skill>/agents/openai.yaml`
- `plugins/newproject/skills/<skill>/agents/favicon.jpg`

## YAML Template

All 8 `openai.yaml` files follow this template (only `display_name` and `short_description` differ):

```yaml
interface:
  display_name: "<see table above>"
  short_description: "<see table above>"
  icon_small: "./favicon.jpg"
  icon_large: "./favicon.jpg"
  brand_color: "#3B82F6"

policy:
  allow_implicit_invocation: false
```

- No `default_prompt` (skills have their own SKILL.md instructions)
- No `dependencies.tools` (no MCP dependencies needed)
- `brand_color: "#3B82F6"` (Tailwind blue-500, shared across all skills)

## Files to Modify

### CLAUDE.md — update plugin structure docs

Add `agents/openai.yaml` to the documented plugin structure:

```
plugins/<name>/
├── .claude-plugin/plugin.json
├── skills/<skill-name>/
│   ├── SKILL.md
│   └── agents/                    # Codex app metadata (optional)
│       ├── openai.yaml
│       └── favicon.jpg
├── README.md
└── LICENSE
```

## Implementation Order

1. Create `assets/` directory at repo root, copy favicon.jpg there
2. For each of the 8 skills: create `agents/` directory, copy favicon.jpg, write openai.yaml
3. Update CLAUDE.md plugin structure documentation

## Verification

- Confirm all 8 `agents/openai.yaml` files exist with valid YAML
- Confirm all 8 `agents/favicon.jpg` files exist and match the root copy
- Confirm `assets/favicon.jpg` exists at repo root
- Confirm CLAUDE.md is updated with the new structure
