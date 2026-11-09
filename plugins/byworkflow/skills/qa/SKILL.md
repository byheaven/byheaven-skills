---
name: qa
description: "Method for QA of a change (new feature, page, flow, fix or dependency bump) on a PR head before merge or on the deployed build after it, in any project. Use before planning or running a QA pass, a regression check of touched features, or a first-time-user walkthrough; a project overlay supplies environments, carriers, test identities and secret rules."
---

# QA

QA observes one change on the real build and returns a **verdict** per item with raw evidence. It tests and reports: code, project files, issues and tickets stay unchanged unless the overlay grants QA a write. Every finding, in scope or not, goes back to whoever sent the run. Acceptance stays with the change's task owner, who reads these verdicts under [Owner acceptance](../task-owner/references/evidence.md#owner-acceptance); judging whether the experience is good uses `experience-design`.

## Verdicts

Each item ends **PASS**, **FAIL**, **NOT RUN** or **BLOCKED**.

- **PASS**: the required outcome observed on the stated build, by an observation able to fail. A PASS names every stand-in it rests on, since a stand-in proves only its own layer ([Owner acceptance](../task-owner/references/evidence.md#owner-acceptance) item 3): `PASS (emulated 320 px)`, `PASS (stubbed 410)`, `PASS (simulated slow network)`, `PASS (unit test only)`.
- **FAIL**: an observed outcome contradicting the expected one, with the step that reproduces it.
- **NOT RUN**: not executed, its evidence unsettled as Owner acceptance item 4 lists, or unread; so is a skip, a stub without its qualifier, or a repeat of the same correlated check.
- **BLOCKED**: a prerequisite outside QA's reach is missing (an account, a device, access, quota); name it and what would unblock it.

## Always-QA

These classes always get QA, at **full** depth: sign-in and identity; money, payments and balances; writing or deleting user data, including saves and data migrations; privacy, sharing and permissions; irreversible operations; a major version bump of a shipped dependency. A project overlay may add classes, never remove one.

## Project overlay

A project's QA overlay, kept in the deployment, declares: who runs QA; the carriers (where each surface runs and what it can observe); the non-production environments and how to confirm which build and backend one serves; the test identities and how to sign in with them; identifiers to mask and secrets never to print; the request guard; default budgets for paid or metered calls; the feature map's location and format; [always-QA](#always-qa) classes it adds; shared-machine rules (lock, foreground, signed-in state to check); where evidence lives; the result route and who files findings. A run whose identity, environment or secret rules are undeclared stops before the first request and asks its dispatcher as [Asking](../task-owner/references/runtimes.md#asking) says: "The QA overlay for <project> does not declare <item>. What should this run use?" Other gaps take this skill's defaults and are named in the report.

## Steps

1. **Pin the subject.** Before a PR merges, test that exact head. After merge, read the merge sha, its CI, the deploy run and the served build's own version or sha, and confirm the build contains the change (a string, route or migration) and points at the intended non-production backend. When Acceptance needs a deployed observation, test the deployed artifact; a local build stands in only with that qualifier. Done when the report's first section names the sha, deploy and environment, each read this run.
2. **Plan the items.** Take items from the change's Acceptance, then from the diff: list the features its files actually reach through their real consumers, and look each up in the feature map. QA sets the depth from what the change can break, and chooses which automated suites run and when, per surface; a change in an [always-QA](#always-qa) class, or one whose first pass failed, gets **full** depth: every step of every touched feature. A touched feature with no map entry is named, with the substitute coverage. A new feature, page or flow that no polishing loop walked adds a [first-time-user walkthrough](references/walkthrough.md). Done when every Acceptance item and every touched feature has a planned item with its expected observable, depth and carrier.
3. **Plan the hard states.** Beside each happy path, plan the states the change can reach: errors and temporary failures with their retry; empty and loading; a second attempt and a rapid double action (idempotency); restart and reopen; deleted, revoked or expired data; a second identity or device; the narrowest screen and other fonts or locales where text wraps; slow or lost network; background and foreground; time windows and day boundaries. Prefer the real cause; a stand-in qualifies the PASS. Done when each planned state is an item or is named as out of reach with the reason.
4. **Arm the run.** Within the overlay's rules and the guardrails: sign-in only through the product's real route or the overlay's sanctioned test sign-in. Where a client could carry a real person's identity, place the **request guard** first: only the test identity's requests to the non-production host go out, proven by a marker before the first request. Declare each paid or metered budget (model calls, payments, messages, quota), default 0. Take the shared-machine lock, then record the **ledger** baseline: the state the items will change (balances, counters, saves, revisions, records) and the environment's own state (signed-in sessions, open windows, checkouts, builds, storage). Done when the guard is proven, budgets are written, and the baseline is saved.
5. **Run each item.** Drive it as a user would, through the carrier the overlay names; for compatibility, crash and startup coverage on many devices, a device farm runs first when the overlay has one, its quota first for release candidates, then device-sensitive changes, while identity, save and time-window checks stay where identity can be controlled. Keep each piece of evidence (screenshot, request trace, log, state read) at a stable path, and view every screenshot a verdict cites. When a result surprises, run a **control** before calling it a regression: the same check on the pre-change build, another font, machine or identity; a defect the control also shows is pre-existing and labelled so. Running on another agent or tool follows [Delegating execution](references/delegating.md). Done when each item has a verdict and its evidence path.
6. **Close the ledger.** Read the same state again: prove each claim such as "nothing deducted" from the before and after values, and count each budget spent. Restore the environment as found: windows, builds, simulators, storage, processes, scratch; check the signed-in sessions again and report a lost one. Scan all evidence for secrets and unmasked identifiers before it leaves the machine, mask any hit and report it. Done when the ledger, budgets, leftover test data and hygiene are written down.
7. **Report** on the [report shape](references/report.md), through the result route. Product issues, harness noise and QA's own brief errors are kept apart; a feature-map step that no longer matches is returned as a corrected triple, `action | command | observable`, with its evidence.

## Guardrails

These hold on every step and carrier:

- Work only on test identities and non-production environments; a check that would need production or a real person's account is BLOCKED.
- Keep tokens, tickets, cookies, signatures, session values and launch payloads out of every command, output and file; mask user identifiers.
- One run at a time per shared machine or device; work in the background, leave a person's foreground app, settings and sign-ins untouched. Stop the run when a shared session's signed-in state is lost.
- An overrun of a declared budget stops the run and is reported.
