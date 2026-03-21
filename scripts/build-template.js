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
