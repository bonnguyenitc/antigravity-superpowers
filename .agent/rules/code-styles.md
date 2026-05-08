---
description: Enforce project code styles — agent MUST read and follow these rules before writing any code
alwaysApply: true
---

# Code Styles

> **Core rule:** ESM only (`import`/`export`), single quotes, semicolons always, camelCase vars, 2-space indent, zero npm dependencies, no TypeScript.

<HARD-GATE>
Before writing, modifying, or generating ANY code, you MUST read this file and strictly follow every rule defined below.
If a section is empty, skip it — but never skip reading this file.
</HARD-GATE>

## How to Use

Fill in the sections below with your project's code style rules.
Delete the placeholder comments and replace them with your actual conventions.

---

## Naming Conventions

- Variables & functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files & folders: `kebab-case`
- No PascalCase (no classes/components in this project)

## File & Folder Structure

- `bin/` — CLI entry points only
- `scripts/` — build/utility scripts, not shipped
- `template/` — files copied to user's `.agent/` on `init`
- `.agent/` — agent rules, skills, workflows (not in `files[]`)
- One responsibility per file; no barrel index files needed

## Formatting

- Indentation: 2 spaces
- Quotes: **single quotes** (`'`) everywhere
- Semicolons: **always**
- Max line length: 100 characters (soft limit)
- Trailing commas: yes (ES2017+)

## Comments & Documentation

- File path comment on line 2: `// bin/init.js`
- Usage comment where non-obvious: `// Usage: ...`
- No obvious comments ("increment i by 1")
- No JSDoc unless the function is exported as a public API

## Patterns & Conventions

- Module system: **ESM** (`import`/`export`) — `"type": "module"` in package.json
- Async: `async/await` over `.then()`
- Error handling: `console.error()` + `process.exit(1)` for CLI errors
- File system: Node.js `fs` (sync preferred for CLI scripts — simple, no callback hell)
- `__dirname` workaround for ESM: `path.dirname(fileURLToPath(import.meta.url))`
- Imports order: Node built-ins → npm packages → local files

## Anti-Patterns (DO NOT)

- No TypeScript — this project is plain JavaScript
- No `require()` — ESM only
- No `console.log` in production paths for errors — use `console.error()`
- No dependencies in `package.json` — keep the CLI zero-dependency
- No dynamic `import()` unless absolutely necessary
- No `any` guesses — if path/logic is unclear, fail loudly with a message
