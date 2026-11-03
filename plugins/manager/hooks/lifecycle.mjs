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

// Deployment options: `rule_paths` (regular expressions matched against an edited
// file path) and `routing_table` (a file whose text is appended to the Dispatch
// reminder). Read from CLAUDE_PLUGIN_OPTIONS when the host sets it, else from the
// user's settings file under pluginConfigs["manager@<marketplace>"].options.
export function readOptions(env = process.env, settingsPath = join(homedir(), '.claude', 'settings.json')) {
  try {
    if (env.CLAUDE_PLUGIN_OPTIONS) return JSON.parse(env.CLAUDE_PLUGIN_OPTIONS);
    const configs = JSON.parse(readFileSync(settingsPath, 'utf8')).pluginConfigs ?? {};
    const key = Object.keys(configs).find((name) => name.startsWith('manager@'));
    return configs[key]?.options ?? {};
  } catch {
    return {};
  }
}

export function actionKeys(toolName, input = {}, options = {}) {
  const name = String(input.name ?? toolName).split('__').at(-1);
  const command = typeof input.command === 'string' ? input.command : input.cmd;
  const commands = typeof command === 'string' ? command.split(/&&|\|\||[;\n|]/).map((part) => part.trim()) : [];
  const keys = new Set();
  if (/^(create_pull_request|update_pull_request)$/.test(name)) keys.add('Publish');
  if (name === 'merge_pull_request') keys.add('Merge');
  if (/^(Agent|Task|spawn_agent|SendMessage|Workflow|delegate_task|t3_thread_launch)$/.test(name)) keys.add('Dispatch');
  const path = typeof input.file_path === 'string' ? input.file_path : input.notebook_path;
  if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(name) && typeof path === 'string'
    && (options.rule_paths ?? []).some((pattern) => new RegExp(pattern).test(path))) keys.add('Rules');
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

export function reminder(keys, options = {}) {
  let text = `Read links relative to their source file.\nSource: ${checksPath}\n\n`
    + keys.map((key) => sections[key]).join('\n\n');
  if (keys.includes('Dispatch') && options.routing_table) {
    try {
      text += `\n\nModel routing (deployment table, ${options.routing_table}):\n${readFileSync(options.routing_table, 'utf8').trim()}`;
    } catch {
      text += `\n\nModel routing table ${options.routing_table} could not be read; select from the deployment's routing rule directly.`;
    }
  }
  return text;
}

// Used by hosts without a native role setting (the Pi extension); Claude Code
// loads the role through its `agent` setting or `--agent manager:task-owner`.
export function sessionContext() {
  const role = readFileSync(rolePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  return `${reminder(['Session'])}\n\nRole source: ${rolePath}\n${role}`;
}

export function hookResult(input, active = false, options = {}) {
  if (input.hook_event_name === 'Stop') {
    const owner = String(input.agent_type ?? '').split(':').at(-1) === 'task-owner';
    return owner && active && !input.stop_hook_active ? { decision: 'block', reason: reminder(['Finish']) } : {};
  }
  if (input.hook_event_name !== 'PreToolUse') return {};
  const keys = actionKeys(input.tool_name, input.tool_input, options);
  if (!keys.length) return {};
  return { hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: reminder(keys, options) } };
}

export function runHook(input, directory, options = readOptions()) {
  if (!input.session_id) return hookResult(input, false, options);
  if (input.hook_event_name === 'PreToolUse' && !actionKeys(input.tool_name, input.tool_input, options).length) return {};
  try {
    mkdirSync(directory, { recursive: true });
    const path = join(directory, `${createHash('sha256').update(input.session_id).digest('hex')}.json`);
    const previous = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
    const state = { active: previous.active ?? false };
    if (input.hook_event_name === 'PreToolUse') state.active = true;
    const result = hookResult(input, state.active, options);
    if (input.hook_event_name === 'Stop') state.active = false;
    const temporary = `${path}.${process.pid}`;
    writeFileSync(temporary, JSON.stringify(state));
    renameSync(temporary, path);
    return result;
  } catch {
    return hookResult(input, false, options);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const directory = join(process.env.CLAUDE_PLUGIN_DATA ?? join(homedir(), '.local', 'state', 'manager'), 'lifecycle');
  process.stdout.write(JSON.stringify(runHook(JSON.parse(input), directory)) + '\n');
}
