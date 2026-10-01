#!/usr/bin/env bash
# Fails when the principles block in the manager agent differs from the
# principles skill. The skill is the single source; the agent carries a
# verbatim copy because a main-session agent cannot preload skills.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
skill="$root/plugins/manager/skills/principles/SKILL.md"
agent="$root/plugins/manager/agents/manager.md"

expected="$(awk 'fm < 2 { if ($0 == "---") fm++; next }
  !title && $0 == "# Principles" { title = 1; skip = 1; next }
  skip && $0 == "" { skip = 0; next }
  { skip = 0; started = started || ($0 != ""); if (started) print }' "$skill")"
actual="$(awk '/^<!-- principles:begin/ { on = 1; next }
  /^<!-- principles:end -->$/ { on = 0 }
  on' "$agent")"

if [ -z "$actual" ]; then
  echo "check-manager-agent: principles markers missing in $agent" >&2
  exit 1
fi
if [ "$expected" != "$actual" ]; then
  echo "check-manager-agent: principles block in agents/manager.md differs from skills/principles/SKILL.md" >&2
  diff <(printf '%s\n' "$expected") <(printf '%s\n' "$actual") >&2 || true
  exit 1
fi
echo "check-manager-agent: principles block matches"
