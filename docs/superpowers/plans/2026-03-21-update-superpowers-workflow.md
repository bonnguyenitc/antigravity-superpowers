# Superpowers Auto-Update Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/update-superpowers` workflow that checks GitHub Releases for a new superpowers version, clones it, rebuilds `.agent/skills/` symlinks, and uses AI to rewrite `.agent/` files that need updating.

**Architecture:** A shell script (`scripts/update-superpowers.sh`) handles the mechanical phases (version check via GitHub API, delete+reclone, symlinks, save state). An Antigravity workflow (`.agent/workflows/update-superpowers.md`) orchestrates the full flow — calling the script then driving the AI rewrite phase. Version state is persisted in `.agent/superpowers-version.json`.

**Tech Stack:** bash, curl, jq, git, Antigravity workflow system

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `scripts/update-superpowers.sh` | Create | CLI worker: version check, clone, symlinks, save state |
| `.agent/workflows/update-superpowers.md` | Create | Antigravity entry point + Phase 2 AI instructions |
| `.agent/superpowers-version.json` | Create (first run) | Tracks installed tag + timestamp |

---

### Task 1: Create the shell script skeleton with version check

**Files:**
- Create: `scripts/update-superpowers.sh`

- [ ] **Step 1: Create `scripts/` directory and script file with version-check logic**

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/obra/superpowers"
VERSION_FILE=".agent/superpowers-version.json"
SKILLS_DIR=".agent/skills"
AGENTS_DIR=".agent/agents"

# ── Phase 0: Version Check ──────────────────────────────────────────────────

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

# ── Show release notes excerpt ───────────────────────────────────────────────
echo ""
echo "🆕 New release available: ${CURRENT_TAG} → ${LATEST_TAG}"
echo ""

# Fetch release body from GitHub API
RELEASE_BODY=$(curl -Lfs --retry 3 \
  "https://api.github.com/repos/obra/superpowers/releases/latest" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('body','')[:800])" 2>/dev/null || echo "(no notes)")

echo "Release notes (excerpt):"
echo "────────────────────────"
echo "$RELEASE_BODY"
echo "────────────────────────"
echo ""
```

- [ ] **Step 2: Make script executable**

```bash
chmod +x scripts/update-superpowers.sh
```

- [ ] **Step 3: Test version check against live GitHub API**

```bash
bash scripts/update-superpowers.sh
```

Expected: Either "Already up to date" (if v5.0.0 is latest) OR shows version diff + release notes. Script exits cleanly without touching any files.

- [ ] **Step 4: Commit**

```bash
git add scripts/update-superpowers.sh
git commit -m "feat: add update-superpowers script (phase 0: version check)"
```

---

### Task 2: Add clone + symlinks phase to script

**Files:**
- Modify: `scripts/update-superpowers.sh` (append after version check block)

- [ ] **Step 1: Append Phase 1 (clone + symlinks) to the script**

Append the following after the release notes block in `scripts/update-superpowers.sh`:

```bash
# ── Phase 1: Clone + Symlinks ────────────────────────────────────────────────

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

# Remove the .git dir (we don't want a nested git repo)
rm -rf superpowers/.git

# ── Recreate all skill symlinks ──────────────────────────────────────────────

echo "🔗 Rebuilding .agent/skills/ symlinks..."

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

# ── Save version state ───────────────────────────────────────────────────────

echo "💾 Saving version state..."

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
```

- [ ] **Step 2: Verify script is valid bash (no syntax errors)**

```bash
bash -n scripts/update-superpowers.sh
```

Expected: no output (clean parse)

- [ ] **Step 3: Commit**

```bash
git add scripts/update-superpowers.sh
git commit -m "feat: add update-superpowers script (phase 1: clone + symlinks + save state)"
```

---

### Task 3: Create the Antigravity workflow

**Files:**
- Create: `.agent/workflows/update-superpowers.md`

- [ ] **Step 1: Write the workflow file**

```markdown
---
description: Update superpowers to the latest GitHub release and rewrite .agent/ files accordingly
---

This workflow has two phases: a shell script handles the mechanical work, then Antigravity reads the new source and rewrites .agent/ files intelligently.

// turbo
1. Run the update script:
   `bash scripts/update-superpowers.sh`

   - If output ends with "Already up to date" → STOP, nothing to do.
   - If clone fails → STOP, report the error.
   - On success the script prints `SCRIPT_DONE:<new-tag>` — note the new tag and proceed.

2. **Phase 2 — AI Rewrite: agents**
   Read `superpowers/agents/code-reviewer.md`.
   Compare with `.agent/agents/code-reviewer.md`.
   Rewrite `.agent/agents/code-reviewer.md` — adapt any Claude-Code-specific syntax
   (`model: inherit`, `Task tool`, etc.) for Antigravity compatibility.
   If no meaningful diff → skip write, note "agents: no changes needed".

