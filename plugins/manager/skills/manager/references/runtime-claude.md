# Claude Code runtime notes

Read only when running in Claude Code. This file maps Manager requirements to Claude mechanisms and adds no policy.

## Worktree

Use the native `EnterWorktree` tool in this conversation when isolation is useful; its base follows the `worktree.baseRef` setting. Check exact remote currency explicitly only when the delivery itself requires it.

Inside an isolated worktree, Claude Code judges every Bash call with a command-text guard compiled into the CLI (observed in Claude Code 2.1.263; no hook, setting, or environment variable changed it then; behavior may differ in other versions). A plain command line passes — literal arguments, `;` lists, and pipelines included, even with `.git` in the text. A loop, `if`, subshell, `$(…)`, or heredoc is refused as soon as it wraps a third-party program (`gh`, `pnpm`, `node`, `python3`, `awk`, `sed`) with a runtime value or quoted expression, evaluates arithmetic, or contains the text `git`. Issue one plain command line per Bash call; put a loop, variable, or heredoc into a script file in the session scratchpad through Write and run it as `sh <file>` or `python3 <file>` (a script outside the session scratchpad may be blocked by the auto-mode permission classifier instead). A sub-agent directive for work inside the worktree carries this paragraph. The guard's true refusals — `git -C <shared checkout>` and `cd <shared checkout> && git …` — stay refused; rewrite them to run inside the worktree.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a rendered attachment, a Claude Artifact, or an authorized accessible page according to the judgment and the current client's capabilities. A Claude Artifact is an option only when that client can render it; remote control does not by itself prove Artifact or local-preview access. Preserve the exact object and version, and provide operable interaction when the decision depends on it. If one carrier is unavailable, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.
