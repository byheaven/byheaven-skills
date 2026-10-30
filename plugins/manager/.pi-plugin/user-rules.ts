/**
 * Pi adapter for the manager plugin: loads the user's cross-agent rules file.
 *
 * Claude Code and Codex read the user's global rules from their own config
 * directories, and those rules route a task-owning session to the
 * `task-owner` skill. Pi reads user rules from its agent directory, which some
 * Pi hosts create fresh for every run. This extension reads
 * `~/.agents/AGENTS.md` at the start of every run, so the current text applies
 * without a copy or a restart. A missing or unreadable file adds nothing, and
 * neither does a file whose text the run's prompt already carries, for
 * example through a host's appended system prompt or a context file.
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { BuildSystemPromptOptions, ExtensionAPI } from "@earendil-works/pi-coding-agent";

const RULES_FILE = join(homedir(), ".agents", "AGENTS.md");
const SECTION = "user_cross_agent_rules";

/** Every other prompt text of this run: custom and appended prompts, context files, other sections. */
function otherPromptText(options: BuildSystemPromptOptions): string[] {
	const texts: unknown[] = [options.customPrompt, options.appendSystemPrompt];
	for (const file of options.contextFiles ?? []) texts.push(file?.content);
	for (const [name, value] of Object.entries(options.sections ?? {})) {
		if (name !== SECTION) texts.push(value);
	}
	return texts.flat().filter((t): t is string => typeof t === "string");
}

export default function userRules(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		const options = event.systemPromptOptions;
		let text: string;
		try {
			text = (await readFile(RULES_FILE, "utf8")).trim();
		} catch {
			delete options.sections[SECTION];
			return;
		}
		if (!text || otherPromptText(options).some((t) => t.includes(text))) {
			delete options.sections[SECTION];
			return;
		}
		options.sections[SECTION] = `# User rules (${RULES_FILE})\n\n${text}`;
	});
}
