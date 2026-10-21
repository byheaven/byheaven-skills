# Grok Bot runtime notes

Read only when running in Grok Bot. This file maps Manager requirements to Grok Bot mechanisms and adds no policy.

## Conversation

Each Manager is one persistent Grok Bot agent and one long-lived conversation. Record the runtime as `grokbot` (`WORKFLOW_RUNTIME`) and the session id as that bot's Grok Bot agent id.

## Asking

Ask the user with a question card in this chat. That card is the native user-question tool.

## Review carrier

For [Review presentation](production.md#review-presentation), put the exact object in this chat, in a form the current client can open, and use a question card when the user must choose or interact. Preserve the exact object and version. If this chat cannot carry the object, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.

## Code production

Send each bounded code slice to the persistent Code Worker bot as an agent-to-agent message. That bot is shared across projects, keeps its own conversation and long-term memory, and generalizable lessons return to the Manager as findings; shared rules change only through the reviewed path. It launches one Cursor cloud agent for the slice on the repository's self-hosted My Machines worker on the user's Mac mini (Yus-M6.local), never on a Cursor-managed VM. Before launching, it calls the Cloud Agents `workers` action and selects the worker whose workspace is that repository (for example `~/amio` or `~/byheaven-skills`); when none is listed, it stops and reports to the Manager. The named worker starts in the repository's shared checkout, and the cloud agent works in its own worktree per [Applicability and boundary](repo-integration.md#applicability-and-boundary). Keep one branch and one draft pull request per slice. The directive names that branch as its write boundary, may name a model, and carries this paragraph; the Code Worker passes a named model through. The result brings back the pull request URL, the changed files, the worker's checks, and the observed state: branch and HEAD sha.

## Knowledge production

Send each bounded knowledge slice to the persistent Knowledge Worker bot as an agent-to-agent message. That bot is shared across projects, keeps its own conversation and long-term memory, and generalizable lessons return to the Manager as findings; shared rules change only through the reviewed path. It writes the documents the directive names and returns their paths, the sha256 of every file it creates or changes, and the observed state.

## Verification

Each verification is a fresh isolated run. Same-family verification is a fresh background subagent spawned for that verification alone. Give it the [verifier](../../../agents/verifier.md) charter and the directive only.

Cross-family verification runs on the Mac mini through the vault's cross-model launcher, directing the Codex CLI read-only (Claude is temporarily paused; Grok and Codex verify each other). For code, fetch the pull request head into the persistent Mac mini clone, create a detached worktree at the pull request head sha, run Codex read-only verification there, confirm HEAD equals the sha, then remove the worktree. For non-code product plans and documents, Codex reads the Mac mini copy of the vault after confirming each file's sha256 hash matches the Grok Bot box copy; P1 product-direction items are marked for the user to judge and are never scored. The receipt is that counterpart's session id and the observed state. A later turn resumes that session through the same launcher. When the launcher's host asks before running a command, that ask is the platform gate for the command.

## Waits

A bounded or external wait, including a pull request, ends the turn on a Grok Bot routine scheduled to wake this conversation, or on the cloud agent's completion notification when that notification is the terminal signal. Register the wake, with the terminal signal and the deadline, before ending the turn. Read [pr_wait.py](../scripts/pr_wait.py) verdicts as that script defines them. A loop that polls inside this conversation is not the wait.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, the Manager merges the pull request itself through the GitHub connector with a squash merge. No cloud agent is dispatched to merge. A repository that requires a `Judge:` line, such as `byheaven/byheaven-skills`, gets that line in the pull request body. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, leave this conversation open.
