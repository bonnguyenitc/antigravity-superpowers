# Antigravity Tool Mapping

Some skills reference tool names from other platforms. Use the Antigravity equivalents below:

| Skill references | Antigravity equivalent |
|---|---|
| `Read` (file reading) | `view_file` |
| `Write` (file creation) | `write_to_file` |
| `Edit` (file editing, single block) | `replace_file_content` |
| `Edit` (file editing, multiple blocks) | `multi_replace_file_content` |
| `Bash` (run commands) | `run_command` |
| `Grep` (search file content) | `grep_search` |
| `Glob` / `LS` (search files by name/pattern) | `find_by_name` |
| `LS` (list directory) | `list_dir` |
| `WebSearch` | `search_web` |
| `WebFetch` | `read_url_content` |
| `Skill` tool (invoke a skill) | `view_file` on `.agent/skills/<name>/SKILL.md` |
| `TodoWrite` (task tracking) | ❌ No direct equivalent — track progress in responses |
| `Task` tool (dispatch subagent) | `browser_subagent` (browser only, not general-purpose) |

## Subagent support

Antigravity does not support general-purpose subagent dispatch (`Task` tool). Skills that rely on `subagent-driven-development` or `dispatching-parallel-agents` should fall back to single-session execution via `executing-plans`.

## Background commands

Antigravity supports long-running background commands:

| Tool | Purpose |
|---|---|
| `run_command` with `WaitMsBeforeAsync` | Start a command, optionally wait for output |
| `command_status` | Poll status and output of a background command |
| `send_command_input` | Send stdin to a running command |

## Additional Antigravity tools

These tools are available in Antigravity with no equivalent in other platforms:

| Tool | Purpose |
|---|---|
| `generate_image` | Generate or edit images via AI |
| `browser_subagent` | Automate browser interactions |
| `list_resources` / `read_resource` | MCP resource access |
