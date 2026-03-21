# Remove Codex References from .agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip all Codex-specific content from the `template/agent/` directory that gets scaffolded by `npx agy-superpowers init`, so users only see Antigravity-relevant content.

**Architecture:** The `.agent/skills/` are symlinks into `superpowers/skills/` (upstream, not ours to modify). The built `template/agent/` is a resolved copy. The fix is a post-copy **patching step** added to `scripts/build-template.js`: after copying, delete the `codex-tools.md` file and apply targeted text patches to 3 skill files. The `superpowers/` source is left untouched.

**Tech Stack:** Node.js (built-in `fs`, `path`), ESM, regex string replacement.

---

## Codex References Inventory

| File (in `template/agent/`) | Type | What to do |
|---|---|---|
| `skills/using-superpowers/references/codex-tools.md` | Whole file | **Delete** |
| `skills/using-superpowers/SKILL.md` line 38 | Inline mention | **Remove sentence** referencing `codex-tools.md` |
| `skills/executing-plans/SKILL.md` line 14 | Inline mention | **Remove "or Codex"** from platform list |
| `skills/writing-skills/SKILL.md` line 12 | Inline mention | **Remove `~/.agents/skills/` for Codex** clause |

---

## Task 1: Add Codex-stripping patch step to `build-template.js`

**Files:**
- Modify: `scripts/build-template.js`

- [ ] **Step 1: Write failing verification first**

Create a test script that checks `template/agent/` for Codex references (run AFTER build):

```bash
grep -r "codex" template/agent/ --include="*.md" -il
```

Expected output RIGHT NOW (before fix): lists several files.

Run it and confirm it fails (finds files):

```bash
node scripts/build-template.js && grep -r "codex" template/agent/ --include="*.md" -il
```

Expected: Lists `codex-tools.md`, `SKILL.md` files → confirms we have Codex refs to remove.

- [ ] **Step 2: Add `patchTemplate()` function to `scripts/build-template.js`**

Open `scripts/build-template.js` and append the following **after** the `copyDir(SRC, DEST)` call:

```js
// --- POST-COPY PATCH: Remove Codex-specific content ---

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Patch target not found (skipping): ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('🔧 Patching: removing Codex-specific content…');

// 1. Delete codex-tools.md entirely
const codexToolsFile = path.join(DEST, 'skills/using-superpowers/references/codex-tools.md');
if (fs.existsSync(codexToolsFile)) {
  fs.rmSync(codexToolsFile);
  console.log('  🗑  Deleted skills/using-superpowers/references/codex-tools.md');
}

// 2. using-superpowers/SKILL.md — remove the sentence mentioning codex-tools.md
patchFile(path.join(DEST, 'skills/using-superpowers/SKILL.md'), [
  [
    /\n\*\*In other environments:\*\* Check your platform's documentation for how skills are loaded\.\n\n## Platform Adaptation\n\nSkills use Claude Code tool names\. Non-CC platforms: see `references\/codex-tools\.md` \(Codex\) for tool equivalents\. Gemini CLI users get the tool mapping loaded automatically via GEMINI\.md\./,
    '\n\n**In other environments:** Check your platform\'s documentation for how skills are loaded.\n\n## Platform Adaptation\n\nSkills use Claude Code tool names. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.'
  ]
]);
console.log('  ✅ Patched skills/using-superpowers/SKILL.md');

// 3. executing-plans/SKILL.md — remove "or Codex" from the platform note
patchFile(path.join(DEST, 'skills/executing-plans/SKILL.md'), [
  [
    /\(such as Claude Code or Codex\)/g,
    '(such as Claude Code)'
  ]
]);
console.log('  ✅ Patched skills/executing-plans/SKILL.md');

// 4. writing-skills/SKILL.md — remove the Codex personal skills path clause
patchFile(path.join(DEST, 'skills/writing-skills/SKILL.md'), [
  [
    /`~\/\.claude\/skills` for Claude Code, `~\/\.agents\/skills\/` for Codex/g,
    '`~/.claude/skills` for Claude Code'
  ]
]);
console.log('  ✅ Patched skills/writing-skills/SKILL.md');

console.log('✅ Codex references removed from template/agent/');
```

- [ ] **Step 3: Run build and verify patches applied**

```bash
node scripts/build-template.js
```

Expected output:
```
📦 Building template/agent/ from .agent/ (resolving symlinks)…
✅ template/agent/ built successfully
🔧 Patching: removing Codex-specific content…
  🗑  Deleted skills/using-superpowers/references/codex-tools.md
  ✅ Patched skills/using-superpowers/SKILL.md
  ✅ Patched skills/executing-plans/SKILL.md
  ✅ Patched skills/writing-skills/SKILL.md
✅ Codex references removed from template/agent/
```

- [ ] **Step 4: Run the verification test — confirm no Codex references remain**

```bash
grep -r "codex" template/agent/ --include="*.md" -il
```

Expected: **no output** (empty — zero files found).

```bash
grep -ri "codex" template/agent/ --include="*.md" | wc -l && echo "lines with 'codex'"
```

Expected: `0 lines with 'codex'`

- [ ] **Step 5: Verify the patch didn't corrupt the files (spot check)**

```bash
# Check SKILL.md still has the Platform Adaptation section intact
grep -A3 "Platform Adaptation" template/agent/skills/using-superpowers/SKILL.md
```

Expected: Shows the section with only Gemini CLI mention, no Codex.

```bash
# Check executing-plans still has the full note (just without Codex)
grep "subagent support" template/agent/skills/executing-plans/SKILL.md
```

Expected: Line contains `(such as Claude Code)` — no `or Codex`.

```bash
# Check writing-skills personal skills line
grep "claude/skills" template/agent/skills/writing-skills/SKILL.md
```

Expected: Shows only `~/.claude/skills` for Claude Code, no Codex path.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-template.js template/
git commit -m "fix: remove Codex-specific content from template/agent/ via build patches"
```

---

## Task 2: Publish updated package

- [ ] **Step 1: Bump patch version and publish**

```bash
./scripts/publish.sh patch
```

Expected:
```
📦 Current version: 5.0.5
🔢 Bump type: patch
🚀 New version: 5.0.6
📤 Publishing agy-superpowers@5.0.6 to npm...
+ agy-superpowers@5.0.6
✅ Done!
```

- [ ] **Step 2: Verify published package has no Codex content**

```bash
rm -rf /tmp/verify-no-codex && mkdir /tmp/verify-no-codex
cd /tmp/verify-no-codex && npx agy-superpowers@latest init
grep -r "codex" .agent/ --include="*.md" -il
```

Expected: **no output** — clean package.

- [ ] **Step 3: Push when ready**

```bash
git push origin main --tags
```

---

## Success Criteria

| Check | Expected |
|---|---|
| `grep -ri "codex" template/agent/` | 0 results |
| `template/agent/skills/using-superpowers/references/codex-tools.md` exists | ❌ File deleted |
| `using-superpowers/SKILL.md` — Platform Adaptation section | Only mentions Gemini CLI, no Codex |
| `executing-plans/SKILL.md` — platform note | `(such as Claude Code)` only |
| `writing-skills/SKILL.md` — personal skills line | Only `~/.claude/skills` for Claude Code |
| `npx agy-superpowers@latest init` then `grep -ri codex .agent/` | 0 results |
| `superpowers/skills/` source files | **Unchanged** — upstream not touched |
