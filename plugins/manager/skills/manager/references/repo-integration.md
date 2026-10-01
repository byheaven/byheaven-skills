# Repository integration

Load before the first repository-affecting action — commit, push, PR, merge, worktree, or completion integration — including establishing an isolated worktree after scope expansion. Manager owns integration. A producer commits, pushes, and opens the PR on the branch its directive names; when several producers share one branch, each directive narrows this to leaving the tree uncommitted and Manager commits and pushes. Manager retains integration and merge responsibility, including when a project mechanism executes the merge.

## Applicability and boundary

This applies to source changes in a Git repository, not to non-repository knowledge work. Before edits, identify the source checkout, active branch or worktree, unrelated changes, open overlapping work, and the authorized integration target. Keep unrelated diffs out of the task.

Use an isolated worktree when the task or later scope expansion requires one. Record the source and worktree relationship so receipts and completion evidence bind to the correct checkout.

For a shared `main` failure, query the open PR set and related task records, then apply [Dependency waits](evidence.md#dependency-waits) using live repair execution evidence. An active repair receives an automatic dependency wait; an unclaimed or stopped repair receives diagnosis and a concrete repair plan under the ordinary authorization boundary. Preserve existing work and avoid duplicate repair.

When an isolated worktree is active, it is the only writable code surface. Run builds, tests, IDEs, and GUI developer tools there; treat the source checkout as a read-only control surface for repository identity and synchronization. Leave the source checkout untouched — no stash, reset, or clean — to satisfy a dispatch or integration precondition. A dirty source remains a separately reported blocker unless the user explicitly authorizes current-branch or local-checkout work.

## Merge authorization

Merge without asking only under a standing grant the user has recorded in their own instructions; otherwise ask, as the last step on a reviewable object after every gate in [Integration sequence](#integration-sequence) has passed. A standing grant never waives locked scope, independent verification, required checks, review resolution, mergeability, or the user-owned boundaries of P1. With any unresolved direction conflict, material risk, blocking review thread, or mergeability problem, keep the PR unmerged and the task non-terminal; investigate and repair within settled boundaries, and surface the exact unresolved condition rather than weakening the gates.

## Delivery unit and early feedback

Choose PR boundaries around outcomes that can be verified, delivered, and recovered independently, within the authorized task. Agent count and file ownership do not determine PR count. Coupled changes may share one outcome; independent outcomes may use separate PRs with explicit dependencies. Keep the locked scope as is rather than expanding it to form a convenient batch.

Inspect semantic dependencies and shared interfaces before parallel production. Open a draft PR or integration candidate when it provides useful feedback; PR creation need not wait for final acceptance. Run each check at the earliest point where its judge can reliably observe the relevant state. Component evidence supports its own predicate; combined behavior requires evidence on the combined state.

## Same-target merge coordination

The project owns its controlled integration entry and candidate construction; Manager owns their use and the delivery evidence. Reuse that mechanism rather than adding a workflow-level queue or prescribing author-branch rebase. Independent preparation and checks may run concurrently; final target publication preserves the project's coordination guarantees.

The project determines which predicates close before merge and which close on actual main afterward. Bind admission to the reviewed author revision, current target, and the evidence required at that stage; an authorized post-merge engineering check stays post-merge. When the project validates a combined candidate before merge, use its merge strategy and establish that the candidate still matches the intended update immediately before publication. Target movement remints affected pre-merge predicates under [evidence.md](evidence.md), not every receipt or the author branch. A main-first project instead validates the actual accepted main with its cumulative coverage and recovery contract; a green author branch never establishes combined correctness.

Establish the entry's guarantee and participating writers from live project authority. Use atomic stale-state rejection where available; cooperative coordination covers only writers that honor it, so a queue, lock, or final read alone never shows other writers are excluded. Remain within the project's authorized risk boundary; a material uncovered race requires a sufficient project mechanism or a user-owned risk decision before merge. Every dependency wait has a verifiable terminal signal and a bounded lifetime.

After merge, observe the actual accepted target. Where admission used a validated candidate, compare its content and provenance under the project's merge strategy; a mismatch leaves integration unverified and blocks reuse of those receipts. Where engineering validation is deliberately post-merge, the original task follows actual-main verification and coordinates necessary recovery before completion; merge alone is not delivery. Preserve the project's declared publication risk boundary rather than inventing candidate proof or outsourcing normal recovery to a new task.

## Integration sequence

1. Establish the outcome, scope, dependencies, target, and project integration entry. Inspect the task diff and exclude unrelated changes or accidental artifacts.
2. Produce and expose the candidate early enough for useful feedback. Obtain relevant local, hosted, and independent evidence under [evidence.md](evidence.md); select independent review by the predicate's judge, not by PR stage.
3. Join supported findings and repair within locked Intent and Acceptance. Triage hosted review under [PR review triage](#pr-review-triage), diagnose failures through [Failure diagnosis](evidence.md#failure-diagnosis), and remint invalidated predicates through their true judges. An unresolved material semantic predicate blocks integration.
4. Ensure intentional commits contain only the accepted task diff. Follow repository-local commit conventions, or Conventional Commits when none exist. Push and create or update the PR with the outcome, dependencies, evidence, and known limitations.
5. Establish the intended update and any project-required pre-merge candidate under [Same-target merge coordination](#same-target-merge-coordination). Close all applicable pre-merge Acceptance predicates, required checks, review blockers, and mergeability conditions. Then use the controlled entry to merge under [Merge authorization](#merge-authorization).
6. Verify the accepted target state. Close remaining actual-main engineering, deployment, and actual-outcome predicates through their appropriate judges before claiming completion. A merge receipt does not prove deployment or user outcome; an environment-only predicate is observed in that environment under existing authorization.

Repository commands and host APIs are project and runtime capabilities. Discover current project conventions rather than assuming a project-specific suite or branch.

## PR review triage

Manager triages hosted review findings against the current candidate. Routine triage asks the user nothing.

**Eligibility.** Repair a finding when it remains valid on the current candidate, concerns the submitted change within locked scope, and demonstrates a real failure, data loss, blocking defect, or violation of locked Acceptance. Its first-comment revision does not determine eligibility. Suggestions, style preferences, and out-of-scope requests receive an explicit disposition or a followup candidate; an unresolved required Acceptance predicate is never dismissed as low severity.

**Repeated comments.** Deduplicate messages, not unresolved defects. Re-anchored or older findings that still meet eligibility remain blockers until closed by relevant evidence. Already fixed, superseded, or inapplicable findings receive a state-bound explanation; their repetition alone does not require another repair or review round. Every finding receives a disposition.

**Repair and receipts.** Apply [Failure diagnosis](evidence.md#failure-diagnosis) when a repair fails or a defect recurs. Repairs within the same commitment remint only affected evidence through the appropriate judges. Independent review is not repeated merely because a PR was updated; neither Manager confidence nor message deduplication closes an open semantic predicate.

**Escalation.** A finding that conflicts with locked Intent, warrants cancellation, or creates a new user-owned value, risk, or authorization choice returns to the user. Ordinary implementation and environment repairs remain Manager execution within settled boundaries.

## Failure and completion

- Authentication, permission, or protected-branch failure stops at the exact blocked action.
- A reality finding that contradicts locked Intent reopens Direction; an architecture-classification error re-runs the [Architecture impact](production.md#architecture-impact) call.
- CI or command failures are evidence, not a new subjective verification round.
- Completion asks only for remaining user judgment or irreversible authorization and never removes required true-judge evidence.
- Required source integration, including the merge when authorized, completes before the terminal task state.

After merge, verify the merged state or accepted target ref, record the final checkout reference in the task record's current state, if any, and clean up only the task-owned branch and worktree.
