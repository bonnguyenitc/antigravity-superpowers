#!/usr/bin/env node
// scripts/patch-agent-skills.js
// Always copies fresh skills from superpowers/skills/ → .agent/skills/.
// Then applies Antigravity-specific patches to remove non-Antigravity tool refs.
// Run after update-superpowers to keep .agent/ self-contained and superpowers/ untouched.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, '.agent', 'skills');
const SUPERPOWERS_SKILLS = path.join(ROOT, 'superpowers', 'skills');

// --- Step 1: Always copy fresh from superpowers/skills/ → .agent/skills/ ---
// Works whether .agent/skills/* are symlinks (first run) or real dirs (subsequent runs).
// superpowers/ is always safe — never modified here.

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const realSrc = entry.isSymbolicLink() ? fs.realpathSync(srcPath) : srcPath;
    const stat = fs.statSync(realSrc);
    if (stat.isDirectory()) {
      copyDir(realSrc, destPath);
    } else {
      fs.copyFileSync(realSrc, destPath);
    }
  }
}

if (!fs.existsSync(SUPERPOWERS_SKILLS)) {
  console.error('❌ superpowers/skills/ not found. Run update-superpowers.sh first.');
  process.exit(1);
}

console.log('📋 Copying fresh skills from superpowers/skills/ → .agent/skills/…');

for (const entry of fs.readdirSync(SUPERPOWERS_SKILLS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const srcSkill = path.join(SUPERPOWERS_SKILLS, entry.name);
  const destSkill = path.join(SKILLS_DIR, entry.name);
  if (fs.existsSync(destSkill)) {
    fs.rmSync(destSkill, { recursive: true, force: true });
  }
  copyDir(srcSkill, destSkill);
  console.log(`  ✅ ${entry.name}`);
}

console.log('✅ Skills refreshed from superpowers/');

// --- Step 2: Delete platform-specific files and create Antigravity replacements ---
// Content patching (removing non-Antigravity tool references) is handled by AI
// during the update-superpowers workflow, reading .agent/patches/skills-patches.md.

function deleteFile(relPath) {
  const fp = path.join(SKILLS_DIR, relPath);
  if (fs.existsSync(fp)) {
    fs.rmSync(fp, { recursive: true });
    console.log(`  🗑  Deleted ${relPath}`);
  }
}

console.log('\n🔧 Removing platform-specific files…');

// Delete Codex tool mapping
deleteFile('using-superpowers/references/codex-tools.md');

// Delete Gemini CLI tool mapping (Gemini CLI ≠ Antigravity)
deleteFile('using-superpowers/references/gemini-tools.md');

// Write Antigravity tool mapping (not in upstream — created here each run)
const antigravityToolsContent = `# Antigravity Tool Mapping

Some skills reference tool names from other platforms. Use the Antigravity equivalents below:

| Skill references | Antigravity equivalent |
|---|---|
| \`Read\` (file reading) | \`view_file\` |
| \`Write\` (file creation) | \`write_to_file\` |
| \`Edit\` (file editing, single block) | \`replace_file_content\` |
| \`Edit\` (file editing, multiple blocks) | \`multi_replace_file_content\` |
| \`Bash\` (run commands) | \`run_command\` |
| \`Grep\` (search file content) | \`grep_search\` |
| \`Glob\` / \`LS\` (search files by name/pattern) | \`find_by_name\` |
| \`LS\` (list directory) | \`list_dir\` |
| \`WebSearch\` | \`search_web\` |
| \`WebFetch\` | \`read_url_content\` |
| \`Skill\` tool (invoke a skill) | \`view_file\` on \`.agent/skills/<name>/SKILL.md\` |
| \`TodoWrite\` (task tracking) | ❌ No direct equivalent — track progress in responses |
| \`Task\` tool (dispatch subagent) | \`browser_subagent\` (browser only, not general-purpose) |

## Subagent support

Antigravity does not support general-purpose subagent dispatch (\`Task\` tool). Skills that rely on \`subagent-driven-development\` or \`dispatching-parallel-agents\` should fall back to single-session execution via \`executing-plans\`.

## Background commands

Antigravity supports long-running background commands:

| Tool | Purpose |
|---|---|
| \`run_command\` with \`WaitMsBeforeAsync\` | Start a command, optionally wait for output |
| \`command_status\` | Poll status and output of a background command |
| \`send_command_input\` | Send stdin to a running command |

## Additional Antigravity tools

These tools are available in Antigravity with no equivalent in other platforms:

| Tool | Purpose |
|---|---|
| \`generate_image\` | Generate or edit images via AI |
| \`browser_subagent\` | Automate browser interactions |
| \`list_resources\` / \`read_resource\` | MCP resource access |
`;
const refsDir = path.join(SKILLS_DIR, 'using-superpowers/references');
fs.mkdirSync(refsDir, { recursive: true });
fs.writeFileSync(path.join(refsDir, 'antigravity-tools.md'), antigravityToolsContent);
console.log('  ✅ Created using-superpowers/references/antigravity-tools.md');

// Delete Claude/Anthropic-specific files
deleteFile('writing-skills/anthropic-best-practices.md');
deleteFile('writing-skills/examples/CLAUDE_MD_TESTING.md');
deleteFile('systematic-debugging/CREATION-LOG.md');

console.log('\n✅ .agent/skills/ is now self-contained.');
console.log('   Content patching (non-Antigravity refs) will be applied by AI via .agent/patches/skills-patches.md\n');

