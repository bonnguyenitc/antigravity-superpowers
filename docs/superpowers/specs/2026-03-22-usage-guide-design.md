# Comprehensive Usage Guide — Design Spec

> Add a "Usage Guide" section to README.md that takes new users from zero to productive with antigravity-superpowers, using a progressive disclosure structure.

## Audience

Developers who just installed `agy-superpowers` via `npx` for the first time and have no prior knowledge of the workflows or skill system.

## Approach: Progressive Disclosure

Three sections, ordered by expertise level. Each section is self-contained — readers can stop at any point and still have actionable knowledge.

## Location

Insert after the existing "How It Works" section (line ~100) in `README.md`, before the "AI-Driven Skill Patching" section.

---

## Section 1: Getting Started in 5 Minutes

### 1.1 The Mental Model (2-3 sentences)
Explain that the agent **automatically reads and selects the right skill** every time you chat. No manual invocation needed. Describe what you should do vs what the agent does.

### 1.2 Your First Feature: A Walkthrough
Concrete end-to-end example: "Add a dark mode toggle to my React app"

| Step | You type | Agent does |
|------|----------|------------|
| 1 | `/brainstorm add dark mode to my React app` | Asks clarifying questions → produces a design spec |
| 2 | `/write-plan` | Converts spec → task list with exact file paths |
| 3 | `/execute-plan` | Implements tasks one by one, pausing for your review |
| 4 | `/code-review` | Reviews code against plan, reports issues by severity |
| 5 | _(auto)_ | Offers to merge, create PR, or discard the branch |

### 1.3 Quick Reference: The 5 Commands You'll Use Most

| Command | What it does | Example |
|---------|-------------|---------|
| `/brainstorm` | Turn an idea into a design spec | `/brainstorm add user onboarding flow` |
| `/write-plan` | Convert approved spec into task list | `/write-plan` |
| `/execute-plan` | Execute tasks with review checkpoints | `/execute-plan` |
| `/code-review` | Review completed work before merging | `/code-review` |
| `/debug` | Systematic 4-phase debugging | `/debug users can't log in on Safari` |

---

## Section 2: Beyond Code — Skills That Work For You

Intro paragraph: The agent has 56 specialized skills beyond just coding. When you mention a topic in natural language, the relevant skill activates automatically.

### Category Tables

Each category gets a mini-table: **Skill → Auto-triggers when...**
Plus 1-2 example prompts per category.

**6 categories:**

1. **🔧 Development Workflow** — brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, verification-before-completion, finishing-a-development-branch, using-git-worktrees, requesting-code-review, receiving-code-review, dispatching-parallel-agents, subagent-driven-development
   - Note: These are core — mostly triggered via slash commands or automatically

2. **💻 Technical** — backend-developer, frontend-developer, mobile-developer, game-developer, api-design, real-time-features, auth-and-identity, devops-engineer, security-engineer, email-infrastructure, saas-architect, chrome-extension-developer
   - Example: _"Design a REST API for user management with rate limiting"_

3. **🎨 Product & Design** — product-manager, ux-designer, cto-architect, i18n-localization, game-design
   - Example: _"Help me prioritize features for the next sprint"_

4. **📈 Marketing & Growth** — growth-hacker, content-marketer, seo-specialist, conversion-optimizer, copywriter, community-manager, influencer-marketer, paid-acquisition-specialist, launch-strategist, landing-page-builder, app-store-optimizer
   - Example: _"Write an ASO-optimized App Store description for my meditation app"_

5. **💰 Revenue & Operations** — monetization-strategist, pricing-psychologist, subscription-billing, bootstrapper-finance, solo-founder-ops, analytics-setup, customer-success-manager, data-analyst, indie-legal
   - Example: _"Should I charge $9/mo or $29/mo for my SaaS?"_

6. **🚀 Validate & Scale** — idea-validator, market-researcher, ai-integrated-product, micro-saas-builder
   - Example: _"I have an idea for an AI writing tool — is it worth building?"_

---

## Section 3: Power User Tips

### 3.1 When to `/brainstorm` vs Just Ask
- **Use `/brainstorm`** when: multi-file changes, design decisions needed, new features, architectural changes
- **Just ask directly** when: quick fixes, single-line changes, knowledge questions, typos
- Rule of thumb: if it touches >1 file or has design tradeoffs → brainstorm

### 3.2 How to Write Better Prompts
- **Provide context**: project name, tech stack, constraints
- **State goals, not solutions**: _"Users drop off during signup"_ > _"Add a progress bar"_
- **Mention domains** to trigger specific skills: _"Review the security of..."_, _"Optimize the SEO for..."_

### 3.3 Combining Workflows for Complex Projects
- **Full product launch**: `/brainstorm` → `/write-plan` → `/execute-plan` → `/code-review` → then ask about marketing copy, ASO, pricing in separate conversations
- **Idea → Validation → Build**: Start with `idea-validator` questions → `market-researcher` → then `/brainstorm` to build
- **Debugging effectively**: `/debug` first → if architectural issue found → `/brainstorm` to redesign

### 3.4 Configuration
- Set `auto_commit: false` in `.agent/config.yml` for strict git control
- Config survives `/update-superpowers` runs

### 3.5 Common Pitfalls

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| Skip `/brainstorm` for large features | Always brainstorm features that touch multiple files |
| Cram multiple goals into one prompt | One conversation = one clear objective |
| Jump to `/execute-plan` without reviewing the spec | Review and approve the spec before execution |
| Skip `/code-review` before merging | Always review before merge — catch bugs early |
| Assume the agent only writes code | Ask about pricing, marketing, legal — it knows those too |

---

## Implementation Notes

- All content added to existing `README.md` as new sections
- Preserves all existing sections — no deletions or restructuring
- Insert point: after "How It Works" section (after the Additional Workflows table), before "AI-Driven Skill Patching"
- Existing "Skills Reference" table remains as-is (it's the full flat reference); the new Section 2 provides a categorized view
- Total estimated addition: ~200-250 lines of markdown
