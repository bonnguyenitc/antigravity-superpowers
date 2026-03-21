#!/usr/bin/env node
// bin/init.js
// Usage: npx antigravity-superpowers init
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '..', 'template', 'agent');
const TARGET_DIR = path.join(process.cwd(), '.agent');

const args = process.argv.slice(2);
const command = args[0];

if (command !== 'init') {
  console.error(`❌ Unknown command: ${command || '(none)'}`);
  console.error('');
  console.error('Usage: npx antigravity-superpowers init');
  console.error('       npx antigravity-superpowers init --force   # overwrite existing .agent/');
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Guard: don't overwrite existing .agent/ without --force
if (fs.existsSync(TARGET_DIR)) {
  console.warn('⚠️  .agent/ already exists in this directory.');
  console.warn('   Delete it first or re-run with --force to overwrite:');
  console.warn('');
  console.warn('   npx antigravity-superpowers init --force');
  console.warn('');
  if (!args.includes('--force')) {
    process.exit(1);
  }
  fs.rmSync(TARGET_DIR, { recursive: true });
  console.log('🗑  Removed existing .agent/');
}

console.log('🚀 Initialising antigravity-superpowers…');
copyDir(TEMPLATE_DIR, TARGET_DIR);
console.log('✅ .agent/ created successfully!\n');
console.log('📖 Next steps:');
console.log('   1. Open your project with Google Antigravity');
console.log('   2. The agent will automatically detect .agent/ and activate Superpowers');
console.log('   3. Use /brainstorm, /write-plan, /execute-plan, /code-review, /debug');
console.log('');
console.log('📦 Keep skills up to date: /update-superpowers');
