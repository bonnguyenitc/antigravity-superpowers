# NPM Package & Init CLI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `antigravity-superpowers` to npm so any user can run `npx antigravity-superpowers init` (or `npx antigravity-superpowers@latest init`) inside their project to scaffold the `.agent/` directory with all skills, workflows, and rules.

**Architecture:** A Node.js CLI (`bin/init.js`) is the entry point. When invoked, it copies the bundled `.agent/` template (skills, workflows, rules — stored in `template/agent/` inside the package) into the user's current working directory. Skills are stored as real files (no symlinks — npm cannot publish symlinks targeting files outside the package boundary). A separate `template/superpowers/skills/` folder holds the skill sources, and `template/agent/skills/` contains copies (not symlinks) of each skill for portability.

**Tech Stack:** Node.js (built-in `fs`, `path`, `url`), npm, ESM modules (`"type": "module"`).

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `name`, `bin`, `files`, `scripts`, `version` fields |
| `bin/init.js` | Create | CLI entry point — copies template into cwd |
| `bin/copy-template.js` | Create | Helper: recursively copy directory |
| `template/agent/` | Create | Bundled `.agent/` ready to copy (no symlinks) |
| `template/agent/skills/<name>/` | Create | Copies of each `superpowers/skills/<name>/` |
| `template/agent/workflows/` | Create | Copy of `.agent/workflows/` |
| `template/agent/rules/` | Create | Copy of `.agent/rules/` |
| `template/agent/.shared/` | Create | Copy of `.agent/.shared/` |
| `scripts/build-template.js` | Create | Build script: copies `.agent/` + resolves symlinks → `template/agent/` |
| `.npmignore` | Create | Exclude dev artifacts; include only `bin/`, `template/`, `package.json`, `README.md` |

---

## Task 1: Update `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update `package.json`**

