# Runtime capabilities

Meet each capability through the host's native mechanism or the deployment binding; report an unavailable layer as blocked. A binding maps mechanisms and adds no task-owner or Manager policy. Deployment bot ids, machines, accounts and model CLIs stay outside this plugin.

## Loading

Load the assigned role before judgment and reload it after context loss; for an owned task use the [task-owner role](../../../agents/task-owner.md) and its checklist. When automatic loading is absent, load them yourself from the installed copy, unless changing the plugin. Hooks carry reminders and never certify gate completion.

## Asking

A session whose questions go to its dispatcher or to an ask session never asks or waits on the user: it ends the turn with each decision the user owns, with context, recommendation, and any exact wording proposed, in its result or through the ask route; whoever relays it continues this same session with the answer. Every other session asks in its own conversation and ends the turn while the user decides. The user's own rules for such questions set their form; without them, give the choices, the recommended one first, answerable in one step where the host offers it and always in the user's own words. Until the answer arrives only independent, already-authorized work proceeds; an empty or preselected answer, or an acknowledgement that the question was queued, is not an answer.

## Sub-agent dispatch

Dispatch bounded work with fresh context and the focused directive. A verifier always receives the plugin's verifier role and its listed skills, without producer reasoning. A writer may use a worker charter when it adds necessary method or context; otherwise its directive and applicable skills suffice. Use a registered role only when the host registered it from this plugin; otherwise supply its body and listed skills. Without a sub-agent capability, run the same assembled prompt as a one-shot run in its own worktree, or keep a writer slice yourself; verification always uses [Verification carrier](#verification-carrier).

A sub-agent of the same model family as the producer is not a cross-family judge; a cross-family judge needs a carrier that runs another family.

## Isolation

Repository work that needs isolation, and every session in a shared checkout, gets its own worktree per [Applicability and boundary](repo-integration.md#applicability-and-boundary): the host's native worktree surface when the session's instructions allow it, otherwise `git worktree add`. Every git operation of a worktree-isolated session targets its own worktree. The host's sandbox and approval policy decide what a session may write and run; a role or directive cannot widen them, and a refused action is reported as blocked. A directive for a sub-agent working in the worktree carries any host restriction on commands there that the deployment's binding records.

## Verification carrier

The task owner, including one that produced the artifact, commissions the judge required by [Owner acceptance](evidence.md#owner-acceptance). A verdict grants no action authority or waiver of P1. Risk classification follows Owner acceptance item 2; required family, model and effort follow deployment routing, never producer preference. Use a permitted native sub-agent/task, the selected family's CLI or a deployment launcher, which may apply the selection but not replace it.

Run fresh and isolated with the [verifier](../../../agents/verifier.md) charter, listed skills, locked Acceptance and exact artifacts, without producer reasoning; the verifier derives checks and judgment independently. Pin code to exact head/base in a clean detached worktree, documents to matching sha256 copies, with read-only access. Authenticate unchanged hashes and a clean tree after the verdict, then remove the tree. Non-zero exit, timeout, changed artifacts or missing verdict yields no valid verdict. Report any difference between selected and observed model/effort in the Judge line.

## Wait and wake

An external wait needs a terminal signal, deadline and supported route that resumes its owner on either result. Use the host's permitted native continuation mechanism; temporary yield preserves that route, and completion or cancellation removes it. A pending snapshot or queued callback is not a result. A permitted same-turn wait runs within its bound; dispatched work resumes through its result route after the owner yields. If bounded continuation is unavailable, report the missing capability rather than substitute an unsupported watcher or claim timeout delivery.

## Review carrier

For [Review presentation](production.md#review-presentation), put the exact object and version in a form the user's current client can open: inline content, a file the client can open, a rendered attachment, a rendered artifact the client can display, or an authorized accessible page. Remote control does not by itself prove that the client can display a rendered artifact or a local preview. Provide operable interaction when the decision depends on it. If one carrier is unavailable, use another sufficient authorized carrier; only the absence of any suitable carrier leaves the review gate open. No carrier grants new publishing or sharing authority.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, the task owner merges the pull request itself through an interface to the repository host the session can use, following the repository's own merge rules. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback, the conversation stays as the deployment's binding or the user's instructions leave it; this plugin closes no conversation.
