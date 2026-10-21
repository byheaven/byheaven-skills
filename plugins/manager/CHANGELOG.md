# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.0...HEAD)

## [0.24.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.23.0...manager-0.24.0) (2026-10-21)

**Manager delivers; direction is settled elsewhere** — Manager is now the
delivery role of a project, not the place where you discuss ideas. You settle
direction (Discussion, Grill, independent derivation) with a separate
direction owner, which hands Manager the locked Intent (Goal, Boundary,
Approach, Acceptance, and any observation) together with your quoted go-ahead.
Manager does not ask you to confirm it again: it starts Delivery, creates any
task record, dispatches, verifies, and integrates. It still asks you directly
for small choices inside that Intent, such as approving a review object, a
completion gate, or which followups to take; anything that would change the
direction goes back to the direction owner.

- New `designer` agent: one bounded flow, screen, state set, or interface-copy
  slice from a Manager directive, built with `experience-design`, with
  `content-creator` for interface copy only
- The session-start line in Claude Code and Codex now calls Manager the
  delivery role and says direction is settled with the direction owner

## [0.23.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.22.0...manager-0.23.0) (2026-10-21)

**Short Manager reports** — Manager now reports done, partially done, or
blocked work in a few lines: a one-sentence conclusion, links you can open, and
numbered one-line decisions with a question card only when you have a real
choice. A high-risk change adds one line naming the model family that
verified it, and unfinished work gets one line. Verification details and
evidence stay in the pull request or task record the report links, and the
fixed "Followup: none" line is gone.

## [0.22.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.21.3...manager-0.22.0) (2026-10-20)

- **Roundtable** A new user-invoked `roundtable` skill asks one question of
  several real model families, each answering independently from the same
  packet, then compares them in one saved session file. The default room is
  every family the session can reach: Codex, Grok with X search, and Gemini
  with web search; Claude is paused and joins only when you name it. A
  conclusion you adopt applies to all models, so it lands in shared rules,
  not one model's private setup
- The document-architecture rules bundled with content-creator are
  regenerated from the vault, so their principles links point at the
  `manager:principles` skill sections

## [0.21.3](https://github.com/byheaven/byheaven-skills/compare/manager-0.21.2...manager-0.21.3) (2026-10-20)

- The principles skill now says where P1–P3 come from: they are a synced
  copy of the Human-Agent Principles in your global rules file
  (`AI/AGENTS-global.md` in the byheaven vault), so a change to them starts
  there and is then mirrored into the plugin

## [0.21.2](https://github.com/byheaven/byheaven-skills/compare/manager-0.21.1...manager-0.21.2) (2026-10-20)

- The document-architecture rules bundled with content-creator now link the
  vault's global guidance at its new home, `AI/AGENTS-global`, so their
  Operational Baseline, Human-Agent Principles, and Project Vision links
  resolve again

## [0.21.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.21.0...manager-0.21.1) (2026-10-20)

- A Grok Bot Manager merges an authorized pull request itself, with a squash
  merge through the GitHub connector and the repository's required `Judge:`
  line in the pull request body, instead of sending a cloud agent to merge.
  A platform safety check may still ask you to confirm; that confirmation is
  a platform gate and leaves the recorded authorization unchanged

## [0.21.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.20.1...manager-0.21.0) (2026-10-20)

- **Run Manager in Grok Bot** You can run the same Manager role in Grok Bot,
  alongside Claude Code and Codex. A Grok Bot session reads how asking,
  production, verification, waiting, and merge map onto that host: code slices
  run on your self-hosted Mac mini worker, verification uses Codex there, and
  knowledge outputs carry sha256 for cross-copy checks. Discussion, delivery,
  and evidence stay the rules they already are

## [0.20.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.20.0...manager-0.20.1) (2026-10-20)

- Content Creator loads document-architecture rules from the vault's `AI/`
  folder, and the bundled mirror follows that path, so a session can still
  read them after the vault rename

## [0.20.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.19.1...manager-0.20.0) (2026-10-18)

