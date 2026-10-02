# AGENTS.md

This file provides guidance to AI coding assistants (Claude Code, OpenAI Codex,
and others) when working with code in this repository.

## What This Repo Is

A monorepo of AI coding skills by Byheaven. Each skill lives under `plugins/<name>/skills/<skill-name>/`
and can be installed and used independently by any AI coding tool (Claude Code, OpenAI Codex, etc.).

For Claude Code users, skills are also bundled into **plugins** — the recommended installation method.
Installing as a plugin enables auto-updates and the ability to enable or disable individual skills in bulk.

## Plugin Structure

Every plugin must have:

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json              # Name only (mods: see below); claude.ai marketplace sync requires it
├── skills/<skill-name>/
│   ├── SKILL.md                 # Skill frontmatter: name, description, version
│   ├── agents/                  # Codex app metadata
│   │   └── openai.yaml
│   └── assets/                  # Skill assets: icons, images
│       └── favicon.png
├── README.md
└── LICENSE
```

A plugin that ships Claude Code function hooks (a mod) instead of skills has `hooks/hooks.json`
naming its hooks module in place of `skills/`. Its `plugin.json` also carries the fields Claude Code
reads from the manifest when it loads the module, `userConfig` and `types`; version and description
still live in `marketplace.json`.

No `AGENTS.md` inside individual plugins — this root file covers all of them.

## Marketplace Registration

All plugins must be registered in `.claude-plugin/marketplace.json`. Add an entry to the `plugins` array with `name`, `version`, `category`, `tags`, `keywords`, `description`, and `source` (relative path). The marketplace entry is the authoritative source for plugin metadata and release versioning.

## Authoring Conventions

- All code, comments, plans, changelogs, skill content, and plugin metadata must be in **English**
- Documentation defaults to **English**. The only standing exception is bilingual repository README documentation such as `README.md` and `README.zh-CN.md`. Any other non-English content requires an explicit user request.
- `.claude-plugin/marketplace.json` `owner` field must include both `name` and `email`
- Skills go in `skills/<skill-name>/SKILL.md`; asset/reference files go in subdirectories alongside the SKILL.md

## ⚠️ Skill Independence: Non-Negotiable Rule

**Every skill MUST be fully self-contained and runnable in isolation.**

A user may invoke any skill without ever having run any other skill first. Skills must never:

- Reference steps in another skill (for example, "see another skill's later step")
- Assume that another skill has already created files, sections, or configurations
- Delegate setup to a sibling skill

When a skill needs something (e.g., a `AGENTS.md` with a `## Contributor Conventions` section), it must handle all cases itself:

1. **File missing** → create the minimal file from scratch
2. **File exists, section missing** → append the section
3. **Section exists** → add only the specific line (if not already present)

Before authoring or modifying a skill, ask: *"Can I run this skill on a brand-new project without touching any other skill?"* If the answer is no, fix it.

---

## Skill Authoring: User Input

**Always use the `AskUserQuestion` tool explicitly** when a skill needs input from the user. Never write vague prose like "ask the user for X" — Claude will skip the tool and ask inline in text instead.

Do this:

```
Use the AskUserQuestion tool: "What is the project name?"
```

Not this:

```
Ask the user for the project name.
```

## Versioning

Each plugin is versioned independently through manually curated releases.
The authoritative version lives in that plugin's entry inside `.claude-plugin/marketplace.json`.

- Each plugin has its own changelog at `plugins/<name>/CHANGELOG.md`
- Tags follow the pattern `<plugin-name>-<version>` (e.g. `newproject-0.2.1`)
- New plugins start at `0.1.0` by default

When adding a new plugin, also:

1. Add the plugin entry to `.claude-plugin/marketplace.json` with `version` set to `0.1.0`, plus `category`, `tags`, and `keywords`
2. Create `plugins/<name>/CHANGELOG.md` with a linked `## [Unreleased](compare-url)` header

## Contributor Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions, PR guidelines, and the release workflow.
Use [docs/changelog-style-guide.md](docs/changelog-style-guide.md) when rewriting changelog sections.
Every change merged to `main` must update the relevant plugin `CHANGELOG.md` under `## [Unreleased]`.

When the user says "release", "ship", or "发版":
follow the Release Workflow section in CONTRIBUTING.md.
