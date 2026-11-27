# Surplus quota

Paid-plan quota drives target concurrency automatically whenever fresh (non-stale) runtime usage readings are available—no manual user surplus announcement is required—while continuing to honor explicit user surplus calls. Turn available paid capacity into useful project results up to the 90% allowance stop (10% left), judged under the project's mandate and any act-first, report-after limits the deployment sets.

## Concurrency targets and quality brake

Scale concurrent tracks from fresh plan-allowance readings within the project's active-task cap:

- **Generous remaining quota** (above 50% of a paid plan's weekly allowance remaining, or the deployment-configured target): target **2–3 concurrent tracks** for steady autonomous delivery and goal-anchored exploratory pre-work.
- **Surplus capacity** (abundant remaining weekly allowance near reset, a deployment-configured surplus threshold, or an explicit user surplus call): expand up to **4–5 concurrent tracks** on that plan's models until the stop threshold below.
- **Tightening quota** (below the generous threshold): throttle exploratory concurrency back, prioritize mandate-covered closures and queued work, and wait for an exhausted plan rather than moving self-selected work to metered fallback.
- **Paired quality brake:** concurrency targets serve useful outcomes, never slot utilization. Pair autonomous dispatch count with adoption/merge rate against discard rate in the weekly report ([Taking work](../SKILL.md#taking-work)); consecutive discards automatically throttle exploratory concurrency back until adoption recovers.

## Work worth doing

Choose work anchored to an active goal or unmet roadmap exit gate—worth doing even without surplus—inside the mandate and limits, leaving the user no new decision or delivering concrete evidence that makes a waiting decision cheaper. Prefer what the available model family adds: reversible exploratory pre-work under [Taking work](../SKILL.md#taking-work) (isolated-worktree prototypes, spikes, architecture or UX option packs, deep research kept on local branches), cross-family reads of recently landed work, test and documentation debt, and queued tasks that family suits.

Spend every other plan as little as possible, the Manager's own included. Sessions on the surplus plan do the reading, triage, prototyping, fixing, and verification; the Manager keeps to selecting, briefing, and reporting. Surplus justifies no new recurring check, monitor, filler work to occupy free slots, or unsolicited review burden beyond choices the user already owes.

## Observable stop

Read current usage from the plan provider's account usage surface or the host's authenticated usage capability for the plan's current allowance. Use fresh, non-stale plan allowance consumption—never session token counts, cost estimates, or a stale snapshot. Take a reading before each dispatch and whenever a dispatched result returns; these readings guide dispatch and this run's stop without adding polling or a recurring check.

Stop surplus-driven work—including surplus work in progress, saved recoverably—when a fresh reading reaches 90% used (10% left); user-dispatched work continues. When no fresh reading is available, never guess a percentage: during an explicit user surplus call, finish only the work selected at the run's start, start no additional surplus work, and report the reading as missing; during ordinary event, freed-slot, or daily starts, skip surplus expansion and run only standard mandate-priority work.

After stopping a surplus run, report once: what ran, what it found and changed, and the usage reading at the stop, or that it was missing.
