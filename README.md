# Byheaven Skills

> A collection of agent skills for code and productive work, built to help you set up faster, automate repetitive tasks, and get real work done with less friction.

English | [中文 README](README.zh-CN.md)

This repository packages practical agent workflows you can actually use: project
setup, publishing flows, and repeatable automation that removes busywork and
helps you ship faster.

The plugins do not depend on a particular harness or model. Claude Code, Codex,
and Grok Bot all run them; `cache-timer` is the one Claude Code-only extension.

## Skills

- **manager** — Project delivery role: take a locked, authorized Intent from the direction owner, deliver, verify independently with sub-agents. Also bundles:
  - **grilling** — Question rounds that stress-test a plan or idea until it converges
  - **writing-for-agents** — How to write skills, rules, and directives that agents follow
  - **experience-design** — Design what a person experiences, from the job and journey down to screens and their words
  - **content-creator** — Writing brief and drafting method for copy, articles, and documents. Writing you reserve for yourself (your own posts, articles, books) is yours to write: it assists, and drafts none of it
  - **code-production** — Code editing and checking method for one bounded change
  - **diagnosing-bugs** — Build a feedback loop for a hard bug, and classify bugs that reached users or production
  - **roundtable** — Ask several model families the same question and compare their answers (invoked by you only)
  - **principles** — Human-Agent Principles P1–P3 and the operational baseline
- **cache-timer** (Claude Code only) — Claude Code mod: prompt-cache countdown in a band above the prompt, with Claude Code's own idle compaction shown and its switch and threshold set from the band
- **newproject** — Self-contained full project setup: scaffolding, CI, linting, release automation, GitHub repo config, dependency management, and security scanning

## Installation

### Claude Code

Installing as a plugin gives you auto-updates. Add the marketplace, then install
the plugins you want:

```text
/plugin marketplace add byheaven/byheaven-skills
/plugin install manager@byheaven-skills
```

### Codex

Codex reads the same marketplace:

```bash
codex plugin marketplace add https://github.com/byheaven/byheaven-skills.git
codex plugin add manager@byheaven-skills
```

Install the other skills with `npx skills add` below.

### Grok Bot

Grok Bot has no plugin installer or hook. Have the bot load the skill it needs
at the start of its conversation, from a checkout of this repository. For the
Manager role, see the [manager README](plugins/manager/README.md#host-mechanisms).

### Other tools that load skills

```bash
npx skills add byheaven/byheaven-skills
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding skills, commit conventions, and PR process.

## License

MIT License
