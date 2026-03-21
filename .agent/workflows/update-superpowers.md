---
description: Update superpowers to the latest GitHub release and rewrite .agent/ files accordingly
---

This workflow has two phases: a shell script handles the mechanical work (version check, clone, symlinks, save state), then Antigravity reads the new source and rewrites `.agent/` files intelligently.

// turbo
1. Run the update script:
   `bash .agent/.shared/update-superpowers.sh`

   - If output ends with "Already up to date" → **STOP**. Nothing to do.
   - If clone fails → **STOP**. Report the error to the user.
   - On success the script prints `SCRIPT_DONE:<new-tag>` — note the new tag and continue.

2. **Phase 2 — AI Rewrite: agents**

   Read: `superpowers/agents/code-reviewer.md`
   Compare with: `.agent/agents/code-reviewer.md`

   Rewrite `.agent/agents/code-reviewer.md`, adapting any Claude-Code-specific syntax
   (`model: inherit`, `Task tool` references, etc.) to be Antigravity-compatible.
   If no meaningful diff → skip, note "agents: no changes needed".

3. **Phase 2 — AI Rewrite: core workflow skills**

   For each row below: read the skill's `SKILL.md`, compare with the current workflow file.
   Rewrite the workflow ONLY if upstream intent, checklist, or steps have changed.
   Always preserve Antigravity-specific path corrections (`.agent/` not `.agents/`) and platform notes.

   | Read this SKILL.md | Rewrite this workflow |
   |---|---|
   | `.agent/skills/brainstorming/SKILL.md` | `.agent/workflows/brainstorm.md` |
   | `.agent/skills/writing-plans/SKILL.md` | `.agent/workflows/write-plan.md` |
   | `.agent/skills/executing-plans/SKILL.md` | `.agent/workflows/execute-plan.md` |
   | `.agent/skills/requesting-code-review/SKILL.md` | `.agent/workflows/code-review.md` |
   | `.agent/skills/systematic-debugging/SKILL.md` | `.agent/workflows/debug.md` |

4. **Phase 2 — AI Rewrite: rules**

   List all skill folders now present in `.agent/skills/`.
   Open `.agent/rules/superpowers.md` and update the skills table:
   - Add a row for any skill not already listed.
   - Prefix removed skills with ⚠️ and a note "(removed upstream)".
   - Preserve all other content in the file unchanged.

5. **Phase 2 — New skills check**

   For any skill present in `.agent/skills/` that has no corresponding workflow:
   - Read its `SKILL.md` description.
   - If it is a major standalone workflow (comparable to brainstorming or debugging in scope),
     create a new workflow in `.agent/workflows/` following the same pattern as the others.
   - Otherwise note it as "available skill, no dedicated workflow needed".

// turbo
6. Commit all AI rewrite changes:
   `git add .agent/ && git commit -m "chore: sync .agent/ with superpowers <new-tag>"`
   (Replace `<new-tag>` with the actual tag from step 1.)

7. Print a summary report in this format:
   ```
   ✅ Superpowers updated: <old-tag> → <new-tag>
   📦 Skills: <old-count> → <new-count>  (+added_skill / -removed_skill)
   🔄 Rewrote: <list of .agent/ files changed>
   ✅ Unchanged: <list of files with no diff>
   ```
