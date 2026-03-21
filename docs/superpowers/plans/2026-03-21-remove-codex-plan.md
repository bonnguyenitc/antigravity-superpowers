# Remove Non-Antigravity Tool References — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip all references to non-Antigravity platforms (Claude Code, Codex, Gemini CLI, Cursor, OpenCode) from `template/agent/` so users only see Antigravity-relevant content. Patches are applied post-copy in `scripts/build-template.js`.

**Antigravity context:** Antigravity reads `.agent/` (rules, skills, workflows). Config file is `GEMINI.md`. Tool names differ from Claude Code. References to other platforms add noise and confusion.

**Architecture:** All patches live in `build-template.js` as post-copy transforms. Source `superpowers/` and `.agent/` are untouched (upstream). `template/` is a gitignored build artifact.

---

## Non-Antigravity References Inventory

### Already patched (Task 0 — done)
| File | What was removed |
|---|---|
| `skills/using-superpowers/references/codex-tools.md` | Deleted |
| `skills/using-superpowers/SKILL.md` | Codex tool mapping sentence |
| `skills/executing-plans/SKILL.md` | `or Codex` in platform list |
| `skills/writing-skills/SKILL.md` | `~/.agents/skills/ for Codex` |
| `skills/brainstorming/visual-companion.md` | Codex platform block |

### Still to patch (this plan)

| File | Non-Antigravity content | Action |
|---|---|---|
| `skills/using-superpowers/SKILL.md` | `In Claude Code:` + `In Gemini CLI:` how-to blocks | Replace with `In Antigravity:` block |
| `skills/using-superpowers/SKILL.md` | `CLAUDE.md, GEMINI.md, AGENTS.md` in priority list | Replace with `GEMINI.md, AGENTS.md` (drop CLAUDE.md) |
| `skills/using-superpowers/SKILL.md` | `Skills use Claude Code tool names. Gemini CLI users…` | Replace with Antigravity description |
| `skills/using-superpowers/references/gemini-tools.md` | Whole file (Gemini CLI ≠ Antigravity) | **Delete** |
| `skills/brainstorming/visual-companion.md` | `Claude Code (macOS/Linux):` + `Claude Code (Windows):` + `Gemini CLI:` platform blocks | Replace with single `Antigravity:` block |
| `skills/writing-skills/SKILL.md` | `~/.claude/skills for Claude Code` personal skills path | Replace with `~/.agent/skills` for Antigravity |
| `skills/dispatching-parallel-agents/SKILL.md` | `// In Claude Code / AI environment` comment | Remove comment or replace with neutral |
| `skills/writing-skills/anthropic-best-practices.md` | Entire file — Anthropic/Claude-specific guidelines | **Delete** |
| `skills/writing-skills/examples/CLAUDE_MD_TESTING.md` | Entire file — Claude-specific testing doc | **Delete** |
| `skills/systematic-debugging/CREATION-LOG.md` | Entire file — internal creation log, not user-facing | **Delete** |

---

## Task 1: Extend `build-template.js` patch step

**Files:**
- Modify: `scripts/build-template.js`

- [ ] **Step 1: Verify current state (RED — these refs still exist)**

```bash
node scripts/build-template.js 2>/dev/null
grep -rin "claude code\|gemini cli\|\.claude/" template/agent/ --include="*.md" -l
```

Expected: Lists several files → confirms refs exist before patching.

- [ ] **Step 2: Add new patches to `build-template.js`**

Inside `scripts/build-template.js`, after the existing Codex patches, append:

```js
// 6. Delete gemini-tools.md (Gemini CLI ≠ Antigravity)
const geminiToolsFile = path.join(DEST, 'skills/using-superpowers/references/gemini-tools.md');
if (fs.existsSync(geminiToolsFile)) {
  fs.rmSync(geminiToolsFile);
  console.log('  🗑  Deleted skills/using-superpowers/references/gemini-tools.md');
}

// 7. Delete Anthropic/Claude-specific files from writing-skills
const filesToDelete = [
  'skills/writing-skills/anthropic-best-practices.md',
  'skills/writing-skills/examples/CLAUDE_MD_TESTING.md',
  'skills/systematic-debugging/CREATION-LOG.md',
];
for (const f of filesToDelete) {
  const fp = path.join(DEST, f);
  if (fs.existsSync(fp)) {
    fs.rmSync(fp);
    console.log(`  🗑  Deleted ${f}`);
  }
}

// 8. using-superpowers/SKILL.md — replace Claude Code + Gemini CLI platform blocks
//    with a single Antigravity block; clean up CLAUDE.md refs and tool name note
patchFile(path.join(DEST, 'skills/using-superpowers/SKILL.md'), [
  // Replace CLAUDE.md in priority list → drop it (GEMINI.md is the Antigravity equivalent)
  [
    /CLAUDE\.md, GEMINI\.md, AGENTS\.md/g,
    'GEMINI.md, AGENTS.md'
  ],
  // Replace "If CLAUDE.md, GEMINI.md..." sentence
  [
    /If CLAUDE\.md, GEMINI\.md, or AGENTS\.md says/g,
    'If GEMINI.md or AGENTS.md says'
  ],
  // Replace platform-specific "How to Access Skills" block
  [
    /\*\*In Claude Code:\*\* Use the `Skill` tool[\s\S]*?\*\*In other environments:\*\* Check your platform's documentation for how skills are loaded\./,
    '**In Antigravity:** Skills are loaded automatically from `.agent/skills/`. Use `view_file` on the skill\'s `SKILL.md` to read it. Skills activate based on their `description` field — the agent checks descriptions before responding.'
  ],
  // Replace the Platform Adaptation section (now about Antigravity)
  [
    /## Platform Adaptation\n\nSkills use Claude Code tool names\. Gemini CLI users get the tool mapping loaded automatically via GEMINI\.md\./,
    '## Platform Adaptation\n\nThis package is configured for **Google Antigravity**. Tool mappings are handled automatically via `GEMINI.md` in your workspace.'
  ],
]);
console.log('  ✅ Patched skills/using-superpowers/SKILL.md (non-Antigravity platform refs)');

// 9. brainstorming/visual-companion.md — replace Claude Code + Gemini CLI platform blocks
//    with single Antigravity block
patchFile(path.join(DEST, 'skills/brainstorming/visual-companion.md'), [
  [
    /\*\*Claude Code \(macOS \/ Linux\):\*\*\n```bash[\s\S]*?```\n\n\*\*Claude Code \(Windows\):\*\*\n```bash[\s\S]*?```\n[\s\S]*?\*\*Gemini CLI:\*\*\n```bash[\s\S]*?```\n/,
    '**Antigravity:**\n```bash\n# Default mode works — launch the server normally\nscripts/start-server.sh --project-dir /path/to/project\n```\n'
  ]
]);
console.log('  ✅ Patched skills/brainstorming/visual-companion.md (platform blocks)');

