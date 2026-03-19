// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce these types only
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature (triggers minor bump)
        'fix',      // Bug fix (triggers patch bump)
        'perf',     // Performance improvement (triggers patch bump)
        'refactor', // Code change, no feature/fix (no bump)
        'docs',     // Documentation only (no bump)
        'test',     // Adding/updating tests (no bump)
        'chore',    // Maintenance (no bump)
        'ci',       // CI/CD changes (no bump)
        'build',    // Build system changes (no bump)
        'revert',   // Revert a previous commit
      ],
    ],
    // Subject line max length
    'subject-max-length': [1, 'always', 100],
    // Scope is optional but must be lowercase if provided
    'scope-case': [2, 'always', 'lower-case'],
  },
}
