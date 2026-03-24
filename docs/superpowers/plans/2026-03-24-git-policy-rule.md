# Git Policy Rule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a central `<HARD-GATE>` git policy rule that blocks all git write operations when `auto_commit: false`, and patch skills that currently bypass this setting.

**Architecture:** A new `.agent/rules/git-policy.md` file with a `<HARD-GATE>` tag serves as the single authoritative policy for all git write operations. Two skills (`finishing-a-development-branch`, `using-git-worktrees`) are patched to explicitly check `auto_commit` before their git write steps. New patch entries in `skills-patches.md` ensure the patches survive future upstream updates.

**Tech Stack:** Markdown files only — no code, no dependencies.

---

## File Structure

| File | Action |
|------|--------|
| `.agent/rules/git-policy.md` | **Create** — central HARD-GATE rule |
| `.agent/skills/finishing-a-development-branch/SKILL.md` | **Modify** — add auto_commit gate to Option 1, 2, 4 |
| `.agent/skills/using-git-worktrees/SKILL.md` | **Modify** — add auto_commit gate to gitignore commit step |
| `.agent/patches/skills-patches.md` | **Modify** — add 2 new patch entries |

---

### Task 1: Create `.agent/rules/git-policy.md`

**Files:**
- Create: `.agent/rules/git-policy.md`

- [ ] **Step 1: Create the rule file**

Create `.agent/rules/git-policy.md` with this exact content:

```markdown
# Git Policy

<HARD-GATE>
Before running ANY git write operation — git add, git commit, git push,
git pull, git merge, git tag, git branch -d, git branch -D, git worktree remove,
git rebase, git cherry-pick, git reset --hard —
you MUST read `.agent/config.yml` and check the `auto_commit` setting.

If `auto_commit: false`:
  - DO NOT run the operation
  - Print exactly: "Skipping git operation (auto_commit: false)."
  - Continue with the rest of the task (non-git steps still execute)

If `auto_commit: true` (or key is absent): proceed normally.
</HARD-GATE>

This applies everywhere — inside skills, workflows, and any ad-hoc actions.
No exceptions.

## Always Allowed (read-only)

These operations are never blocked:
- `git status`, `git log`, `git diff`, `git show`
- `git worktree add`, `git worktree list`
- `git checkout <branch>` (navigation only)
```

- [ ] **Step 2: Verify file exists and content is correct**

Run:
```bash
cat .agent/rules/git-policy.md
```
Expected: File content matches above exactly, `<HARD-GATE>` block is present.

- [ ] **Step 3: Skip commit (auto_commit: false)**

Print: `"Skipping git operation (auto_commit: false)."`

---

### Task 2: Patch `finishing-a-development-branch/SKILL.md`

**Files:**
- Modify: `.agent/skills/finishing-a-development-branch/SKILL.md` (lines 66–134)

This task adds `auto_commit` checks before each git write operation in the Execute Choice section.

- [ ] **Step 1: Read the current file to confirm line numbers**

Run:
```bash
grep -n "git merge\|git push\|git branch -d\|git branch -D\|git checkout" \
  .agent/skills/finishing-a-development-branch/SKILL.md
```
Expected: Lines showing git write operations in Option 1, 2, and 4 blocks.

- [ ] **Step 2: Patch Option 1 — add auto_commit gate before merge and branch delete**

Find the `#### Option 1: Merge Locally` block. It currently reads:
```bash
# Switch to base branch
git checkout <base-branch>

# Pull latest
git pull

# Merge feature branch
git merge <feature-branch>

# Verify tests on merged result
<test command>

# If tests pass
git branch -d <feature-branch>
```

Replace with:
```bash
# Switch to base branch
git checkout <base-branch>

# Pull latest
git pull

# Check auto_commit before merge
# Read .agent/config.yml — if auto_commit: false, skip and print skip message
git merge <feature-branch>

# Verify tests on merged result
<test command>

# Check auto_commit before branch delete
# Read .agent/config.yml — if auto_commit: false, skip and print skip message
git branch -d <feature-branch>
```

Add a note above the block:
```
**Before git write steps:** Check `.agent/config.yml` for `auto_commit`.
- If `auto_commit: false`: skip the git operation, print "Skipping git operation (auto_commit: false)."
- If `auto_commit: true` (or absent): proceed normally.
```

- [ ] **Step 3: Patch Option 2 — add auto_commit gate before push**

Find the `#### Option 2: Push and Create PR` block. Add the same `auto_commit` gate note above the `git push` line:

```
**Before git write steps:** Check `.agent/config.yml` for `auto_commit`.
- If `auto_commit: false`: skip the git operation, print "Skipping git operation (auto_commit: false)."
- If `auto_commit: true` (or absent): proceed normally.
```

- [ ] **Step 4: Patch Option 4 — add auto_commit gate before branch delete**

Find the `#### Option 4: Discard` block. After the `Wait for exact confirmation.` line and before `If confirmed:`, add the same `auto_commit` gate note.

- [ ] **Step 5: Verify patches look correct**

