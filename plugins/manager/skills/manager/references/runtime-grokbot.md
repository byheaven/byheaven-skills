# Grok Bot runtime notes

Read only when running in Grok Bot. This file maps Manager requirements to Grok Bot mechanisms and adds no policy.

## Conversation

Each Manager is one persistent Grok Bot agent and one long-lived conversation. Record the runtime as `grokbot` (`WORKFLOW_RUNTIME`) and the session id as that bot's Grok Bot agent id.

## Direction owner

The direction owner is the user's personal-assistant bot (Flow), except for a task the user starts directly in this bot, which this bot directs under [Direct start](direction.md#direct-start). Flow sends each [Handoff](direction.md#handoff) to the project's Manager bot as an agent-to-agent message. A returned handoff question, a Reopen Direction delta, including one from a directly started task, and a project-loop finding that needs direction go back to Flow the same way. A question or decision that needs the user follows [Asking](#asking).

## Asking

Asking is this binding's external ask route. When the user asks or tasks this bot directly, this bot answers the user in this chat, and a question card in this chat is used only then. Every other question or decision that needs the user goes to Flow (agent id `cefe2a76-1627-423e-95d9-9c68ff768c5a`) as an agent-to-agent message. Flow answers within the delegated decision authority in vault `AI/agents/flow.md`, or escalates to the user with a recommendation. That mapping is the native user-question tool.

## Review carrier

For [Review presentation](production.md#review-presentation), follow [Asking](#asking) and put the exact object in a form the user's client can open. Preserve the exact object and version. If this chat cannot carry the object, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.

## Code production

Send each bounded code slice to the persistent Code Worker bot as an agent-to-agent message. That bot is shared across projects, keeps its own conversation and long-term memory, and generalizable lessons return to the Manager as findings; shared rules change only through the reviewed path. The Code Worker chooses the Codex CLI or Cursor CLI on the user's Mac mini (Yus-M6.local) by the writer-selection rule named in the project's runtime binding and passes through any writer or model the directive names. It creates its own worktree of the repository's shared checkout at the task-owned path `~/tmp/<writer>/<slice>`, on a new branch off `origin/main`, per [Applicability and boundary](repo-integration.md#applicability-and-boundary). The writer CLI runs sandboxed to that worktree with workspace write access and leaves the tree uncommitted. The Code Worker inspects the diff, runs the checks, commits, pushes the branch, and opens one draft pull request per slice. Cursor cloud agents and Cursor-managed VMs are not used. The directive names that branch as its write boundary and carries this paragraph. The result brings back the pull request URL, the changed files, the checks run, the writer's CLI, model, selection reason, and session id, and the observed state: branch and HEAD sha.

## Knowledge production

Send each bounded knowledge slice to the persistent Knowledge Worker bot as an agent-to-agent message. That bot is shared across projects, keeps its own conversation and long-term memory, and generalizable lessons return to the Manager as findings; shared rules change only through the reviewed path. It writes the documents the directive names and returns their paths, the sha256 of every file it creates or changes, and the observed state.

## Design production

Send each bounded design slice (a flow, screen, its states, or its interface copy) to the persistent Designer bot as an agent-to-agent message. That bot is shared across projects and works as the plugin's [designer](../../../agents/designer.md) agent; it keeps its own conversation and long-term memory, and generalizable lessons return to the Manager as findings; shared rules change only through the reviewed path. It returns the review object in a form the user's client can open, the paths and sha256 of every file it creates or changes, and the observed state.

## Verification

Each verification is a fresh isolated run with only the [verifier](../../../agents/verifier.md) charter and the directive.

For code, the Manager runs the verifier on the Mac mini, on the CLI whose model did not write the code. The Codex CLI, read-only through the vault's cross-model launcher, verifies Cursor-written code. The Cursor CLI, in its read-only ask mode and with the user's CLI permissions denying writes to verification worktrees, verifies Codex-written code. The Code Worker never dispatches the verifier. The verifier works in its own detached worktree at the exact pull request head per [Applicability and boundary](repo-integration.md#applicability-and-boundary). Confirm HEAD equals the pull request head sha, and `git status --porcelain` in that worktree is empty before and after the run.

For non-code product plans and documents, same-family verification is a fresh background subagent spawned for that verification alone. Cross-family verification runs the Codex CLI read-only through the vault's cross-model launcher against the Mac mini copy of the vault after confirming each file's sha256 hash matches the Grok Bot box copy; P1 product-direction items are marked for the user to judge and are never scored, and that judgment follows [Asking](#asking).

The receipt is the counterpart's session id and the observed state. A later turn resumes that session with the same CLI. When the launcher's host asks before running a command, that ask is the platform gate for the command.

## Waits

A bounded or external wait, including a pull request, ends the turn on a Grok Bot routine scheduled to wake this conversation. Register the wake, with the terminal signal and the deadline, before ending the turn. Read [pr_wait.py](../scripts/pr_wait.py) verdicts as that script defines them. A loop that polls inside this conversation is not the wait.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, the Manager merges the pull request itself through the GitHub connector with a squash merge. No cloud agent is dispatched to merge. A repository that requires a `Judge:` line, such as `byheaven/byheaven-skills`, gets that line in the pull request body. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, leave this conversation open.
