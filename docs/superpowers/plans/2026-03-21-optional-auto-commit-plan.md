# Optional Auto-Commit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `auto_commit` flag to `.agent/rules/superpowers.md` so users can disable automatic git commits across all Superpowers skills.

**Architecture:** Add a `## User Preferences` section to the existing rules file. Update `brainstorming` and `subagent-driven-development` SKILL.md files to check this flag before committing. No new files needed.

**Tech Stack:** Markdown only — no code, no dependencies.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `.agent/rules/superpowers.md` | Modify | Add `auto_commit` flag with documentation |
| `.agent/skills/brainstorming/SKILL.md` | Modify | Check flag before "Commit the design document" step |
| `.agent/skills/subagent-driven-development/SKILL.md` | Modify | Check flag before implementer commit instructions |

---

### Task 1: Add `auto_commit` flag to rules file

**Files:**
- Modify: `.agent/rules/superpowers.md`

- [ ] **Step 1: Open the file and verify current content**

  Run: `cat .agent/rules/superpowers.md`
  Expected: File ends after "Evidence over claims" line — no User Preferences section exists.

- [ ] **Step 2: Add User Preferences section**

  Append to the end of `.agent/rules/superpowers.md`:

  ```markdown

  ## User Preferences

  Configure these settings per-project by editing this file.

  - `auto_commit: true` — AI automatically commits after completing tasks and writing design docs.
    Set to `false` to skip all git commits and staging; files are left as modified for manual commit.

  ### Current Settings

  auto_commit: true
  ```

- [ ] **Step 3: Verify the file looks correct**

  Run: `cat .agent/rules/superpowers.md`
  Expected: New section appears at the bottom with `auto_commit: true` under `### Current Settings`.

---

### Task 2: Update `brainstorming` skill to respect the flag

**Files:**
- Modify: `.agent/skills/brainstorming/SKILL.md`

- [ ] **Step 1: Find the commit step in the skill**

  Run: `grep -n "commit" .agent/skills/brainstorming/SKILL.md`
  Expected: Line containing "Commit the design document to git"

- [ ] **Step 2: Replace the commit instruction with a conditional one**

  Find this text (line ~117):
  ```markdown
  - Commit the design document to git
  ```

  Replace with:
  ```markdown
  - **Commit the design document to git** — but first check `.agent/rules/superpowers.md`:
    - If `auto_commit: true` (default): run `git add <path> && git commit -m "docs: add <topic> design spec"`
    - If `auto_commit: false`: skip commit and staging entirely. Print: "Skipping commit (auto_commit: false in .agent/rules/superpowers.md). File is ready for manual commit."
  ```

- [ ] **Step 3: Verify the change**

  Run: `grep -A 4 "Commit the design" .agent/skills/brainstorming/SKILL.md`
  Expected: Shows the new conditional commit instruction.

---

### Task 3: Update `subagent-driven-development` skill to respect the flag

**Files:**
- Modify: `.agent/skills/subagent-driven-development/SKILL.md`

- [ ] **Step 1: Find the commit instruction for implementer subagents**

  Run: `grep -n "commit" .agent/skills/subagent-driven-development/SKILL.md`
  Expected: Lines containing implementer commit instructions (in the process diagram and example).

- [ ] **Step 2: Add flag-check instruction to the implementer guidance section**

  Find the "Remember" or summary section (near line 57–63 in the skill).
  Add after the existing remember items:

  ```markdown
  - **Before committing:** Check `.agent/rules/superpowers.md` for `auto_commit` setting.
    - If `auto_commit: true` (default): commit normally with `git add` + `git commit`
    - If `auto_commit: false`: skip commit and staging. Print: "Skipping commit (auto_commit: false). Files left as modified for manual commit."
  ```

- [ ] **Step 3: Also update the process diagram label**

  Find (line ~51):
  ```
  \"Implementer subagent implements, tests, commits, self-reviews\" [shape=box];
  ```

  Replace with:
  ```
  \"Implementer subagent implements, tests, commits (if auto_commit: true), self-reviews\" [shape=box];
  ```

- [ ] **Step 4: Verify the changes**

  Run: `grep -n "auto_commit" .agent/skills/subagent-driven-development/SKILL.md`
  Expected: 2 occurrences — one in the diagram, one in the instructions.

---

## Verification Plan

### Manual Verification

This feature is AI-instruction-only (no runnable code), so verification is manual:

**Test A — Flag is `true` (default behavior unchanged):**
1. Open `.agent/rules/superpowers.md` and confirm `auto_commit: true`
2. Ask AI: *"Please commit this file: docs/test.md"* (create a dummy file first with `echo "test" > docs/test.md`)
3. Expected: AI runs `git add docs/test.md && git commit -m "..."` normally

**Test B — Flag is `false` (skip behavior):**
1. Edit `.agent/rules/superpowers.md`: change `auto_commit: true` → `auto_commit: false`
2. Ask AI: *"Please commit this file: docs/test.md"*
3. Expected: AI prints the skip message and does NOT run any git commands
4. Verify: `git status` shows `docs/test.md` as untracked/modified — no commit happened

**Test C — Brainstorming session respects flag:**
1. Keep `auto_commit: false`
2. Run a short brainstorm (`/brainstorm`) ending with a design doc write
3. Expected: AI writes the design doc but prints the skip message instead of committing

After verification, revert: change `auto_commit: false` back to `auto_commit: true`.
