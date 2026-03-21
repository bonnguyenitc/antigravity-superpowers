# Skill Patches

Patches applied by AI during the `update-superpowers` workflow (Phase 2, Step 7).
Each patch describes the *intent* of the change — AI finds the relevant section and rewrites it.
Do not match text literally. Understand intent and adapt to current upstream wording.

---

## Patch: Platform Adaptation — using-superpowers

**File:** `using-superpowers/SKILL.md`
**Intent:** Remove all references to Claude Code, Gemini CLI, and Codex. Replace with a single
Antigravity block: skills are read using `view_file` on `.agent/skills/<name>/SKILL.md`.
Reference `references/antigravity-tools.md` for tool name mappings.
The Platform Adaptation section should say this package is configured for Google Antigravity,
with tool name equivalents in `references/antigravity-tools.md`.

---

## Patch: Platform mentions — executing-plans

**File:** `executing-plans/SKILL.md`
**Intent:** Replace any mentions of "Claude Code", "Codex", or other non-Antigravity platforms
with "Antigravity". Example: "(such as Claude Code or Codex)" → "(such as Antigravity)".

---

## Patch: Skills path — writing-skills

**File:** `writing-skills/SKILL.md`
**Intent:** Replace platform-specific personal skill paths (`~/.claude/skills` for Claude Code,
`~/.agents/skills/` for Codex) with the Antigravity path: `~/.agent/skills`.

---

## Patch: Visual companion platform blocks — brainstorming

**File:** `brainstorming/visual-companion.md`
**Intent:** Remove the Codex-specific server block. Replace Claude Code and Gemini CLI
server startup blocks with a single Antigravity block:
```bash
# Launch the server normally
scripts/start-server.sh --project-dir /path/to/project
```

---

## Patch: Platform comment — dispatching-parallel-agents

**File:** `dispatching-parallel-agents/SKILL.md`
**Intent:** Remove the comment `// In Claude Code / AI environment` (or similar platform-specific
inline comments). The code should work without platform-specific annotations.

---

## Patch: auto_commit flag — brainstorming

**File:** `brainstorming/SKILL.md`
**Intent:** Make the step that commits the design document to git conditional on `.agent/config.yml`:
- Read `.agent/config.yml` before committing
- If `auto_commit: true` (default): commit normally with `git add <path> && git commit -m "docs: add <topic> design spec"`
- If `auto_commit: false`: skip commit and staging entirely. Print: "Skipping commit (auto_commit: false in .agent/config.yml). File is ready for manual commit."

---

## Patch: auto_commit flag — subagent-driven-development

**File:** `subagent-driven-development/SKILL.md`
**Intent:** Make the implementer subagent commit step conditional on `.agent/config.yml`:
- Read `.agent/config.yml` before committing
- If `auto_commit: true` (default): commit normally with `git add` + `git commit`
- If `auto_commit: false`: skip commit and staging entirely. Print: "Skipping commit (auto_commit: false in .agent/config.yml). Files left as modified for manual commit."
Update any diagram labels that mention "commits" to reflect this conditionality
(e.g. "commits (if auto_commit: true)").
