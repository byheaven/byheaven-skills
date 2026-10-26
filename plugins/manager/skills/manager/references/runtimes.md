# Runtime capabilities

Manager needs the capabilities below from whatever host it runs in. Each states the requirement only; the mechanism is the host's. Before a runtime-native action, map the requirement to the host's own native mechanism, or read the binding the deployment names for this host when the user's instructions name one. When neither meets a requirement, report it as blocked rather than approximating it. A binding maps requirements to mechanisms and adds no policy; on Manager method and role semantics this skill wins.

Which bots, agent ids, machines, accounts, and model CLIs a deployment uses belong to that deployment's own binding. This plugin names none of them.

## Loading

The session that acts as Manager has the `manager` skill and the `principles` skill it links in context. When a host loads nothing automatically, or a resumed, cleared, compacted, or one-shot session lost them, load the skill yourself before acting as Manager. Read the installed copy, not a repository checkout of this plugin, unless the task changes the plugin.

## Asking

Every question or decision the user owns goes through the host's native user-question tool, or through the external ask route the deployment's binding names when it names one. A required answer keeps dependent work pending until the user answers: a tool that may continue on an empty or preselected answer is not eligible for it, and with no eligible tool, ask in plain text and end the turn to await the reply. An acknowledgement that a question was queued is not an answer; continue only independent, already-authorized work until the reply arrives. An optional question may use a tool whose contract allows continuing without an answer.

## Sub-agent dispatch

Dispatch a worker or verifier as a sub-agent that starts with fresh context and inherits none of this conversation: a verifier must judge independent of the producer's reasoning. It runs the plugin's role file for its kind, with each skill that file's `skills:` frontmatter lists, followed by the directive. When the host registers the plugin's agents, dispatch that registered role; otherwise give the sub-agent the role file's body and the full text of each listed skill. A role name the host offers is the plugin's role only when the host registered it from this plugin. Without a sub-agent capability, run the same assembled prompt as a one-shot run in the worker's worktree, or produce the slice yourself under [Topology](production.md#topology).

A sub-agent of the same model family as the producer is not a cross-family judge; a cross-family judge needs a carrier that runs another family.

## Isolation

Repository work that needs isolation, and every session in a shared checkout, gets its own worktree per [Applicability and boundary](repo-integration.md#applicability-and-boundary): the host's native worktree surface when the session's instructions allow it, otherwise `git worktree add`. Every git operation of a worktree-isolated session targets its own worktree. The host's sandbox and approval policy decide what a session may write and run; a role or directive cannot widen them, and a refused action is reported as blocked. A directive for a sub-agent working in the worktree carries any host restriction on commands there that the deployment's binding records.

## Verification carrier

A judge that [Manager acceptance](evidence.md#manager-acceptance) selects runs as a fresh isolated run with only the [verifier](../../../agents/verifier.md) charter and the directive, on the model family that step selects. For code, it reads the exact pull request head in its own detached worktree, clean before and after the run and removed once the verdict is recorded. For a document, it reads a copy whose sha256 matches what the producer reported, and the hashes are unchanged after the run. A producer never dispatches its own verifier.

## Wait and wake

A bounded or external wait, including a pull request, ends on its terminal signal or deadline per [Dependency waits](evidence.md#dependency-waits), through a mechanism that resumes this conversation when it ends: a background command that exits on the signal or the deadline, such as [pr_wait.py](../scripts/pr_wait.py), or a scheduled wake registered with the terminal signal and the deadline before the turn ends. Polling in the foreground is not the wait. A wait that fits inside the current turn may run within its bound. When the host offers no way to resume this conversation after the turn ends, a longer wait is blocked on that missing capability: report it with the terminal signal and the deadline rather than treating the ended turn as the wait.

## Review carrier

For [Review presentation](production.md#review-presentation), put the exact object and version in a form the user's current client can open: inline content, a file the client can open, a rendered attachment, a rendered artifact the client can display, or an authorized accessible page. Remote control does not by itself prove that the client can display a rendered artifact or a local preview. Provide operable interaction when the decision depends on it. If one carrier is unavailable, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. No carrier grants new publishing or sharing authority.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, Manager merges the pull request itself through an interface to the repository host the session can use, following the repository's own merge rules. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, the conversation stays as the deployment's binding or the user's instructions leave it; this plugin closes no conversation.
