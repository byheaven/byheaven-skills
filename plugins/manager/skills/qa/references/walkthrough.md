# First-time-user walkthrough

For a new feature, page or flow, several runs each play one first-time user with a goal (for example, from the first screen to the first completed job) and walk the real build, screenshotting every place they get stuck, confused or annoyed. Agent confusion is not real-user confusion; the walkthrough finds candidates for the owner, it settles nothing.

## Personas

Five by default, each walked separately on a fresh test identity where the product allows:

1. **Impatient**: skims, taps the most prominent control, abandons a wait past about eight seconds.
2. **Skeptic**: reads terms, privacy and data choices before committing; asks what is kept and who sees it.
3. **Small screen, slow network**: the narrowest supported viewport, a slow connection, rotation, and leaving and returning (background and foreground) mid-flow.
4. **Literal non-native reader**: follows the interface text word by word; flags any term it cannot act on.
5. **Breaker**: double taps, goes back mid-step, sends odd input, goes offline, restarts, signs out and returns.

Each persona starts in the state a real newcomer has: online, on the real entry point, signed out or freshly signed up. Offline or broken starts are extra cases, never a persona's only state, or the persona never reaches the flow it was meant to test. Give each walk enough time to finish the goal, with a stopping rule (goal reached, about five attempts at one obstacle, or a time limit).

## Findings

Rank findings by how many personas hit each. Label each **product** (a real issue: new or already known), **harness noise** (the driver, the stand-in network, or the test data caused it), or **recheck** (seen once, not separable from noise). Note what worked well briefly. Name what was simulated and what was not run (narrowest screen, rotation, real sign-in prompt, real touch).

The walkthrough is worth repeating when at least two of the top five findings are new and worth fixing; report whether this run met that bar.
