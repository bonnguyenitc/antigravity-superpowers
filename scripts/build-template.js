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

// 3. executing-plans/SKILL.md — remove "or Codex" from platform list
patchFile(path.join(DEST, 'skills/executing-plans/SKILL.md'), [
  [
    /\(such as Claude Code or Codex\)/g,
    '(such as Claude Code)'
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

