# AI-Driven Skill Patching — Design Spec

> **Goal:** Replace brittle regex patches in `patch-agent-skills.js` with a human-readable patch spec file that AI applies semantically during `update-superpowers`.
>
> **Problem:** `patchFile()` calls in `patch-agent-skills.js` use regex to remove non-Antigravity platform references from SKILL.md files. If upstream changes wording, the regex silently fails and the old platform refs remain. Adding new patches requires writing JavaScript regex.

---

## Design

### New File: `.agent/patches/skills-patches.md`

A markdown file where each section describes one patch — the *intent*, not the exact text to match. AI reads this file and applies each patch semantically to the target SKILL file.

**Format per patch:**
```markdown
## Patch: <short name>

**File:** `<relative path under .agent/skills/>`
**Intent:** <natural language description of what should change and why>
```

**All current patches to migrate:**

| Patch | File | Intent |
|---|---|---|
| Platform Adaptation | `using-superpowers/SKILL.md` | Replace Claude Code / Gemini CLI / Codex refs with Antigravity (`view_file` on SKILL.md) |
| Platform mentions | `executing-plans/SKILL.md` | Replace "(such as Claude Code or Codex)" with "(such as Antigravity)" |
| Skills path | `writing-skills/SKILL.md` | Replace `~/.claude/skills` / `~/.agents/skills/` with `~/.agent/skills` for Antigravity |
| Visual companion | `brainstorming/visual-companion.md` | Remove Codex block; replace Claude Code + Gemini CLI server blocks with single Antigravity block |
| Platform comment | `dispatching-parallel-agents/SKILL.md` | Remove `// In Claude Code / AI environment` comment |
| auto_commit | `brainstorming/SKILL.md` | Make "commit design doc" step conditional on `.agent/config.yml` auto_commit flag |
| auto_commit | `subagent-driven-development/SKILL.md` | Make implementer commit step conditional on `.agent/config.yml` auto_commit flag |

### Changes to `patch-agent-skills.js`

**Keep:**
- `copyDir()` — copy fresh skills from `superpowers/skills/` → `.agent/skills/`
- `deleteFile()` calls — remove `codex-tools.md`, `gemini-tools.md`, `anthropic-best-practices.md`, etc.
- Inline creation of `antigravity-tools.md` (new file, not a patch)

**Remove:**
- All `patchFile()` calls and the `patchFile()` function itself

### Changes to `update-superpowers.md` workflow

**Replace** the current Step 7 "Apply `.agent/config.yml` flag behaviors" with a broader step:

> **Phase 2 — Apply skill patches from `.agent/patches/skills-patches.md`**
>
> Read the file. For each patch entry, open the target SKILL.md, understand the intent described, find the relevant section, and rewrite it to match the intent. If already applied → skip, note "already applied". If upstream content changed → adapt gracefully.

This consolidates both platform adaptation patches AND feature flag patches (like `auto_commit`) into one authoritative file.

---

## Benefits

- **Robust:** AI understands intent, not text. Upstream wording changes don't break patches.
- **Extensible:** Adding a new patch = append a section to `skills-patches.md`, no code changes.
- **Readable:** Patches are documented in plain English, reviewable by anyone.
- **Consolidated:** One place for all Antigravity-specific adaptations.

---

## Verification

After implementation, manually run `/update-superpowers` (or simulate by running `patch-agent-skills.js` then the workflow Phase 2 steps manually) and verify:
1. `using-superpowers/SKILL.md` — no Claude Code / Gemini CLI mentions
2. `brainstorming/SKILL.md` — commit step is conditional on `.agent/config.yml`
3. `dispatching-parallel-agents/SKILL.md` — no `// In Claude Code` comment
