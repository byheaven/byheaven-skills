---
name: ui-design
description: Method for designing what a person sees or operates and writing its text. Use when creating or changing a screen, state, flow, component, or any user-facing copy, or when reviewing one, whether as the coordinating agent or as a dispatched worker.
---

# UI design

Every element and every word on a user-facing surface must **earn its place** in the user's experience. Whatever does not, the system does silently or leaves out. A surface is done when each remaining element has a reason a user would recognize, and nothing a user needs is missing.

The project's own authorities come first. Its Vision decides what counts as experience; its design system, tokens, glossary, and the surface's product document decide concrete values, names, and voice. This skill fills what they leave open and never weakens a floor they set.

## Steps

### 1. Read the surface as it is

Read the project authorities above for this surface, then the current surface itself: rendered at the viewport its users hold where a render is possible, otherwise its source with every state it can reach (first use, empty, loading, success, error, permission, offline). Done when you can name the surface's one job, its one primary action, and every state it shows.

### 2. Subtract

Put every element and every string through the **deletion test**, in order:

1. Can the user get it by looking or by doing? A visible state, a familiar pattern, a format that labels itself ("12 left"), or one tap that teaches the rule. Then delete the words and let the design carry it.
2. Is it the system vouching for itself? Guarantees about storage, sync, validation, verification, versions, or internal process belong in correct behavior. Delete them; speak only when the guarantee fails and the user must act.
3. Has the surface already said it? A heading, intro, helper, and toast repeating one fact keep one, in the place the user looks.
4. Is it rare but needed? Move it behind progressive disclosure, one level deep and findable.

The **floor** survives every deletion, because without it the user decides blind:

- money, cost, or any spend of a balance;
- consequences that cannot be undone, such as deletion, leaving, or publishing;
- who can see what, and how to change it;
- where information comes from, how current it is, and how certain, whenever that changes the user's decision; this includes whether a person or a machine made something, wherever the product distinguishes them;
- a failure the user cannot infer from the screen, with the way out of it;
- what a control does, when its form cannot show it;
- the labels of form fields, and an accessible name for every control and meaningful image, even when the visible words go.

Done when every remaining element has a named reason from the floor or the surface's job, and every deleted one has a named home: behavior, design, disclosure, or nowhere.

### 3. Design so fewer words are needed

- **One focal point.** Decide what the user sees first; show order with position, size, weight, color, and space. One primary action per decision; secondary actions recede.
- **Contrast, repetition, alignment, proximity.** Related things sit together, unrelated things apart; same kind, same treatment; every element aligns with something; different things look clearly different.
- **Conventions over invention.** Use the platform's and the genre's known patterns; keep one treatment per meaning across the product.
- **Signifiers.** Make actionable things look actionable. Remove information, never the cue that something can be acted on.
- **Feedback where the action happened**, immediate and proportional: ambient confirmation for routine actions, an interruption only when something is at risk. Game surfaces scale feedback richer; see the games reference.
- **Teach by doing**, one concept at a time, at the moment it is needed. A tour or rules page is the last resort.
- **Knowledge in the world.** Visible options, sensible defaults, constraints that prevent the wrong input, and undo instead of confirmation for anything recoverable.
- **Status in its place.** Show state on the element it describes rather than in a sentence about it.

Done when each sentence removed in step 2 has either a design replacement or a reason it was never needed.

### 4. Write what remains

- Use the user's words for things they recognize, never the system's names for how it is built.
- One term per concept across the whole product; the button's verb is the next screen's title.
- Put the key word first; one idea per screen or message.
- Buttons name the result with a specific verb ("Save draft", "再来一局"), never a bare OK/Yes/No for a consequential choice.
- Voice stays constant; tone follows the moment. Playfulness belongs to success and idle moments, plain words to failure, money, privacy, and loss.
- Positive and specific: say what to do, in active voice, with real numbers.
- Avoid stock phrases, slogans that would fit any product, and machine-sounding cadence such as stacked em-dashes or "not X, but Y" contrasts.

Done when every string passes the language reference for its language and reads naturally aloud.

### 5. Judge

- Render the changed surface at its real viewports and themes, with real copy and every state. A source read does not show overflow, truncation, or contrast.
- Five-second test: after a five-second look, can a first-time user say what this is and what to do? When you cannot answer that with confidence, ask a fresh reader (a person or an agent without your context).
- Trunk test for any deep screen: where am I, what is this, what can I do here.
- Floor check: contrast, minimum text size, touch target size, and reduced-motion behavior meet the platform's floor and the project's.
- Count what changed: elements and characters before and after per screen, and every floor item still present.

Done when every applicable check passes, or each failure is fixed or reported as open; an unrendered surface is reported as unverified, not passed.

## References

- [`references/language.md`](references/language.md): Chinese and English conventions for punctuation, spacing, address, button and title form, numbers. Read before writing or reviewing strings in either language.
- [`references/states.md`](references/states.md): onboarding, empty, loading, error, confirmation, success, and permission states. Read when the surface has any of these states, which almost every surface does.
- [`references/games.md`](references/games.md): teaching through play, feedback and reward, HUD, share cards. Read when the surface is a game or a playful consumer experience.
- [`references/sources.md`](references/sources.md): where each rule comes from, conflicts between sources, and attribution. Read when a rule's basis or scope is in question.
