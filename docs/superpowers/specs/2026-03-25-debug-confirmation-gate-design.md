# Debug Confirmation Gate

## Problem

AI tự động fix code khi phát hiện bug hoặc khi user yêu cầu fix, mà không trình bày phân tích và hướng fix trước. User muốn review phân tích trước khi AI thực hiện bất kỳ thay đổi code nào liên quan đến debug/fix bug.

## Scope

- **Áp dụng:** Mọi trường hợp fix bug/lỗi — dù qua workflow `/debug` hay ad-hoc
- **Không áp dụng:** Thêm feature mới, refactor (đã có brainstorming gate riêng)

## Design

Hai lớp defense:

### Layer 1: Global Rule — `.agent/rules/debug-confirmation-policy.md`

Tạo file rule mới với `alwaysApply: true`. Rule này bắt mọi trường hợp debug/fix bug dù user có dùng `/debug` workflow hay không.

**Nội dung rule:**

```
<HARD-GATE>
When you identify a bug, error, test failure, or any code that needs fixing —
whether the user asked you to fix it, or you discovered it yourself —
you MUST present your analysis and get user confirmation BEFORE writing any fix.

Required Analysis Report:
1. Root Cause — What is causing the issue and why
2. Evidence — Error messages, stack traces, or code references
3. Proposed Fix — Specific files and changes planned
4. Risk Assessment — What else could be affected

Then ask: "Bạn đồng ý với phân tích và hướng fix này không?"

Wait for user confirmation before proceeding.
DO NOT write fix code before presenting analysis.
DO NOT combine analysis + fix in one step.
DO NOT skip this gate because the fix "seems obvious".
</HARD-GATE>
```

### Layer 2: Skill HARD-GATE — `systematic-debugging/SKILL.md`

Chèn **Confirmation Gate** giữa Phase 3 (Hypothesis and Testing) và Phase 4 (Implementation).

```
### Confirmation Gate: Present Analysis Before Fixing

<HARD-GATE>
You MUST present your complete analysis to the user and get explicit confirmation
BEFORE proceeding to Phase 4 (Implementation).

Present a summary containing:
1. Root Cause — from Phase 1
2. Pattern Analysis — key differences found in Phase 2
3. Hypothesis — your confirmed theory from Phase 3
4. Proposed Fix — what you plan to change (files, functions, approach)

Then ask: "Bạn đồng ý với phân tích và hướng fix này không?"

Wait for user confirmation. Do NOT proceed to Phase 4 until confirmed.
</HARD-GATE>
```

## Defense Layers Summary

| Layer | File | Catches |
|-------|------|---------|
| Rule (global) | `.agent/rules/debug-confirmation-policy.md` | Mọi trường hợp fix bug — ad-hoc, implicit |
| Skill (workflow) | `.agent/skills/systematic-debugging/SKILL.md` | Khi AI follow đúng `/debug` workflow |

## Files Changed

1. **[NEW]** `.agent/rules/debug-confirmation-policy.md`
2. **[MODIFY]** `.agent/skills/systematic-debugging/SKILL.md` — thêm Confirmation Gate section trước Phase 4

## Verification

### Manual Test
1. Mở conversation mới, gởi: "fix lỗi X trong file Y" (không dùng `/debug`)
   - **Expected:** AI phải trình bày phân tích trước, hỏi confirm, không tự fix
2. Dùng `/debug` workflow với một bug thực tế
   - **Expected:** AI chạy Phase 1-3 rồi dừng lại hỏi confirm trước Phase 4
3. Đang làm feature, test fail
   - **Expected:** AI phải trình bày phân tích test failure, hỏi confirm trước khi fix
