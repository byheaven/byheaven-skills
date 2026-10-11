#!/usr/bin/env bash
# Fails a PR that changes agent-facing rule text (plugins/*/skills or
# plugins/*/agents) without a "Judge:" line in its description. The line names
# the model family of the independent judge, or states "same-family" with the
# reason no cross-model judge was used. Cloud transcripts are not kept, so a
# judge left unrecorded at merge cannot be recovered later.
#
# Inputs: PR_BODY (description text), BASE_SHA, HEAD_SHA.
set -euo pipefail

changed="$(git diff --name-only "$BASE_SHA...$HEAD_SHA" | grep -E '^plugins/[^/]+/(skills|agents)/' || true)"
if [ -z "$changed" ]; then
  echo "check-judge-line: no rule files changed; skipped"
  exit 0
fi

line="$(printf '%s\n' "${PR_BODY:-}" | tr -d '\r' | grep -E '^Judge:' | head -n 1 || true)"
value="$(printf '%s' "${line#Judge:}" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"

fail() {
  echo "check-judge-line: $1" >&2
  echo "Rule files changed:" >&2
  printf '  %s\n' $changed >&2
  echo 'Add a line to the PR description, e.g. "Judge: GPT (Codex, GPT-6)" or' >&2
  echo '"Judge: same-family (Claude), reason: <why no cross-model judge>".' >&2
  exit 1
}

[ -n "$value" ] || fail "missing a filled \"Judge:\" line"
if printf '%s' "$value" | grep -qi 'same-family'; then
  reason="$(printf '%s' "$value" | sed -nE 's/.*[Rr]eason:[[:space:]]*(.*)$/\1/p')"
  [ -n "$reason" ] || fail "\"same-family\" judge needs \"reason: <why no cross-model judge>\""
fi
echo "check-judge-line: $line"
