import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const checksPath = resolve(root, 'skills/task-owner/references/action-checks.md');
const rolePath = resolve(root, 'agents/task-owner.md');
const sections = Object.fromEntries(
  readFileSync(checksPath, 'utf8').split(/^## /m).slice(1).map((section) => {
    const newline = section.indexOf('\n');
    return [section.slice(0, newline), section.slice(newline).trim()];
  }),
);

export function actionKeys(toolName, input) {
  const text = JSON.stringify(input);
  return [
    ['Publish', /\bgit\b[^\n;&|]*\bpush\b|\bgh\s+pr\s+(?:create|edit)\b|create_pull_request|update_pull_request/],
    ['Merge', /\bgh\s+pr\s+merge\b|merge_pull_request/],
    ['Dispatch', /\b(?:Agent|Task|spawn_agent|send_to_session|start_session_task|followup_task)\b/],
  ].filter(([, pattern]) => pattern.test(`${toolName} ${text}`)).map(([key]) => key);
}

export function reminder(keys) {
  return `Read links relative to their source file.\nSource: ${checksPath}\n\n`
    + keys.map((key) => sections[key]).join('\n\n');
}

export function sessionContext() {
  const role = readFileSync(rolePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  return `${reminder(['Session'])}\n\nRole source: ${rolePath}\n${role}`;
}

export function hookResult(input) {
  if (input.hook_event_name === 'Stop') {
    return input.stop_hook_active ? {} : { decision: 'block', reason: reminder(['Finish']) };
  }
  const text = input.hook_event_name === 'SessionStart'
    ? sessionContext()
    : reminder(actionKeys(input.tool_name, input.tool_input));
  if (input.hook_event_name !== 'SessionStart' && !actionKeys(input.tool_name, input.tool_input).length) return {};
  return { hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: text } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(JSON.stringify(hookResult(JSON.parse(input))) + '\n');
}
