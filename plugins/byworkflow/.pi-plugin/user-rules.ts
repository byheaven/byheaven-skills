/**
 * Pi adapter for the manager plugin: loads the user's cross-agent rules file.
 *
 * It exists for a Pi host whose agent directory does not carry the user's
 * global rules, for example one that creates that directory fresh for every
 * run. At the start of every run it reads `~/.agents/AGENTS.md`, so the
 * current text applies without a copy or a restart. On a host whose prompt
 * already carries that text (an appended system prompt or a context file),
 * its dedupe makes it a no-op; a missing or unreadable file adds nothing.
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
