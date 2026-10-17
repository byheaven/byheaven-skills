"""Point Claude Code and Codex sessions at this installed plugin's canonical Manager loader.

When the session starts in a git checkout, also refresh the remote's view of the default
branch (and the branch's upstream) with one bounded fetch, and say so when HEAD lacks
commits that either has, so claims about what exists now are read from the remote rather
than the stale tree. The whole check stays inside the hook's 5 s limit.
"""

import json
import os
from pathlib import Path
import subprocess
import sys
import time

BUDGET_S = 4.0  # leaves headroom under the 5 s hook timeout for the loader line
CALL_S = 0.4
FETCH_S = 2.0
RECENT_FETCH_S = 60

GIT_ENV = {**os.environ, "GIT_TERMINAL_PROMPT": "0"}
GIT_ENV.setdefault("GIT_SSH_COMMAND", "ssh -o BatchMode=yes")


class Git:
    def __init__(self, cwd, budget=BUDGET_S):
        self.cwd = cwd
        self.deadline = time.monotonic() + budget

    def run(self, *args, limit=CALL_S):
        """Return (ok, output); ok is None when the call timed out or could not start."""
        timeout = min(limit, self.deadline - time.monotonic())
        if timeout <= 0.05:
            return None, "out of time"
        try:
            result = subprocess.run(
                ["git", "-C", self.cwd, *args],
                capture_output=True, text=True, timeout=timeout, env=GIT_ENV,
            )
        except subprocess.TimeoutExpired:
            return None, f"timed out after {timeout:.1f} s"
        except OSError as error:
            return None, str(error)
        if result.returncode != 0:
            lines = result.stderr.strip().splitlines()
            return False, lines[-1] if lines else f"exit {result.returncode}"
        return True, result.stdout.strip()

    def value(self, *args):
        ok, out = self.run(*args)
        return out if ok else None


def default_ref(git):
    ref = git.value("symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD")
    if ref:
        return ref
    for candidate in ("origin/main", "origin/master"):
        if git.value("rev-parse", "--verify", "--quiet", f"refs/remotes/{candidate}"):
            return candidate
    return None


def refresh(git, git_dir, refs):
    """Fetch the given remote-tracking refs from their remote. Returns None on success,
    else a short reason the counts below are only as current as the last fetch."""
    remote = refs[0].split("/", 1)[0]
    branches = [ref.split("/", 1)[1] for ref in refs if ref.split("/", 1)[0] == remote]
    fetch_head = Path(git_dir) / "FETCH_HEAD"
    try:
        if time.time() - fetch_head.stat().st_mtime < RECENT_FETCH_S:
            return None
    except OSError:
        pass
    ok, out = git.run("fetch", "--quiet", "--no-tags", "--no-recurse-submodules",
                      remote, *branches, limit=FETCH_S)
    if ok:
        return None
    return f"refreshing from {remote} failed: {out}"


def currency_notice(cwd):
    git = Git(cwd)
    info = git.value("rev-parse", "--absolute-git-dir", "--abbrev-ref", "HEAD")
    if not info or len(info.splitlines()) != 2:
        return None
    git_dir, head = info.splitlines()
    upstream = None
    if head != "HEAD":
        full = git.value("rev-parse", "--symbolic-full-name", "@{upstream}") or ""
        if full.startswith("refs/remotes/"):
            upstream = full[len("refs/remotes/"):]
    default = default_ref(git)
    refs = list(dict.fromkeys(ref for ref in (default, upstream) if ref and "/" in ref))
    if not refs:
        return None

    failure = refresh(git, git_dir, refs)
    lags = []
    for ref in refs:
        count = git.value("rev-list", "--count", f"HEAD..{ref}")
        if count and count != "0":
            lags.append((ref, count))

    where = "this checkout's detached HEAD" if head == "HEAD" else f"this checkout's {head}"
    if not lags:
        if not failure:
            return None
        return (
            f"At session start, {failure}, so whether {where} is current with "
            f"{refs[0]} is unknown. For whether something exists or how it behaves now, "
            f"fetch or read the remote directly before answering."
        )

    when = "As of a fetch at session start" if not failure else f"As of the last fetch ({failure})"
    parts = [f"{ref} has {count} commit{'' if count == '1' else 's'}" for ref, count in lags]
    target = lags[0][0]
    return (
        f"{when}, {' and '.join(parts)} that {where} lacks. "
        f"For whether something exists or how it behaves now, read {target} "
        f"(`git show {target}:<path>`, `git grep <pattern> {target}`) or update the checkout first."
    )


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
