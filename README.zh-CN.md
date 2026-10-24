# Byheaven Skills

> 一组面向代码与高效工作的 Agent skills，帮助你更快完成初始化、自动化重复任务，并以更少的阻力推进真正的工作。

[English README](README.md)

这个仓库收集的是可以直接投入使用的实用型 Agent 工作流：项目初始化、内容发布，以及能减少重复劳动、帮助更快交付的可复用自动化能力。

## Skills

- **manager** — 项目交付角色：接收方向负责方交来的已锁定、已授权 Intent，交付并通过子代理独立验证。同时附带：
  - **grilling** — 一轮轮追问，压力测试计划或想法直到收敛
  - **writing-for-agents** — 如何编写供 Agent 遵循的 skill、规则与指令
  - **experience-design** — 设计用户的体验：从任务与旅程，到界面及其文字
  - **content-creator** — 文案、文章与文档的写作简报与起草方法；对你本人的帖子、文章与书籍只做辅助，不代写
  - **code-production** — 单个有界改动的代码编写与检查方法
  - **roundtable** — 向多个模型家族提出同一问题并对比回答（仅由你手动调用）
  - **principles** — 人机协作原则 P1–P3 与操作基线
- **cache-timer** — Claude Code Mod：在输入框上方的横条中倒计时提示缓存，显示 Claude Code 自带的空闲压缩，并可在横条中设置它的开关和阈值
- **newproject** — 完整项目初始化：脚手架、CI、代码规范、发布自动化、GitHub 仓库配置、依赖管理与安全扫描

## 安装方式

### Claude Code——插件方式（推荐）

以插件方式安装可在 Claude Code 中获得自动更新和打包好的使用体验：

```text
/plugin marketplace add byheaven/byheaven-skills
```

### 其他 AI 工具——npx skills

```bash
npx skills add byheaven/byheaven-skills
```

## 参与贡献

新增 skill、提交规范与 PR 流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

MIT License