- **Reviews judge decisions against your own words** When a reviewer checks
  what a record says you decided, it now gets your verbatim words as the
  standard, and any agent-written proposal you replied to arrives labelled as
  agent-written. A detail inside a proposal you agreed to as a whole is no
  longer read as your own decision

## [0.19.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.19.0...manager-0.19.1) (2026-10-18)

- `pr_wait.py` keeps waiting, for up to two minutes, when GitHub reports a PR
  as blocked before any check has registered, instead of returning a gated
  verdict right after a push

## [0.19.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.18.1...manager-0.19.0) (2026-10-18)

- **Plans settle only after routes, tests, and a failure question** A
  consequential product or technical plan now lays out two or three routes
  that differ in mechanism, runs the smallest test of each assumption that
  would change the route before choosing (an untested one keeps its
  dependent commitments provisional), and its review asks how the plan could
  meet its criteria and still fail its purpose
- **Polishing loop for designs and plans** After a candidate is chosen, a
  fresh judge from another model family compares it with the benchmark each
  round and names the largest gaps; the producer fixes those. It stops at
  benchmark level, after two rounds without gain, or after five rounds.
  Correctness review still runs once

## [0.18.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.18.0...manager-0.18.1) (2026-10-18)

- The session-start remote refresh no longer runs programs a checkout's own
  config names. The fetch allows only standard transports and the stock
  upload-pack, with automatic maintenance and lazy object fetches off, and a
  repository whose config sets a credential helper, an ssh command, a
  configured hook, an include, a custom upload-pack, a partial-clone promisor,
  or transport permissions is not fetched; the notice falls back to the last
  fetch and says why

## [0.18.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.17.0...manager-0.18.0) (2026-10-18)

- **You judge quality at the design stage** A heavy or medium change now
  reaches you as two or three clickable high-fidelity versions with real
  copy, realistic data, and every state, each beside the benchmark and
  carrying its experience scenarios. A fresh reviewer renders, compares, and
  walks each version first, so only versions that pass reach you. There is no
  separate wireframe review; when versions differ in flow, a one-page overview
  shows each route and you decide flow and look together. The build is then
  compared, rendered, against the version you approved
- **Games and 3D get playable prototypes** A game mechanic or 3D scene is
  reviewed as a playable graybox on the target device, a visual target, and a
  frame rate measured on a real device

## [0.17.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.16.0...manager-0.17.0) (2026-10-18)

- **An approved draft sets direction, not the ceiling** The draft you approve
  fixes the journey, its steps, states, actions, entry points, information
  priority, and what the copy says. Within that direction, implementation goes
  past the draft's fidelity: visual polish, every viewport, motion and
  feedback, and the states that follow by convention. A new step, action,
  setting, or sentence still comes back to you
- **Designs are judged on the experience, not only on matching the draft** A
  heavy or medium user-visible change names a benchmark and the two or three
  experience scenarios a leading team would not ship without, such as finding
  a remembered moment. A fresh reviewer renders the result and walks those
  scenarios; a candidate that fails one is fixed even if it matches the draft
  and passes every test

## [0.16.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.15.0...manager-0.16.0) (2026-10-18)

- **Escaped bugs become review replay cases** When an escaped bug is one a
  reviewer of the change that introduced it could have reported, Manager
  records it as a fixed case: the reviewed state, what the review was given,
  and the defect it should have reported. Changing the verifier, a review
  checklist, or the verifier-dispatch rules now replays every case under the
  old and the new text, and a case the new text misses blocks the change
  until it is caught again or you accept the loss
- **Every verifier finding gets a recorded resolution** Once each verifier
  finding is settled, Manager marks it fixed, wrong, intentional, or
  immaterial, adds one row per finding to the finding ledger, and reports the
  counts with the delivery, so the false-alarm share can be measured
- **You choose where the records live** Both records go where your own or the
  project's instructions say; without a location, the delivery reply carries
  them instead

