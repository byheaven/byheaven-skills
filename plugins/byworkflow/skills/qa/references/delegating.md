# Delegating execution

When another agent, model or tool drives the steps, the QA owner keeps every verdict. The executor's report is a claim; a verdict rests only on raw evidence the owner reads itself.

## The brief

The executor sees nothing but its brief, so the brief is self-contained: the exact build, the items as triples with expected observables, the carrier, every safety rule of the overlay and of this skill's Guardrails written out, the budgets, the output paths (report, screenshots, request log, guard log), and the cleanup. When the executor also loads its own standing rules, the brief's first line says which instructions win.

State each rule with its intent and scope, so the executor can tell a legitimate method from the risk the rule guards. A rule written too broadly blocks real work: one brief forbade a mocking call that the project's own registered journey makes; another, asking to mask an identifier "in every file you write", was read as forbidding a byte-for-byte project copy. When a run stops on such a rule, rewrite the rule with its scope, rerun, and report the stop as a QA brief error, never a product failure.

## Before and after

The owner, not the executor, takes the lock, records the ledger baseline and the environment snapshot (repository states, signed-in sessions, foreground watch), and repeats them after the run. Unchanged snapshots and the owner's own after-checks are evidence; the executor's statement that it cleaned up is not.

## Accepting a run

Accept an item only when the owner has:

- confirmed the tested build equals the requested one;
- opened the raw artifacts: the report, the request log (budgets within limits), the guard log (no request under any identity but a test identity's), and every screenshot a verdict depends on;
- viewed those screenshots directly: fast executors judge from page structure and can miss what their own screenshots show, such as an empty state flashing before content loads;
- scanned the run's logs and transcripts for secrets and unmasked identifiers before anything leaves the machine.

Every other item stays NOT RUN under [Verdicts](../SKILL.md#verdicts). A run that leaves no usable evidence, or an executor that is unavailable, falls back to the owner driving the item itself, and the report names the blocker.

## Depth

Delegated walks are fast and shallow: one to three minutes per persona, rules such as a persona's patience limit skipped, driver failures reported as user blocks. The first time a new executor runs a kind of check, compare it once with the owner's own run of the same build and items, and report the comparison.
