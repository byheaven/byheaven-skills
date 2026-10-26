# AGENTS.md

This file guides every AI coding agent that works in this repository, whatever its harness or model.
Claude Code reads it through the `CLAUDE.md` symlink; Codex and Grok Bot read it as `AGENTS.md`.

## What This Repo Is

A monorepo of agent plugins by Byheaven. Each skill lives under `plugins/<name>/skills/<skill-name>/`
and can be installed and used on its own in any host that loads skills.

Claude Code, Codex, and Grok Bot are the supported hosts: all three use these plugins and change this
repository. Hosts with a plugin system install the plugins from this repository's marketplace; the
README gives each host's entry point.

## Harness and Model Independence

Every plugin behaves the same on every supported host and with any model. Three layers keep it that way:

- **Shared**: skill bodies, references, templates, and agent role text. State the intent and name
  what you need as a capability (the host's user-question tool, an isolated worktree, a sub-agent, a
  scheduled wake), never as a host, a host tool, a host variable, a model, a model CLI, or one
  person's preferences; the agent picks its host's native mechanism. Link files by paths relative to
  the file that links them.
- **Adapter**: each host's packaging, which carries no behavior text: `.claude-plugin/`,
  `.codex-plugin/`, `agents/openai.yaml`, `hooks/` (manifests and the loader scripts they run), the
  frontmatter of agent role files (hosts that register agents read it; the body is shared), and the
  install sections of READMEs. Give every host the same behavior: a skill that only the user may
  invoke says so in each host's metadata. Support a new host by adding its packaging files; a
  host-specific fix changes only that host's packaging.
- **Deployment**: the bots, agent ids, machines, accounts, private paths, model CLIs, and host
  bindings (which mechanism meets each capability on one host) one user runs, plus that user's
  personal preferences. None of it lives in this repository; shared text refers to the deployment's
  own binding instead.

A **host extension** is a plugin whose purpose is one host's own API, such as `cache-timer` (Claude
Code function hooks). Its marketplace description and README name that host, and all its files are
adapter layer.

`npm run check:portability`, which CI runs, is a lint: it fails when a shared file names a host, host
tool, or model, or when any plugin file carries deployment data such as an agent id, a private path,
an email address, or a notes-vault link. It catches known patterns only; the reviewer judges coupling
in meaning. Its `ADAPTER` list names the skill and agent files allowed to name hosts; extend it only
for a new packaging file there. When a legitimate shared line trips it, rephrase the line.

The Human-Agent Principles P1–P3 in
`plugins/manager/skills/principles/SKILL.md` mirror the owner's global rules file
(`AI/AGENTS-global.md` in the byheaven vault), which is their source of truth: change them there
first, then mirror them here.

## Plugin Structure

Every plugin must have:

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json              # Name and description (mods: see below); claude.ai marketplace sync requires it
├── skills/<skill-name>/
│   ├── SKILL.md                 # Skill frontmatter: name, description (no version; see below)
│   ├── agents/                  # Optional: Codex app metadata (display name, icon)
│   │   └── openai.yaml
│   └── assets/                  # Optional: skill icons and images
│       └── favicon.png
├── README.md
└── LICENSE
```

A plugin that ships Claude Code function hooks (a mod) instead of skills has `hooks/hooks.json`
naming its hooks module in place of `skills/`. Its `plugin.json` also carries `userConfig` when the
mod has settings, and no other field.

`plugin.json` repeats the marketplace entry's `description` word for word: Claude Code's plugin page
reads it there for a plugin installed from the marketplace on this machine. Change both together.
Version and category live only in `marketplace.json`.

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

When a skill needs input from the user, write the question as its own step with its exact text, and
say how to ask it in capability terms: the route the host's own instructions name for questions to
the user, otherwise the host's user-question tool, otherwise plain text. A vague line such as "ask the
user for X" gets answered with a guess instead of asked.

Do this:

```
Ask through the host's user-question tool: "What is the project name?"
```

Not this:

```
Ask the user for the project name.
```

## Versioning

Each plugin is versioned independently; the pull request that changes a plugin releases it.
The authoritative version lives in that plugin's entry inside `.claude-plugin/marketplace.json`.

- Each plugin has its own changelog at `plugins/<name>/CHANGELOG.md`
- Tags follow the pattern `<plugin-name>-<version>` (e.g. `newproject-0.2.1`)
- New plugins start at `0.1.0` by default

When adding a new plugin, also:

1. Add the plugin entry to `.claude-plugin/marketplace.json` with `version` set to `0.1.0`, plus `category`, `tags`, and `keywords`
2. Create `plugins/<name>/CHANGELOG.md` with a linked `## [Unreleased](compare-url)` header and a `## [0.1.0]` section; merging the PR publishes `<name>-0.1.0`

## Contributor Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions, PR guidelines, and the release workflow.
Use [docs/changelog-style-guide.md](docs/changelog-style-guide.md) when rewriting changelog sections.
Every change merged to `main` must update the relevant plugin `CHANGELOG.md`: under a new version section when the PR releases the plugin, otherwise under `## [Unreleased]`.

When the user says "release", "ship", or "发版":
follow the Release Workflow section in CONTRIBUTING.md.
