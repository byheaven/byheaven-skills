#!/bin/bash
# scripts/extract-release-notes.sh
#
# Extracts a single version's section from CHANGELOG.md.
# Used by release.yml to get the release body for GitHub Releases.
#
# Usage: ./scripts/extract-release-notes.sh v1.2.0
#
# Output: RELEASE_NOTES.md (in the current directory)
# Exit 1: if the version section is not found in CHANGELOG.md

set -euo pipefail

VERSION_TAG="${1:-${GITHUB_REF_NAME:-}}"

if [[ -z "$VERSION_TAG" ]]; then
  echo "❌ No version tag provided." >&2
  echo "   Usage: $0 v1.2.0" >&2
  exit 1
fi

# Extract semver from tag: handles 'v1.2.0', 'byheaven-skills-1.2.0', '1.2.0'
VERSION=$(echo "$VERSION_TAG" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
if [[ -z "$VERSION" ]]; then
  echo "❌ Could not extract semver from tag: $VERSION_TAG" >&2
  exit 1
fi

CHANGELOG_FILE="${CHANGELOG_FILE:-CHANGELOG.md}"
OUTPUT_FILE="${OUTPUT_FILE:-RELEASE_NOTES.md}"
TITLE_FILE="${TITLE_FILE:-RELEASE_TITLE.txt}"

if [[ ! -f "$CHANGELOG_FILE" ]]; then
  echo "❌ $CHANGELOG_FILE not found in $(pwd)" >&2
  exit 1
fi

# Extract everything between ## [VERSION] and the next ## [ heading
awk "
  /^\#\# \[${VERSION}\]/ { found=1; next }
  found && /^\#\# \[/    { exit }
  found                  { print }
" "$CHANGELOG_FILE" \
  | sed '/./!d' \
  > "$OUTPUT_FILE"

# Fail loudly if nothing was extracted
if [[ ! -s "$OUTPUT_FILE" ]]; then
  echo "❌ Version [${VERSION}] not found in ${CHANGELOG_FILE}." >&2
  echo "   Make sure the changelog has a section starting with:" >&2
  echo "   ## [${VERSION}] - YYYY-MM-DD" >&2
  exit 1
fi

echo "✅ Extracted release notes for ${VERSION} → ${OUTPUT_FILE}"

# Extract the first bold line (**...**) as the release title
BOLD_LINE=$(grep -m 1 '^\*\*[^*]' "$OUTPUT_FILE" || true)
if [[ -n "$BOLD_LINE" ]]; then
  # Strip leading/trailing ** markers
  TITLE=$(echo "$BOLD_LINE" | sed 's/^\*\*//; s/\*\*.*//')
  echo "$TITLE" > "$TITLE_FILE"
  echo "✅ Extracted release title → ${TITLE_FILE}: ${TITLE}"
else
  : > "$TITLE_FILE"
  echo "ℹ️  No bold headline found; ${TITLE_FILE} left empty (release will use tag name)"
fi
