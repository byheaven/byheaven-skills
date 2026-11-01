import test from 'node:test';
import assert from 'node:assert/strict';
import taskLifecycle from '../.pi-plugin/task-lifecycle.ts';

function adapter() {
  const handlers = new Map();
  const messages = [];
  taskLifecycle({ on: (name, handler) => handlers.set(name, handler), sendMessage: (message) => messages.push(message) });
  return { handlers, messages };
}

test('the run receives a role section without replacing other prompt sections', () => {
  const { handlers } = adapter();
  const event = { systemPromptOptions: { sections: { existing: 'keep' } } };
  handlers.get('before_agent_start')(event);
  assert.equal(event.systemPromptOptions.sections.existing, 'keep');
  assert.ok(event.systemPromptOptions.sections.task_owner_role);
});

test('recognized actions add context without authorizing or executing tools', () => {
  const { handlers, messages } = adapter();
  assert.equal(handlers.get('tool_call')({ toolName: 'bash', input: { command: 'gh pr merge 17' } }), undefined);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].display, false);
  handlers.get('tool_call')({ toolName: 'read', input: { path: 'README.md' } });
  assert.equal(messages.length, 1);
});

test('only a completed run gets one final checklist continuation', () => {
  const { handlers } = adapter();
  const settle = handlers.get('agent_before_settle');
  assert.equal(settle({ outcome: 'aborted', entries: [] }), undefined);
  const existing = { type: 'custom', customType: 'existing', data: {} };
  const first = settle({ outcome: 'completed', entries: [existing] });
  assert.equal(first.continue, true);
  assert.equal(first.entries[0], existing);
  assert.equal(settle({ outcome: 'completed', entries: [] }), undefined);
  handlers.get('before_agent_start')({ systemPromptOptions: { sections: {} } });
  assert.equal(settle({ outcome: 'completed', entries: [] }).continue, true);
});
