# Optional Auto-Commit Feature — Design Spec

> **Goal:** Make git commits optional via a per-project config flag instead of always automatic.
>
> **Context:** Currently, some Superpowers skills commit git changes automatically without asking the user — specifically `brainstorming` (commits design docs) and `subagent-driven-development` (implementer subagent commits after each task). This feature adds a flag so users can opt out.

---

## Problem

Skills that auto-commit assume the user always wants commits at those points. This is appropriate for many workflows but not all. Some users prefer to control exactly when commits happen.

---

## Design

### Config Format

Add a `## User Preferences` section to `.agent/rules/superpowers.md`:

```markdown
## User Preferences

- `auto_commit: true` — AI automatically commits after tasks and design docs.
  Set to `false` to skip all git commits and staging; files are left as modified.
```

This file already has `alwaysApply: true`, so the AI reads it on every conversation — no new file or lookup mechanism needed.

### Default Value

`auto_commit: true` — preserves current behavior. Users explicitly set it to `false` to opt out.

### Behavior When `auto_commit: false`

Any skill or step that would normally run `git add` + `git commit` **skips both** and instead prints:

> "Skipping commit (`auto_commit: false` in `.agent/rules/superpowers.md`). Files are left as modified for manual commit."

The user retains full control over when to commit.

### Skills Affected

| Skill | Where commit happens | What changes |
|---|---|---|
| `brainstorming` | "Commit the design document to git" (step after writing spec) | Skip if flag is false |
| `subagent-driven-development` | Implementer subagent "commits" after each task | Skip if flag is false |

---

## Out of Scope

- `finishing-a-development-branch`: already interactive (asks user what to do) — no change needed
- Per-task override (e.g., committing some tasks but not others) — YAGNI
- Global config (cross-project) — per-project config is sufficient for now

---

## Verification

Manual: Set `auto_commit: false` in `.agent/rules/superpowers.md`, run a brainstorming session or ask AI to "commit this file", verify AI skips commit and prints the skip message.
