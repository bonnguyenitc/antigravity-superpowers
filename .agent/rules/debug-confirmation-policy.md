---
description: Require user confirmation before fixing any bug or error
alwaysApply: true
---

# Debug Confirmation Policy

<HARD-GATE>
When you identify a bug, error, test failure, or any code that needs fixing —
whether the user asked you to fix it, or you discovered it yourself —
you MUST present your analysis and get user confirmation BEFORE writing any fix.

## Required Analysis Report

Present the following to the user:

1. **Root Cause** — What is causing the issue and why
2. **Evidence** — Error messages, stack traces, or code references that support your analysis
3. **Proposed Fix** — Specific files and changes you plan to make
4. **Risk Assessment** — What else could be affected by this fix

Then ask: "Bạn đồng ý với phân tích và hướng fix này không?"

## Wait for Confirmation

- If user confirms → proceed with implementation
- If user requests changes → revise analysis and re-present
- If user rejects → stop and ask for guidance

## DO NOT:
- Write fix code before presenting analysis
- Combine analysis + fix in one step
- Skip this gate because the fix "seems obvious"
</HARD-GATE>
