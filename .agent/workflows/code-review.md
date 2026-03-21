---
description: Review completed code against the plan and coding standards - uses superpowers requesting-code-review skill
---

You are acting as a Senior Code Reviewer. Read the skill first, then perform the review:

// turbo
1. Read the skill: `view_file` `.agent/skills/requesting-code-review/SKILL.md`

2. Gather context:
   - Find the original plan (if any) in `docs/superpowers/plans/`
   - View recent git diff: `git diff HEAD~1` or the relevant branch diff
   - Identify all changed files

3. Review across 5 dimensions:

   **A. Plan Alignment** — Does the code match the original plan?
   - List any deviations (justified improvements vs. problematic departures)
   - Confirm all planned functionality is implemented

   **B. Code Quality**
   - Consistent patterns and conventions?
   - Proper error handling?
   - Clear naming?

   **C. Test Coverage**
   - Were tests written RED before GREEN?
   - Coverage across happy path and edge cases?

   **D. Architecture & Design**
   - SOLID principles followed?
   - Proper separation of concerns?
   - Integrates cleanly with existing code?

   **E. Documentation**
   - Comments present where logic is non-obvious?

4. Report issues categorized as:
   - 🔴 **Critical** — Must fix before merge
   - 🟡 **Important** — Should fix
   - 🟢 **Suggestion** — Nice to have

5. Always acknowledge what was done well before listing issues

6. If Critical issues exist → block progress, require fixes and re-review
