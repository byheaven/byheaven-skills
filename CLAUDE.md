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
