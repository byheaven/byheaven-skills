# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A monorepo of Claude Code plugins by Byheaven. Each plugin lives under `plugins/<name>/` and is self-contained.

## Plugin Structure

Every plugin must have:

```
plugins/<name>/
├── .claude-plugin/plugin.json   # Plugin manifest (name, version, description, author with email)
├── skills/<skill-name>/
│   └── SKILL.md                 # Skill frontmatter: name, description, version
├── README.md
└── LICENSE
```

Optional (only when the plugin exposes slash commands):

```
├── commands/<command-name>.md   # Command frontmatter: name, description
```

No `CLAUDE.md` inside individual plugins — this root file covers all of them.

## Marketplace Registration

All plugins must be registered in `.claude-plugin/marketplace.json`. Add an entry to the `plugins` array with `name`, `version`, `description`, and `source` (relative path).

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

When a skill needs something (e.g., a `CLAUDE.md` with a `## Contributor Conventions` section), it must handle all cases itself:

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

The repo has a single version (`"."` in `.release-please-manifest.json`) that covers
the entire monorepo. release-please automatically updates both `package.json` and
`.claude-plugin/marketplace.json` (via `extra-files` in `release-please-config.json`).

Individual plugin versions in each `plugin.json` are **not** updated automatically —
keep them in sync manually when a plugin has a meaningful change.

## Contributor Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions, PR guidelines, and the release workflow.
Use [docs/changelog-style-guide.md](docs/changelog-style-guide.md) when rewriting changelog sections.

When the user says "release", "ship", "发版", or "merge the release PR":
follow the Release Workflow section in CONTRIBUTING.md.
