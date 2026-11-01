import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { actionKeys, hookResult, runHook } from './lifecycle.mjs';

test('action checks cover recognized commands and exclude text in unrelated tool fields', () => {
  assert.deepEqual(actionKeys('Bash', { command: 'git -C repo push origin HEAD:feature' }), ['Publish']);
  assert.deepEqual(actionKeys('Bash', { command: 'gh pr create --body-file description.md' }), ['Publish']);
  assert.deepEqual(actionKeys('Bash', { command: 'gh api repos/org/repo/pulls/1/merge -X PUT' }), ['Merge']);
  assert.deepEqual(actionKeys('mcp__github__merge_pull_request', {}), ['Merge']);
  for (const [name, input] of [
    ['Edit', { new_string: '## Task contract' }],
    ['Write', { content: 'Agent guidance' }],
    ['Bash', { command: 'git commit -m "push handling"' }],
    ['Bash', { command: 'grep "gh pr merge" log.txt' }],
  ]) assert.deepEqual(actionKeys(name, input), []);
});

test('native, routed and CLI dispatch receive model-routing context', () => {
  assert.deepEqual(actionKeys('Agent', { prompt: 'Review the candidate' }), ['Dispatch']);
  assert.deepEqual(actionKeys('mcp__tools__call_tool', { name: 'spawn_agent', args: {} }), ['Dispatch']);
  for (const command of ['claude -p "review"', 'codex exec "review"', 'cross-model verifier review']) {
    assert.deepEqual(actionKeys('Bash', { command }), ['Dispatch']);
  }
});

test('session context is delivered as the host event output', () => {
  const result = hookResult({ hook_event_name: 'SessionStart' });
  assert.equal(result.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.ok(result.hookSpecificOutput.additionalContext.length);
});

test('only an active explicit task owner receives a completion pass', () => {
  const owner = { hook_event_name: 'Stop', agent_type: 'manager:task-owner' };
  assert.deepEqual(hookResult(owner), {});
  assert.equal(hookResult(owner, true).decision, 'block');
  assert.deepEqual(hookResult({ ...owner, stop_hook_active: true }, true), {});
  for (const role of [undefined, 'manager:verifier', 'manager:code-worker', 'coordinator']) {
    assert.deepEqual(hookResult({ hook_event_name: 'Stop', agent_type: role }, true), {});
  }
});

test('session activity persists across calls and resets at prompt and completion boundaries', () => {
  const directory = mkdtempSync(join(tmpdir(), 'manager-hooks-'));
  const session = { session_id: 'owner-session' };
  const event = (input) => runHook({ ...session, ...input }, directory);
  try {
    event({ hook_event_name: 'SessionStart', agent_type: 'manager:task-owner' });
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.equal(event({ hook_event_name: 'Stop' }).decision, 'block');
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    event({ hook_event_name: 'UserPromptSubmit' });
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
    event({ hook_event_name: 'SessionStart' });
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
    event({ hook_event_name: 'SessionStart', agent_type: 'manager:verifier' });
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
  } finally {
    rmSync(directory, { recursive: true });
  }
});
