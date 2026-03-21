# AI-Driven Skill Patching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace regex `patchFile()` calls in `patch-agent-skills.js` with a human-readable `.agent/patches/skills-patches.md` that AI reads and applies semantically during the `update-superpowers` workflow.

**Architecture:** New patch spec file documents all Antigravity-specific adaptations in plain English. Script is simplified to copy + delete + create only. Workflow Phase 2 gains a new step to apply patches via AI.

**Tech Stack:** Markdown + JavaScript (Node.js ES modules).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `.agent/patches/skills-patches.md` | **Create** | All patch intents in natural language |
| `scripts/patch-agent-skills.js` | **Modify** | Remove `patchFile()` function and all its calls |
| `.agent/workflows/update-superpowers.md` | **Modify** | Replace Step 7 with broader "apply skills-patches.md" step |

---

### Task 1: Create `.agent/patches/skills-patches.md`

**Files:**
- Create: `.agent/patches/skills-patches.md`

- [ ] **Step 1: Create the file with all patches**

  Create `.agent/patches/skills-patches.md` with this exact content:

  ```markdown
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
  ```

- [ ] **Step 2: Verify file was created**

  Run: `cat .agent/patches/skills-patches.md | head -5`
  Expected: Shows `# Skill Patches` header.

---

### Task 2: Strip `patchFile()` from `patch-agent-skills.js`

**Files:**
- Modify: `scripts/patch-agent-skills.js`

- [ ] **Step 1: Count current patchFile calls to know what to remove**

  Run: `grep -n "patchFile\|function patchFile" scripts/patch-agent-skills.js`
  Expected: Shows `patchFile` function definition + 5 call sites.

- [ ] **Step 2: Remove the `patchFile` function and all its call sites**

  Delete these blocks from the file (keep everything else):
  - The `function patchFile(filePath, replacements) { ... }` function definition
  - `patchFile(path.join(SKILLS_DIR, 'using-superpowers/SKILL.md'), [...])`
  - `patchFile(path.join(SKILLS_DIR, 'executing-plans/SKILL.md'), [...])`
  - `patchFile(path.join(SKILLS_DIR, 'writing-skills/SKILL.md'), [...])`
  - `patchFile(path.join(SKILLS_DIR, 'brainstorming/visual-companion.md'), [...])`
  - `patchFile(path.join(SKILLS_DIR, 'dispatching-parallel-agents/SKILL.md'), [...])`
  - Their corresponding `console.log('  ✅ Patched ...')` lines

  Also update the section comment from:
  ```js
  // --- Step 2: Apply patches to remove non-Antigravity tool references ---
  ```
  To:
  ```js
  // --- Step 2: Delete platform-specific files and create Antigravity replacements ---
  ```

- [ ] **Step 3: Verify no patchFile calls remain**

  Run: `grep -n "patchFile" scripts/patch-agent-skills.js`
  Expected: No output (zero matches).

- [ ] **Step 4: Verify script still has correct structure**

  Run: `node --input-type=module --check < scripts/patch-agent-skills.js && echo "Syntax OK"`
  Expected: `Syntax OK`

---

### Task 3: Update `update-superpowers.md` workflow

**Files:**
- Modify: `.agent/workflows/update-superpowers.md`

- [ ] **Step 1: Read current Step 7 to understand what to replace**

  Run: `grep -n "config.yml flag\|skills-patches\|Phase 2" .agent/workflows/update-superpowers.md`
  Expected: Shows line numbers of current Phase 2 steps.

- [ ] **Step 2: Replace Step 7 with broader AI patch step**

  Find Step 7 ("Apply `.agent/config.yml` flag behaviors to skills") and replace with:

  ```markdown
  7. **Phase 2 — Apply skill patches from `.agent/patches/skills-patches.md`**

     Read `.agent/patches/skills-patches.md`. For each patch entry:
     - Open the target SKILL.md (path relative to `.agent/skills/`)
     - Understand the *intent* described — do not match text literally
     - Find the relevant section in the current file content
     - Rewrite that section to match the intent, adapting to any upstream wording changes
     - If the patch is already applied → skip, note "already applied"

     Apply all patches before moving to the next step.
  ```

- [ ] **Step 3: Verify the step reads cleanly**

  Run: `grep -A 10 "skills-patches" .agent/workflows/update-superpowers.md`
  Expected: Shows the new step 7 content.

---

## Verification Plan

### Manual Verification

This feature is AI-workflow-only (no runnable automated tests). Verify by simulating the update workflow:

**Test A — Patch spec file is complete:**
1. Run: `cat .agent/patches/skills-patches.md`
2. Expected: 7 patch sections, each with `**File:**` and `**Intent:**` fields

**Test B — Script no longer has patchFile:**
1. Run: `grep "patchFile" scripts/patch-agent-skills.js`
2. Expected: No output

**Test C — Script syntax is valid:**
1. Run: `node --input-type=module --check < scripts/patch-agent-skills.js && echo "OK"`
2. Expected: `OK`

**Test D — Workflow has skills-patches step:**
1. Run: `grep "skills-patches" .agent/workflows/update-superpowers.md`
2. Expected: Shows Step 7 reference to the new file
