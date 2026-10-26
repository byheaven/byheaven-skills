# Codex runtime notes

Read only when running in Codex. This file maps Manager requirements to Codex mechanisms and adds no policy.

## Loading

The plugin's session-start hook ([codex.json](../../../hooks/codex.json)) runs only at `startup` and tells the new session to load the `manager` skill. Resume, clear, compaction, and `codex exec` runs get nothing from it; load the skill yourself there when you need the role. Read the installed copy, not a repository checkout of this plugin, unless the task changes the plugin.

## Roles and sub-agents

The plugin's Codex manifest registers no agents, so an agent type the session offers under the same name is not established as the plugin's role. When the plugin's `agents/` files are installed, dispatch a worker or verifier by starting a sub-agent with the session's sub-agent tool, give it the role file's body, the full text of each skill its `skills:` frontmatter lists, and then the directive. Start it with fresh context, inheriting none of this conversation (with `spawn_agent`, `fork_turns="none"`): a verifier must judge independent of the producer's reasoning. The other frontmatter fields (`effort`, `memory`, `color`) have no Codex mapping and change nothing here.

Without a sub-agent tool, run the same assembled prompt as a one-shot `codex exec` in the worker's worktree, or produce the slice yourself under [Topology](production.md#topology). A Codex sub-agent runs one of Codex's own models, not another family: a cross-family judge needs a carrier for another family.

## Asking

Classify the question before choosing `request_user_input` or `request_user_input_async`, using the current mode's instructions and each tool's contract.

A required answer, including restatement confirmation or an unresolved user-owned choice, uses a native question tool only when the mode permits that use and its unanswered path keeps dependent work pending. A tool restricted to optional questions or requiring continuation on an empty answer is ineligible. With no eligible tool, ask directly in plain text and end the turn to await the reply. A preselected option is not an answer; if a required question completes with no answer, ask it in plain text and end the turn. An asynchronous acknowledgement only means the question was queued: keep dependent work pending and continue only independent, already-authorized work until the reply arrives.

An optional question may use a tool whose contract allows continuing without an answer; follow that contract if the result is empty.

## Worktree and permissions

Codex has no worktree tool: create one with `git worktree add` per [Applicability and boundary](repo-integration.md#applicability-and-boundary). The session's sandbox and approval policy decide what it may write and run. A role or directive cannot widen them, and a refused action is reported as blocked.

## Waits

A wait that fits inside this turn runs [pr_wait.py](../scripts/pr_wait.py) within its bound. Codex offers no wake that resumes this conversation after the turn ends, so a longer wait cannot meet [Dependency waits](evidence.md#dependency-waits) here: report it as blocked on that missing capability, with the terminal signal and the deadline, rather than treating the ended turn as the wait.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a file path the user's client can open, or a rendered attachment where the client supports one. Preserve the exact object and version. This mapping grants no new publishing or sharing authority.
