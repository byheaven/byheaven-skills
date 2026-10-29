/**
 * Pi adapter for the manager plugin: loads the user's cross-agent rules file.
 *
 * Claude Code and Codex read the user's global rules from their own config
 * directories, and those rules route a task-owning session to the
 * `task-owner` skill. Pi reads user rules from its agent directory, which some
 * Pi hosts create fresh for every run. This extension reads
 * `~/.agents/AGENTS.md` at the start of every run, so the current text applies
 * without a copy or a restart. A missing or unreadable file adds nothing.
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const RULES_FILE = join(homedir(), ".agents", "AGENTS.md");
const SECTION = "user_cross_agent_rules";

export default function userRules(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		let text: string;
		try {
			text = (await readFile(RULES_FILE, "utf8")).trim();
		} catch {
			delete event.systemPromptOptions.sections[SECTION];
			return;
		}
		if (!text) {
			delete event.systemPromptOptions.sections[SECTION];
			return;
		}
		event.systemPromptOptions.sections[SECTION] =
			`# User rules (${RULES_FILE})\n\n${text}`;
	});
}
