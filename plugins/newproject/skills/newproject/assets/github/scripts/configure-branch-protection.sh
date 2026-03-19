#!/bin/bash
# configure-branch-protection.sh
#
# Applies branch protection rules to the main branch via GitHub CLI.
# Requires: gh CLI installed and authenticated.
#
# Usage: ./configure-branch-protection.sh [branch-name]
# Default branch: main

set -euo pipefail

BRANCH="${1:-main}"
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

echo "Configuring branch protection for '${BRANCH}' on ${REPO}..."

gh api \
  --method PUT \
  "repos/${REPO}/branches/${BRANCH}/protection" \
  --field 'required_status_checks={"strict":true,"contexts":[]}' \
  --field 'enforce_admins=false' \
  --field 'required_pull_request_reviews={"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_last_push_approval":false}' \
  --field 'restrictions=null' \
  --field 'allow_force_pushes=false' \
  --field 'allow_deletions=false' \
  --field 'block_creations=false'

echo "✅ Branch protection applied to '${BRANCH}'"
echo ""
echo "Next steps:"
echo "  1. After your CI workflow runs once, add status check names:"
echo "     gh api repos/${REPO}/branches/${BRANCH}/protection --jq .required_status_checks"
echo "  2. Re-run this script or update via GitHub UI: Settings → Branches"
