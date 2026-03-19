// prettier.config.js
// Prettier formatting defaults — opinionated but widely accepted.
// All options here are deliberate; see inline comments.

/** @type {import("prettier").Config} */
const config = {
  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Line length — 100 is a reasonable balance between readability and wrapping
  printWidth: 100,

  // Strings — single quotes are common in JS/TS ecosystems
  singleQuote: true,
  jsxSingleQuote: false,

  // Semicolons — explicit semicolons prevent ASI edge cases
  semi: false,

  // Trailing commas in multi-line expressions (ES5-compatible)
  trailingComma: 'es5',

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions — always include parens for consistency
  arrowParens: 'always',

  // End of line — LF for cross-platform consistency (matches .editorconfig)
  endOfLine: 'lf',
}

export default config
