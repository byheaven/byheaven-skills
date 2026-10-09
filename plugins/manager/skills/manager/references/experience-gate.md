# Experience gates

Work that adds or changes what a person sees or operates, including the user's own tools such as a status line, pane, or other interface mod, passes both gates below before implementation or dispatch. A project's own design-engineering standard may refine the tiers and artifacts and may not weaken the invariants; these gates are the fallback when a project has none, and their invariants hold across projects. Source-local rules map storage and tooling and may strengthen the artifact or evidence.

## Review object gate

Whoever produces or reviews such a change applies the `experience-design` skill. For every such change, produce the smallest real, durable, version-bound review object as soon as its direction is visible and before any implementation whose shape depends on that direction. Classify the delta once:

- interaction or mixed: a low-fidelity prototype with real copy and applicable states;
- content-only: exact copy in its real UI context;
- visual-only: one representative high-fidelity sample;
- deterministic correction: the exact expected before/after result.

Present that exact object under [Review presentation](production.md#review-presentation) before requesting judgment. In this interim direction review, the user or named product owner approves taste-bearing objects; a deterministic correction passes when focused evidence matches its exact contract. Experience approval settles the direction; an earlier effective Delivery request continues to cover implementation of the approved object while its Goal, Boundary, and Acceptance are unchanged, and without one the approval does not itself authorize implementation. Selection-independent service, data, contract, and test work may continue while the gate is open. Implementation scales only from the confirmed object, returns any missing or changed user-facing decision to the gate, and closes through evidence against that same object. Whoever produced it, Manager or a sub-agent, Manager acceptance closes one additional predicate for every user-visible delivery: the P3 ceiling invariant below holds.

## Product decision gate

- **Heavy — adds or changes the structure of a user journey** (new feature, new loop, new page, cross-page flow): settle direction through [Grill](direction.md#grill) first (a refutable change is a value bet and enters as a five-part proposal), then deliver a complete user-journey wireframe — frame by frame across the journey, each frame carrying only that frame's open decisions; sources and settled content are recorded in the task record or a repository artifact. Implementation is dispatched only after the owner has adjudicated every open decision. Visual identity ships a separate representative sample for review; economic values ship an editable numeric table.
- **Medium — a single-point change to an existing screen**: one before/after mock carrying its open decisions, adjudicated the same way before implementation.
- **Light — copy, defect fixes, adjustments that do not change structure**: owner review may be skipped only when no review predicate remains user-owned; otherwise it uses the content-only or deterministic-correction review object above.

Every review object that needs owner adjudication is presented under [Review presentation](production.md#review-presentation) before judgment is requested.

**Invariant (P1).** No product setting becomes settled content, or the basis for dispatched implementation, until the product owner has explicitly chosen it. An authorization to "write it up as a document" covers only recording what has been adjudicated; it does not promote producer proposals to settings. Likewise, a bare request to proceed ("just do it", "直接做") authorizes building but settles no setting that is otherwise open: choices the owner states in the request or the current context stay settled, the Light exception above still applies, and every other open setting reaches the owner in the review object before shape-dependent work, unless the owner explicitly waives that review. Inline annotations on the review object are the default adjudication channel; the remainder closes through structured questions.

**Invariant (P3).** The approved review object is the ceiling of the user-visible surface, not its floor. Copy, states, motion, entry points, and interactions absent from the review object stay unimplemented. An unspecified state such as an empty or failure state follows the product's existing convention, or stays empty when no convention exists. A necessary state the review object missed returns to this gate as one more frame for the owner to adjudicate; neither Manager nor a producer fills it in.