Run:
```bash
grep -n "auto_commit\|Skipping" .agent/skills/finishing-a-development-branch/SKILL.md
```
Expected: At least 3 matches — one per patched option (1, 2, 4).

- [ ] **Step 6: Skip commit (auto_commit: false)**

Print: `"Skipping git operation (auto_commit: false)."`

---

### Task 3: Patch `using-git-worktrees/SKILL.md`

**Files:**
- Modify: `.agent/skills/using-git-worktrees/SKILL.md` (lines 62–68)

- [ ] **Step 1: Read the current gitignore-fix section**

Run:
```bash
grep -n -A 5 "If NOT ignored" .agent/skills/using-git-worktrees/SKILL.md
```
Expected: The block showing steps 1, 2, 3 (add .gitignore, commit, proceed).

- [ ] **Step 2: Patch the gitignore auto-commit step**

Find the `**If NOT ignored:**` block:
```
Per Jesse's rule "Fix broken things immediately":
1. Add appropriate line to .gitignore
2. Commit the change
3. Proceed with worktree creation
```

Replace with:
```
Per Jesse's rule "Fix broken things immediately":
1. Add appropriate line to .gitignore
2. Commit the change (if auto_commit enabled)
   - Read `.agent/config.yml` — if `auto_commit: false`: skip commit, print "Skipping git operation (auto_commit: false)."
   - If `auto_commit: true` (or absent): `git add .gitignore && git commit -m "chore: ignore worktree directory"`
3. Proceed with worktree creation
```

- [ ] **Step 3: Verify patch looks correct**

Run:
```bash
grep -n "auto_commit\|Skipping" .agent/skills/using-git-worktrees/SKILL.md
```
Expected: 2+ matches in the gitignore-fix section.

- [ ] **Step 4: Skip commit (auto_commit: false)**

Print: `"Skipping git operation (auto_commit: false)."`

---

### Task 4: Update `skills-patches.md`

**Files:**
- Modify: `.agent/patches/skills-patches.md`

- [ ] **Step 1: Append two new patch entries to the end of the file**

Open `.agent/patches/skills-patches.md` and append at the end:

```markdown

---

## Patch: git-policy rule — finishing-a-development-branch

**File:** `finishing-a-development-branch/SKILL.md`
**Intent:** Before each git write operation in Execute Choice (Option 1: merge + branch delete,
Option 2: push, Option 4: branch delete), add an explicit `auto_commit` check:
- Read `.agent/config.yml` before the git operation
- If `auto_commit: false`: skip the operation, print "Skipping git operation (auto_commit: false)."
- If `auto_commit: true` (or absent): proceed normally.

---

## Patch: git-policy rule — using-git-worktrees

**File:** `using-git-worktrees/SKILL.md`
**Intent:** In the "If NOT ignored" safety verification block, make the git commit step conditional:
- Step 1 (add to .gitignore): always runs — file edit is not a git write operation
- Step 2 (commit): check `auto_commit` in `.agent/config.yml`
  - If `false`: skip commit, print "Skipping git operation (auto_commit: false)."
  - If `true` (or absent): `git add .gitignore && git commit -m "chore: ignore worktree directory"`
- Step 3 (proceed with worktree creation): always runs
```

- [ ] **Step 2: Verify the new entries are appended correctly**

Run:
```bash
tail -40 .agent/patches/skills-patches.md
```
Expected: Both new patch entries visible at the end of the file.

- [ ] **Step 3: Skip commit (auto_commit: false)**

Print: `"Skipping git operation (auto_commit: false)."`

---

### Task 5: Verify End-to-End

**Files:** None modified — verification only.

- [ ] **Step 1: Verify all 4 files exist/are modified**

Run:
```bash
ls -la .agent/rules/git-policy.md && \
grep -c "auto_commit" .agent/skills/finishing-a-development-branch/SKILL.md && \
grep -c "auto_commit" .agent/skills/using-git-worktrees/SKILL.md && \
grep -c "git-policy rule" .agent/patches/skills-patches.md
```
Expected:
- `git-policy.md` exists
- `finishing-a-development-branch/SKILL.md` has 3+ `auto_commit` mentions
- `using-git-worktrees/SKILL.md` has 2+ `auto_commit` mentions
- `skills-patches.md` has 2 `git-policy rule` entries

- [ ] **Step 2: Verify HARD-GATE is present and correct in git-policy.md**

Run:
```bash
grep -c "HARD-GATE" .agent/rules/git-policy.md
```
Expected: `2` (opening and closing tags)

- [ ] **Step 3: Run agent tests if applicable**

Run:
```bash
python3 .agent/.tests/run_tests.py finishing-a-development-branch 2>/dev/null || echo "No tests for this skill"
python3 .agent/.tests/run_tests.py using-git-worktrees 2>/dev/null || echo "No tests for this skill"
```
Expected: Tests pass or "No tests for this skill"

- [ ] **Step 4: Skip commit (auto_commit: false)**

Print: `"Skipping git operation (auto_commit: false)."`
