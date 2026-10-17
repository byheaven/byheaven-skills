# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/manager-0.14.0...HEAD)

## [0.14.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.13.0...manager-0.14.0) (2026-10-17)

- **A writing brief before every draft** Before drafting or revising product
  copy, a post, an article, or a document written to be read, Claude shows you
  who the author and the reader are, what the piece is for, what the reader
  should take away and feel, and the style it recommends with concrete
  references. It drafts only after you approve
- **Your own writing sets your voice** When you are the author, the brief draws
  its style references from voice samples you chose and from what you have
  already written on the topic. For a piece built on your own thinking, you
  give the argument and key sentences and the draft keeps them
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
