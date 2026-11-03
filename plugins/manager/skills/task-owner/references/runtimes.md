# Runtime capabilities

Meet each capability through the host's native mechanism or the deployment binding; report an unavailable layer as blocked. A binding maps mechanisms and adds no policy; bot ids, machines, accounts and model CLIs stay outside this plugin.

## Loading

The host's own role setting loads the role for the whole session (the README names each host's form); reload it after context loss, or read the installed or repository copy where no setting exists. Hooks carry action reminders and never certify gate completion.

## Deployment rules

The plugin carries method only; the deployment's always-loaded rules supply P1–P3, the question route and answer form, model routing for writers, sub-agents, verifiers, judges and derivation routes, the merge grant, floors, the rule-change review route, and the record store a task uses. A session loading none of them gets the [Global-rules excerpt](production.md#topology) in its directive; a missing item is a gap to report, never a default to invent.

## Asking

A session whose questions go to its dispatcher or to an ask session never asks or waits on the user: it ends the turn with each decision the user owns, with context, recommendation, and any exact wording proposed, in its result or through the ask route; whoever relays it continues this same session with the answer. Every other session asks in its own conversation and ends the turn while the user decides. The user's own rules for such questions set their form; without them, give the choices, the recommended one first, answerable in one step where the host offers it and always in the user's own words. Until the answer arrives only independent, already-authorized work proceeds; an empty or preselected answer, or an acknowledgement that the question was queued, is not an answer.

## Sub-agent dispatch

Dispatch bounded work with fresh context and the focused directive. A verifier always receives the plugin's verifier role and its listed skills, without producer reasoning; a writer takes a worker charter only when it adds needed method or context. Use a registered role only when the host registered it from this plugin; otherwise supply its body and skills. Without sub-agents, run the assembled prompt as a one-shot in its own worktree, or keep the slice yourself; verification always uses [Verification carrier](#verification-carrier).

A sub-agent of the same model family as the producer is not a cross-family judge; a cross-family judge needs a carrier that runs another family.

## Isolation

Repository work that needs isolation, and every session in a shared checkout, gets its own worktree per [Applicability and boundary](repo-integration.md#applicability-and-boundary): the host's native worktree surface when the session's instructions allow it, otherwise `git worktree add`; every git operation then targets that worktree. The host's sandbox and approval policy decide what a session may write and run; a role or directive cannot widen them, and a refused action is reported as blocked. A sub-agent directive for the worktree carries any command restriction the deployment's binding records.

## Verification carrier

The task owner, including one that produced the artifact, commissions the judge required by [Owner acceptance](evidence.md#owner-acceptance). A verdict grants no action authority or waiver of P1. Risk classification follows Owner acceptance item 2; required family, model and effort follow deployment routing, never producer preference. Use a permitted native sub-agent/task, the selected family's CLI or a deployment launcher, which may apply the selection but not replace it.

Run fresh and isolated with the [verifier](../../../agents/verifier.md) charter, listed skills, locked Acceptance and exact artifacts, without producer reasoning; the verifier derives checks and judgment independently. Pin code to exact head/base in a clean detached worktree, documents to matching sha256 copies, with read-only access. Authenticate unchanged hashes and a clean tree after the verdict, then remove the tree. Non-zero exit, timeout, changed artifacts or missing verdict yields no valid verdict. Report any difference between selected and observed model/effort in the Judge line.

## Wait and wake

An external wait needs a terminal signal, a deadline and a supported route that resumes its owner on either result, through the host's permitted continuation mechanism; a pending snapshot or queued callback is not a result. A permitted same-turn wait runs within its bound; dispatched work resumes through its result route after the owner yields. Without bounded continuation, report the missing capability rather than an unsupported watcher or a timeout claimed as delivery.

## Review carrier

For [Review presentation](production.md#review-presentation), put the exact object and version in a form the user's current client can open: inline content, an openable file, a rendered attachment or artifact, or an authorized accessible page; remote control alone proves none of these. Provide operable interaction when the decision depends on it. Use another sufficient authorized carrier when one is unavailable; only the absence of any leaves the review gate open. No carrier grants publishing or sharing authority.

## Merge

When [Merge authorization](repo-integration.md#merge-authorization) allows the merge, the task owner merges the pull request itself through an interface to the repository host the session can use, following the repository's own merge rules. A platform safety check may still ask the user to confirm; that confirmation is a platform gate and leaves the recorded authorization unchanged.

## Completion

After the terminal readback the conversation stays as the deployment's binding leaves it; this plugin closes none.
