---
name: experience-design
description: Method for designing what a person experiences in a product, from the job and the journey down to screens and their text. Use when creating or changing a feature, flow, screen, state, component, or user-facing copy, or when reviewing one, whether as the coordinating agent or as a dispatched worker.
---

# Experience design

Every step, element, and word a person meets must **earn its place** in their experience. Whatever does not, the system does silently or leaves out. People should finish feeling the time was worth it, and leave freely when the job is done.

The project's own authorities come first. Its Vision, brand ethos, official mark, and ethical red lines are fixed; its sensory worlds (themes, materials, motion, layout) grow over time unless a task explicitly extends an already-settled surface in place. Where authorities are silent, this skill is design judgment to draw on, not law: depart from any default when the result serves the person better. The floor in step 3, the red lines, and every floor the project sets always hold.

## Two stages for open design work

For a new surface, page redesign, or open visual direction, separate **creative exploration** from **engineering integration**:

1. **Stage 1 — Clean-sandbox exploration.** Work in a lightweight interactive sandbox fed only a concise Soul Brief (Vision, brand ethos, official mark, hard red lines, real user job, and factual constraints) plus living sensory specimens—leave repository runbooks, approval matrices, full product manuals, legacy token lints, and CSS hygiene checklists out of this stage so attention stays on visual and interactive craft. Where the project holds multiple or growing brand sensory worlds, deliver both an evolution of an existing sensory world and at least one **brand-new sensory world** derived freshly from Vision and brand ethos. Every section across the entire page must stand on visual composition, media, or live interaction rather than explanatory prose walls.
2. **Stage 2 — Engineering integration.** Once the owner picks the winning interactive prototype, wire real data, auth and security boundaries, accessible primitives, runtime hygiene (`references/web-craft.md`), tests, and documentation. When the chosen sensory world or prototype conflicts with stale code tokens or specs, extend or update the specs and theme registry to carry the new design rather than diluting the design to fit old constraints.

