import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sessionRole from './task-owner-role.ts';

async function run(cwd) {
  const handlers = new Map();
  sessionRole({ on: (name, handler) => handlers.set(name, handler) });
  assert.deepEqual([...handlers.keys()], ['before_agent_start']);
  const event = { systemPromptOptions: { cwd, sections: { existing: 'keep' } } };
  await handlers.get('before_agent_start')(event);
  return event.systemPromptOptions.sections;
}

function project(settings) {
  const dir = mkdtempSync(join(tmpdir(), 'pi-role-'));
  if (settings !== undefined) {
    mkdirSync(join(dir, '.claude'));
    writeFileSync(join(dir, '.claude', 'settings.json'), settings);
  }
  return dir;
}

const skill = (name) => readFileSync(new URL(`../skills/${name}/SKILL.md`, import.meta.url), 'utf8');

test('a run receives only the task-owner role body by default', async () => {
  const { existing, task_owner_role: role, manager_role } = await run(undefined);
  assert.equal(existing, 'keep');
  assert.ok(role.startsWith('# Task owner'));
  assert.ok(!role.includes('name: task-owner'));
  assert.ok(skill('task-owner').includes(role));
  assert.equal(manager_role, undefined);
});

test('a project whose Claude settings name the manager role gets that role instead', async () => {
  const dir = project(JSON.stringify({ agent: 'manager', permissions: {} }));
  try {
    const { existing, task_owner_role, manager_role: role } = await run(dir);
    assert.equal(existing, 'keep');
    assert.equal(task_owner_role, undefined);
    assert.ok(role.startsWith('# Manager'));
    assert.ok(skill('manager').includes(role));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('an unknown role, an unreadable setting or no setting keeps the default', async () => {
  for (const settings of [JSON.stringify({ agent: 'flow' }), JSON.stringify({ agent: 'constructor' }), JSON.stringify({ agent: '' }), '{not json', undefined]) {
    const dir = project(settings);
    try {
      const sections = await run(dir);
      assert.ok(sections.task_owner_role.startsWith('# Task owner'), String(settings));
      assert.equal(sections.manager_role, undefined);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});
