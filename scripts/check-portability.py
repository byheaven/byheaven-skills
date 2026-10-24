#!/usr/bin/env python3
"""Keep the plugins harness- and model-agnostic (AGENTS.md, Harness and Model Independence).

Fails when a shared file names a host, a host tool or variable, a model, or a model CLI, and
when any plugin file carries deployment data such as an agent id or a private machine path.
Shared files are everything under plugins/*/skills and plugins/*/agents except the adapter
files in ADAPTER and third-party license texts. Usage: check-portability.py [repo root].
"""

import re
import sys
from pathlib import Path

# Adapter files may name hosts: each maps the shared layer to one host or model family.
# Extend this list only for a new adapter file.
ADAPTER = (
    "plugins/*/skills/*/agents/openai.yaml",
    "plugins/manager/skills/manager/references/runtimes.md",
    "plugins/manager/skills/manager/references/runtime-*.md",
    "plugins/manager/skills/roundtable/references/seat-routes.md",
)

# `${CLAUDE_PLUGIN_ROOT}` is the one shared path placeholder; every other host variable is not.
HOST = re.compile(
    r"Claude Code|\bClaude\b|\bCodex\b|\bGrok\b|\bCursor\b|\bGemini\b|ChatGPT|\bGPT\b|OpenAI"
    r"|AskUserQuestion|request_user_input|EnterWorktree|ExitWorktree|TodoWrite|TaskCreate"
    r"|SendMessage|spawn_agent|\bAgent tool\b"
    r"|CLAUDE_(?!PLUGIN_ROOT\b)[A-Z_]+|(?<!CLAUDE_)\bPLUGIN_ROOT\b"
    r"|\bclaude -p\b|\bcodex exec\b|\bgrok -p\b|\bcursor-agent\b"
    r"|\b(?:claude|gpt|grok|gemini|deepseek)-\w*\d|\b(?:Opus|Sonnet|Haiku|DeepSeek)\b"
)

# Deployment data belongs to the user's own binding, never to this repository.
DEPLOY = re.compile(
    r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b"
    r"|/home/box/|/Users/[A-Za-z0-9._-]+/|\bYus-M\d"
)

TEXT = {".md", ".yaml", ".yml", ".json", ".toml", ".txt", ".template", ".py", ".sh",
        ".js", ".ts", ".tsx", ".gitignore", ".editorconfig", ""}


def scan(root):
    adapter = {p for pattern in ADAPTER for p in root.glob(pattern)}
    hits = []
    for path in sorted(root.glob("plugins/**/*")):
        if not path.is_file() or path.suffix not in TEXT or path.name.startswith("LICENSE"):
            continue
        rel = path.relative_to(root)
        shared = rel.parts[2] in ("skills", "agents") and path not in adapter
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        for number, line in enumerate(lines, 1):
            for kind, pattern in (("deployment", DEPLOY), ("host", HOST if shared else None)):
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
              "and deployment data to the user's own binding (AGENTS.md).", file=sys.stderr)
        return 1
    print("check-portability: shared files are harness-agnostic; no deployment data")
    return 0


if __name__ == "__main__":
    sys.exit(main())
