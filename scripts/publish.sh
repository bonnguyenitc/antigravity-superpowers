#!/usr/bin/env bash
# scripts/publish.sh
# Bump version, publish to npm, and tag git.
#
# Usage:
#   ./scripts/publish.sh          → patch bump (5.0.5 → 5.0.6)
#   ./scripts/publish.sh minor    → minor bump (5.0.5 → 5.1.0)
#   ./scripts/publish.sh major    → major bump (5.0.5 → 6.0.0)
#   ./scripts/publish.sh 5.1.2    → exact version
#
# The version should track upstream superpowers releases.
# After running /update-superpowers, check the new tag and use it here.

set -e

BUMP=${1:-patch}
CURRENT=$(node -p "require('./package.json').version")

echo "📦 Current version: $CURRENT"
echo "🔢 Bump type: $BUMP"
echo ""

# Bump version (npm version also creates a git tag)
NEW_VERSION=$(npm version "$BUMP" --no-git-tag-version)
NEW_VERSION=${NEW_VERSION#v}  # strip leading 'v'

echo "🚀 New version: $NEW_VERSION"
echo ""

# Build + publish
echo "📤 Publishing agy-superpowers@$NEW_VERSION to npm..."
npm publish --access public

# Commit + tag + push
git add package.json
git commit -m "chore: publish agy-superpowers@$NEW_VERSION"
git tag "v$NEW_VERSION"
git push origin main --tags

echo ""
echo "✅ Done! agy-superpowers@$NEW_VERSION published and tagged."
echo "🔗 https://www.npmjs.com/package/agy-superpowers"
