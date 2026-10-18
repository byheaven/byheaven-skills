"""Point Claude Code and Codex sessions at this installed plugin's canonical Manager loader.

When the session starts in a git checkout, also refresh the remote-tracking refs for the
remote default branch and the branch's upstream with one bounded, non-interactive fetch
per remote, and say when HEAD lacks commits either has, so claims about what exists now
are read from the remote rather than the stale tree. Each ref in the notice says whether
it was refreshed now or is only as current as an earlier fetch. The whole check stays
inside the hook's 5 s limit, and any failure still leaves the loader line.
"""

import json
import os
import re
from pathlib import Path
import signal
import subprocess
import sys
import time

BUDGET_S = 4.0  # leaves headroom under the 5 s hook timeout for the loader line
CALL_S = 0.4
FETCH_S = 2.0

# Background fetches must never ask anyone anything: no terminal prompt, no askpass
# dialog, no interactive credential manager, no ssh passphrase prompt.
GIT_ENV = {
    **os.environ,
    "GIT_TERMINAL_PROMPT": "0",
    "GIT_ASKPASS": "",
    "SSH_ASKPASS": "",
    "SSH_ASKPASS_REQUIRE": "never",
    "GCM_INTERACTIVE": "never",
}
GIT_ENV["GIT_SSH_COMMAND"] = (os.environ.get("GIT_SSH_COMMAND") or "ssh") + " -o BatchMode=yes"
# Only standard transports, whatever any config says; no lazy object fetches from
# rev-list in a partial clone; and the config scan reads the same files git fetch reads.
GIT_ENV["GIT_ALLOW_PROTOCOL"] = "https:http:ssh:git:file"
GIT_ENV["GIT_NO_LAZY_FETCH"] = "1"
GIT_ENV.pop("GIT_CONFIG", None)

# The session may open in a repository nobody has vetted, so the fetch runs nothing the
# repository's own config names: hook directories, fsmonitor and automatic maintenance
# stay off, GIT_ALLOW_PROTOCOL above admits only standard transports, and upload-pack is
# the stock binary. Command-line -c beats repository config. Only the explicit refspec is
# written, so a fetch touches nothing but the named remote-tracking refs and FETCH_HEAD.
FETCH_ARGS = ["-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false",
              "-c", "maintenance.auto=false", "-c", "gc.auto=0",
              "fetch", "--quiet", "--no-tags", "--no-recurse-submodules", "--no-auto-maintenance",
              "--upload-pack=git-upload-pack", "--refmap="]

# Keys in the repository's own config (local or worktree scope) that can make a fetch run
# a program the command line above cannot switch off. A repository that sets any of them
# is not fetched; the notice falls back to its last fetch and says why.
EXEC_KEY = re.compile(r"^(credential\..*helper|include\.path|includeif\..*|hook\..*"
                      r"|core\.(sshcommand|gitproxy|fsmonitor|askpass|alternaterefscommand)"
                      r"|gc\.recentobjectshook|remote\..*\.(uploadpack|receivepack|vcs|promisor)"
                      r"|extensions\.partialclone|protocol\.(.*\.)?allow)$", re.DOTALL)


class Git:
    def __init__(self, cwd, budget=BUDGET_S):
        self.cwd = cwd
        self.deadline = time.monotonic() + budget

    def run(self, *args, limit=CALL_S):
        """Return (ok, output). ok is True on success, False on a git error, None when the
        call timed out or could not start; output is stdout, or the reason it failed."""
        timeout = min(limit, self.deadline - time.monotonic())
        if timeout <= 0.05:
            return None, "out of time"
        try:
            proc = subprocess.Popen(
                ["git", "-C", self.cwd, *args], stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                env=GIT_ENV, start_new_session=True,
            )
        except OSError as error:
            return None, str(error)
        try:
            out, err = proc.communicate(timeout=timeout)
        except subprocess.TimeoutExpired:
            # Kill git and everything it started (ssh, helpers) before returning.
            try:
                os.killpg(proc.pid, signal.SIGKILL)
            except OSError:
                pass
            try:
                proc.communicate(timeout=0.2)
            except subprocess.TimeoutExpired:
                pass
            return None, f"timed out after {timeout:.1f} s"
        if proc.returncode != 0:
            lines = err.strip().splitlines()
            fatal = [line for line in lines if line.startswith("fatal:")]
            return False, (fatal or lines or [f"exit {proc.returncode}"])[0]
        return True, out.strip()

    def value(self, *args):
        ok, out = self.run(*args)
        return out if ok else None


def remote_of(ref, remotes):
    """Split 'remote/branch' using the configured remote names, longest first."""
    for name in sorted(remotes, key=len, reverse=True):
        if ref.startswith(name + "/"):
            return name, ref[len(name) + 1:]
    return None, None


