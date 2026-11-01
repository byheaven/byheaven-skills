import test from 'node:test';
import assert from 'node:assert/strict';
import { actionKeys, hookResult } from './lifecycle.mjs';

test('publication and merge operations request the corresponding checks', () => {
  assert.deepEqual(actionKeys('Bash', { command: 'git -C repo push origin HEAD:feature' }), ['Publish']);
  assert.deepEqual(actionKeys('Bash', { command: 'gh pr create --body-file description.md' }), ['Publish']);
  assert.deepEqual(actionKeys('mcp__github__merge_pull_request', {}), ['Merge']);
  assert.deepEqual(actionKeys('Bash', { command: 'git status --short' }), []);
});

test('native and routed dispatch request model-routing context', () => {
  assert.deepEqual(actionKeys('Agent', { prompt: 'Review the candidate' }), ['Dispatch']);
  assert.deepEqual(actionKeys('mcp__helper__call_tool', { name: 'send_to_session', args: {} }), ['Dispatch']);
  assert.equal(hookResult({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} }).hookSpecificOutput.hookEventName, 'PreToolUse');
});

test('session context is delivered as the host event output', () => {
  const result = hookResult({ hook_event_name: 'SessionStart' });
  assert.equal(result.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.ok(result.hookSpecificOutput.additionalContext.length);
});

test('completion requests one pass and allows the active stop hook to settle', () => {
  assert.equal(hookResult({ hook_event_name: 'Stop', stop_hook_active: false }).decision, 'block');
  assert.deepEqual(hookResult({ hook_event_name: 'Stop', stop_hook_active: true }), {});
});