// 10. writing-skills/SKILL.md — replace ~/.claude/skills with Antigravity path
patchFile(path.join(DEST, 'skills/writing-skills/SKILL.md'), [
  [
    /`~\/\.claude\/skills` for Claude Code/g,
    '`~/.agent/skills` for Antigravity'
  ]
]);
console.log('  ✅ Patched skills/writing-skills/SKILL.md (personal skills path)');

// 11. dispatching-parallel-agents/SKILL.md — remove "In Claude Code / AI environment" comment
patchFile(path.join(DEST, 'skills/dispatching-parallel-agents/SKILL.md'), [
  [
    /\/\/ In Claude Code \/ AI environment\n/g,
    ''
  ]
]);
console.log('  ✅ Patched skills/dispatching-parallel-agents/SKILL.md');

console.log('✅ All non-Antigravity platform references removed');
```

- [ ] **Step 3: Run build and check output**

```bash
node scripts/build-template.js
```

Expected output (all patches fire):
```
🔧 Patching: removing Codex-specific content…
  🗑  Deleted skills/using-superpowers/references/codex-tools.md
  ✅ Patched skills/using-superpowers/SKILL.md
  ✅ Patched skills/executing-plans/SKILL.md
  ✅ Patched skills/writing-skills/SKILL.md
  ✅ Patched skills/brainstorming/visual-companion.md
  🗑  Deleted skills/using-superpowers/references/gemini-tools.md
  🗑  Deleted skills/writing-skills/anthropic-best-practices.md
  🗑  Deleted skills/writing-skills/examples/CLAUDE_MD_TESTING.md
  🗑  Deleted skills/systematic-debugging/CREATION-LOG.md
  ✅ Patched skills/using-superpowers/SKILL.md (non-Antigravity platform refs)
  ✅ Patched skills/brainstorming/visual-companion.md (platform blocks)
  ✅ Patched skills/writing-skills/SKILL.md (personal skills path)
  ✅ Patched skills/dispatching-parallel-agents/SKILL.md
✅ All non-Antigravity platform references removed
```

- [ ] **Step 4: Verify — no Claude Code or Gemini CLI refs remain**

```bash
grep -ri "claude code\|gemini cli\|\.claude/\|CLAUDE\.md" template/agent/ --include="*.md" -l
```

Expected: **no output** (empty).

- [ ] **Step 5: Spot check key patches applied correctly**

```bash
# using-superpowers: should mention Antigravity, not Claude Code
grep -A3 "In Antigravity" template/agent/skills/using-superpowers/SKILL.md

# brainstorming: should show Antigravity block, not Claude Code blocks
grep -B1 -A4 "Antigravity:" template/agent/skills/brainstorming/visual-companion.md

# writing-skills: should show Antigravity path
grep "agent/skills" template/agent/skills/writing-skills/SKILL.md

# deleted files should not exist
ls template/agent/skills/writing-skills/anthropic-best-practices.md 2>&1
ls template/agent/skills/using-superpowers/references/gemini-tools.md 2>&1
```

Expected:
- Antigravity block present in SKILL.md ✅
- Old Claude Code blocks gone ✅
- `No such file` for deleted files ✅

- [ ] **Step 6: Commit**

```bash
git add scripts/build-template.js
git commit -m "fix: strip all non-Antigravity platform refs from template (Claude Code, Gemini CLI)"
```

---

## Success Criteria

| Check | Expected |
|---|---|
| `grep -ri "claude code" template/agent/ --include="*.md"` | 0 results |
| `grep -ri "gemini cli" template/agent/ --include="*.md"` | 0 results |
| `grep -ri "codex" template/agent/ --include="*.md"` | 0 results |
| `skills/using-superpowers/SKILL.md` — How to Access Skills | Single `In Antigravity:` block |
| `skills/brainstorming/visual-companion.md` — platform section | Single `Antigravity:` block |
| `references/gemini-tools.md` | ❌ Deleted |
| `writing-skills/anthropic-best-practices.md` | ❌ Deleted |
| `writing-skills/examples/CLAUDE_MD_TESTING.md` | ❌ Deleted |
| `systematic-debugging/CREATION-LOG.md` | ❌ Deleted |
| `superpowers/` source files | **Unchanged** |
