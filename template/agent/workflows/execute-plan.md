---
description: Execute an implementation plan task by task with TDD and code review - uses superpowers executing-plans skill
---

Read and follow the `executing-plans` skill completely:

// turbo
1. Read the skill: `view_file` `.agent/skills/executing-plans/SKILL.md`

// turbo
2. Read the TDD skill: `view_file` `.agent/skills/test-driven-development/SKILL.md`

3. Locate the plan in `docs/superpowers/plans/` or as specified by the user

4. For each task in the plan:
   a. Read the task spec carefully
   b. Write a failing test first (RED) — run it, confirm it fails
   c. Write the minimal code to make the test pass (GREEN) — run it, confirm it passes
   d. Refactor if needed, keeping tests green (REFACTOR)
   e. Commit with a clear, descriptive message

5. After each batch of tasks, pause for a human checkpoint

6. When all tasks are complete, read and follow the `verification-before-completion` skill:
   `view_file` `.agent/skills/verification-before-completion/SKILL.md`
