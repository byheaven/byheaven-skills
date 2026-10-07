# Byheaven Skills

> A collection of agent skills for code and productive work, built to help you set up faster, automate repetitive tasks, and get real work done with less friction.

English | [中文 README](README.zh-CN.md)

This repository packages practical agent workflows you can actually use: project
setup, publishing flows, and repeatable automation that removes busywork and
helps you ship faster.

## Skills

- **manager** — Project collaborator role: discuss first, deliver on explicit request, verify independently with sub-agents
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
