#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/obra/superpowers"
VERSION_FILE=".agent/superpowers-version.json"
SKILLS_DIR=".agent/skills"

# ── Phase 0: Version Check ────────────────────────────────────────────────────

echo "🔍 Checking superpowers version..."

# Read current installed tag
CURRENT_TAG=$(jq -r '.tag // "none"' "$VERSION_FILE" 2>/dev/null || echo "none")

# Fetch latest release tag from GitHub API
LATEST_TAG=$(curl -Lfs --retry 3 \
  "https://api.github.com/repos/obra/superpowers/releases/latest" \
  | grep '"tag_name"' | cut -d'"' -f4)

if [[ -z "$LATEST_TAG" ]]; then
  echo "❌ Failed to fetch latest release from GitHub. Check your network." >&2
  exit 1
fi

echo "  Current: ${CURRENT_TAG}"
echo "  Latest:  ${LATEST_TAG}"

if [[ "$CURRENT_TAG" == "$LATEST_TAG" ]]; then
  echo "✅ Already up to date (${LATEST_TAG}). Nothing to do."
  exit 0
fi

# ── Show release notes excerpt ────────────────────────────────────────────────

echo ""
echo "🆕 New release available: ${CURRENT_TAG} → ${LATEST_TAG}"
echo ""

RELEASE_BODY=$(curl -Lfs --retry 3 \
  "https://api.github.com/repos/obra/superpowers/releases/latest" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('body','')[:800])" 2>/dev/null \
  || echo "(no notes)")

echo "Release notes (excerpt):"
echo "────────────────────────"
echo "$RELEASE_BODY"
echo "────────────────────────"
echo ""

# ── Phase 1: Clone + Symlinks ─────────────────────────────────────────────────

echo "📥 Cloning superpowers @ ${LATEST_TAG}..."

TMP_DIR=$(mktemp -d)
CLONE_TARGET="${TMP_DIR}/superpowers"

# Clone at exact release tag, shallow for speed
if ! git clone --branch "$LATEST_TAG" --depth 1 "$REPO" "$CLONE_TARGET" 2>&1; then
  echo "❌ Clone failed. Aborting — superpowers/ is unchanged." >&2
  rm -rf "$TMP_DIR"
  exit 1
fi

echo "✅ Clone successful."

# Backup existing superpowers/ before replacing
if [[ -d "superpowers" ]]; then
  BACKUP_DIR="superpowers.bak.$(date +%s)"
  mv superpowers "$BACKUP_DIR"
  echo "📦 Old superpowers/ backed up to ${BACKUP_DIR}"
fi

# Move new clone into place
mv "$CLONE_TARGET" superpowers/
rm -rf "$TMP_DIR"
echo "✅ superpowers/ replaced."

# Remove nested .git (we don't want a nested git repo)
rm -rf superpowers/.git

# ── Recreate all skill symlinks ───────────────────────────────────────────────

echo "🔗 Rebuilding ${SKILLS_DIR}/ symlinks..."

mkdir -p "$SKILLS_DIR"

# Remove old symlinks only (not regular files)
find "$SKILLS_DIR" -maxdepth 1 -type l -delete

# Detect and link ALL skills in new superpowers
NEW_SKILLS=()
for skill_dir in superpowers/skills/*/; do
  skill_name=$(basename "$skill_dir")
  ln -sf "../../${skill_dir}" "${SKILLS_DIR}/${skill_name}"
  NEW_SKILLS+=("$skill_name")
done

echo "✅ Linked ${#NEW_SKILLS[@]} skills: ${NEW_SKILLS[*]}"

# ── Sync agents: copy + fix path references ───────────────────────────────────

echo "📋 Syncing .agent/agents/ from superpowers/agents/..."

AGENTS_DIR=".agent/agents"
mkdir -p "$AGENTS_DIR"

SYNCED_AGENTS=()
for agent_src in superpowers/agents/*.md; do
  [[ -f "$agent_src" ]] || continue
  agent_name=$(basename "$agent_src")
  dest="${AGENTS_DIR}/${agent_name}"

  # Copy verbatim, then fix known Antigravity path differences in-place:
  #   .agents/  →  .agent/   (superpowers uses .agents/, Antigravity uses .agent/)
  cp "$agent_src" "$dest"
  sed -i '' 's|\.agents/|.agent/|g' "$dest"

  SYNCED_AGENTS+=("$agent_name")
  echo "  ✅ ${agent_name}"
done

echo "✅ Synced ${#SYNCED_AGENTS[@]} agent(s): ${SYNCED_AGENTS[*]}"

# ── Sync commands → workflows: copy + fix path references ─────────────────────

echo "🔄 Syncing .agent/workflows/ from superpowers/commands/..."

WORKFLOWS_DIR=".agent/workflows"
mkdir -p "$WORKFLOWS_DIR"

SYNCED_WORKFLOWS=()
for cmd_src in superpowers/commands/*.md; do
  [[ -f "$cmd_src" ]] || continue
  cmd_name=$(basename "$cmd_src")
  dest="${WORKFLOWS_DIR}/${cmd_name}"

  # Copy verbatim, then fix path references:
  #   .agents/  →  .agent/
  cp "$cmd_src" "$dest"
  sed -i '' 's|\.agents/|.agent/|g' "$dest"

  SYNCED_WORKFLOWS+=("$cmd_name")
  echo "  ✅ ${cmd_name}"
done

if [[ ${#SYNCED_WORKFLOWS[@]} -eq 0 ]]; then
  echo "  (no commands found in superpowers/commands/)"
else
  echo "✅ Synced ${#SYNCED_WORKFLOWS[@]} workflow(s): ${SYNCED_WORKFLOWS[*]}"
fi

# ── Save version state ────────────────────────────────────────────────────────

echo "💾 Saving version state to ${VERSION_FILE}..."

mkdir -p "$(dirname "$VERSION_FILE")"
cat > "$VERSION_FILE" << EOF
{
  "tag": "${LATEST_TAG}",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "source": "${REPO}"
}
EOF

echo "✅ Version saved: ${LATEST_TAG}"
echo ""
echo "────────────────────────────────────────────────────────"
echo "SCRIPT_DONE:${LATEST_TAG}"
echo "────────────────────────────────────────────────────────"
echo ""
echo "⏭  Script complete. Antigravity will now handle the AI rewrite phase."
