# Performance changes

Measurement is the evidence for a change whose target is speed, latency, memory, size, frame rate, or cost. Every number below comes from a run, never from reading the code.

## Before the first edit

1. Write the claim you expect to ship as one sentence with metric, unit, data, and surface, such as "p50 export latency on the 60k-row dataset drops 30%", and name the numeric target.
2. Capture a baseline on the surface and under the conditions where the cost occurs, with the command and raw artifact. Run every side the way production runs it: release build, production flags, realistic data size, caches as warm or cold as users meet them.
3. Name the limiter: the resource or code path that bounds the number, such as a core, a lock, the disk, the network, or the load generator itself. Take it from a profile or system counters in a run you do not report, and map it to source.

## Change

Try remedies cheapest first and stop at the first that meets the target: skip work whose result nothing uses; avoid repeating work; do less; defer it; move it off the path the user waits on; run it concurrently; make it cheaper. Apply one remedy at a time, re-measure, and keep it only when the number moves toward the target by more than the run-to-run spread.

## Vet every number

Check each number on these five points before you report it or act on it:

- **Errors.** Count failures and non-success results, and check that outputs are correct. Rejections are often fast; timeouts and retries are slow.
- **The work happened.** Confirm the timed region did the work: the request reached the server, the rows were written, the result was awaited and used. Cache hits, unawaited async work, discarded results, and timeouts all print numbers for work that never ran.
- **Repeats.** Run each side at least five times, alternating A, B, A, B, and report the median and range. A gap smaller than the run-to-run spread is no measurable difference.
- **Limits.** Do the arithmetic against bandwidth, cores, and the share of time the changed piece took. Removing a piece that takes 10% of a run makes it at most about 11% faster; a result past a limit measured something else.
- **End to end.** Report a local speedup as its share of the end-to-end wait the user sees.

A quick ballpark the user asks for may be one run when errors and the work happening are checked and the report says it is one run. A choice between options is never a ballpark.

## Report

Lead with the verdict: faster, slower, no measurable difference, or inconclusive. Then give baseline, result, and delta with units, the run count and range, the limiter, the conditions, and artifact paths. The verdict is inconclusive when the limiter is unnamed, a side ran untuned, errors or the work happening went unchecked, or the number came from another surface.
