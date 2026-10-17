"""Point Claude Code and Codex sessions at this installed plugin's canonical Manager loader.

When the session starts in a git checkout whose branch trails its upstream, also say so,
so claims about what exists now are read from the upstream rather than the stale tree.
"""

import json
from pathlib import Path
import re
import subprocess
import sys


def current_branch_tracking(cwd):
    try:
        result = subprocess.run(
            ["git", "-C", cwd, "for-each-ref", "refs/heads",
             "--format=%(HEAD)%00%(refname:short)%00%(upstream:short)%00%(upstream:track,nobracket)"],
            capture_output=True, text=True, timeout=1.5,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    if result.returncode != 0:
        return None
    for line in result.stdout.splitlines():
        marker, branch, upstream, track = line.split("\0")
        if marker == "*":
            return branch, upstream, track
    return None


def currency_notice(cwd):
    tracking = current_branch_tracking(cwd)
    behind = re.search(r"behind (\d+)", tracking[2]) if tracking and tracking[1] else None
    if not behind:
        return None
    branch, upstream, _ = tracking
    commits = "1 commit" if behind[1] == "1" else f"{behind[1]} commits"
    return (
        f"This checkout's {branch} lacks {commits} that are on {upstream} as of the last fetch. "
        f"For whether something exists or how it behaves now, read {upstream} "
        f"(`git show {upstream}:<path>`, `git grep <pattern> {upstream}`) or update the checkout first."
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
    notice = currency_notice(event.get("cwd") or ".")
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
