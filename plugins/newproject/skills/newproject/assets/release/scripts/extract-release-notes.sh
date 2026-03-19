#!/bin/bash
# scripts/extract-release-notes.sh
#
# Extracts a single version's section from CHANGELOG.md.
# Used by release.yml to publish GitHub Releases from manually curated changelog sections.
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

# Extract semver from tag: handles 'v1.2.0', 'myapp-1.2.0', '1.2.0'
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

rm -f "$OUTPUT_FILE" "$TITLE_FILE"

python3 - "$CHANGELOG_FILE" "$VERSION" "$OUTPUT_FILE" "$TITLE_FILE" <<'PY'
import pathlib
import re
import sys

changelog_file, version, output_file, title_file = sys.argv[1:]
content = pathlib.Path(changelog_file).read_text(encoding="utf-8").splitlines()

header_pattern = re.compile(rf"^## \[{re.escape(version)}\]\(")
next_header_pattern = re.compile(r"^## \[")

capturing = False
section_lines = []

for line in content:
    if not capturing:
        if header_pattern.match(line):
            capturing = True
        continue

    if next_header_pattern.match(line):
        break

    section_lines.append(line)

while section_lines and not section_lines[0].strip():
    section_lines.pop(0)

while section_lines and not section_lines[-1].strip():
    section_lines.pop()

if not section_lines:
    sys.exit(0)

pathlib.Path(output_file).write_text("\n".join(section_lines) + "\n", encoding="utf-8")

title = ""
for line in section_lines:
    if re.match(r"^\*\*[^*]", line):
        title = re.sub(r"^\*\*", "", line)
        title = re.sub(r"\*\*.*$", "", title)
        break

pathlib.Path(title_file).write_text(title + ("\n" if title else ""), encoding="utf-8")
PY

# Fail loudly if nothing was extracted
if [[ ! -s "$OUTPUT_FILE" ]]; then
  echo "❌ Version [${VERSION}] not found in ${CHANGELOG_FILE}." >&2
  echo "   Make sure the changelog has a section starting with:" >&2
  echo "   ## [${VERSION}](compare-url) (YYYY-MM-DD)" >&2
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
