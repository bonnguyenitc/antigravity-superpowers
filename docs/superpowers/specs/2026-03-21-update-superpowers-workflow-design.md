# Design: Superpowers Auto-Update Workflow

**Date:** 2026-03-21  
**Status:** Approved  
**Source:** https://github.com/obra/superpowers

---

## Problem

The `superpowers/` directory is a manual clone (not a git submodule). When superpowers releases new versions with updated skills, agents, or fixes, there is no mechanism to update `.agent/` accordingly. Skills could become stale and workflows could diverge from upstream intent.

## Goal

A single `/update-superpowers` workflow that:
1. Compares the current superpowers version against the latest GitHub release
2. Skips if already up to date
3. If a newer release exists: confirms with user, clones the new release, updates `.agent/` intelligently via AI, and records the new version

---

## Scope

### In Scope
- Version comparison via GitHub Releases API
- Delete + re-clone of `superpowers/` at the latest release tag
- Recreate all `.agent/skills/` symlinks (auto-detect all skills, including new ones)
- AI-driven rewrite of `.agent/agents/code-reviewer.md` from new source
- AI-driven rewrite of `.agent/workflows/*.md` where upstream skills have changed
- AI-driven update of `.agent/rules/superpowers.md` skill list
- Detection and reporting of new or removed skills
- Save current version tag to `.agent/superpowers-version.json`

### Out of Scope
- Converting `superpowers/` to a git submodule
- Updating `.agent/rules/superpowers.md` structure (preserved, only content updated)
- Auto-creating workflows for every new skill (AI judges which skills need a workflow)

---

## Architecture

### Files Created / Modified

| File | Type | Role |
|---|---|---|
| `scripts/update-superpowers.sh` | New (shell) | Phase 1 worker: version check, clone, symlinks, save state |
| `.agent/workflows/update-superpowers.md` | New (workflow) | Antigravity entry point: calls script then AI rewrite phase |
| `.agent/superpowers-version.json` | New (state) | Tracks current installed tag and timestamp |

### Files Preserved (never touched by update)
- `.agent/rules/superpowers.md` — content updated, structure preserved
- `.agent/workflows/brainstorm.md`, `write-plan.md`, `execute-plan.md`, `code-review.md`, `debug.md` — rewritten only if upstream skill intent changed

---

## Detailed Design

### Phase 0 — Version Check (Script)

```bash
CURRENT_TAG=$(jq -r '.tag' .agent/superpowers-version.json 2>/dev/null || echo "none")
LATEST_TAG=$(curl -s https://api.github.com/repos/obra/superpowers/releases/latest \
  | grep '"tag_name"' | cut -d'"' -f4)
```

Decision tree:
- `.agent/superpowers-version.json` **not found** → first-time setup, proceed without confirmation
- `CURRENT_TAG == LATEST_TAG` → print "Already up to date ($LATEST_TAG)" → exit 0
- `CURRENT_TAG != LATEST_TAG` → print version diff + release notes excerpt → pause for user confirmation

### Phase 1 — Clone + Symlinks (Script)

```bash
# Clone at exact release tag, shallow for speed
git clone --branch $LATEST_TAG --depth 1 \
  https://github.com/obra/superpowers /tmp/superpowers-update

# Replace superpowers/
rm -rf superpowers/
mv /tmp/superpowers-update superpowers/

# Recreate all symlinks — auto-detect every skill folder
rm -f .agent/skills/*
for skill_dir in superpowers/skills/*/; do
  skill_name=$(basename "$skill_dir")
  ln -sf "../../${skill_dir}" ".agent/skills/${skill_name}"
done
```

### Phase 2 — AI Rewrite (Antigravity)

After the script completes, Antigravity reads new source and rewrites `.agent/` content:

1. **`superpowers/agents/code-reviewer.md`** → rewrite `.agent/agents/code-reviewer.md`  
   Adapts `model: inherit` and any Claude Code-specific syntax for Antigravity compatibility.

2. **5 core skill SKILL.md files** → rewrite corresponding workflows if intent changed:
   - `brainstorming` → `brainstorm.md`
   - `writing-plans` → `write-plan.md`
   - `executing-plans` → `execute-plan.md`
   - `requesting-code-review` → `code-review.md`
   - `systematic-debugging` → `debug.md`

3. **All skills scan** → update `.agent/rules/superpowers.md` skill table  
   - Add newly discovered skills to the table
   - Flag removed skills with a warning comment

4. **New skills** → AI decides if a new workflow is warranted (based on skill description)

### Phase 3 — Save State (Script)

```bash
echo "{
  \"tag\": \"$LATEST_TAG\",
  \"updated_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"source\": \"https://github.com/obra/superpowers\"
}" > .agent/superpowers-version.json
```

### Phase 4 — Summary Report (AI)

Print a structured report:
```
✅ Superpowers updated: v5.0.0 → v5.1.0
📦 Skills: 14 → 16 (+frontend-design, +mcp-builder)
🔄 Workflows rewritten: brainstorm.md, code-review.md
✅ Preserved: write-plan.md, execute-plan.md, debug.md (no upstream changes)
⚠️  Skills removed upstream: none
```

---

## Data Model

### `.agent/superpowers-version.json`

```json
{
  "tag": "v5.0.0",
  "updated_at": "2026-03-21T02:26:00Z",
  "source": "https://github.com/obra/superpowers"
}
```

---

## Error Handling

| Failure | Behavior |
|---|---|
| GitHub API unreachable | Script exits with error message, no changes made |
| Clone fails | Script exits, `superpowers/` untouched (old version preserved) |
| Partial symlink failure | Script reports which symlinks failed, continues |
| AI rewrite produces no diff | Skip write, report "no changes needed" |

---

## Success Criteria

- Running `/update-superpowers` when already on latest tag prints "up to date" and exits cleanly
- Running on a stale version shows the tag diff and release notes, waits for confirmation
- After update, all `.agent/skills/` symlinks resolve correctly
- `.agent/workflows/` files reflect current upstream skill intent
- `.agent/superpowers-version.json` reflects the newly installed tag
