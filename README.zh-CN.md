# Byheaven Skills

> 一组面向代码与高效工作的 Agent skills，帮助你更快完成初始化、自动化重复任务，并以更少的阻力推进真正的工作。

[English README](README.md)

这个仓库收集的是可以直接投入使用的实用型 Agent 工作流：项目初始化、内容发布，以及能减少重复劳动、帮助更快交付的可复用自动化能力。

这些插件不依赖特定的 harness 或模型，Claude Code、Codex、Pi 和 Grok Bot 都能使用；只有 `cache-timer` 是 Claude Code 专属扩展。

## Skills

- **manager** — 项目交付角色：接收方向负责方交来的已锁定、已授权 Intent，交付并通过子代理独立验证。同时附带：
  - **grilling** — 一轮轮追问，压力测试计划或想法直到收敛
  - **writing-for-agents** — 如何编写供 Agent 遵循的 skill、规则与指令
  - **experience-design** — 设计用户的体验：从任务与旅程，到界面及其文字
  - **content-creator** — 文案、文章与文档的写作简报与起草方法；你留给自己写的内容（你本人的帖子、文章、书）由你来写：只做辅助，不代写
  - **code-production** — 单个有界改动的代码编写与检查方法
  - **diagnosing-bugs** — 为难查的 bug 建立反馈回路，并对已到达用户或生产环境的 bug 分类
  - **roundtable** — 向多个模型家族提出同一问题并对比回答（仅由你手动调用）
  - **principles** — 人机协作原则 P1–P3 与操作基线
- **cache-timer**（仅限 Claude Code）— Claude Code Mod：在输入框上方的横条中倒计时提示缓存，显示 Claude Code 自带的空闲压缩，并可在横条中设置它的开关和阈值
- **newproject** — 完整项目初始化：脚手架、CI、代码规范、发布自动化、GitHub 仓库配置、依赖管理与安全扫描

## 安装方式

### Claude Code

以插件方式安装可获得自动更新。先添加 marketplace，再安装需要的插件：

```text
/plugin marketplace add byheaven/byheaven-skills
/plugin install manager@byheaven-skills
```

### Codex

Codex 读取同一个 marketplace：

```bash
codex plugin marketplace add https://github.com/byheaven/byheaven-skills.git
codex plugin add manager@byheaven-skills
```

其他 skill 用下方的 `npx skills add` 安装。

### Pi

把本仓库作为 Pi 包安装。它会加载 `manager` 的 skill，以及一个扩展：每次运行都重新读取 `~/.agents/AGENTS.md`（存在时）并应用到这次运行：

```bash
pi install git:github.com/byheaven/byheaven-skills
```

`pi update` 会把它更新到最新的 `main`。把 `~/.agents/AGENTS.md` 指向你其他 agent 读取的同一份全局规则文件，Pi 就会遵循同样的规则。

### Grok Bot

Grok Bot 没有插件安装器或 hook。让 bot 在对话开始时从本仓库的检出中加载所需的 skill；Manager 角色见 [manager README](plugins/manager/README.md#host-mechanisms)。

### 其他能加载 skill 的工具

```bash
npx skills add byheaven/byheaven-skills
```

## 参与贡献

新增 skill、提交规范与 PR 流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

MIT License
