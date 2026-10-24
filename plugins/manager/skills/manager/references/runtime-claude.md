# Claude Code runtime notes

Read only when running in Claude Code. This file maps Manager requirements to Claude mechanisms and adds no policy.

## Asking

The native user-question tool is `AskUserQuestion`. A host surface that offers its own question card in place of it, such as a desktop next-step box, is that tool there.

## Roles and sub-agents

When the plugin is installed, its agents register as `manager:<role>`: dispatch a worker or verifier with the `Agent` tool and that `subagent_type`, for example `manager:code-worker` or `manager:verifier`. Each starts with fresh context and the skills its frontmatter lists. For a code slice in a repository, pass `isolation: "worktree"` so the worker gets its own worktree. Claude sub-agents are one model family: a cross-family judge needs a carrier for another family.

## Waits

A wait resumes this conversation through a background command that exits on the terminal signal or the deadline: run [pr_wait.py](../scripts/pr_wait.py) with Bash `run_in_background`, or, for a wait under its 30-minute cap, a `Monitor` whose command ends on that signal. The exit notification wakes this conversation. Polling in the foreground is not the wait.

## Worktree

Use the native `EnterWorktree` tool when the session's instructions allow it, otherwise `git worktree add` per [Applicability and boundary](repo-integration.md#applicability-and-boundary); a shared checkout always takes its own worktree. `EnterWorktree`'s base follows the `worktree.baseRef` setting. Check exact remote currency explicitly only when the delivery itself requires it.

Inside an isolated worktree, Claude Code checks each Bash call's command text with a guard compiled into the CLI (observed in Claude Code 2.1.289). Literal commands, `;` lists, pipelines, loops, `if`, subshells, heredocs, and arithmetic pass. It refuses three shapes: an interpreter (`python3`, `node`, `sed`, `awk`) whose program text contains a runtime value such as `$f`, `$HOME`, or `$((…))`, even in a plain command; `awk` with a non-literal program inside a loop or other compound command; and `git` inside `$(…)`. Pass a runtime value as an argument instead of inside the program text (`python3 -c '…' "$HOME"`), or put the logic in a script in the session scratchpad through Write and run it as `sh <file>` or `python3 <file>`. Its true refusals, `git -C <shared checkout>` and `cd <shared checkout> && git …`, stay refused; rewrite them to run inside the worktree. A sub-agent directive for work inside the worktree carries this paragraph.

This paragraph maps observed CLI behavior, not a requirement. Re-probe it by 2026-11-13 or when a refusal differs from it; when the guard no longer refuses these shapes, delete everything but the shared-checkout rule, which protects the requirement that a worktree-isolated session's git operations target its own worktree.

## Review carrier

For [Review presentation](production.md#review-presentation), use inline content, a rendered attachment, a Claude Artifact, or an authorized accessible page according to the judgment and the current client's capabilities. A Claude Artifact is an option only when that client can render it; remote control does not by itself prove Artifact or local-preview access. Preserve the exact object and version, and provide operable interaction when the decision depends on it. If one carrier is unavailable, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.
