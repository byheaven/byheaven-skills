---
name: experience-design
description: Method for designing what a person experiences in a product, from the job and the journey down to screens and their text. Use when creating or changing a feature, flow, screen, state, component, or user-facing copy, or when reviewing one, whether as the coordinating agent or as a dispatched worker.
---

# Experience design

Every step, element, and word a person meets must **earn its place** in their experience. Whatever does not, the system does silently or leaves out. People should finish feeling the time was worth it, and leave freely when the job is done.

The project's own authorities come first. Its Vision decides what counts as value and which tradeoffs win; its design system, tokens, glossary, and the surface's product document decide concrete values, names, and voice. This skill fills what they leave open and never weakens a floor they set.

Work in layers, from the job down to the words. A symptom on the surface often starts lower: trace it down (job, journey, screen, words) and fix the lowest layer where the wrong choice was made. Steps 1 and 2 apply whenever a feature or flow is created or changed; a change confined to one screen starts at step 3 after confirming the journey around it still holds.

## Steps

### 1. Name the job

- Write the progress the person wants in their circumstance: what they get done, how they want to feel, and how they want to be seen. Write what they use today for it, including doing nothing.
- Pick one primary person in one scene and resolve tradeoffs for them, without failing the others. The same person in another scene is another user.
- The new way must beat the old by more than the cost of switching: learning, setup, migration, risk, and social cost. Lower the anxiety and the habit cost, not only add attraction.
- Name the session shape: a quick visit that finishes and leaves, a long working session, or play. It sets density, pacing, and how much the product should hold attention.

Done when the job, the person, the scene, the current alternative, and the session shape each fit in one sentence.

### 2. Shape the journey

- Walk the journey step by step. Every step either moves the job forward or is overhead that serves the tool (navigation, setup, waiting, re-entering, confirming). Remove overhead; count decisions, waits, and re-entries, not taps.
- Ask only for what this step needs, at the moment it is needed, with the reason; never ask twice. Value comes before any account, permission, share, or payment request.
- Defaults are decisions made for the person: the safest, most common, reversible choice in their interest.
- Forgive: undo for routine actions, confirmation only for irreversible ones naming the consequence, work saved and resumed where the person was interrupted.
- At every point the person can tell where they are, what just happened, what they can do, and how to leave. Every entry (a shared link, a notification, a search result) is a valid start that orients them.
- Organize by the person's tasks and words, never by the system's structure; reveal what is rare one level down, at most two.
- Design the peak and the end: remove the worst moment first, make the peak the moment the job is done, and end on completion and relief.
- Motivation comes from the person's own sense of choice, growing skill, and connection with others. Rewards inform; they never replace the reason to do the thing.
- Let people leave when the job is done, and earn the return with value. Coming back after a gap is welcomed, never punished.
- Hold the **red lines**: the person would make the same choice knowing everything the designer knows, and declining, cancelling, or leaving takes no more effort or prominence than accepting. The full list is in the red-lines reference.

Done when every step has a named contribution to the job or is removed, the first value arrives before the first request, the peak and end are named, and the journey passes the red-lines reference.

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
- **Conventions over invention.** Use the platform's and the genre's known patterns; keep one treatment per meaning across the product.
- **Signifiers.** Make actionable things look actionable. Remove information, never the cue that something can be acted on.
- **Feedback where the action happened**, immediate and proportional: ambient confirmation for routine actions, an interruption only when something is at risk.
- **Teach by doing**, one concept at a time, at the moment it is needed. A tour or rules page is the last resort.
- **Knowledge in the world.** Visible options, constraints that prevent the wrong input, and status shown on the element it describes rather than in a sentence about it.

Done when each sentence removed in step 3 has either a design replacement or a reason it was never needed.

### 5. Write what remains

- Use the person's words for things they recognize, never the system's names for how it is built.
- One term per concept across the whole product; the button's verb is the next screen's title.
- Put the key word first; one idea per screen or message.
- Buttons name the result with a specific verb ("Save draft", "再来一局"), never a bare OK/Yes/No for a consequential choice.
- Voice stays constant; tone follows the moment. Playfulness belongs to success and idle moments, plain words to failure, money, privacy, and loss.
- Positive and specific: say what to do, in active voice, with real numbers.
- Avoid stock phrases, slogans that would fit any product, and machine-sounding cadence such as stacked em-dashes or "not X, but Y" contrasts.

Done when every string passes the language reference for its language and reads naturally aloud.

### 6. Judge

- Render the changed screens at their real viewports and themes, with real copy and every state. A source read does not show overflow, truncation, or contrast.
- Walk the journey as the primary person: at each step, would they try the right thing, notice the control, connect it to their goal, and see that it worked? Run the trunk test (where am I, what is this, what can I do) on any deep screen.
- Floor check: contrast, minimum text size, touch target size, and reduced-motion behavior meet the platform's floor and the project's.
- Count what changed: steps, requests, elements, and characters before and after, and every floor item still present.
- An agent's walkthrough predicts problems; first impressions, comprehension, feelings, and whether people come back are judged by real people. When the decision rests on one of these, say so and name the smallest test that would settle it (see the research reference).

Done when every applicable check passes, or each failure is fixed or reported as open; an unrendered screen or an unobserved reaction is reported as unverified, not passed.

## References

- [`references/red-lines.md`](references/red-lines.md): manipulative patterns that never ship, and the tests for new ones. Read whenever the journey touches money, sharing, notifications, rewards, streaks, data or permissions, sign-up, or leaving.
- [`references/research.md`](references/research.md): which checks an agent can run alone and which need real people, and how to run each. Read before step 6 when the decision depends on real reactions.
- [`references/platforms.md`](references/platforms.md): journey rules that differ for WeChat mini programs and mini games, native apps, the web, and internal tools. Read when designing for one of them.
- [`references/states.md`](references/states.md): onboarding, empty, loading, error, confirmation, success, and permission states. Read when the screen has any of these states, which almost every screen does.
- [`references/games.md`](references/games.md): how games differ from tools in challenge, failure, teaching, feedback, rewards, and sessions. Read when the product is a game or a playful consumer experience.
- [`references/language.md`](references/language.md): Chinese and English conventions for punctuation, spacing, address, button and title form, numbers. Read before writing or reviewing strings in either language.
- [`references/sources.md`](references/sources.md): where each rule comes from, conflicts between sources, and attribution. Read when a rule's basis or scope is in question.