## [0.15.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.14.0...manager-0.15.0) (2026-10-17)

- **Acceptance checks the effect, not just the artifact** Every delivery's
  acceptance now includes at least one check that watches the change do what
  it is for: a rule change is run to see an agent behave differently, a script
  is run on a real case. Reviews of the text, passing linters, and a merge no
  longer stand in for that
- **The session-start notice looks at the remote** When a session starts in a
  git checkout, Manager now fetches the remote default branch and the branch's
  upstream, within two seconds per remote, and says when your checkout lacks
  commits either has, even on a branch with no upstream. Each line says whether
  it was refreshed just now or why refreshing failed. The fetch never prompts
  for credentials, runs no repository hooks, and writes only remote-tracking
  refs
- **Acceptance wording for later effects** An effect that only later real use
  can show stays an observation outside Acceptance

## [0.14.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.13.0...manager-0.14.0) (2026-10-17)

- **A writing brief before every draft** Before drafting or revising product
  copy, a post, an article, or a document written to be read, Claude shows you
  who the author and the reader are, what the piece is for, what the reader
  should take away and feel, and the style it recommends with concrete
  references. It drafts only after you approve
- **Your posts, articles, and books stay yours** For anything published under
  your name, Claude assists and writes none of the text: it asks questions that
  draw out your view, gathers what you have already written and read, points
  out gaps in your outline, reads your draft as your reader would, and fixes
  only typos and punctuation. A book gets a workspace with your chapter map,
  material, and a consistency check
- The fixed voice rules are gone: the Paul Graham voice target, the Chinese
  hard rules, the banned-phrase lists, and the fixed lengths and structures per
  platform. Platform notes now carry only each platform's hard limits

## [0.13.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.12.1...manager-0.13.0) (2026-10-17)

- **Goals and acceptance criteria set at an expert's bar** For a product plan,
  a design, or other method-heavy work, Manager finds the fields involved by
  restating the work as verbs, then writes the goal and acceptance criteria
  the way the best practitioner in each field would: the checks they would
  insist on, the raw material and methods those checks use, and a judge other
  than the producer and you where one exists. A field counts only when one of
  its checks could change the result. How hard each criterion is verified
  still follows its risk
- **Designs name the experience to beat** Experience design now names the
  best existing experience for the job and scene and judges the rendered
  result against it quality by quality

## [0.12.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.12.0...manager-0.12.1) (2026-10-17)

- `pr_wait.py` no longer reports a failed check when a run was cancelled and
  replaced by a later run of the same check; only the latest run of each check
  counts

## [0.12.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.11.0...manager-0.12.0) (2026-10-17)

- **A stale checkout says so at session start** When a session opens in a git
  checkout whose branch trails its upstream, Manager is told how many commits
  behind it is and to read the upstream before saying whether something exists

## [0.11.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.10.0...manager-0.11.0) (2026-10-17)

- **One command tells you where a PR stands** `scripts/pr_wait.py` polls a
  GitHub pull request within a time bound and reports a single verdict with
  its own exit code: ready, merged, conflict, review threads open, checks
  failed, waiting on a merge gate, timed out, or query failed. Checks that do
  not gate the change can be left out with `--ignore-check`

## [0.10.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.9.0...manager-0.10.0) (2026-10-16)

- **A third fix waits until the premise is tested** After two fixes built on
  the same assumption fail the same check, agents write the assumption down
  and test it directly before trying again
- **Batch edits checked one unit at a time** A sweep or batch of similar
  edits is checked unit by unit, and reuses an existing command or gets a
  small script a reviewer can rerun
- **Easier code to follow** The structure reference now asks for fewer
  pass-through layers and less hidden state

## [0.9.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.8.0...manager-0.9.0) (2026-10-16)

- **A correction you repeat changes the structure, not the instructions**
  When the same correction comes back, the principles now ask agents to
  change what allowed it (an owner, an interface, or a check where the lesson
  can be formalized) instead of writing more text; text keeps only the lessons
  that need judgment
