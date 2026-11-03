import test from 'node:test';
import assert from 'node:assert/strict';
import { actionKeys, reminder, sessionContext } from './lifecycle.mjs';

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
    ['Read', { file_path: '/repo/x.md', pattern: 'git push' }],
  ]) assert.deepEqual(actionKeys(name, input), []);
});

test('native, routed and CLI dispatch receive the dispatch check', () => {
  assert.deepEqual(actionKeys('Agent', { prompt: 'Review the candidate' }), ['Dispatch']);
  assert.deepEqual(actionKeys('mcp__tools__call_tool', { name: 'spawn_agent', args: {} }), ['Dispatch']);
  for (const command of ['claude -p "review"', 'codex exec "review"', 'pi -p "review"']) {
    assert.deepEqual(actionKeys('Bash', { command }), ['Dispatch']);
  }
  assert.ok(reminder(['Dispatch']).includes('model routing'));
});

test('the session context carries the role and the session check', () => {
  const context = sessionContext();
  assert.ok(context.includes('# Task owner'));
  assert.ok(context.includes(reminder(['Session']).split('\n\n').at(-1)));
});
