#!/usr/bin/env node
// scripts/patch-agent-skills.js
// Breaks .agent/skills/* symlinks → copies real files from superpowers/skills/*.
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
  // Remove existing (symlink or real dir) and copy fresh
  if (fs.existsSync(destSkill)) {
    fs.rmSync(destSkill, { recursive: true, force: true });
  }
  copyDir(srcSkill, destSkill);
  console.log(`  ✅ ${entry.name}`);
}

console.log(`✅ Skills refreshed from superpowers/`);


// --- Step 2: Apply patches to remove non-Antigravity tool references ---

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Patch target not found (skipping): ${path.relative(ROOT, filePath)}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function deleteFile(relPath) {
  const fp = path.join(SKILLS_DIR, relPath);
  if (fs.existsSync(fp)) {
    fs.rmSync(fp, { recursive: true });
    console.log(`  🗑  Deleted ${relPath}`);
  }
}

console.log('\n🔧 Patching: removing non-Antigravity tool references…');

// Delete Codex tool mapping
deleteFile('using-superpowers/references/codex-tools.md');

// Delete Gemini CLI tool mapping (Gemini CLI ≠ Antigravity)
deleteFile('using-superpowers/references/gemini-tools.md');

// Write Antigravity tool mapping (not in upstream — create here)
const antigravityToolsContent = `# Antigravity Tool Mapping

Skills use Claude Code tool names. When you encounter these in a skill, use your Antigravity equivalent:

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

These tools are available in Antigravity but have no Claude Code equivalent:

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

// using-superpowers/SKILL.md
patchFile(path.join(SKILLS_DIR, 'using-superpowers/SKILL.md'), [
  // Remove CLAUDE.md from priority list
  [/CLAUDE\.md, GEMINI\.md, AGENTS\.md/g, 'GEMINI.md, AGENTS.md'],
  [/If CLAUDE\.md, GEMINI\.md, or AGENTS\.md says/g, 'If GEMINI.md or AGENTS.md says'],
  // Replace Claude Code + Gemini CLI platform blocks with single Antigravity block
  [
    /\*\*In Claude Code:\*\* Use the `Skill` tool\. When you invoke a skill, its content is loaded and presented to you—follow it directly\. Never use the Read tool on skill files\.\n\n\*\*In Gemini CLI:\*\* Skills activate via the `activate_skill` tool\. Gemini loads skill metadata at session start and activates the full content on demand\.\n\n\*\*In other environments:\*\* Check your platform's documentation for how skills are loaded\./,
    '**In Antigravity:** Use `view_file` on `.agent/skills/<skill-name>/SKILL.md` to read a skill. Skills are detected automatically from their `description` field.'
  ],
  // Replace Platform Adaptation section (use dotAll to match full content)
  [
    /## Platform Adaptation\n\nSkills use Claude Code tool names\..*?\n/s,
    '## Platform Adaptation\n\nThis package is configured for **Google Antigravity**. Tool name mappings are handled automatically via `GEMINI.md` in your workspace.\n'
  ],
]);
console.log('  ✅ Patched using-superpowers/SKILL.md');

// executing-plans/SKILL.md — replace platform mentions with Antigravity
patchFile(path.join(SKILLS_DIR, 'executing-plans/SKILL.md'), [
  [/\(such as Claude Code or Codex\)/g, '(such as Antigravity)'],
  [/\(such as Claude Code\)/g, '(such as Antigravity)'],
]);
console.log('  ✅ Patched executing-plans/SKILL.md');

// writing-skills/SKILL.md — personal skills path + Codex path
patchFile(path.join(SKILLS_DIR, 'writing-skills/SKILL.md'), [
  [/`~\/\.claude\/skills` for Claude Code, `~\/\.agents\/skills\/` for Codex/g, '`~/.agent/skills` for Antigravity'],
  [/`~\/\.claude\/skills` for Claude Code/g, '`~/.agent/skills` for Antigravity'],
  [/, `~\/\.agents\/skills\/` for Codex/g, ''],
]);
console.log('  ✅ Patched writing-skills/SKILL.md');

// brainstorming/visual-companion.md — replace Claude Code + Gemini CLI + Codex platform blocks
patchFile(path.join(SKILLS_DIR, 'brainstorming/visual-companion.md'), [
  // Remove Codex block
  [/\n\*\*Codex:\*\*\n```bash\n# Codex reaps background processes[\s\S]*?```\n\n/, '\n\n'],
  // Replace Claude Code + Gemini CLI blocks with Antigravity block
  [
    /\*\*Claude Code \(macOS \/ Linux\):\*\*\n```bash\n[\s\S]*?```\n\n\*\*Claude Code \(Windows\):\*\*\n```bash\n[\s\S]*?```\n[\s\S]*?\n\*\*Gemini CLI:\*\*\n```bash\n[\s\S]*?```\n/,
    '**Antigravity:**\n```bash\n# Launch the server normally\nscripts/start-server.sh --project-dir /path/to/project\n```\n'
  ],
]);
console.log('  ✅ Patched brainstorming/visual-companion.md');

// dispatching-parallel-agents/SKILL.md — remove Claude Code comment
patchFile(path.join(SKILLS_DIR, 'dispatching-parallel-agents/SKILL.md'), [
  [/\/\/ In Claude Code \/ AI environment\n/g, ''],
]);
console.log('  ✅ Patched dispatching-parallel-agents/SKILL.md');

console.log('\n✅ .agent/skills/ is now self-contained with Antigravity-specific content.');
console.log('   superpowers/ is untouched and safe.\n');
