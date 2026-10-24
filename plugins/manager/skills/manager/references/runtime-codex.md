# Codex runtime notes

Read only when running in Codex. This file maps Manager requirements to Codex mechanisms and adds no policy.

## Loading

The plugin's session-start hook ([codex.json](../../../hooks/codex.json)) runs only at `startup` and tells the new session to load the `manager` skill. Resume, clear, compaction, and `codex exec` runs get nothing from it; load the skill yourself there when you need the role. Codex does not expand `${CLAUDE_PLUGIN_ROOT}`: resolve it to the installed plugin root, the directory that contains `agents/` and `skills/`, two levels above the `manager` skill's directory. Read the installed copy, not a repository checkout of this plugin, unless the task changes the plugin.

## Roles and sub-agents

Codex registers none of the plugin's `agents/*.md` files as agents. To dispatch a worker or verifier, start a sub-agent with the session's sub-agent tool when it has one, and give it the role file's body, the full text of each skill its `skills:` frontmatter lists, and then the directive. Without a sub-agent tool, run the same assembled prompt as a one-shot `codex exec` in the worker's worktree, or produce the slice yourself under [Topology](production.md#topology). A Codex sub-agent runs a model from Codex's own provider, so it is not another model family: a cross-family judge needs another family's CLI route.

## Asking

Use the question tool the session exposes and allows in its current mode: `request_user_input` where the mode permits it (Plan mode), otherwise `request_user_input_async`. With neither, ask in the conversation and wait for the answer. Silence is not an answer.

## Worktree and permissions

Codex has no worktree tool: create one with `git worktree add` per [Applicability and boundary](repo-integration.md#applicability-and-boundary). The session's sandbox and approval policy decide what it may write and run. A role or directive cannot widen them, and a refused action is reported as blocked.

## Waits

Wait on a pull request with [pr_wait.py](../scripts/pr_wait.py) inside its bound. Codex has no scheduled wake for this conversation, so a wait longer than the session can hold ends the turn, stating the terminal signal and the deadline.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a file path the user's client can open, or a rendered attachment where the client supports one. Preserve the exact object and version. This mapping grants no new publishing or sharing authority.
