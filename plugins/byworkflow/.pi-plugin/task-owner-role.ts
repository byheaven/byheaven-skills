/**
 * Pi adapter for the manager plugin: loads the task-owner role.
 *
 * Pi has no native role setting, so at the start of every run this extension
 * reads the `task-owner` skill, strips its frontmatter and sets the body as
 * one system-prompt section. It adds no reminder and no completion check.
 */

import { readFile } from "node:fs/promises";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const ROLE_FILE = new URL("../skills/task-owner/SKILL.md", import.meta.url);
const SECTION = "task_owner_role";

export default function taskOwnerRole(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		const role = await readFile(ROLE_FILE, "utf8");
		event.systemPromptOptions.sections[SECTION] = role.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
	});
}
