import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import taskOwnerRole from './task-owner-role.ts';

test('a run receives only the role body as its own prompt section', async () => {
  const handlers = new Map();
  taskOwnerRole({ on: (name, handler) => handlers.set(name, handler) });
  assert.deepEqual([...handlers.keys()], ['before_agent_start']);
  const event = { systemPromptOptions: { sections: { existing: 'keep' } } };
  await handlers.get('before_agent_start')(event);
  const { existing, task_owner_role: role } = event.systemPromptOptions.sections;
  assert.equal(existing, 'keep');
  assert.ok(role.startsWith('# Task owner'));
  assert.ok(!role.includes('name: task-owner'));
  assert.ok(readFileSync(new URL('../agents/task-owner.md', import.meta.url), 'utf8').includes(role));
});
