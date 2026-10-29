#!/usr/bin/env bash
# Fails a PR that changes agent-facing rule text without a "Judge:" line in its
# description. The line names the model family of the independent judge, or
# states "same-family" or "none" with the reason no cross-model judge was used. Cloud
# transcripts are not kept, so a judge left unrecorded at merge cannot be
# recovered later.
#
# Rule text: plugins/*/skills, plugins/*/agents, and the root AGENTS.md /
# CLAUDE.md.
# Inputs: PR_BODY (description text), BASE_SHA, HEAD_SHA.
set -euo pipefail

rule_paths='^(plugins/[^/]+/(skills|agents)/|AGENTS\.md$|CLAUDE\.md$)'
# --no-renames lists both sides of a rename, so moving a file out still counts.
changed="$(git diff --no-renames --name-only "$BASE_SHA...$HEAD_SHA" | grep -E "$rule_paths" || true)"
if [ -z "$changed" ]; then
  echo "check-judge-line: no rule files changed; skipped"
  exit 0
fi

# Only visible text counts: drop HTML comments, then CR.
visible="$(printf '%s\n' "${PR_BODY:-}" | perl -0pe 's/<!--.*?-->//gs' | tr -d '\r')"

valid() {
  local value="$1" reason
  [ -n "$value" ] || return 1
  if printf '%s' "$value" | grep -qiE 'same-family|^none\b'; then
    reason="$(printf '%s' "$value" | sed -nE 's/.*[Rr]eason:[[:space:]]*(.*[^[:space:]]).*$/\1/p')"
    [ -n "$reason" ] || return 1
  fi
}

while IFS= read -r line; do
  value="$(printf '%s' "${line#Judge:}" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if valid "$value"; then
    echo "check-judge-line: $line"
    exit 0
  fi
done < <(printf '%s\n' "$visible" | grep -E '^Judge:' || true)

echo 'check-judge-line: no filled "Judge:" line ("same-family" or "none" also needs "reason: <why>")' >&2
echo "Rule files changed:" >&2
printf '  %s\n' $changed >&2
echo 'Add a line to the PR description, e.g. "Judge: GPT (Codex, GPT-6)" or' >&2
echo '"Judge: same-family (Claude), reason: <why no cross-model judge>" or "Judge: none, reason: <why>".' >&2
exit 1
