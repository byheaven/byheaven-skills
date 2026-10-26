# Changelog

## [Unreleased](https://github.com/byheaven/byheaven-skills/compare/manager-0.35.1...HEAD)

## [0.35.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.35.0...manager-0.35.1) (2026-10-26)

### Bug Fixes

- **Principles** P3 now says the simplicity test holds between agents too: keep chains of hand-offs short, since each hand-off must add new information, such as an independent review or a required authority, and one that adds neither is removed

## [0.35.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.34.1...manager-0.35.0) (2026-10-26)

**Works with any host as is** — The plugin now states what Manager needs
from a host (loading, asking, dispatching sub-agents, isolation,
verification, waiting, review carriers, merging, completion) and lets your
agent meet each need with its host's own tools. Per-host binding files are
gone; a binding your own instructions name still applies, and a need the
host cannot meet is reported as blocked.

**No one person's setup built in** — Roundtable takes its Seat roster,
search requirements, and CLI shapes from your instructions, and Seats reply
in your language; its session file goes to a scratch directory outside the
repository. Writing
you reserve for yourself (your own posts, articles, books) is yours to
write: Content Creator assists, and drafts none of it. It no longer ships
one person's platform limits or skip-and-revision rules, and example paths
are placeholders instead of one machine's layout.

### Breaking Changes

- **Manager** `runtime-claude.md`, `runtime-codex.md`, and `runtime-grokbot.md` are removed; name your host binding in your own instructions if you relied on them
- **Roundtable** The built-in Seat roster and CLI shapes are removed; without a roster in your instructions, the Host offers the model families it can reach and confirms the room with you
- **Content Creator** `references/platforms.md` and `references/anti-perfectionism.md` are removed, along with the built-in procedure for assisting personal posts, articles, and books
- **Principles** The first-reply restatement rule is removed, and Discussion no longer opens with a restatement round

### Improvements

- **Code Production** The shared-checkout rule links the current repository-integration reference on `main` instead of a pinned commit
- **Writing for Agents** Refers to the project instruction file instead of naming host-specific file names

## [0.34.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.34.0...manager-0.34.1) (2026-10-26)

### Bug Fixes

- **Codex** Required confirmations use a question route that keeps dependent work waiting for your answer, with a direct text question when no suitable native tool is available

## [0.34.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.33.0...manager-0.34.0) (2026-10-25)

**Fewer, lighter reviews** — Work that needs an independent judge gets one
review round from another model family by default, and a fix the verifier
spelled out closes on a diff check instead of a second round. A follow-up
runs only for an unresolved critical or high finding, or a fix that changes
behavior beyond what was prescribed. Outside the high-risk class,
documentation and records, corrections that change no meaning, hash-checked
mirrors, version metadata, and test path fixes close on the producer's own
check and deterministic evidence, with no independent judge.

## [0.33.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.32.0...manager-0.33.0) (2026-10-25)

**Related issues travel together** — When Manager dispatches work from a
queue or turns followups into new work, it now groups issues that touch
the same area and are judged the same way into one task instead of sending
one task per issue, so setup and review happen once and your limit on tasks
in flight covers more of the queue. Each task still stays small enough for
one producer: one pull request a reviewer can judge in a single pass, or a
short chain of two or three. Urgent fixes and blockers can still go out on
their own.

## [0.32.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.31.0...manager-0.32.0) (2026-10-25)

**Every request starts with a restatement** — The `principles` skill now
carries the first-reply rule. Your first reply to a request is a restatement
of the intent the agent infers, what you observed, and your assumptions with
evidence, and it acts only after you confirm. The only exceptions are a
factual question about current state, an answer to a question the agent just
asked, and a request to continue the current work. Every host and cloud
session that loads the plugin gets it, not only the ones that read your global
rules.

## [0.31.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.30.1...manager-0.31.0) (2026-10-25)

**Several Managers can share a project** — When your project binding names
more than one Manager working at once, they divide the work by claim. Each
takes only tasks no other Manager has claimed and owns them to closure, and a
limit on work in flight counts each Manager's own dispatches. Every duty has
exactly one owner, with the default Manager your binding names taking
whatever no one owns, including the one list of questions for you. When the
shared branch goes red, only the Manager that merged the failing commit
dispatches the repair, so two Managers no longer fix the same failure.

## [0.30.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.30.0...manager-0.30.1) (2026-10-25)

**Work threads keep their roles** — A session whose project instructions or
starting brief give it a role other than Manager, such as one that delivers a
given task and leaves claiming, dispatch, and closure to a Manager, now takes
that role instead of loading Manager. Conversations you start directly, and
sessions assigned Manager, still load it.

## [0.30.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.29.0...manager-0.30.0) (2026-10-24)