These two stages separate **direction exploration** from **engineering integration**; they do not mean Stage 2 ships as one monolithic pull request. Once Stage 1 settles direction for a complex multi-dimension feature or game, break Stage 2 into vertical experience milestones under [Multi-unit delivery](../task-owner/references/production.md#multi-unit-delivery) so each craft pillar reaches the bar—landing a first working skeleton closes that milestone alone, never the whole feature.

Product decisions follow the project's decision rights, and P1 where the project names none. Reuse what the owner has settled; a choice those rights keep for the owner is a proposal the owner decides, through the project's own review process, before it shapes the product, and the designer makes the rest. This skill guides how to design and judge; it authorizes no change.

Work in layers, from the job down to the words. A symptom on the surface often starts lower: trace it down (job, journey, screen, words) and fix the lowest layer where the wrong choice was made. The steps below are an order that usually works, not a sequence to complete: start at the layer where the problem is, with the layers above it still holding, and judge against the benchmark for the qualities it changes.

## Steps

### 1. Name the job

- Derive the experience from the project authorities and the person's job. Read the current experience, rendered where possible: the journey as people go through it today and every screen and state it reaches. It tests the derivation and shows what people meet now; it is not the template.
- Write the progress the person wants in their circumstance: what they get done, how they want to feel, and how they want to be seen. Write what they use today for it, including doing nothing.
- Pick one primary person in one scene and resolve tradeoffs for them, without failing the others. The same person in another scene is another user.
- The new way must beat the old by more than the cost of switching: learning, setup, migration, risk, and social cost. Lower the anxiety and the habit cost, not only add attraction.
- Name what excellent looks like: the best experience anywhere for this job and scene, anchored in the task's [Highest-standard bar](../task-owner/references/evidence.md#highest-standard-bar) with no applicable dimension omitted (paying special attention to real examples proving the product promise, zero fabricated third-party assets, target-locale ecosystem fit, visual/motion/copy craft, functional edge cases, and adherence to locked user decisions). Never trade quality for speed; step 6 judges every applicable dimension against this bar (`MEETS BAR` / `BELOW BAR` / `UNVERIFIED`) and closes substantive gaps before handoff without looping on minor polish.
- Name the session shape: a quick visit that finishes and leaves, a long working session, or play. It sets density, pacing, and how much the product should hold attention.

Done when the job, the person, the scene, the current alternative, the benchmark, and the session shape are each named and marked as settled by the owner (with its source), supported by evidence, assumed, or open for the owner.

### 2. Shape the journey

- Walk the journey step by step. Every step either moves the job forward, protects the person, or is overhead that serves the tool (navigation, setup, waiting, re-entering). Remove overhead; count decisions, waits, and re-entries, not taps.
- Ask only for what this step needs, at the moment it is needed, with the reason; never ask twice. Postpone every account, permission, share, or payment request the current step does not need until the person has seen value; a request the step itself needs (the camera for a camera tool, identity before private data, a legal or safety requirement) comes at that moment.
- Defaults are decisions made for the person: the safest, most common, reversible choice in their interest.
- Forgive: undo for routine actions, confirmation only for irreversible ones naming the consequence, work saved and resumed where the person was interrupted.
- At every point the person can tell where they are, what just happened, what they can do, and how to leave. Every entry (a shared link, a notification, a search result) is a valid start that orients them.
- Organize by the person's tasks and words, never by the system's structure; reveal what is rare one level down, at most two.
- Remove the worst moment first. Where the experience has an emotional arc, make its peak the moment the job is done and end on completion rather than on a request.
- Motivation comes from the person's own sense of choice, growing skill, and connection with others. Rewards inform; they never replace the reason to do the thing.
- Let people leave when the job is done, and earn the return with value. Coming back after a gap is welcomed, never punished.
- Hold the **red lines**: the person would make the same choice knowing everything the designer knows, and declining, cancelling, or leaving is as easy to find and as prominent as accepting, with no friction beyond a proportionate protection. The full list is in the red-lines reference.

Done when every step has a named contribution to the job or to the person's protection, or is removed; every request is either needed by its step or comes after first value; the branches are covered (first visit, return, interruption and resumption, each entry point, failure); and the journey passes the red-lines reference.

### 3. Subtract on each screen

Put every element and every string through the **deletion test**, in order:

1. Can the person get it by looking or by doing? A visible state, a familiar pattern, a format that labels itself ("12 left"), or one tap that teaches the rule. Then delete the words and let the design carry it.
2. Is it the system vouching for itself? Guarantees about storage, sync, validation, verification, versions, or internal process belong in correct behavior. Delete them; speak only when the guarantee fails and the person must act.
3. Has the screen already said it? A heading, intro, helper, and toast repeating one fact keep one, in the place the person looks.
4. Is it rare but needed? Move it behind progressive disclosure, one level deep and findable.

The **floor** survives every deletion, because without it the person decides blind:

- money, cost, or any spend of a balance;
- consequences that cannot be undone, such as deletion, leaving, or publishing;
- who can see what, and how to change it;
- where information comes from, how current it is, and how certain, whenever that changes the person's decision; this includes whether a person or a machine made something, wherever the product distinguishes them;
- a failure the person cannot infer from the screen, with the way out of it;
- what a control does, when its form cannot show it;
- the labels of form fields, and an accessible name for every control and meaningful image, even when the visible words go.

Done when every remaining element has a named reason from the floor or the screen's job, and every deleted one has a named home: behavior, design, disclosure, or nowhere.

### 4. Design so fewer words are needed

- **One focal point.** Decide what the person sees first; show order with position, size, weight, color, and space. One primary action per decision; secondary actions recede.
- **Contrast, repetition, alignment, proximity.** Related things sit together, unrelated things apart; same kind, same treatment; every element aligns with something; different things look clearly different.
- **Familiar interaction, a language of its own.** Interactions people already know, such as going back, scrolling, and the platform's gestures, keep working as they expect; the look, motion, and signature components are the product's own, carried from its brand. Keep one treatment per meaning across the product.
- **Signifiers.** Make actionable things look actionable. Remove information, never the cue that something can be acted on.
- **Feedback where the action happened**, immediate and proportional: ambient confirmation for routine actions, an interruption only when something is at risk.
- **Teach by doing**, one concept at a time, at the moment it is needed. A tour or rules page is the last resort.
- **Knowledge in the world.** Visible options, constraints that prevent the wrong input, and status shown on the element it describes rather than in a sentence about it.

Done when each sentence removed in step 3 has either a design replacement or a reason it was never needed.

### 5. Write what remains

- Write to this copy's writing brief (`content-creator`).
- Use the person's words for things they recognize, never the system's names for how it is built.
- One term per concept across the whole product; the button's verb is the next screen's title.
- Put the key word first; one idea per screen or message.
- Buttons name the result with a specific verb ("Save draft", "再来一局"), never a bare OK/Yes/No for a consequential choice.
- Voice stays constant; tone follows the moment. Playfulness belongs to success and idle moments, plain words to failure, money, privacy, and loss.
- Positive and specific: say what to do, in active voice, with real numbers.

Done when every string passes the language reference for its language and reads naturally aloud.

### 6. Judge

- Render **full-page** captures across every band, route, viewport, and theme with real copy and live states—never judge from an above-the-fold crop alone. Verify that visual composition and interaction carry every section below the fold with the same restraint and craft as the hero.
- Walk the journey as the primary person: at each step, would they try the right thing, notice the control, connect it to their goal, and see that it worked? Run the trunk test (where am I, what is this, what can I do) on any deep screen.
- Floor check: contrast, minimum text size, touch target size, and reduced-motion behavior meet the platform's floor and the project's. Automated visual scanners check objective legibility and contrast floor only; they never prove aesthetic quality, originality, or text restraint.
- Compare the rendered result with the benchmark from step 1, quality by quality.
- Name what the change added and removed, and confirm every floor item is still present.
- An agent's walkthrough predicts problems; first impressions, comprehension, feelings, and whether people come back are judged by real people. When the decision rests on one of these, say so and name the smallest test that would settle it (see the research reference).

Done when every applicable check passes, or each failure is fixed or reported as open; an unrendered screen or an unobserved reaction is reported as unverified, not passed.

## References

- [`references/red-lines.md`](references/red-lines.md): manipulative patterns that never ship, and the tests for new ones. Read whenever the journey touches money, sharing, notifications, rewards, streaks, data or permissions, sign-up, or leaving.
- [`references/research.md`](references/research.md): which checks an agent can run alone and which need real people, and how to run each. Read before step 6 when the decision depends on real reactions.
- [`references/platforms.md`](references/platforms.md): journey rules that differ for WeChat mini programs and mini games, native apps, the web, and internal tools. Read when designing for one of them.
- [`references/web-craft.md`](references/web-craft.md): surface modes (Persuade/Experience vs Operate/Read), color strategy, motion frequency and compositor craft, zero-jank navigation/caching, and typography/runtime hygiene. Read right before shaping or editing web or interactive UI code.
- [`references/states.md`](references/states.md): onboarding, empty, loading, error, confirmation, success, and permission states. Read when the screen has any of these states, which almost every screen does.
- [`references/games.md`](references/games.md): how games differ from tools in challenge, failure, teaching, feedback, rewards, and sessions. Read when the product is a game or a playful consumer experience.
- [`references/language.md`](references/language.md): Chinese and English conventions for punctuation, spacing, address, button and title form, numbers. Read before writing or reviewing strings in either language.
- [`references/sources.md`](references/sources.md): where each rule comes from, conflicts between sources, and attribution. Read when a rule's basis or scope is in question.