Replace the current `superpowers/package.json` (which is the upstream one). Edit the **root** `package.json` (create it if it doesn't exist — currently the root only has `README.md`, `.agent/`, `superpowers/`, `docs/`).

Create `package.json` at project root:

```json
{
  "name": "antigravity-superpowers",
  "version": "1.0.0",
  "description": "Superpowers skills library for Google Antigravity agent — scaffold .agent/ with one command",
  "type": "module",
  "bin": {
    "antigravity-superpowers": "./bin/init.js"
  },
  "files": [
    "bin/",
    "template/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node scripts/build-template.js",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "antigravity",
    "superpowers",
    "agent",
    "skills",
    "workflow",
    "ai"
  ],
  "author": "bonnguyenitc",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/bonnguyenitc/antigravity-superpowers.git"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

- [ ] **Step 2: Verify `package.json` is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('✅ Valid JSON')"
```

Expected: `✅ Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add root package.json for npm publishing"
```

---

## Task 2: Create the Build Script

**Files:**
- Create: `scripts/build-template.js`

The build script copies `.agent/` into `template/agent/`, **resolving symlinks** so all skills become real files (npm strips symlinks that point outside the package).

- [ ] **Step 1: Create `scripts/build-template.js`**

```js
// scripts/build-template.js
// Builds template/agent/ from .agent/, resolving symlinks to real copies.
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
```

- [ ] **Step 2: Run build script to verify it works**

```bash
node scripts/build-template.js
```

Expected output:
```
📦 Building template/agent/ from .agent/ (resolving symlinks)…
✅ template/agent/ built successfully
```

- [ ] **Step 3: Verify template contents**

```bash
ls template/agent/
```

Expected: `rules/  skills/  workflows/  .shared/  superpowers-version.json`

```bash
ls template/agent/skills/ | head -5
```

Expected: real directories (not dangling symlinks), e.g. `brainstorming  dispatching-parallel-agents  executing-plans …`

- [ ] **Step 4: Verify a skill file is readable (not a broken symlink)**

```bash
cat template/agent/skills/brainstorming/SKILL.md | head -5
```

Expected: YAML frontmatter output (real file content, not symlink error)

- [ ] **Step 5: Commit**

```bash
git add scripts/build-template.js template/
git commit -m "feat: add build script and template/agent/ (resolved symlinks)"
```

---

## Task 3: Create the CLI Entry Point

**Files:**
- Create: `bin/init.js`

- [ ] **Step 1: Create `bin/init.js`**

```js
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
  console.error('Usage: npx antigravity-superpowers init');
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

// Guard: don't overwrite existing .agent/ without confirmation
if (fs.existsSync(TARGET_DIR)) {
  console.warn(`⚠️  .agent/ already exists in this directory.`);
  console.warn(`   Delete it first if you want a fresh install, or run with --force to overwrite.`);
  if (!args.includes('--force')) {
    process.exit(1);
  }
  fs.rmSync(TARGET_DIR, { recursive: true });
  console.log('🗑  Removed existing .agent/');
}

console.log('🚀 Initialising antigravity-superpowers…');
copyDir(TEMPLATE_DIR, TARGET_DIR);
console.log('✅ .agent/ created successfully!');
console.log('');
console.log('📖 Next steps:');
console.log('   1. Open your project with Google Antigravity');
console.log('   2. The agent will automatically detect .agent/ and activate Superpowers');
console.log('   3. Use /brainstorm, /write-plan, /execute-plan, /code-review, /debug');
console.log('');
console.log('📦 Keep skills up to date: /update-superpowers');
```

- [ ] **Step 2: Make bin file executable and persist in git**

```bash
chmod +x bin/init.js
git update-index --chmod=+x bin/init.js
```

This ensures the executable bit survives `git clone` on all platforms — required for `npx` to invoke the bin without errors.

- [ ] **Step 3: Test CLI locally (dry run — no npm publish needed)**

```bash
node bin/init.js
```

Expected: error message `❌ Unknown command: (none)` — correct, because no argument was passed.

```bash
mkdir -p /tmp/test-init && node bin/init.js init --cwd-override-not-supported
```

> Note: since this test is in the project dir, `.agent/` already exists, so test with a temp dir:

```bash
cd /tmp/test-init && node /Users/thoaint/Documents/workspace/indie-hacker/antigravity-superpowers/bin/init.js init
```

Expected:
```
🚀 Initialising antigravity-superpowers…
✅ .agent/ created successfully!
```

- [ ] **Step 4: Verify output files exist**

```bash
ls /tmp/test-init/.agent/
```

Expected: `rules  skills  workflows  .shared  superpowers-version.json`

```bash
ls /tmp/test-init/.agent/skills/
```

Expected: all skill directories present as real folders

- [ ] **Step 5: Commit**

```bash
git add bin/init.js
git commit -m "feat: add CLI bin/init.js for npx antigravity-superpowers init"
```

---

## Task 4: Create `.npmignore`

**Files:**
- Create: `.npmignore`

This ensures only essential files are published (not `docs/`, `superpowers/`, `.agent/`, `.git/`, etc.).

- [ ] **Step 1: Create `.npmignore`**

```
# Development artifacts — not needed in npm package
.agent/
superpowers/
docs/
scripts/
.git/
.gitignore
.gitattributes
antigravity_agent_summary.md

# Test artifacts
/tmp/
*.test.js

# Editors
.DS_Store
*.swp
```

- [ ] **Step 2: Verify `npm pack` dry-run includes correct files**

```bash
npm pack --dry-run 2>&1 | head -50
```

Expected output should list only:
- `bin/init.js`
- `template/agent/**`
- `package.json`
- `README.md`
- `LICENSE`

Should NOT include: `superpowers/`, `.agent/`, `docs/`, `scripts/`

- [ ] **Step 3: Commit**

```bash
git add .npmignore
git commit -m "feat: add .npmignore to control published files"
```

---

## Task 5: Update README with npm Install Instructions

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add npm installation section to README**

Add a new **"Quick Start (npm)"** section near the top of the Installation section:

```markdown
## Quick Start

### Option 1 — npx (recommended, no install needed)

Inside any project directory:

```bash
npx antigravity-superpowers@latest init
```

This scaffolds `.agent/` with all Superpowers skills, workflows, and rules.  
Open the project with **Google Antigravity** — Superpowers activates automatically.

To overwrite an existing `.agent/`:

```bash
npx antigravity-superpowers@latest init --force
```

### Option 2 — Global install

```bash
npm install -g antigravity-superpowers
antigravity-superpowers init
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add npm quick start instructions to README"
```

---

## Task 6: Publish to npm

- [ ] **Step 1: Login to npm (if not already)**

```bash
npm whoami
```

If not logged in:
```bash
npm login
```

- [ ] **Step 2: Run the full build before publish**

```bash
npm run build
```

Expected: `✅ template/agent/ built successfully`

- [ ] **Step 3: Inspect the packed tarball before publishing**

```bash
npm pack
```

This creates `antigravity-superpowers-1.0.0.tgz`. Inspect:

```bash
tar -tzf antigravity-superpowers-1.0.0.tgz | head -40
```

Verify:
- `package/bin/init.js` ✅
- `package/template/agent/skills/brainstorming/SKILL.md` ✅
- No `package/superpowers/` or `package/.agent/` entries ✅

- [ ] **Step 4: Test the packed tarball locally**

```bash
mkdir -p /tmp/test-npm-pack && cd /tmp/test-npm-pack
npm install /Users/thoaint/Documents/workspace/indie-hacker/antigravity-superpowers/antigravity-superpowers-1.0.0.tgz
npx antigravity-superpowers init
ls .agent/
```

Expected: `.agent/` fully populated

- [ ] **Step 5: Publish to npm**

```bash
npm publish --access public
```

Expected:
```
npm notice Publishing to https://registry.npmjs.org/
+ antigravity-superpowers@1.0.0
```

- [ ] **Step 6: Verify the published package**

```bash
mkdir -p /tmp/verify-publish && cd /tmp/verify-publish
npx antigravity-superpowers@latest init
ls .agent/
```

Expected: `.agent/` created with skills, workflows, rules.

- [ ] **Step 7: Commit tarball cleanup + tag**

```bash
rm antigravity-superpowers-*.tgz
git add .
git commit -m "chore: post-publish cleanup"
git tag v1.0.0
git push origin main --tags
```

---

## Success Criteria

| Check | Expected |
|---|---|
| `npx antigravity-superpowers init` in a fresh dir | Creates `.agent/` with all 14 skills, 6 workflows, 1 rule |
| `npx antigravity-superpowers init` when `.agent/` exists | Warns and exits without overwriting |
| `npx antigravity-superpowers init --force` | Replaces existing `.agent/` |
| `npx antigravity-superpowers` (no command) | Prints usage error |
| `npm pack --dry-run` | No `superpowers/`, `.agent/`, `docs/` in output |
| Antigravity opens a project with `.agent/` from init | Skills activate automatically |
