"""Point Codex sessions at this installed plugin's canonical Manager loader."""

import json
from pathlib import Path
import sys


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
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": context,
        }
    }))


if __name__ == "__main__":
    main()