- **Fewer comments, clearer code** Code changes keep a comment only for what
  the code cannot say. A surprising behavior in our own code is fixed by
  reshaping the code, and agents reread their diff to remove narrating
  comments, needless defensive checks, and type-checker bypasses. A new
  structure reference covers data shape, boundaries, safe reruns, shared
  state, and commit order
- **Every open question says what waits** A question you own now says what
  proceeds and what waits until you answer
- **Safety claims say how far they were checked** A claim that a change is
  safe names whether it was only asserted, traced to a line, walked through,
  run, or reproduced in the product
- **Rule tests run blind** Running a document to test a rule change hides
  that it is a test from the agent and the outputs' origin from the judge

## [0.8.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.7.0...manager-0.8.0) (2026-10-13)

- **Independent followups can run in parallel** When a project's standing
  delivery mandate allows parallel sessions, a followup that depends neither
  on the finished delivery nor on the rest of the continuation becomes its
  own queued record for a new session, within the mandate's concurrency
  limit. Dependent followups still continue in the same conversation

## [0.7.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.5...manager-0.7.0) (2026-10-09)

- **Experiences with fewer, better words** A new `experience-design` skill
  guides any work on what people experience in a product. It starts from the
  job the person wants done and the journey: fewer steps and requests, value
  before any ask, a designed peak and ending, and freedom to leave. A list of
  manipulative patterns never ships. On each screen, every element and string
  must earn its place, the system stops explaining itself, and the remaining
  text follows one set of Chinese and English conventions; money, irreversible
  actions, privacy, and what a person cannot see always keep their words.
  Manager and its workers and verifier apply it to every user-facing change

## [0.6.5](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.4...manager-0.6.5) (2026-10-08)

- **"Just do it" still shows you the preview** Telling Manager to go ahead
  now authorizes the build but no longer settles how it looks: anything you
  have not chosen is shown to you before the parts that depend on it, unless
  you say to skip the review. Choices you state in the request stay settled

## [0.6.4](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.3...manager-0.6.4) (2026-10-08)

- **Interface changes to your own tools get a preview** A status line, pane,
  or other interface mod for your own setup now gets the same review object
  as product work before it is built
- **Effects that need real use get named up front** When a delivery's value
  can only show in later use, its opening states what to watch and asks you
  to settle the keep, adjust, and withdraw conditions
- **Sub-agent prompts follow the writing rules** Every prompt Manager hands
  to a sub-agent is now written with the agent-writing rules loaded

## [0.6.3](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.2...manager-0.6.3) (2026-10-08)

- **New tests need a source outside the code** A producer now adds a test
  only for a bug reproduction, a decided requirement whose cases another
  agent writes from the requirement (on trial), or a trust boundary; any
  other change runs the existing checks. Tests that restate the
  implementation, such as copied counts, rosters, copy, or mock-call
  assertions, are deleted or rewritten when an intended change breaks them

## [0.6.2](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.1...manager-0.6.2) (2026-10-08)

- **A fixed basis line** Recommendations, decision requests, and acceptance
  judgments now carry one line right after the conclusion naming the red
  lines and the principle or Vision clause behind them
- **Acceptance written down at the start** A delivery now opens, before
  any action, with its goal, boundary, and acceptance; without a task
  record, the pull request states them too
- **Escaped bugs and high-risk changes caught early** Manager now recognizes
  a defect you report in something already delivered, and a high-risk
  change that needs a reviewer from another model family, from any turn
  instead of only after opening a reference file

## [0.6.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.6.0...manager-0.6.1) (2026-10-08)

- **Followups at every close** Manager now runs its closing steps before
  reporting any finished delivery, including work with no task record, and
  ends that report with its followups, or a line saying there are none.
  Before, these steps were only reached when the agent opened a
  separate reference file, and in practice they were skipped

## [0.6.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.5.0...manager-0.6.0) (2026-10-08)

