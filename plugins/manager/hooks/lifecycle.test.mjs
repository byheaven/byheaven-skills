import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { actionKeys, hookResult, readOptions, reminder, runHook, sessionContext } from './lifecycle.mjs';

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
  for (const command of ['claude -p "review"', 'codex exec "review"']) {
    assert.deepEqual(actionKeys('Bash', { command }), ['Dispatch']);
  }
});

test('no host event other than an action or completion adds context; Pi still assembles the role section', () => {
  assert.deepEqual(hookResult({ hook_event_name: 'SessionStart' }), {});
  assert.deepEqual(hookResult({ hook_event_name: 'UserPromptSubmit' }), {});
  assert.ok(sessionContext().includes('# Task owner'));
});

test('rule-file edits get the writing reminder only for deployment-configured paths', () => {
  const options = readOptions({ CLAUDE_PLUGIN_OPTIONS: JSON.stringify({ rule_paths: ['/AI/', '^/vault/rules/'] }) });
  assert.deepEqual(actionKeys('Edit', { file_path: '/srv/vault/AI/AGENTS-global.md' }, options), ['Rules']);
  assert.deepEqual(actionKeys('Write', { file_path: '/vault/rules/x.md' }, options), ['Rules']);
  assert.deepEqual(actionKeys('Edit', { file_path: '/srv/code/src/app.ts' }, options), []);
  assert.deepEqual(actionKeys('Edit', { file_path: '/srv/vault/AI/AGENTS-global.md' }), []);
  assert.ok(reminder(['Rules']).includes('writing-for-agents'));
});

test('dispatch appends the deployment routing table when configured and names a missing one', () => {
  const directory = mkdtempSync(join(tmpdir(), 'manager-routing-'));
  try {
    const table = join(directory, 'routing.md');
    writeFileSync(table, '| Purpose | Family |\n| --- | --- |\n| Verifier | other than writer |');
    assert.ok(reminder(['Dispatch'], { routing_table: table }).includes('| Verifier | other than writer |'));
    assert.ok(reminder(['Dispatch'], { routing_table: join(directory, 'missing.md') }).includes('could not be read'));
    assert.ok(!reminder(['Publish'], { routing_table: table }).includes('Model routing'));
    writeFileSync(join(directory, 'settings.json'), JSON.stringify({ pluginConfigs: { 'manager@byheaven-skills': { options: { routing_table: table } } } }));
    assert.deepEqual(readOptions({}, join(directory, 'settings.json')), { rule_paths: [], routing_table: table });
    assert.deepEqual(readOptions({ CLAUDE_PLUGIN_OPTIONS: '{"rule_paths":["x"]}' }).rule_paths.map(String), ['/x/']);
    assert.deepEqual(readOptions({}, join(directory, 'absent.json')), {});
    for (const bad of ['null', '"text"', '[1]', '{"rule_paths":"not-a-list"}', '{"rule_paths":["[unterminated", 7, "/ok/"],"routing_table":3}', 'not json']) {
      const options = readOptions({ CLAUDE_PLUGIN_OPTIONS: bad });
      assert.ok(typeof options === 'object' && options !== null && !Array.isArray(options), bad);
      assert.deepEqual(hookResult({ hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: '/ok/x.md' } }, false, options).hookSpecificOutput?.additionalContext?.includes('writing-for-agents') ?? false, bad.includes('/ok/'), bad);
      assert.deepEqual(hookResult({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} }, false, options).hookSpecificOutput.hookEventName, 'PreToolUse', bad);
    }
  } finally {
    rmSync(directory, { recursive: true });
  }
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

test('session activity persists across calls and resets at the completion boundary', () => {
  const directory = mkdtempSync(join(tmpdir(), 'manager-hooks-'));
  const event = (input) => runHook({ session_id: 'owner-session', ...input }, directory, {});
  try {
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.equal(event({ hook_event_name: 'Stop', agent_type: 'manager:task-owner' }).decision, 'block');
    assert.deepEqual(event({ hook_event_name: 'Stop', agent_type: 'manager:task-owner' }), {});
    event({ hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: {} });
    assert.deepEqual(event({ hook_event_name: 'Stop', agent_type: 'manager:task-owner' }), {});
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    assert.deepEqual(event({ hook_event_name: 'Stop', agent_type: 'manager:verifier' }), {});
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test('compaction preserves an active owner check until its final result', () => {
  const directory = mkdtempSync(join(tmpdir(), 'manager-compact-'));
  const event = (input) => runHook({ session_id: 'owner-session', agent_type: 'manager:task-owner', ...input }, directory, {});
  try {
    event({ hook_event_name: 'PreToolUse', tool_name: 'Agent', tool_input: {} });
    event({ hook_event_name: 'SessionStart', source: 'compact' });
    assert.equal(event({ hook_event_name: 'Stop' }).decision, 'block');
    assert.deepEqual(event({ hook_event_name: 'Stop' }), {});
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test('state storage failure preserves action context without an unsafe completion block', () => {
  const directory = mkdtempSync(join(tmpdir(), 'manager-state-failure-'));
  const unavailable = join(directory, 'file');
  writeFileSync(unavailable, 'not a directory');
  try {
    const result = runHook({ session_id: 'owner-session', hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'git push -h' } }, unavailable, {});
    assert.equal(result.hookSpecificOutput.hookEventName, 'PreToolUse');
    assert.deepEqual(runHook({ session_id: 'owner-session', agent_type: 'manager:task-owner', hook_event_name: 'Stop' }, unavailable, {}), {});
  } finally {
    rmSync(directory, { recursive: true });
  }
});
