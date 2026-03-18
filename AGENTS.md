# AGENTS.md

This file provides guidance to AI coding assistants (Claude Code, OpenAI Codex,
and others) when working with code in this repository.

## What This Repo Is

A monorepo of AI coding skills by Byheaven. Each skill lives under `plugins/<name>/skills/<skill-name>/`
and can be installed and used independently by any AI coding tool (Claude Code, OpenAI Codex, etc.).

For Claude Code users, skills are also bundled into **plugins** — the recommended installation method.
Installing as a plugin enables auto-updates, slash commands that orchestrate multiple skills at once
(e.g. `/newproject`), and the ability to enable or disable individual skills in bulk.

## Plugin Structure

Every plugin must have:

```
plugins/<name>/
├── .claude-plugin/plugin.json   # Plugin manifest (name, version, description, author with email)
├── skills/<skill-name>/
│   ├── SKILL.md                 # Skill frontmatter: name, description, version
│   ├── agents/                  # Codex app metadata
│   │   └── openai.yaml
│   └── assets/                  # Skill assets: icons, images
│       └── favicon.png
├── README.md
└── LICENSE
```

Optional (only when the plugin exposes slash commands):

```
├── commands/<command-name>.md   # Command frontmatter: name, description
```

No `AGENTS.md` inside individual plugins — this root file covers all of them.

## Marketplace Registration

All plugins must be registered in `.claude-plugin/marketplace.json`. Add an entry to the `plugins` array with `name`, `description`, and `source` (relative path). Do **not** include a `version` field — the authoritative version lives in each plugin's own `.claude-plugin/plugin.json`.

## Authoring Conventions

- All content (code, comments, docs) must be in **English**
- `plugin.json` `author` field must include both `name` and `email`
- Skills go in `skills/<skill-name>/SKILL.md`; asset/reference files go in subdirectories alongside the SKILL.md
- Commands are optional — only add them when the plugin needs user-invocable slash commands with parameters

## ⚠️ Skill Independence: Non-Negotiable Rule

**Every skill MUST be fully self-contained and runnable in isolation.**

A user may invoke any skill without ever having run any other skill first. Skills must never:

- Reference steps in another skill (e.g., "see project-scaffold Step 9")
- Assume that another skill has already created files, sections, or configurations
- Delegate setup to a sibling skill

When a skill needs something (e.g., a `AGENTS.md` with a `## Contributor Conventions` section), it must handle all cases itself:

1. **File missing** → create the minimal file from scratch
2. **File exists, section missing** → append the section
3. **Section exists** → add only the specific line (if not already present)

Before authoring or modifying a skill, ask: *"Can I run this skill on a brand-new project without touching any other skill?"* If the answer is no, fix it.

---

## Skill & Command Authoring: User Input

**Always use the `AskUserQuestion` tool explicitly** when a skill or command needs input from the user. Never write vague prose like "ask the user for X" — Claude will skip the tool and ask inline in text instead.

Do this:

```
Use the AskUserQuestion tool: "What is the project name?"
```

Not this:

```
Ask the user for the project name.
```

For commands, declare `AskUserQuestion` in the `allowed-tools` frontmatter field so Claude knows it is available.

## Versioning

Each plugin is versioned independently using [release-please](https://github.com/googleapis/release-please).
The authoritative version lives in each plugin's `.claude-plugin/plugin.json`.

- Conventional commits scoped to a plugin name (e.g. `feat(newproject): ...`) trigger that plugin's version bump
- Each plugin has its own changelog at `plugins/<name>/CHANGELOG.md`
- Tags follow the pattern `<plugin-name>-<version>` (e.g. `newproject-0.2.1`)
- New plugins start at `0.1.0` by default

When adding a new plugin, also:

1. Create `plugins/<name>/version.txt` containing `0.1.0` (required by release-please)
2. Add a package entry to `release-please-config.json`
3. Add `"plugins/<name>": "0.1.0"` to `.release-please-manifest.json`

## Contributor Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions, PR guidelines, and the release workflow.
Use [docs/changelog-style-guide.md](docs/changelog-style-guide.md) when rewriting changelog sections.

When the user says "release", "ship", "发版", or "merge the release PR":
follow the Release Workflow section in CONTRIBUTING.md.
