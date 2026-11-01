import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

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
  if (/^(Agent|Task|spawn_agent|SendMessage|Workflow)$/.test(name)) keys.add('Dispatch');
  for (const part of commands) {
    if (/^git(?:\s+-C\s+(?:"[^"]*"|'[^']*'|\S+))*\s+push(?:\s|$)/.test(part)
      || /^gh\s+pr\s+(?:create|edit)(?:\s|$)/.test(part)) keys.add('Publish');
    if (/^gh\s+pr\s+merge(?:\s|$)/.test(part)
      || /^gh\s+api\b.*\/pulls\/[^/\s]+\/merge\b/.test(part)) keys.add('Merge');
    if (/^claude\b.*(?:\s-p\b|\s--print\b|\s--bg\b|\s--background\b)/.test(part)
      || /^codex\s+exec(?:\s|$)/.test(part)) keys.add('Dispatch');
  }
  return [...keys];
}

export function reminder(keys) {
  return `Read links relative to their source file.\nSource: ${checksPath}\n\n`
    + keys.map((key) => sections[key]).join('\n\n');
}

export function sessionContext() {
  const role = readFileSync(rolePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  return `${reminder(['Session'])}\n\nRole source: ${rolePath}\n${role}`;
}

export function hookResult(input, active = false) {
  if (input.hook_event_name === 'Stop') {
    const owner = String(input.agent_type ?? '').split(':').at(-1) === 'task-owner';
    return owner && active && !input.stop_hook_active ? { decision: 'block', reason: reminder(['Finish']) } : {};
  }
  if (input.hook_event_name === 'UserPromptSubmit') return {};
  const keys = actionKeys(input.tool_name, input.tool_input);
  if (input.hook_event_name !== 'SessionStart' && !keys.length) return {};
  const text = input.hook_event_name === 'SessionStart' ? sessionContext() : reminder(keys);
  return { hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: text } };
}

export function runHook(input, directory) {
  if (!input.session_id) return hookResult(input);
  if (input.hook_event_name === 'PreToolUse' && !actionKeys(input.tool_name, input.tool_input).length) return hookResult(input);
  try {
    mkdirSync(directory, { recursive: true });
    const key = createHash('sha256').update(input.session_id).digest('hex');
    const path = join(directory, `${key}.json`);
    const previous = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
    const agentType = input.hook_event_name === 'SessionStart' ? input.agent_type : input.agent_type ?? previous.agent_type;
    const state = { agent_type: agentType, active: previous.active ?? false };
    if (input.hook_event_name === 'UserPromptSubmit') state.active = false;
    if (input.hook_event_name === 'PreToolUse') state.active = true;
    const result = hookResult({ ...input, agent_type: state.agent_type }, state.active);
    if (input.hook_event_name === 'Stop') state.active = false;
    const temporary = `${path}.${process.pid}`;
    writeFileSync(temporary, JSON.stringify(state));
    renameSync(temporary, path);
    return result;
  } catch {
    return hookResult(input);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const directory = join(process.env.CLAUDE_PLUGIN_DATA ?? join(homedir(), '.local', 'state', 'manager'), 'lifecycle');
  process.stdout.write(JSON.stringify(runHook(JSON.parse(input), directory)) + '\n');
}
