#!/usr/bin/env node
// Fails when a skill's or agent's frontmatter is not strict YAML, or lacks a string
// `name` and `description`. Lenient hosts accept, for example, an unquoted ": " inside
// a description; strict YAML parsers reject it and the skill fails to load there.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parseDocument } from 'yaml';

const files = execFileSync(
  'git',
  ['ls-files', '--', 'plugins/*/skills/*/SKILL.md', 'plugins/*/agents/*.md'],
  { encoding: 'utf8' },
).split('\n').filter(Boolean);

const failures = [];
for (const file of files) {
  const match = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    failures.push(`${file}: no frontmatter block`);
    continue;
  }
  const doc = parseDocument(match[1], { strict: true, uniqueKeys: true });
  const problems = [...doc.errors, ...doc.warnings].map((e) => e.message.split('\n')[0]);
  const data = problems.length ? null : doc.toJS();
  for (const key of ['name', 'description']) {
    if (data && (typeof data[key] !== 'string' || !data[key].trim())) {
      problems.push(`\`${key}\` is not a non-empty string`);
    }
  }
  for (const problem of problems) failures.push(`${file}: ${problem}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error('\nQuote a value that contains ": " or starts with a YAML indicator.');
  process.exit(1);
}
console.log(`check-frontmatter: ${files.length} files parse as strict YAML`);
