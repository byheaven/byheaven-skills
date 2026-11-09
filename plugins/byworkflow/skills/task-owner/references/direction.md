# Direction

Direction helps the user form a tested judgment before Delivery. It is run by the **direction owner**, the conversation where the user forms project ideas; the session that delivers a task, its **task owner**, receives its result through [Handoff](#handoff), except for a task the user starts directly in that session, which directs it itself under [Direct start](#direct-start). A user's explanation or proposed solution is an input to assess; the original meaning and authorization remain distinct. The direction owner investigates facts, challenges a false premise, and recommends the simplest coherent direction; the user owns value, risk, taste, and irreversible choices.

## Intent

A task's Intent is its **Goal**, which Direction locks: why the work exists, written as the result that is visible once it is done rather than a direction; for a problem, that result includes its class not recurring (P3 in always-loaded rules). The task owner sets scope and method by P1–P3, except a method the user picked, and **Acceptance** by P2, as the observable predicates by which completion is judged, each naming its [true judge](evidence.md#owner-acceptance), and at least one observing the effect the work exists to produce rather than the artifact alone, where the delivery itself can show that effect; an effect only later real use can show is the observation below. What lies beyond its authority goes up under [Asks](#asks).

When the work's value rests on an effect only later real use can show, Direction also names that **observation** outside Acceptance: the effect, the observation that would refute it, the earliest date that observation can exist, and the keep, adjust, and withdraw conditions, which are owner decisions settled with the user. Completion carries it under [Predicate closure](evidence.md#predicate-closure).

The locked Goal changes only by reopening Direction. A product or technical plan whose choice is consequential or costly to reverse settles under [Before a plan settles](plans.md#before-a-plan-settles).

### Practitioner's bar

For a product plan, a design, or other work whose quality rests on domain method, set Goal and Acceptance where a leading practitioner in each field the work involves would set them. Find the fields by restating the work's nouns as verbs: a review deck becomes getting busy people to believe a cause and decide under uncertainty, which brings in analysis, narrative, and decision-making. For each field kept, name what its best practitioners would check that the request does not, the rawest material and the methods that check runs on, and a judge outside the producer and the user wherever one exists. Keep a field only when such a check could change the result, and bring it in as that check applied to the work. Excellence sets the bar; verification effort still scales with risk under P2, and an effect only later real use can show becomes an observation.

## Discussion

Discussion is the direction owner's default state and creates no task record. Read enough live authority to separate the requested solution, observed symptoms, underlying outcome, and cost of solving the wrong problem. Resolve factual prerequisites yourself rather than delegating investigation to the user. State the diagnosis, recommendation, uncertainty, and material tradeoffs.

If the project defines an improvement or learning method, read its applicable branch before interpreting project feedback, a user-proposed explanation or solution, or a learning opportunity. Sufficient evidence and effective authorization let an ordinary correction proceed without a formal experiment or renewed approval.

For an existing app in a repository, read its open pull requests, remote branches, and worktrees before locking an interface, cutting a worktree, or dispatching a sub-agent. Approved but unmerged work is landed in the user's eyes; its merge order against the new work is a frontier question.

Under P1, defer only actions dependent on an unsettled user-owned choice; continue unaffected work covered by an effective Delivery request. Discussion ends with a settled direction in the current conversation; the direction owner hands it to a task owner under [Handoff](#handoff) only once the user explicitly asks for the work.

Before asking the user to judge a concrete review object, follow [Review presentation](review-presentation.md).

## Grill

Grill is Discussion's convergence procedure. This plugin's `grilling` skill supplies the round mechanics; Frontier admission, Value bets, the Defaults ledger, and Completion below take precedence where the skill differs.

**Frontier admission.** A decision that adds or changes what a person sees or operates, or that sets the Goal, value, risk, taste, or an irreversible step, is an owner decision. The direction owner derives its answer from the principles and the Vision's commitments, then tests it against the references. The user's words in this conversation settle it directly. A recorded user preference, project rule, or past user decision whose conditions still hold settles it only when it agrees with that derivation; where they diverge, the decision enters the frontier with both. The direction owner's own judgment of importance is not a source; every other such decision enters the frontier with its recommended answer. A technical implementation choice inside settled bounds is the task owner's routine judgment in Delivery; it enters the frontier only when different readings would lead to materially different work, and always when it alters the Goal. A fork whose answer is an observable property — which approach is faster, whether a layout fits, what an interface returns, whether a behavior reproduces — is a factual prerequisite: when a bounded prototype, measurement, or probe within current authority can settle it, the direction owner runs that observation and cites the result as a verified fact, so only what the observation leaves open reaches the frontier. A choice that alters the Goal still enters the frontier, carrying the observation as evidence; every owner decision named above — including taste, value, risk, and bets on real user behavior — stays with its owner whatever a prototype shows, and the observation settles only the property it measured. A decision whose class is uncertain enters the frontier.

**Value bets.** A user-facing product change is a *value bet* when user behavior could refute it — users start, return, pay, tell someone, or do not — and a *taste decision* when no user behavior could. Whoever originates it, user or agent, and even when the user's own words are its source, a value bet enters the frontier with what it must beat, why it should work and the Vision clause it serves, and the observation on real users that would refute it. Candidates in the frontier rank by how soon their refuting observation can be made on real users, not by how convincing the derivation reads. A taste decision the user states directly. When the user refuses or drops a value bet, the direction owner appends it at that moment to the project's proposal log, if it keeps one, with the user's stated reason and any actual refuting evidence, or reports the missing log rather than creating one. A refusal without a reason or observation remains unexplained, not empirically refuted.

When the user picks [Independent derivation](#independent-derivation) in a round, its divergences enter the next round as options.

**Defaults ledger.** At round closure the direction owner lists each owner decision it closed by source, one line each with the source. Routine technical choices stay agent-owned under P1 and are not listed. The user may pull any line back into the frontier.

**Completion.** Grill completes when the frontier is empty, the ledger is shown, and the user confirms shared understanding; a first round whose frontier is already empty completes at once by showing the ledger, the confirmation step being waived because nothing was asked. Closure locks direction only; the handoff still needs the user's explicit action request unless one is already effective under [Delivery gate](#delivery-gate).

## Independent derivation

Independent derivation can expose materially different options before a user-owned commitment. Its value depends on added relevant information, not the number of routes or model brands; agreement alone is not verification. Selected routes remain provenance-isolated: no route receives another route's result.

**Trigger.** It runs only when the user picks it. Every question asking the user to pick a route offers an option to have another model family derive independently, labeled as the deployment names it; when the user picks it, one route from one other family runs, then a new question follows. For an interface decision, the route also returns a **usage sketch**: README-style usage, two or three real call sites, and the types derived from them. Preserve user-owned choices whether derivation runs or not, and state the route's concrete question and expected contribution in the direction context.

**Timing.** Run the route after the user picks it and before the decision it informs; the new question shows the derived route or its divergences. Reassess only when new evidence or a material change invalidates a route's premise or exposes a new consequential question; narrow any follow-up to that question. A later user choice is carried as fact and is not by itself a reason to replay all derivations.

**Routes.** Run one route from a family other than the direction owner's, taking its family, model, and effort from the deployment's model routing when one is named, and using the runtime's configured cross-model carrier if one exists. The direction owner may derive its own route while that route runs. A same-family observer may add information through a distinct method or observation, but is never labeled cross-family evidence. A requested route counts only after its bounded result arrives.

**Packet.** Every route derives from one redacted packet file, alone in a scratch folder outside the repository: Problem, the user's settled decisions, and the current state as result-level facts — what already works and what was tried and falsified — with secrets and private identifiers removed. The packet names no implementation path, and the direction owner writes its own route to disk only after every dispatched route has returned. The project's Vision, entered through its project entry, is the only project reference chain a route expands. For a decision governed by a shared method, the packet also names the applicable authority and branch; the route reads that normative authority before deciding. This permits standards reading, not implementation or additional project evidence. A route anchors its derivation on the principles and the Vision's commitments, reached through the foundation chain; the packet's settled decisions bound it, and its current-state facts are references that test it. A route never derives from implementation, earlier derivations, or another route's draft. A route that does not load the user's global rules also receives the [global-rules excerpt](production.md#topology). Each route returns its Goal, `Context consulted`, and open questions.

**Unavailable.** Report an unavailable selected route with its observed failure layer; an unselected or unattempted route is not unavailable. Partial or timed-out output is not a completed derivation. Preserve a user-specified model or family; if unavailable, report it and request substitution. Otherwise use only deployment-authorized fallback the host permits. A missing route stays missing, never evidence of adequacy.

**Synthesis.** Derivations are inputs to one direction, never candidates to pick between. Compose the strongest parts. Each substantive divergence any single route raises — a value, user-outcome, or risk divergence, or one that cannot be composed without choosing a side — becomes its own explicit option in the round, however many routes share it; surface every disagreement rather than averaging it. The handoff, and the task record or else the delivery report, carry one `Independent derivation:` line whenever the user picked it: the family that ran and what it changed or left unresolved, or the missing route.

## Handoff

A handoff transfers authorized work to its task owner. Its first message carries:

- **Outcomes:** the results the work must deliver, each with who judges it.
- **Intent:** locked Goal, observation, user-selected route or method, and Defaults ledger.
- **Authority:** the user's exact action request, source and date; keep it separate from the sender's interpretation.
- **Scope and Acceptance:** boundaries, true judges, dependencies and exact artifact/write target.
- **Context and return:** required sources, owner/session, result route and coordinator question route. Missing routing is a gap, not permission to ask elsewhere.

A park/queue request uses the same packet; the receiver creates any required record. An onward handoff preserves the locked Intent.

The receiver does not re-confirm a complete handoff with the user; it checks the handoff against live state and opens Delivery at the gate below. A gap, a contradiction with live state, or an owner decision still open is one precise question under [Asks](#asks). **Reopen Direction** is a delta that would change the Goal. Send the delta and its evidence under [Asks](#asks). Only the work it affects waits, and that work resumes when a revised Intent returns.

## Asks

Every question or decision for the user, including a Reopen Direction delta and a question sent back from an incomplete handoff, follows [Asking](runtimes.md#asking).

## Direct start

A user-started task forms and confirms its Goal in that conversation through Discussion, Grill and any selected Independent derivation. No handoff is needed; [Delivery gate](#delivery-gate) opens execution there.

## Delivery gate

An effective action request opens Delivery after the Goal confirmation required by the user's rules. A pure confirmation proceeds without another round. A request that names a determined change to make is such a request even when phrased as a question or a wish ("can you…", "help me…"); an evaluation of current work is not. A request made before Discussion remains effective only when the settled direction stays within its Goal. If Discussion or Grill materially changes the Goal, obtain a new explicit action request.

Direction may skip extended Discussion and the Grill rounds only when a reproducible semantic defect exists, exactly one behavior is correct, scope and objective Acceptance are already settled, no owner decision remains open, and explicit Delivery authority exists. No keyword, file class, task size, or task-owner confidence creates another carve-out.

Once Delivery opens, distill the settled direction into the project's task record when the project requires one. Implementation plans and agent-owned adaptations remain transient.