def default_ref(git, remote):
    ref = git.value("symbolic-ref", "--quiet", "--short", f"refs/remotes/{remote}/HEAD")
    if ref:
        return ref
    for branch in ("main", "master"):
        if git.value("rev-parse", "--verify", "--quiet", f"refs/remotes/{remote}/{branch}"):
            return f"{remote}/{branch}"
    return None


def risky_repo_key(git):
    """Return the first program-running key the repository's own config sets, or None.
    An unreadable config counts as risky, so the fetch is skipped rather than trusted."""
    ok, out = git.run("config", "--show-scope", "--name-only", "--list")
    if not ok:
        return "an unreadable config"
    # Split on newlines only: git allows other line-separator characters (such as
    # U+2028) inside subsection names, and splitlines() would cut a key in two.
    for line in out.split("\n"):
        scope, _, key = line.partition("\t")
        if scope in ("local", "worktree") and EXEC_KEY.match(key.lower()):
            return key
    return None


def currency_notice(cwd):
    git = Git(cwd)
    info = git.value("rev-parse", "--is-bare-repository", "--abbrev-ref", "HEAD")
    if not info or info.splitlines()[0] != "false":
        return None
    head = info.splitlines()[1]
    # A remote name that starts with "-" would read as an option on the fetch line.
    remotes = [name for name in (git.value("remote") or "").split() if not name.startswith("-")]
    if not remotes:
        return None

    upstream = None
    if head != "HEAD":
        full = git.value("rev-parse", "--symbolic-full-name", "@{upstream}") or ""
        if full.startswith("refs/remotes/"):
            upstream = full[len("refs/remotes/"):]
    up_remote = remote_of(upstream, remotes)[0] if upstream else None
    main_remote = up_remote or ("origin" if "origin" in remotes else
                                remotes[0] if len(remotes) == 1 else None)
    default = default_ref(git, main_remote) if main_remote else None

    refs = list(dict.fromkeys(ref for ref in (upstream, default) if ref))
    if not refs:
        return None

    # One fetch per remote, each into its own remote-tracking ref only.
    status = {}
    by_remote = {}
    for ref in refs:
        remote, branch = remote_of(ref, remotes)
        by_remote.setdefault(remote, []).append((ref, branch))
    risky = risky_repo_key(git)
    if risky:
        for ref in refs:
            status[ref] = f"skipped, this repository's own config sets {risky}"
        by_remote = {}
    for remote, items in by_remote.items():
        specs = [f"+refs/heads/{branch}:refs/remotes/{ref}" for ref, branch in items]
        ok, out = git.run(*FETCH_ARGS, "--", remote, *specs, limit=FETCH_S)
        for ref, _ in items:
            status[ref] = None if ok else out

    def counted(ref):
        count = git.value("rev-list", "--count", f"HEAD..{ref}")
        return int(count) if count and count.isdigit() else None

    where = "the detached HEAD" if head == "HEAD" else head
    lines = []
    for ref in refs:
        failure = status.get(ref)
        count = counted(ref)
        source = "fetched just now" if failure is None else f"as of an earlier fetch; refreshing failed: {failure}"
        if count:
            plural = "" if count == 1 else "s"
            if ref == upstream:
                lines.append(f"{ref} ({source}) has {count} commit{plural} that {where} lacks; "
                             f"pull before relying on this tree.")
            else:
                lines.append(
                    f"{ref} ({source}) has {count} commit{plural} that {where} lacks. For whether "
                    f"something exists on {ref} or has shipped, read it there (`git show {ref}:<path>`, "
                    f"`git grep <pattern> {ref}`); this branch's own changes are not on it.")
        elif failure is not None:
            lines.append(f"Whether {where} is current with {ref} is unknown: refreshing failed "
                         f"({failure}). Read the remote directly before saying what exists there now.")
    return "\n".join(lines) or None


def main():
    event = json.load(sys.stdin)
    if event.get("hook_event_name") != "SessionStart":
        return

    skill = Path(__file__).resolve().parents[1] / "skills/manager/SKILL.md"
    context = (
        "Default conversation role: Manager. At the start of this conversation, "
        "read and follow the manager:manager skill from this installed plugin: "
        f"{skill}. The skill loads the full Manager role and principles. "
        "Apply the current project's own instructions and bindings."
    )
    try:
        notice = currency_notice(event.get("cwd") or ".")
    except Exception:  # the loader line must survive any git surprise
        notice = None
    if notice:
        context += "\n\n" + notice
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": context,
        }
    }))


if __name__ == "__main__":
    main()
