# Grok Bot runtime notes

Read only when running in Grok Bot. This file maps Manager requirements to Grok Bot mechanisms and adds no policy.

## Conversation

Each Manager is one persistent Grok Bot agent and one long-lived conversation. Record the runtime as `grokbot` (`WORKFLOW_RUNTIME`) and the session id as that bot's Grok Bot agent id.

## Asking

Ask the user with a question card in this chat. That card is the native user-question tool.

## Review carrier

For [Review presentation](production.md#review-presentation), put the exact object in this chat, in a form the current client can open, and use a question card when the user must choose or interact. Preserve the exact object and version. If this chat cannot carry the object, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.

## Code production

Send each bounded code slice to the persistent Code Worker bot as an agent-to-agent message. That bot is shared across projects and keeps its own conversation. It launches one Cursor cloud coding agent for the slice, on one branch with one pull request. The cloud branch is the isolation surface and replaces a local worktree. The worker does not clone the repository locally. The directive names that branch as its write boundary and carries this paragraph. The result brings back the pull request URL, the changed files, the worker's checks, and the observed state: branch and HEAD sha.

## Knowledge production

Send each bounded knowledge slice to the persistent Knowledge Worker bot as an agent-to-agent message. That bot is shared across projects and keeps its own conversation. It writes the documents the directive names and returns their paths and the observed state.

## Verification

Same-family verification is a fresh background subagent spawned for that verification alone. Give it the [verifier](../../../agents/verifier.md) charter and the directive only.

Cross-family verification runs through the store's cross-model carrier, which invokes the configured external CLI counterpart read-only. The receipt is that counterpart's session id and the observed state. A later turn resumes that session through the same carrier. When the carrier's host asks before running a command, that ask is the platform gate for the command.

## Waits

A bounded or external wait, including a pull request, ends the turn on a Grok Bot routine scheduled to wake this conversation, or on the cloud agent's completion notification when that notification is the terminal signal. Register the wake, with the terminal signal and the deadline, before ending the turn. Read [pr_wait.py](../scripts/pr_wait.py) verdicts as that script defines them. A loop that polls inside this conversation is not the wait.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, dispatch a cloud agent with the pull request and the recorded grant it is applying. Grok Bot has no merge tool of its own. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, leave this conversation open.
