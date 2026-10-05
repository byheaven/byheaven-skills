# Claude Code runtime notes

Read only when running in Claude Code. This file maps Manager requirements to Claude mechanisms and adds no policy.

## Worktree

Use the native `EnterWorktree` tool in this conversation when isolation is useful; its base follows the `worktree.baseRef` setting. Check exact remote currency explicitly only when the delivery itself requires it.

Inside an isolated worktree, Claude Code checks each Bash call's command text with a guard compiled into the CLI (observed in Claude Code 2.1.289). Literal commands, `;` lists, pipelines, loops, `if`, subshells, heredocs, and arithmetic pass. It refuses three shapes: an interpreter (`python3`, `node`, `sed`, `awk`) whose program text contains a runtime value such as `$f`, `$HOME`, or `$((…))`, even in a plain command; `awk` with a non-literal program inside a loop or other compound command; and `git` inside `$(…)`. Pass a runtime value as an argument instead of inside the program text (`python3 -c '…' "$HOME"`), or put the logic in a script in the session scratchpad through Write and run it as `sh <file>` or `python3 <file>`. Its true refusals, `git -C <shared checkout>` and `cd <shared checkout> && git …`, stay refused; rewrite them to run inside the worktree. A sub-agent directive for work inside the worktree carries this paragraph.

This paragraph maps observed CLI behavior, not a requirement. Re-probe it by 2026-11-13 or when a refusal differs from it; when the guard no longer refuses these shapes, delete everything but the shared-checkout rule, which protects the requirement that a worktree-isolated session's git operations target its own worktree.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a rendered attachment, a Claude Artifact, or an authorized accessible page according to the judgment and the current client's capabilities. A Claude Artifact is an option only when that client can render it; remote control does not by itself prove Artifact or local-preview access. Preserve the exact object and version, and provide operable interaction when the decision depends on it. If one carrier is unavailable, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.
