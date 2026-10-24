# Byheaven Skills

> A collection of agent skills for code and productive work, built to help you set up faster, automate repetitive tasks, and get real work done with less friction.

English | [中文 README](README.zh-CN.md)

This repository packages practical agent workflows you can actually use: project
setup, publishing flows, and repeatable automation that removes busywork and
helps you ship faster.

## Skills

- **manager** — Project delivery role: take a locked, authorized Intent from the direction owner, deliver, verify independently with sub-agents. Also bundles:
  - **grilling** — Question rounds that stress-test a plan or idea until it converges
  - **writing-for-agents** — How to write skills, rules, and directives that agents follow
  - **experience-design** — Design what a person experiences, from the job and journey down to screens and their words
  - **content-creator** — Writing brief and drafting method for copy, articles, and documents
  - **code-production** — Code editing and checking method for one bounded change
  - **roundtable** — Ask several model families the same question and compare their answers (invoked by you only)
  - **principles** — Human-Agent Principles P1–P3 and the operational baseline
- **cache-timer** — Claude Code mod: prompt-cache countdown in a band above the prompt, and compaction of a large conversation just before its cache expires, switchable from the band
- **newproject** — Self-contained full project setup: scaffolding, CI, linting, release automation, GitHub repo config, dependency management, and security scanning

## Installation

### Claude Code — plugin (recommended)

Installing as a plugin gives you auto-updates and a packaged experience in
Claude Code:

```text
/plugin marketplace add byheaven/byheaven-skills
```

### Other AI tools — npx skills

```bash
npx skills add byheaven/byheaven-skills
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding skills, commit conventions, and PR process.

## License

MIT License
