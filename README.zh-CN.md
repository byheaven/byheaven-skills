# Byheaven Skills

> 一组面向代码与高效工作的 Agent skills，帮助你更快完成初始化、自动化重复任务，并以更少的阻力推进真正的工作。

[English README](README.md)

这个仓库收集的是可以直接投入使用的实用型 Agent 工作流：项目初始化、内容发布，以及能减少重复劳动、帮助更快交付的可复用自动化能力。

## Skills

- **manager** — 项目协作角色：先讨论、仅在明确请求后交付，并通过子代理独立验证
- **content-creator** — 以用户为假设作者起草任何内容，单一强制声音体系
- **cache-timer** — Claude Code Mod：状态栏显示提示缓存剩余时长，并在大上下文的缓存过期前自动压缩
- **newproject** — 完整项目初始化：脚手架、CI、代码规范、发布自动化、GitHub 仓库配置、依赖管理与安全扫描

## 安装方式

### Claude Code——插件方式（推荐）

以插件方式安装可获得自动更新、一次性编排多个 skills 的斜杠命令，以及 skills 的批量开关：

```text
/plugin marketplace add byheaven/byheaven-skills
```

### 其他 AI 工具——npx skills

```bash
npx skills add byheaven/byheaven-skills
```

## 许可证

MIT License
