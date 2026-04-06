---
description: CRITICAL — Scratch scripts must run inside workspace (.agent/tmp/), NEVER in /tmp/
alwaysApply: true
---

# Scratch Scripts Policy

> **PRIORITY: CRITICAL** — Violating this rule causes commands to hang and freeze the conversation.

## The Rule

**NEVER create or run scratch scripts in `/tmp/`.** Always use `.agent/tmp/` instead.

Running scripts in `/tmp/` causes `run_command` to hang because `/tmp/` is outside the workspace boundary. This freezes the entire conversation with no recovery.

## Requirements

1. **Path**: All scratch/temporary scripts go in `.agent/tmp/`, NOT `/tmp/`
2. **Cwd**: When calling `run_command`, set `Cwd` to the **workspace root** — never to `/tmp/` or any path outside the workspace
3. **Create dir first**: Run `mkdir -p .agent/tmp` before writing scratch files if the directory might not exist
4. **Cleanup**: Delete scratch files after use when they are no longer needed

## Examples

```
# ✅ CORRECT
Cwd: /path/to/project
CommandLine: node .agent/tmp/test-parser.js

# ❌ WRONG — will hang
Cwd: /tmp
CommandLine: node /tmp/test-parser.js
```

## Why This Matters

The `run_command` tool requires `Cwd` to be within the workspace. When scripts are placed in `/tmp/` and `Cwd` is set to `/tmp/`, the command hangs indefinitely — the agent goes silent and the user must restart the conversation.
