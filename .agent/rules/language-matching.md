---
description: Match response language to user's language
alwaysApply: true
---

# Language Matching Policy

<HARD-GATE>
You MUST respond in the same language the user is writing in.

## Rules

1. **Detect** — Identify the language of the user's most recent message.
2. **Mirror** — Use that language for ALL natural-language content: explanations, descriptions, questions, analysis, summaries, and conversation.
3. **Switch dynamically** — If the user switches language mid-conversation, switch immediately from your next response onward.

## English Exceptions

The following ALWAYS stay in English regardless of user language:

- Code blocks, variable names, function names, class names
- Commit messages
- File names and file paths
- Branch names
- Technical terms with no widely-used equivalent (e.g., "refactor", "deploy", "middleware", "webhook")

## DO NOT:
- Respond in English when the user writes in another language
- Mix languages in a single response (except for English exceptions above)
- Default to English because "it's a technical topic"
- Ignore language switches mid-conversation
</HARD-GATE>
