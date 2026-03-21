---
description: Start the brainstorming process before writing any code - uses superpowers brainstorming skill
---

Read and follow the `brainstorming` skill completely:

// turbo
1. Read the skill: `view_file` `.agent/skills/brainstorming/SKILL.md`

2. Explore current project context (files, docs, recent git log)

3. Execute the full skill checklist in order:
   - Offer visual companion if upcoming questions involve visuals
   - Ask clarifying questions one at a time
   - Propose 2-3 approaches with trade-offs and a recommendation
   - Present design section by section, wait for approval after each
   - Write design doc to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   - Run spec review loop (dispatch spec-document-reviewer, fix issues, repeat max 3x)
   - Ask user to review the written spec
   - Transition to `writing-plans` skill
