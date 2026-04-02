---
description: Update superpowers to the latest GitHub release and sync .agent/ files
---

This workflow has two phases:
- **Phase 1 (script):** version check, clone, rebuild symlinks, sync agents + commands→workflows with path fixes, save state
- **Phase 2 (AI):** update the skill list in rules only — no content rewriting

// turbo
1. Preserve user config (if exists):
   `mkdir -p .agent/tmp && [ -f .agent/config.yml ] && cp .agent/config.yml .agent/tmp/agent-config-backup.yml && echo "Config backed up" || echo "No config to backup"`

// turbo
2. Run the update script:
   `bash .agent/.shared/update-superpowers.sh`

   - If output ends with "Already up to date" → restore config if backed up (`[ -f .agent/tmp/agent-config-backup.yml ] && cp .agent/tmp/agent-config-backup.yml .agent/config.yml`), then **STOP**. Nothing to do.
   - If clone fails → restore config if backed up, then **STOP**. Report the error to the user.
   - On success the script prints `SCRIPT_DONE:<new-tag>` — note the new tag and continue.

// turbo
3. Run the Antigravity patch script (breaks symlinks → real files, removes non-Antigravity tool refs):
   `node scripts/patch-agent-skills.js`

// turbo
4. Restore user config:
   `[ -f .agent/tmp/agent-config-backup.yml ] && cp .agent/tmp/agent-config-backup.yml .agent/config.yml && echo "Config restored" || echo "No config to restore"`

5. **Phase 2 — Update skill list in rules**

   List all skill folders now present in `.agent/skills/`.
   Open `.agent/rules/superpowers.md` and update **only the skills table**:
   - Add a row for any skill not already listed (use its SKILL.md `description` field as the "When to Use" value).
   - Prefix any skill that no longer exists with ⚠️ and a note "(removed upstream)".
   - Preserve all other content in the file exactly as-is.

   If no skills were added or removed → skip, note "rules: no changes needed".

6. **Phase 2 — New skills check**

   For any skill in `.agent/skills/` that has no corresponding workflow in `.agent/workflows/`:
   - Read its `SKILL.md` `description` field.
   - Report it to the user: "New skill available: `<name>` — `<description>`. Create a workflow?"
   - Do NOT auto-create. Let the user decide.

7. **Phase 2 — Apply skill patches from `.agent/patches/skills-patches.md`**

   Read `.agent/patches/skills-patches.md`. For each patch entry:
   - Open the target SKILL.md (path relative to `.agent/skills/`)
   - Understand the *intent* described — do not match text literally
   - Find the relevant section in the current file content
   - Rewrite that section to match the intent, adapting to any upstream wording changes
   - If the patch is already applied → skip, note "already applied"

   Apply all patches before moving to the next step.

// turbo
8. Commit all changes from Phase 2:
   `git add .agent/ && git commit -m "chore: sync .agent/ with superpowers <new-tag>"`
   (Skip commit if nothing changed.)

8. Print summary:
   ```
   ✅ Superpowers updated: <old-tag> → <new-tag>
   📦 Skills: <old-count> → <new-count>  (+new_skill / -removed_skill)
   📋 Agents synced: <list>
   🔄 Workflows synced from commands: <list or "none">
   🔄 Rules updated: <yes/no>
   ⚠️  New skills needing workflows: <list or "none">
   ```
