# Codex runtime notes

Read only when running in Codex. This file maps Manager requirements to Codex mechanisms and adds no policy.

## Loading

The plugin's session-start hook ([codex.json](../../../hooks/codex.json)) runs only at `startup` and tells the new session to load the `manager` skill. Resume, clear, compaction, and `codex exec` runs get nothing from it; load the skill yourself there when you need the role. Skill and role text reaches you with `${CLAUDE_PLUGIN_ROOT}` unexpanded (Codex sets that variable only for plugin hook commands): resolve it to the installed plugin root, the directory that contains `agents/` and `skills/`, two levels above the `manager` skill's directory. Read the installed copy, not a repository checkout of this plugin, unless the task changes the plugin.

## Roles and sub-agents

The plugin's Codex manifest registers no agents, so an agent type the session offers under the same name is not established as the plugin's role. To dispatch a worker or verifier, start a sub-agent with the session's sub-agent tool, give it the role file's body, the full text of each skill its `skills:` frontmatter lists, and then the directive. Start it with fresh context, inheriting none of this conversation (with `spawn_agent`, `fork_turns="none"`): a verifier must judge independent of the producer's reasoning. The other frontmatter fields (`effort`, `memory`, `color`) have no Codex mapping and change nothing here.

Without a sub-agent tool, run the same assembled prompt as a one-shot `codex exec` in the worker's worktree, or produce the slice yourself under [Topology](production.md#topology). A Codex sub-agent runs one of Codex's own models, not another family: a cross-family judge needs a carrier for another family.

## Asking

Use the question tool the session exposes, as that tool's own description allows it in the current mode: `request_user_input` or `request_user_input_async`. With neither, ask in the conversation and wait for the answer. Silence is not an answer.

## Worktree and permissions

Codex has no worktree tool: create one with `git worktree add` per [Applicability and boundary](repo-integration.md#applicability-and-boundary). The session's sandbox and approval policy decide what it may write and run. A role or directive cannot widen them, and a refused action is reported as blocked.

## Waits

A wait that fits inside this turn runs [pr_wait.py](../scripts/pr_wait.py) within its bound. Codex offers no wake that resumes this conversation after the turn ends, so a longer wait cannot meet [Dependency waits](evidence.md#dependency-waits) here: report it as blocked on that missing capability, with the terminal signal and the deadline, rather than treating the ended turn as the wait.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a file path the user's client can open, or a rendered attachment where the client supports one. Preserve the exact object and version. This mapping grants no new publishing or sharing authority.
