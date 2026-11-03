import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Shared by the Pi extension `.pi-plugin/task-lifecycle.ts`. Claude Code loads no
// hook from this plugin; it takes the role through its `agent` setting.
const root = fileURLToPath(new URL('../', import.meta.url));
const checksPath = resolve(root, 'skills/task-owner/references/action-checks.md');
const rolePath = resolve(root, 'agents/task-owner.md');
const sections = Object.fromEntries(
  readFileSync(checksPath, 'utf8').split(/^## /m).slice(1).map((section) => {
    const newline = section.indexOf('\n');
    return [section.slice(0, newline), section.slice(newline).trim()];
  }),
);

export function actionKeys(toolName, input = {}) {
  const name = String(input.name ?? toolName).split('__').at(-1);
  const command = typeof input.command === 'string' ? input.command : input.cmd;
  const commands = typeof command === 'string' ? command.split(/&&|\|\||[;\n|]/).map((part) => part.trim()) : [];
  const keys = new Set();
  if (/^(create_pull_request|update_pull_request)$/.test(name)) keys.add('Publish');
  if (name === 'merge_pull_request') keys.add('Merge');
  if (/^(Agent|Task|spawn_agent|SendMessage|Workflow|delegate_task|t3_thread_launch)$/.test(name)) keys.add('Dispatch');
  for (const part of commands) {
    if (/^git(?:\s+-C\s+(?:"[^"]*"|'[^']*'|\S+))*\s+push(?:\s|$)/.test(part)
      || /^gh\s+pr\s+(?:create|edit)(?:\s|$)/.test(part)) keys.add('Publish');
    if (/^gh\s+pr\s+merge(?:\s|$)/.test(part)
      || /^gh\s+api\b.*\/pulls\/[^/\s]+\/merge\b/.test(part)) keys.add('Merge');
    if (/^claude\b.*(?:\s-p\b|\s--print\b|\s--bg\b|\s--background\b)/.test(part)
      || /^codex\s+exec(?:\s|$)/.test(part)
      || /^pi\b.*(?:\s-p\b|\s--print\b)/.test(part)) keys.add('Dispatch');
  }
  return [...keys];
}

export function reminder(keys) {
  return `Read links relative to their source file.\nSource: ${checksPath}\n\n`
    + keys.map((key) => sections[key]).join('\n\n');
}

// Pi has no native role setting, so its extension adds the role to the system prompt.
export function sessionContext() {
  const role = readFileSync(rolePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  return `${reminder(['Session'])}\n\nRole source: ${rolePath}\n${role}`;
}