3. **Phase 2 — AI Rewrite: core workflow skills**
   For each of the 5 skills below, read its SKILL.md, compare with the corresponding
   workflow file, and rewrite the workflow ONLY if the upstream skill's intent or
   checklist has changed. Preserve Antigravity-specific adaptations (path corrections,
   platform notes).

   | Skill SKILL.md | Workflow to rewrite |
   |---|---|
   | `.agent/skills/brainstorming/SKILL.md` | `.agent/workflows/brainstorm.md` |
   | `.agent/skills/writing-plans/SKILL.md` | `.agent/workflows/write-plan.md` |
   | `.agent/skills/executing-plans/SKILL.md` | `.agent/workflows/execute-plan.md` |
   | `.agent/skills/requesting-code-review/SKILL.md` | `.agent/workflows/code-review.md` |
   | `.agent/skills/systematic-debugging/SKILL.md` | `.agent/workflows/debug.md` |

4. **Phase 2 — AI Rewrite: rules**
   Read all skill folders now in `.agent/skills/`.
   Update the skills table in `.agent/rules/superpowers.md`:
   - Add rows for any skills not already listed.
   - Mark removed skills with a ⚠️ comment.
   - Preserve all other content in the file.

5. **Phase 2 — New skills check**
   For any skill that exists in `.agent/skills/` but has NO corresponding workflow:
   - Read its SKILL.md description.
   - If it is a major standalone workflow (like brainstorming or debugging), create a
     new workflow file in `.agent/workflows/` following the same pattern as the others.
   - Otherwise note it as "available skill, no workflow needed".

// turbo
6. Commit all changes from the AI rewrite phase:
   `git add .agent/ && git commit -m "chore: sync .agent/ with superpowers <new-tag>"`

7. **Print summary report:**
   ```
   ✅ Superpowers updated: <old-tag> → <new-tag>
   📦 Skills: <old-count> → <new-count> (+new_skill_a, +new_skill_b / -removed_skill)
   🔄 Rewrote: <list of files changed>
   ✅ Unchanged: <list of files with no diff>
   ```
```

- [ ] **Step 2: Verify file was created correctly**

```bash
head -5 .agent/workflows/update-superpowers.md
```

Expected: shows the `---` frontmatter and description line.

- [ ] **Step 3: Commit**

```bash
git add .agent/workflows/update-superpowers.md
git commit -m "feat: add /update-superpowers Antigravity workflow"
```

---

### Task 4: Create initial superpowers-version.json from current install

**Files:**
- Create: `.agent/superpowers-version.json`

- [ ] **Step 1: Read current version from superpowers gemini-extension.json**

```bash
cat superpowers/gemini-extension.json
```

Note the `"version"` field value (e.g. `"5.0.0"`).

- [ ] **Step 2: Fetch matching git tag from GitHub to find the canonical tag**

```bash
curl -Lfs --retry 3 \
  "https://api.github.com/repos/obra/superpowers/releases" \
  | python3 -c "import sys,json; releases=json.load(sys.stdin); [print(r['tag_name'], r['name']) for r in releases[:5]]"
```

Note the tag that matches the current installed version.

- [ ] **Step 3: Write superpowers-version.json with the identified tag**

Replace `<TAG>` with the actual tag found in step 2:

```bash
cat > .agent/superpowers-version.json << 'EOF'
{
  "tag": "<TAG>",
  "updated_at": "2026-03-21T02:26:00Z",
  "source": "https://github.com/obra/superpowers"
}
EOF
```

- [ ] **Step 4: Verify file is valid JSON**

```bash
jq . .agent/superpowers-version.json
```

Expected: pretty-prints the JSON with no errors.

- [ ] **Step 5: Commit**

```bash
git add .agent/superpowers-version.json
git commit -m "chore: record initial superpowers version in .agent/superpowers-version.json"
```

---

### Task 5: Smoke test the full workflow

**Files:** none new — integration test only

- [ ] **Step 1: Verify script exits cleanly when already up to date**

First, ensure the version file matches the latest tag (may already be the case after Task 4):

```bash
bash scripts/update-superpowers.sh
```

Expected output includes:
```
✅ Already up to date (<TAG>). Nothing to do.
```
Script exits with code 0.

- [ ] **Step 2: Simulate a stale version to test update path**

```bash
# Temporarily set an old tag
echo '{"tag":"v0.0.0","updated_at":"2020-01-01T00:00:00Z","source":"https://github.com/obra/superpowers"}' \
  > .agent/superpowers-version.json

# Run script — should detect new version available
bash scripts/update-superpowers.sh
```

Expected: Shows "New release available: v0.0.0 → \<LATEST\>", prints release notes, then clones and updates.

- [ ] **Step 3: Verify symlinks all resolve after the update**

```bash
for link in .agent/skills/*/; do
  target=$(readlink "$link")
  if [[ -f "${link}SKILL.md" ]]; then
    echo "✅ $(basename $link)"
  else
    echo "❌ BROKEN: $(basename $link) → $target"
  fi
done
```

Expected: All lines show ✅.

- [ ] **Step 4: Verify superpowers-version.json has been updated**

```bash
jq . .agent/superpowers-version.json
```

Expected: shows the new `tag` and a recent `updated_at` timestamp.

- [ ] **Step 5: Restore correct version if smoke test changed things**

```bash
# Re-run to reset to latest
bash scripts/update-superpowers.sh || true
git add .agent/superpowers-version.json superpowers/ .agent/skills/
git commit -m "chore: restore to latest superpowers after smoke test" || echo "Nothing to commit"
```
