# Byheaven Skills

> A collection of Agent skills — works with Claude Code, OpenAI Codex, and other AI tools

English | [中文 README](README.zh-CN.md)

## Skills

- **xhs-publisher** — Xiaohongshu (RedNote) auto publisher (browser automation)
- **newproject** — Full project setup: scaffolding, CI, linting, release automation, GitHub repo config, dependency management, and security scanning

## Installation

### Claude Code — plugin (recommended)

Installing as a plugin gives you auto-updates, slash commands that orchestrate multiple skills
at once (e.g. `/newproject`), and batch enable/disable of skills:

```text
/plugin marketplace add byheaven/byheaven-skills
/plugin install newproject
```

### Other AI tools — npx skills

```bash
npx skills add byheaven/byheaven-skills
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding skills, commit conventions, and PR process.

## License

MIT License
