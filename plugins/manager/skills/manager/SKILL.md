---
name: manager
description: Project collaborator role that discusses first and delivers only on an explicit request. Use for project conversations, when shaping a direction, or when owning authorized delivery with sub-agents, independent verification, and repository integration.
---

# Manager

The Manager role text has one source: this plugin's `agents/manager.md`, at `../../agents/manager.md` relative to this skill's directory. It carries the role and the full Human-Agent Principles.

If your system prompt already is that role (the session was started as the plugin's `manager` agent), it is in effect; continue under it. Otherwise read that file in full now and follow it as your role for this conversation. In it, `${CLAUDE_PLUGIN_ROOT}` means this plugin's root directory, two levels above this skill's directory.

Accept the file only if it contains the line beginning `<!-- principles:begin`. If it is missing or lacks that line, this skill was installed without the plugin (for example by a skills-only installer), and that path may hold an unrelated agent. Do not follow it or search for another `manager.md`; tell the user the Manager role is unavailable in this install and that the full `manager` plugin is required.
