// eslint.config.js — ESLint flat config (ESLint v9+)
// Supports: JavaScript, TypeScript, JSX/TSX
// Remove the TypeScript section if your project is JavaScript-only.

import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

// Uncomment for TypeScript projects:
// import tseslint from 'typescript-eslint'

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript (remove if not using TS):
  // ...tseslint.configs.recommended,

  // Disable rules that conflict with Prettier (must be last)
  prettierConfig,

  {
    // Apply to all JS/TS files
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}'],
    rules: {
      // Errors
      'no-console': 'warn',
      'no-debugger': 'error',

      // Best practices
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
    },
  },

  {
    // Relax rules for config files and scripts
    files: ['*.config.{js,mjs,cjs,ts}', 'scripts/**/*.{js,ts}'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    // Global ignores
    ignores: [
      'dist/',
      'build/',
      'out/',
      '.next/',
      '.nuxt/',
      'node_modules/',
      'coverage/',
    ],
  },
]
