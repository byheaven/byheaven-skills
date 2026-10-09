# States

Each state shows the one fact the user needs now, and the next action when the user must act and the screen does not already show it. The deletion test and floor in SKILL.md apply to every state below.

## First use and onboarding

- First value fast: the user does the real thing in the first session, with sensible defaults and the minimum setup.
- Teach the next needed concept at the moment it is needed, by letting the user perform it; one concept at a time.
- A tip appears once, beside its control, dismissible, and never again after dismissal; a returning user never sees first-use teaching.
- Any guided flow is optional and skippable; requests follow the journey rule in SKILL.md step 2.
- No welcome or self-praise text on the way in; the first screen is the product.

## Empty

- Say what will appear here only when the empty space alone does not show it; offer the control that fills it when the user is expected to fill it.
- Distinguish the kinds: first use (the next step), cleared by the user (a light touch, often nothing), no results (how to widen or clear the query), no permission (why, and how to get access).
- Empty states disappear, so never put information the user needs later only there.

## Loading

- Silent for anything that resolves within about half a second; a skeleton in place of the content for longer waits; determinate progress when the real progress is known.
- Name a long operation by what it does for the user; never narrate internal steps and never invent progress.

## Error

- Show the error where it happened, say what failed and the next action, and keep the user's input.
- Internal codes, service names, and stack details stay in logs; a support reference appears only when the user needs to quote it.
- A failure the user can retry offers the retry in place.
- A frequent error is a design problem, not a copy problem.

## Confirmation and destructive actions

- Recoverable actions happen immediately with undo where the product supports it; confirmation is for actions that cannot be undone and are not the obvious result of what the user just chose.
- A confirmation names the object and the consequence, and its button repeats the action ("Delete 3 photos", 「删除照片」), never Yes/No/OK.

## Success

- Routine success is the visible change itself: the item appears, the toggle moves, the counter updates.
- Explicit celebration only for what the user worked for, scaled to the effort; it never delays the next action.

## Permission and privacy

- Ask for a permission in the moment it is needed, saying what the user gets from it.
- Public visibility, data sharing, and deletion consequences are stated plainly where the user makes the choice; this text belongs to the floor.