**Restatements cite what you decided before** — Before restating your
request, Manager looks up the decisions, experiments, and records it touches
and cites them as the evidence for the intent it infers and for or against
each of your assumptions. In a blind replay of three real cases this raised
intent capture on both ambiguous requests and left clear questions answered
directly.

## [0.29.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.28.0...manager-0.29.0) (2026-10-24)

**Your real intent comes first** — Every Discussion now opens with a round of
its own that states the intent Manager infers from the whole context, what
you observed, and each assumption your request carries, marked as yours with
the evidence for or against it. You confirm or correct it before any
diagnosis, and confirming it starts no work.

**Cross-model designs by default** — Decisions that fix an interface or
architecture others depend on, change stored data, are costly to reverse, or
restructure a user journey now get derivations from another model family
without anyone first naming a blind spot. Interface routes return a usage
sketch, and that sketch is what you review in Grill. Open shape commitments
in Delivery are drafted by two model families as competing candidates.

**Evidence over abstract plan review** — Open questions in a plan are
answered by probes and prototypes. The "meet Acceptance yet fail its purpose"
review now runs only for plans costly to reverse, and the polishing loop
covers designs, not plans.

### Improvements

- **Competing candidates** Selection fixes its criteria before fan-out, has
  Manager and a judge from another family score independently and compare,
  and reframes the task instead of averaging when candidates diverge too far
  to pick
- **Experience gate** Heavy and medium versions are drafted by producers from
  different model families where available
- **Code production** A new or reshaped interface starts from its README-style
  usage and real call sites, then derives the types from them
- **Basis line** Names only the principles that changed the choice and what
  each ruled in or out
- **Independent derivation** An unavailable or out-of-quota family falls back
  to the next one the deployment's model routing names, and a missing
  cross-family route is stated with the decision it affects
- **Roundtable** Seat models and effort come from the deployment's model
  routing when one is named

## [0.28.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.27.0...manager-0.28.0) (2026-10-24)

**One skill is the role** — The `manager` skill now holds the whole Manager
role and reads the `principles` skill directly, so the role lives in one
place on every host. Claude Code gets it the way Codex already does: the
plugin's startup hook loads the skill.

**Manager without the plugin** — Installing only the skills, for example
with `npx skills add`, now gives you the full Manager role. Worker and
verifier agents still come with the plugin.

### Breaking Changes

- The `manager` agent and its `manager:manager` agent type are gone, so remove
  `"agent": "manager:manager"` from your Claude settings and any
  `--agent manager:manager` flag from your launch commands, since the hook now
  loads the role

## [0.27.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.6...manager-0.27.0) (2026-10-24)

**Manager works in Codex** — A new Codex runtime binding tells Manager how
Codex loads the role and finds the plugin's files, and how it dispatches
workers and verifiers as fresh-context sub-agents and asks you questions. When
Codex cannot resume a long wait, Manager reports the wait as blocked instead
of pretending it waits.

**One method on every host** — The role, skills, and references no longer
name a host, its tools, or a model. Each host's mechanics live in its runtime
binding, listed in one index, and the Claude Code binding now also covers
questions, sub-agents, and waits.

**Your setup stays yours** — The Grok Bot binding describes only Grok Bot's
mechanisms; which bots own direction, take your questions, write, and verify
come from your own deployment binding. `content-creator` no longer bundles a
copy of one person's notes-vault rules or assumes who you are: a workspace's
own document rules load with that workspace.

### Improvements

- The roundtable stays user-invoked in Codex too, keeps its seat roster next
  to its routes, and asks you exact questions through your host's question
  route
- `writing-for-agents` names the user-invoked metadata of each host
- The `content-creator` skill no longer shows a stale version of its own, so
  the manager plugin's version is the only one to compare when updating

## [0.26.6](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.5...manager-0.26.6) (2026-10-23)

**Your runtime binding picks the machine and model** — On Grok Bot, the
writer and verifier CLIs run on whichever machine your runtime binding names
for each one, instead of one fixed machine. The `code-worker` and `verifier`
agents no longer pin a model or effort, so they run on the host's default
unless you choose one. The roundtable seats `@Claude` whenever a logged-in
route exists, like the other families.

**Scripted Claude runs leave the repository alone** — A `claude -p` or Agent
SDK run, such as a writer or judge another agent launches, no longer gets the
Manager loader line or runs the branch-currency fetch, so the hook writes
nothing into that run's repository. `codex exec` runs already worked this way.
The fetch now runs only in a session the hook recognises as interactive; a
session it cannot place still gets the loader line, without the fetch.

## [0.26.5](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.4...manager-0.26.5) (2026-10-23)

**Typed answers on your terms** — When your global rules require option
cards to end with a free-text option, Manager report Decisions and roundtable
questions now include it, so you can type your own answer.

## [0.26.4](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.3...manager-0.26.4) (2026-10-23)

