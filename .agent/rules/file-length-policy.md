---
description: File length policy — apply when creating or editing files in .agent/rules/
alwaysApply: true
priority: critical
---

> **⚠️ CRITICAL PRIORITY — This rule overrides all other instructions about file editing.**
> Check file length BEFORE writing. No exceptions.

<HARD-GATE>
Do NOT write, append, or edit any file in `.agent/rules/` until you have checked its current character count.
If adding content would push the file past 12,000 characters, you MUST create a new file instead.
This gate applies exclusively to `.agent/rules/` files.
</HARD-GATE>

# File Length Policy

## Hard Limit: 12,000 Characters Per File

Every file in `.agent/rules/` has a **hard character limit of 12,000 characters**.

Before writing or appending to any `.agent/rules/` file, check the current file size:
- If the current content **plus** the new content will exceed 12,000 characters → **do NOT add to the existing file**
- Instead → **create a new file** following the naming convention below

## When Content Overflows: Create a New File

### Naming Convention

Split content into numbered parts:

```
original-file.md         ← Part 1 (keep as-is, trim if needed)
original-file-part2.md   ← Part 2 (new file for overflow)
original-file-part3.md   ← Part 3 (continue if needed)
```

### Cross-Reference Between Parts

At the **bottom** of the original file, add:
```
## See Also
- [Continued in original-file-part2.md](./original-file-part2.md)
```

At the **top** of the new file, add:
```
<!-- Part 2 of original-file.md -->
```

## Why This Matters

LLM context windows process rules most reliably when individual files stay concise. Files over 12,000 characters risk:
- Partial truncation during loading
- Reduced rule adherence near the end of the file
- Harder human maintenance

## Examples

| Situation | Action |
|---|---|
| Adding 500 chars to a 11,800-char file | Create `filename-part2.md` for the new content |
| Adding 200 chars to a 5,000-char file | Safe — append directly |
| Refactoring a 15,000-char existing file | Split into two files immediately |
