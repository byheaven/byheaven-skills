---
name: diagnosing-bugs
description: Build a feedback loop for a hard or performance bug, and classify every bug already observed by a user or production. Use when a defect resists the first obvious fix, reproduces intermittently, spans component boundaries, or has escaped to a user or production, before reading code to build theories.
---

# Diagnosing Bugs

The failure this skill exists to prevent: read the code, form a theory, start changing things. **Building the feedback loop is the skill; everything after is mechanical.**

## Phase 1 — Build the feedback loop

Construct one command that observes the failure. Candidate forms, preferred first: failing test → curl/CLI script with fixture diff → headless browser probe → replayed captured trace → disposable harness → property/fuzz loop → bisect harness → last resort, a human-in-the-loop script that tells the user exactly what to click and captures the result, whose capture then feeds an agent-runnable replay.

Phase 1 is complete only when you can state **one command you have already run at least once** (show the invocation and redacted output) and all four hold:

- **Red-capable** — it asserts the user's exact symptom, not merely "no error".
- **Deterministic** — pin time, seed randomness; for flaky bugs the goal is a raised reproduction rate (loop it 100×, parallelize, add pressure), not a clean repro.
- **Fast** — seconds, not minutes.
- **Agent-runnable** — you can run it yourself without a human.

If you catch yourself reading code to build a theory before this command exists — stop; jumping to hypotheses is the exact failure this skill prevents. If the loop truly cannot be built, stop and ask through the route the host's instructions name for questions to the user, otherwise the host's user-question tool, otherwise plain text: "I could not build a command that reproduces this bug. I tried: <what was tried>. Can you give me <environment access, a capture, or production instrumentation>?"

Redact secrets everywhere: literals become `<REDACTED>`, loops read from environment variables, captures quote only the signal-bearing lines.

## Phase 2 — Reproduce and minimize

Confirm the loop is red on the failure the user described — fixing the wrong bug is the expensive version of fixing nothing. Then cut inputs, callers, and configuration one slice at a time, re-running after each cut. Done when every remaining element is load-bearing: removing any one turns the loop green.

## Phase 3 — Hypotheses

Write 3–5 ranked falsifiable hypotheses before touching anything; a single hypothesis is anchoring on the first plausible idea. Each must carry a prediction: "if X is the cause, changing Y makes the bug disappear." A hypothesis without a prediction is a vibe — discard or sharpen it. Show the ranked list to the user before testing (they often re-rank instantly from domain knowledge), but do not block on their absence.

## Phase 4 — Instrument

Every probe maps to a specific prediction; change one variable at a time. Prefer debugger/REPL, then targeted logging. Never "log everything and grep". Prefix every debug log with one unique tag such as `[DEBUG-a4f2]` so cleanup is a single grep. Performance problems branch here: measure a baseline first, then bisect.

## Phase 5 — Fix with a regression test

Fix where the system first went wrong. A guard at the crash site is the fix only when the state it handles is legitimate; when that state should never exist, find what produced it.

Before fixing, turn the minimized repro into a failing test — but only where a correct seam exists. If the only available seam is too shallow to observe the real trigger chain, the test buys false confidence; the missing seam is itself a finding — record it and hand it to architecture work instead. With a seam: watch the test go red → fix → watch it go green → re-run the original unminimized loop from Phase 1.

## Phase 6 — Clean up

- Original repro no longer reproduces.
- Regression test passes, or the missing-seam finding is recorded.
- All `[DEBUG-]` lines removed (one grep proves it).
- Disposable harnesses deleted.
- The winning hypothesis written into the commit/PR message for the next debugger.
- When the deciding fact took a deep dig to find, the cheap always-on signal that would have shown it at first look is proposed in the report; adding it is a separate decision.

If the bug reached a user or production, cleanup also classifies the escape against the project's behavior registry (its registered behavior assertions) at the pre-escape source ref; a project with no separate registry registers behavior in its product documentation and tests, so classify against those:

- `registered-assertion-regression` — the failing behavior already contradicted a registered assertion at that ref; evidence names the immutable ref, product-doc path, and assertion line.
- `new-behavior-gap` — no registered assertion covered the behavior at that ref; the repair registers one with its executable carrier or explicit carrier/registry gap, and evidence names both the before ref and the new registration.

Persist the result atomically as one event: when and where (user or production) the escape was observed, its class, and its evidence. It goes on the owning task record in the fields the project's task-record rule defines, or, with no task record, in the evidence the task's report links, such as its pull request. A worker returns that exact payload to the task owner instead of writing the record itself. Commit/PR prose preserves the winning hypothesis but does not replace this event. Phase 6 remains incomplete while a known user or production escape lacks its durable classification.