**Scripted Codex runs keep their own role** — A `codex exec` run, such as a
writer or judge another agent launches, no longer receives the Manager
loader line or the branch-currency notice, so it works under the charter its
directive names. Interactive Codex sessions still start as Manager.

## [0.26.3](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.2...manager-0.26.3) (2026-10-22)

**Follow-up rounds stay on the pull request** — A Codex session is told to
move to a fresh worktree only when the branch's own same-named remote branch
has commits it lacks. A branch that merely tracks `main` or another branch now
only hears that that branch has newer commits.
New slice branches are created without tracking `main`, and a follow-up round
on an open pull request works at that pull request's head.

## [0.26.2](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.1...manager-0.26.2) (2026-10-22)

**Your project's own checks come first** — When a project names its own
decisive check for the screens a change touches, Manager follows it instead of
rerunning every registered end-to-end check before acceptance. When a
repository has a written testing standard, code workers follow it instead of
the plugin's own testing rules.

## [0.26.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.26.0...manager-0.26.1) (2026-10-22)

**Every question for you arrives in one place** — On Grok Bot, a bot sends
every question or decision it needs from you to Flow, even in a chat you
started with that bot; Flow answers it or brings it to you. Grilling,
roundtable, and Manager reports with decisions also follow where your global
rules send such questions, not only their format.

## [0.26.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.6...manager-0.26.0) (2026-10-22)

**Verifiers judge by the producer's standards** — A verifier now loads the
same standard skill the producer applied to that kind of work (code, writing
for people, agent-facing rules, or user-facing design) and cites the rule
behind each finding. Its directive carries the approved writing brief, the
approved review object, and the governed-change excerpt where they apply.

## [0.25.6](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.5...manager-0.25.6) (2026-10-22)

**Problems get fixed at their cause** — P3 now asks agents to find what
produces a problem and fix it there before picking the simplest solution. A
probe, periodic check, monitor, or workaround that leaves the cause in place
counts only as a labeled interim step.

## [0.25.5](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.4...manager-0.25.5) (2026-10-22)

**Your writer choice takes precedence** — On Grok Bot, Manager passes your named
writer to Code Worker, overriding the routing rule. Without a named writer,
Code Worker follows your runtime binding's writer-selection rule.

## [0.25.4](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.3...manager-0.25.4) (2026-10-22)

**A verifier bot can check your work** — On Grok Bot, your runtime binding can
name a shared verifier bot that runs each check on another model family, while
Manager still decides acceptance and merging.

## [0.25.3](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.2...manager-0.25.3) (2026-10-22)

**Questions follow your own format** — When your global rules say how a
message that needs your reply should look, grilling rounds, roundtable
questions, and Manager reports with decisions now use that format.

## [0.25.2](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.1...manager-0.25.2) (2026-10-22)

**More models can check your code** — Grok Bot uses your runtime binding to
choose writers and read-only verifiers from different model families.

## [0.25.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.25.0...manager-0.25.1) (2026-10-22)

**Writer choice stays yours** — On Grok Bot, only a writer you name overrides
the selection rule, and directives leave both CLI models unchanged.

## [0.25.0](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.4...manager-0.25.0) (2026-10-21)

**Code written on your Mac** — On Grok Bot, the Codex CLI or the Cursor CLI
on your Mac mini writes the code instead of Cursor cloud agents. Manager
verifies that code on the other model.

## [0.24.4](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.3...manager-0.24.4) (2026-10-21)

**Tasks you start with Manager are discussed there** — A task you start
directly with Manager is discussed and locked in that conversation with the
same direction method, then delivered there. Once delivery starts, a decision
that needs you uses the runtime's external ask route when it has one, and
otherwise asks you in that session.

## [0.24.3](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.2...manager-0.24.3) (2026-10-21)

**Questions follow Asking** — In Grok Bot, a question or decision that
needs you follows the runtime Asking rule. A review object stays in a form
your client can open, and a P1 product-direction item stays marked for you
to judge and is never scored. Roundtable and newproject follow that rule.

## [0.24.2](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.1...manager-0.24.2) (2026-10-21)

**Design slices stay with Designer** — A flow, a screen, its states, or its
interface copy belongs to the designer agent. Knowledge Worker returns a
slice like that as out of scope.

## [0.24.1](https://github.com/byheaven/byheaven-skills/compare/manager-0.24.0...manager-0.24.1) (2026-10-21)

**Shared checkout stays put** — A checkout other sessions also use keeps
the branch and commit where a session found it. Coding and verification,
including sub-agents and cloud agents, run in that session's own worktree.
When the branch is behind, the session-start notice tells you to work from
a fresh worktree off the remote branch. The verifier runs its checks only
in a worktree of its own, and cross-family verification follows that same
rule. Permission to work on the current branch applies only to a checkout
this session alone uses. The code-production skill follows that rule before any repository action,
including an install, build, test, or check, and the link is pinned to the
commit that contains the rule so a standalone install does not read an older copy.

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
