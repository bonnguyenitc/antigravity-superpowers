// scripts/build-template.js
// Builds template/agent/ from .agent/, resolving symlinks to real copies.
// Run: node scripts/build-template.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, '.agent');
const DEST = path.join(ROOT, 'template', 'agent');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Resolve symlinks to their real path before copying
    const realSrc = entry.isSymbolicLink()
      ? fs.realpathSync(srcPath)
      : srcPath;

    const stat = fs.statSync(realSrc);
    if (stat.isDirectory()) {
      copyDir(realSrc, destPath);
    } else {
      fs.copyFileSync(realSrc, destPath);
    }
  }
}

// Clean previous build
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true });
  console.log('🗑  Cleaned old template/agent/');
}

console.log('📦 Building template/agent/ from .agent/ (resolving symlinks)…');
copyDir(SRC, DEST);
console.log('✅ template/agent/ built successfully');

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

// 2. using-superpowers/SKILL.md — remove codex-tools.md reference from Platform Adaptation
patchFile(path.join(DEST, 'skills/using-superpowers/SKILL.md'), [
  [
    / Non-CC platforms: see `references\/codex-tools\.md` \(Codex\) for tool equivalents\./g,
    ''
  ]
]);
console.log('  ✅ Patched skills/using-superpowers/SKILL.md');

// 3. executing-plans/SKILL.md — remove "or Codex" + rename Claude Code → Antigravity
patchFile(path.join(DEST, 'skills/executing-plans/SKILL.md'), [
  [
    /\(such as Claude Code or Codex\)/g,
    '(such as Antigravity)'
  ],
  [
    /\(such as Claude Code\)/g,
    '(such as Antigravity)'
  ]
]);
console.log('  ✅ Patched skills/executing-plans/SKILL.md');

// 4. writing-skills/SKILL.md — remove Codex personal skills path
patchFile(path.join(DEST, 'skills/writing-skills/SKILL.md'), [
  [
    /, `~\/\.agents\/skills\/` for Codex/g,
    ''
  ]
]);
console.log('  ✅ Patched skills/writing-skills/SKILL.md');

// 5. brainstorming/visual-companion.md — remove the Codex platform block
patchFile(path.join(DEST, 'skills/brainstorming/visual-companion.md'), [
  [
    /\n\*\*Codex:\*\*\n```bash\n# Codex reaps background processes[\s\S]*?```\n\n/,
    '\n\n'
  ]
]);
console.log('  ✅ Patched skills/brainstorming/visual-companion.md');
console.log('✅ Codex references removed from template/agent/');

// --- PATCH: Remove all other non-Antigravity platform references ---
console.log('🔧 Patching: removing Claude Code & Gemini CLI references…');

// 6. Delete gemini-tools.md (Gemini CLI ≠ Antigravity)
const geminiToolsFile = path.join(DEST, 'skills/using-superpowers/references/gemini-tools.md');
if (fs.existsSync(geminiToolsFile)) {
  fs.rmSync(geminiToolsFile);
  console.log('  🗑  Deleted skills/using-superpowers/references/gemini-tools.md');
}

// 7. Delete Claude/Anthropic-specific files
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
patchFile(path.join(DEST, 'skills/using-superpowers/SKILL.md'), [
  // Drop CLAUDE.md from priority list
  [
    /CLAUDE\.md, GEMINI\.md, AGENTS\.md/g,
    'GEMINI.md, AGENTS.md'
  ],
  // Fix the conditional sentence
  [
    /If CLAUDE\.md, GEMINI\.md, or AGENTS\.md says/g,
    'If GEMINI.md or AGENTS.md says'
  ],
  // Replace the three platform-specific "How to Access Skills" lines with one Antigravity line
  [
    /\*\*In Claude Code:\*\* Use the `Skill` tool\. When you invoke a skill, its content is loaded and presented to you—follow it directly\. Never use the Read tool on skill files\.\n\n\*\*In Gemini CLI:\*\* Skills activate via the `activate_skill` tool\. Gemini loads skill metadata at session start and activates the full content on demand\.\n\n\*\*In other environments:\*\* Check your platform's documentation for how skills are loaded\./,
    '**In Antigravity:** Use `view_file` on `.agent/skills/<skill-name>/SKILL.md` to read a skill. Skills are detected automatically from their `description` field.'
  ],
  // Replace Platform Adaptation section
  [
    /## Platform Adaptation\n\nSkills use Claude Code tool names\. Gemini CLI users get the tool mapping loaded automatically via GEMINI\.md\./,
    '## Platform Adaptation\n\nThis package is configured for **Google Antigravity**. Tool name mappings are handled automatically via `GEMINI.md` in your workspace.'
  ],
]);
console.log('  ✅ Patched skills/using-superpowers/SKILL.md (Claude Code + Gemini CLI refs)');

// 9. brainstorming/visual-companion.md — replace Claude Code + Gemini CLI platform blocks
patchFile(path.join(DEST, 'skills/brainstorming/visual-companion.md'), [
  [
    /\*\*Claude Code \(macOS \/ Linux\):\*\*\n```bash\n[\s\S]*?```\n\n\*\*Claude Code \(Windows\):\*\*\n```bash\n[\s\S]*?```\n[\s\S]*?\n\*\*Gemini CLI:\*\*\n```bash\n[\s\S]*?```\n/,
    '**Antigravity:**\n```bash\n# Launch the server normally\nscripts/start-server.sh --project-dir /path/to/project\n```\n'
  ]
]);
console.log('  ✅ Patched skills/brainstorming/visual-companion.md (platform blocks)');

// 10. writing-skills/SKILL.md — replace ~/.claude/skills with Antigravity equivalent
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

console.log('✅ All non-Antigravity platform references removed from template/agent/');
