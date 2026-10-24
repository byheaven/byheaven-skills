# Grok Bot runtime notes

Read only when running in Grok Bot. This file maps Manager requirements to Grok Bot mechanisms and adds no policy. Which bots fill the roles below, their agent ids, and the machines and model CLIs they use come from the deployment's own Grok Bot binding, which the user's instructions name.

## Conversation

Each Manager is one persistent Grok Bot agent with one long-lived conversation. Its session id is that bot's agent id.

## Direction owner

The deployment's binding names the direction-owner bot. It sends each [Handoff](direction.md#handoff) to the project's Manager bot as an agent-to-agent message. A task the user starts directly in this bot is directed here under [Direct start](direction.md#direct-start). A returned handoff question, a Reopen Direction delta, including one from a directly started task, and a project-loop finding that needs direction go back to the direction owner the same way. A question or decision that needs the user follows [Asking](#asking).

## Asking

When the deployment's binding names an ask route, such as a bot that answers within delegated decision authority or puts the question to the user, that route is this binding's external ask route: every question or decision this bot needs from the user goes there as a priority agent-to-agent message, including in a conversation the user started in this chat. Without one, ask in this chat. This bot still answers the user's own questions, and reports results, in this chat. That mapping is the native user-question tool.

## Review carrier

For [Review presentation](production.md#review-presentation), follow [Asking](#asking) and put the exact object in a form the user's client can open. Preserve the exact object and version. If this chat cannot carry the object, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. This mapping grants no new publishing or sharing authority.

## Production

Send each bounded slice, as an agent-to-agent message, to the worker bot the deployment's binding names for its kind: code, knowledge, or design (a flow, screen, its states, or its interface copy; that bot works as the plugin's [designer](../../../agents/designer.md) agent). A worker bot keeps its own conversation and long-term memory; generalizable lessons return to the Manager as findings, and shared rules change only through the reviewed path. The Manager passes a writer through only when the user named one; otherwise the deployment's binding selects the writer and its machine, and a directive changes no CLI's model.

The code worker creates its own worktree of the repository's shared checkout on a new branch off `origin/main` for a new slice, or at the pull request's head for a follow-up round, per [Applicability and boundary](repo-integration.md#applicability-and-boundary). The writer runs sandboxed to that worktree with workspace write access and leaves the tree uncommitted; the code worker inspects the diff, runs the checks, commits, pushes the branch, and opens one draft pull request per slice. The directive names that branch as its write boundary and carries this paragraph.

Each worker returns the observed state with its result:

- code: the pull request URL, the changed files, the checks run, the writer's CLI, model, selection reason, and session id, and the branch and HEAD sha;
- knowledge: the paths and sha256 of every file it creates or changes;
- design: the review object in a form the user's client can open, and the paths and sha256 of every file it creates or changes.

## Verification

The Manager decides when to verify. Where the deployment's binding names a verifier bot, the Manager sends the artifact there as an agent-to-agent message and keeps every decision on acceptance, blocking findings, and merging. Each judging run is a fresh isolated run with only the [verifier](../../../agents/verifier.md) charter and the directive, on a model whose family did not produce the artifact, chosen and invoked as the deployment's binding says. A producer never dispatches its own verifier.

For code, the verifier works in its own detached worktree at the exact pull request head per [Applicability and boundary](repo-integration.md#applicability-and-boundary), removed once the verdict is recorded. Confirm HEAD equals the pull request head sha, and `git status --porcelain` in that worktree is empty before and after the run.

For non-code product plans and documents, the verifier runs read-only against a copy whose sha256 matches what the producer reported, and the hashes are unchanged after the run. When no model of another family is available, report that cross-model verification could not run. P1 product-direction items are marked for the user to judge and are never scored, and that judgment follows [Asking](#asking).

The receipt is the counterpart's session id and the observed state. A later turn resumes that session with the same CLI. When the host asks before running a command, that ask is the platform gate for the command.

## Waits

A bounded or external wait, including a pull request, ends the turn on a Grok Bot routine scheduled to wake this conversation. Register the wake, with the terminal signal and the deadline, before ending the turn. Read [pr_wait.py](../scripts/pr_wait.py) verdicts as that script defines them. A loop that polls inside this conversation is not the wait.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, the Manager merges the pull request itself through the GitHub connector with a squash merge. No cloud agent is dispatched to merge. A repository that requires a `Judge:` line gets that line in the pull request body. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, leave this conversation open.
