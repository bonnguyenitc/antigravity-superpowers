# Design: Global Git Policy Rule

**Date:** 2026-03-24  
**Status:** Approved  
**Topic:** Strengthen `auto_commit: false` enforcement across all skills

---

## Problem

When `auto_commit: false` is set in `.agent/config.yml`, the AI still performs git write operations (commit, push, merge) through skill paths that were never patched:

- `finishing-a-development-branch/SKILL.md` — directly runs `git push`, `git merge`, `git branch -d/-D` with no `auto_commit` check
- `using-git-worktrees/SKILL.md` — auto-commits `.gitignore` fix with no `auto_commit` check
- AI "freestyle" git ops — not in any skill flow, no guardrail

Current patches only cover 4 skills:
- `brainstorming/SKILL.md` ✅
- `writing-plans/SKILL.md` ✅
- `subagent-driven-development/SKILL.md` ✅
- `subagent-driven-development/implementer-prompt.md` ✅

---

## User Requirements

- When `auto_commit: false`: block **all** git write operations entirely
- No suggested git commands needed — just a short skip message
- Applies to: `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git tag`, `git branch -d/-D`, `git worktree remove`, `git rebase`, `git cherry-pick`, `git reset --hard`
- Non-git steps in the same task continue normally

---

## Approach: Global Git Policy Rule

A single `.agent/rules/git-policy.md` file with a `<HARD-GATE>` tag creates a centralized, AI-readable policy that applies universally — inside skills, workflows, and ad-hoc actions.

**Why a separate rule file (not added to `superpowers.md`):**
- Separation of concerns: git policy is a distinct concern
- Survivability: won't be overwritten by `/update-superpowers`
- Discoverability: AI scans entire `rules/` dir early in every session

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.agent/rules/git-policy.md` | Create | Central HARD-GATE rule blocking git write ops when `auto_commit: false` |
| `.agent/skills/finishing-a-development-branch/SKILL.md` | Modify | Add `auto_commit` check before merge/push/branch-delete steps |
| `.agent/skills/using-git-worktrees/SKILL.md` | Modify | Add `auto_commit` check before gitignore auto-commit step |
| `.agent/patches/skills-patches.md` | Modify | Add 2 new patches for the 2 skills above to survive upstream updates |

---

## Design Details

### 1. `.agent/rules/git-policy.md` (new file)

```markdown
# Git Policy

<HARD-GATE>
Before running ANY git write operation — git add, git commit, git push,
git merge, git tag, git branch -d, git branch -D, git worktree remove —
you MUST read `.agent/config.yml` and check the `auto_commit` setting.

If `auto_commit: false`:
  - DO NOT run the operation
  - Print exactly: "Skipping git operation (auto_commit: false)."
  - Continue with the rest of the task (non-git steps still execute)

If `auto_commit: true` (or key is absent): proceed normally.
</HARD-GATE>

This applies everywhere — inside skills, workflows, and any ad-hoc actions.
No exceptions.
```

### 2. `finishing-a-development-branch/SKILL.md`

Add `auto_commit` gate before each git write operation per option:
- **Option 1 (Merge locally):** gate before `git merge` and `git branch -d`
- **Option 2 (Push + PR):** gate before `git push`
- **Option 4 (Discard):** gate before `git branch -D`

If `auto_commit: false`: print "Skipping git operation (auto_commit: false)." and skip that step.

### 3. `using-git-worktrees/SKILL.md`

In the safety verification section, "If NOT ignored → Add to .gitignore + commit" step:
- Still add the entry to `.gitignore` (file edit is allowed)
- Gate the `git add .gitignore && git commit` behind `auto_commit` check
- If `false`: skip commit, print skip message

### 4. `skills-patches.md` additions

Two new entries documenting intent for upstream sync:

```
## Patch: git-policy rule — finishing-a-development-branch
File: finishing-a-development-branch/SKILL.md
Intent: Before each git write operation (merge, push, branch delete),
check .agent/config.yml auto_commit. If false, skip and print:
"Skipping git operation (auto_commit: false)."

## Patch: git-policy rule — using-git-worktrees
File: using-git-worktrees/SKILL.md
Intent: In the "Add to .gitignore + commit" step, gate the git commit
behind auto_commit check. File edit still happens; commit is skipped if false.
```

---

## Behavior Summary

| `auto_commit` | git add | git commit | git push | git merge | git branch -d |
|---|---|---|---|---|---|
| `true` (or absent) | ✅ runs | ✅ runs | ✅ runs | ✅ runs | ✅ runs |
| `false` | ❌ skip | ❌ skip | ❌ skip | ❌ skip | ❌ skip |

---

## What Is NOT Blocked

- `git status`, `git log`, `git diff`, `git show` — read-only, always allowed
- `git worktree add`, `git worktree list` — structure ops, not write ops
- `git checkout <branch>` — navigation, not write op
- `git stash` — local-only safety net, borderline; excluded from gate for now

---

## Testing

Manual verification after implementation:
1. Set `auto_commit: false` in `.agent/config.yml`
2. Run brainstorming → finishing-a-development-branch: verify no git ops run
3. Run using-git-worktrees on a project without `.gitignore` entry: verify `.gitignore` is edited but not committed
4. Ask AI ad-hoc "commit this file": verify AI reads config and skips
