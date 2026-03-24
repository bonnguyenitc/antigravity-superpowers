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
