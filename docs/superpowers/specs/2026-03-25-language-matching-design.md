# Language Matching Rule

AI agents often respond in mixed languages, creating a jarring experience. This design adds a global rule that forces the AI to mirror the user's language in all natural-language responses.

## Design

### Approach: Simple Mirror Rule

A single file `.agent/rules/language-matching.md` with `alwaysApply: true`.

### Behavior

1. **Detection** — Identify the language of the user's most recent message.
2. **Mirror** — Respond in that same language for all natural-language content: explanations, descriptions, questions, analysis, summaries.
3. **English exceptions** — The following always stay in English regardless of user language:
   - Code blocks, variable names, function names
   - Commit messages
   - File names and paths
   - Technical terms with no widely-used equivalent (e.g., "refactor", "deploy", "middleware")
4. **Dynamic switching** — If the user changes language mid-conversation, switch immediately from the next response onward.
5. **Enforcement** — Wrapped in a `<HARD-GATE>` to make compliance mandatory.

### Rule File Structure

```yaml
---
description: Match response language to user's language
alwaysApply: true
---
```

The body contains the mirror instructions and the English-exception list, wrapped in a `<HARD-GATE>`.

### What This Does NOT Do

- Does not add a config option (YAGNI — can be added later if needed)
- Does not modify any existing skills
- Does not affect code generation, commit messages, or file naming

## Files Changed

| Action | File |
|--------|------|
| NEW    | `.agent/rules/language-matching.md` |

## Verification Plan

### Manual Verification

1. Open a new AI chat session in a project that uses this rule.
2. Send a message in Vietnamese → AI should respond in Vietnamese.
3. Send a message in English → AI should switch to English.
4. Verify code blocks and commit messages remain in English.
5. Switch back to Vietnamese mid-conversation → AI follows.
