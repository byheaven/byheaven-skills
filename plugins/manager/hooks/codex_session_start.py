"""Point Claude Code and Codex sessions at this installed plugin's canonical Manager loader.

When the session starts in a git checkout whose branch trails its upstream, also say so,
so claims about what exists now are read from the upstream rather than the stale tree.
"""

import json
from pathlib import Path
import subprocess
import sys


def git(cwd, *args):
    try:
        result = subprocess.run(
            ["git", "-C", cwd, *args], capture_output=True, text=True, timeout=2
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    return result.stdout.strip() if result.returncode == 0 else None


def currency_notice(cwd):
    upstream = git(cwd, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}")
    behind = git(cwd, "rev-list", "--count", "HEAD..@{upstream}") if upstream else None
    if not behind or not behind.isdigit() or int(behind) == 0:
        return None
    branch = git(cwd, "rev-parse", "--abbrev-ref", "HEAD")
    return (
        f"This checkout's {branch} is {behind} commits behind {upstream} as of the last fetch. "
        f"For whether something exists or how it behaves now, read {upstream} "
        f"(`git show {upstream}:<path>`, `git grep <pattern> {upstream}`) or update the "
        "checkout first; the working tree shows an older state."
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