- **Content creator, bundled** The `content-creator` skill now ships with the
  plugin in Claude Code, cloud sessions, and Codex. It drafts posts, essays,
  and governance documents in the author's voice, and the knowledge worker
  loads it for user-authored content. This plugin is now its only source
- **Codex startup only** Manager's loading reminder now runs only when a new
  Codex session starts. Resuming, clearing, or compacting the session no longer
  injects it again. Claude Code's startup behavior is unchanged.

## [0.5.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.4.0...manager-0.5.0) (2026-10-07)

- **Performance numbers you can trust** Before reporting or acting on a
  performance number, code production now names what limits it, counts
  errors, confirms the timed work actually ran, alternates at least five runs
  per side, and states the share of the end-to-end wait; otherwise the result
  is reported as inconclusive
- **Safety fact** The verifier now names the one fact a code or configuration
  change is safe because of, proves it by running real code, and looks for
  breakage that a symbol search misses

## [0.4.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.3.0...manager-0.4.0) (2026-10-07)

- **Startup hook for Claude Code** Every Claude Code session with the plugin
  enabled now gets the same `SessionStart` reminder Codex uses, so Manager is
  the default role even where the host ignores the `agent` setting, such as
  Claude Code project threads on claude.ai
- **Writing for agents, bundled** The `writing-for-agents` skill now ships
  with the plugin in both Claude Code and Codex, and Manager loads it before
  writing any skill, rule, agent instruction, sub-agent directive, or task
  Acceptance another agent will execute
- **Performance changes** Code production now measures a baseline before the
  first edit, tries remedies cheapest first, keeps only those that move the
  number, and reports baseline, result, delta, and conditions

## [0.3.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.2.0...manager-0.3.0) (2026-10-06)

- **Principles** Derivation anchors only on the principles and the
  commitments of the project's Vision, and begins by stating the red lines
  they or the user draw; current facts (including those a Vision records),
  decision history, and existing practice are references that test a
  conclusion, never its starting point. A recorded
  preference, rule, or past decision settles an owner decision in Grill only
  when it agrees with that derivation; a divergence goes to the user with both

## [0.2.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.1.0...manager-0.2.0) (2026-10-05)

- **Evidence** High-risk predicates (authentication, money, deletion,
  privacy, irreversible actions, and changes to a Vision or a rule) always get
  an independent verifier from another model family by default, with no
  blind-spot reason required; terminal evidence names each predicate's judge
  so a later audit can check the choice

## [0.1.0](https://github.com/byheaven/byheaven-skills/compare/a5b412ebb6d4e4c31be99fda1adb6165460347f7...manager-0.1.0) (2026-10-05)

- **Manager role** A `manager` agent that discusses first, delivers only on
  an explicit request, and closes every Acceptance predicate through a
  qualified judge before claiming completion; it carries the full role and
  the principles from the first turn, and a `manager` skill loads it in
  runtimes that cannot select the agent
- **Principles** The `principles` skill holds the Human-Agent Principles
  P1-P3, project-foundation guidance with first-principles derivation as the
  default, and the operational baseline; CI fails when the agent's copy
  drifts from it
- **Intent** Defines Goal, Boundary, Approach, and Acceptance, the four
  dimensions a settled direction locks
- **Grill** Ships the `grilling` skill, so question rounds work the same on
  every machine
- **Sub-agents** `verifier`, `code-worker`, and `knowledge-worker` agents plus
  a shared `code-production` skill for bounded, independently judged work;
  workers report a material assumption the Acceptance leaves open instead of
  deciding it
- **Evidence** Defines commitment identity: a repair inside the same locked
  Intent and Acceptance keeps it, a change to what is promised does not
- **Governed changes** A temporary capability patch carries its review date
  and exit condition
- **Codex startup** Loads the Manager role in Codex through a session hook,
  without changing Claude Code's agent-based startup
- **Claude worktree note** Describes what the worktree command guard in
  Claude Code 2.1.289 actually refuses
- **Plugin page** Shows the plugin's description on Claude Code's plugin page
  when it is installed from the marketplace
