#!/usr/bin/env python3
"""Lint the plugins for harness and model independence (AGENTS.md, Harness and Model Independence).

Fails when a shared file names a host, a host tool or variable, a model, or a model CLI, and when
any plugin file carries deployment data such as an agent id, a private path, an email address, or a
notes-vault link. Shared files are everything under plugins/*/skills and plugins/*/agents except the
adapter files in ADAPTER, license texts, and the frontmatter of agent role files, which hosts that
register agents read. Deployment data is checked everywhere. It catches known patterns only; review
judges meaning.
Usage: check-portability.py [repo root].
"""

import re
import sys
from pathlib import Path

# Host packaging under skills/ may name hosts; it carries no behavior text.
# Extend this list only for a new packaging file there.
ADAPTER = (
    "plugins/*/skills/*/agents/openai.yaml",
)
LICENSE = re.compile(r"^LICENSE(-[A-Za-z0-9]+)?$")

# Host and model names that are rare as ordinary words match in any case; Cursor, Opus, Sonnet,
# and Haiku match only capitalized. The `CLAUDE.md` and `agents/openai.yaml` file names are
# conventions every host's files share.
HOST = re.compile(
    r"(?i:\bclaude\b(?!\.md)|\bcodex\b|\bgrok\b|\bgemini\b|chatgpt|\bgpt\b|openai(?!\.yaml)|deepseek"
    r"|\b(?:claude|gpt|grok|gemini|deepseek|o\d)-\w*\d)"
    r"|\bCursor\b|\b(?:Opus|Sonnet|Haiku)\b"
    r"|AskUserQuestion|request_user_input|EnterWorktree|ExitWorktree|TodoWrite"
    r"|\bTask(?:Create|Update|List|Get|Output|Stop)\b|ScheduleWakeup|CronCreate"
    r"|SendMessage|spawn_agent|fork_turns|\bAgent tool\b|\bfunctions\.\w+|\bcollaboration\.\w+|\bmcp__\w+"
    r"|\bCLAUDE_\w+|\bPLUGIN_ROOT\b"
    r"|\bclaude -p\b|\bcodex exec\b|\bgrok -p\b|\bcursor-agent\b"
)

# Deployment data belongs to the user's own binding, never to this repository.
DEPLOY = re.compile(
    r"(?i:\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b)"
    r"|/(?:home|Users)/(?!<)[A-Za-z0-9._-]+/|\bYus-M\d"
    r"|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.(?:com|net|org|io|dev|ai|app|co|me|cn|edu|gov)\b"
    r"|\[\[(?! )[^\]]+\]\]"
)


def scan(root):
    adapter = {p for pattern in ADAPTER for p in root.glob(pattern)}
    hits = []
    for path in sorted(root.glob("plugins/**/*")):
        if not path.is_file():
            continue
        data = path.read_bytes()
        if b"\0" in data:
            continue  # binary asset
        rel = path.relative_to(root)
        shared = (rel.parts[2] in ("skills", "agents") and path not in adapter
                  and not LICENSE.match(path.name))
        role = rel.parts[2] == "agents" and len(rel.parts) == 4
        lines = data.decode("utf-8", "replace").splitlines()
        frontmatter = 0
        if role and lines and lines[0] == "---":
            frontmatter = next((i for i, line in enumerate(lines[1:], 2) if line == "---"), 0)
        for number, line in enumerate(lines, 1):
            host = HOST if shared and number > frontmatter else None
            for kind, pattern in (("deployment", DEPLOY), ("host", host)):
                match = pattern.search(line) if pattern else None
                if match:
                    hits.append(f"{rel}:{number}: {kind} `{match.group(0)}`")
    return hits


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent)
    hits = scan(root.resolve())
    for hit in hits:
        print(hit)
    if hits:
        print(f"check-portability: {len(hits)} finding(s). Move host details to an adapter file "
              "and deployment data to the user's own binding, or rephrase (AGENTS.md).",
              file=sys.stderr)
        return 1
    print("check-portability: no host names in shared files; no deployment data")
    return 0


if __name__ == "__main__":
    sys.exit(main())
