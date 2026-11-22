/**
 * Pi adapter for the manager plugin: loads the session's role.
 *
 * Pi has no native role setting, so at the start of every run this extension
 * reads a role skill, strips its frontmatter and sets the body as one
 * system-prompt section. The role is `task-owner` unless the working
 * directory's `.claude/settings.json` names another of this plugin's session
 * roles in its `agent` field: the same project setting that selects the role
 * in Claude Code, so one declaration serves both hosts. It adds no reminder
 * and no completion check.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const DEFAULT_ROLE = "task-owner";
/** Session roles this plugin ships, each with the prompt section it fills. */
const SECTIONS: Record<string, string> = { "task-owner": "task_owner_role", manager: "manager_role" };

/** The role the project at `cwd` names, else the default; an unreadable setting falls back to the default. */
export async function projectRole(cwd: string | undefined): Promise<string> {
	if (!cwd) return DEFAULT_ROLE;
	try {
		const agent = JSON.parse(await readFile(join(cwd, ".claude", "settings.json"), "utf8"))?.agent;
		return typeof agent === "string" && Object.hasOwn(SECTIONS, agent) ? agent : DEFAULT_ROLE;
	} catch {
		return DEFAULT_ROLE;
	}
}

export default function sessionRole(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		const options = event.systemPromptOptions;
		const role = await projectRole(options.cwd);
		const body = await readFile(new URL(`../skills/${role}/SKILL.md`, import.meta.url), "utf8");
		for (const section of Object.values(SECTIONS)) delete options.sections[section];
		options.sections[SECTIONS[role]] = body.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
	});
}
