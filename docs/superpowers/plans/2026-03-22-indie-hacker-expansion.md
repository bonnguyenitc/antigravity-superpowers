# Indie Hacker Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 12 new indie-hacker targeted skills and integrate them into the superpowers library.

**Architecture:** Each skill will be implemented following the TDD for Documentation process outlined in `writing-skills`. Each skill gets a standalone `SKILL.md` file in `.agent/skills/<skill-name>/`, adhering to the standard anatomy (Identity, Core Instincts, Questions, Red Flags/Anti-patterns) and the token budget (300-800 words). The `README.md` and `.agent/rules/superpowers.md` will be updated to register these new skills.

**Tech Stack:** Markdown. Antigravity Agent tools.

---

## File Structure Map

```
.agent/skills/
  # Task 1: Validate
  idea-validator/SKILL.md
  market-researcher/SKILL.md
  # Task 2: Build
  chrome-extension-developer/SKILL.md
  # Task 3: Launch
  launch-strategist/SKILL.md
  landing-page-builder/SKILL.md
  # Task 4: Revenue
  pricing-psychologist/SKILL.md
  bootstrapper-finance/SKILL.md
  # Task 5: Operate
  solo-founder-ops/SKILL.md
  indie-legal/SKILL.md
  analytics-setup/SKILL.md
  # Task 6: Advanced
  ai-integrated-product/SKILL.md
  micro-saas-builder/SKILL.md

README.md (modify)
.agent/rules/superpowers.md (modify)
```

---

## Important Execution Note for Subagents
For every skill task below, you MUST follow the **RED → GREEN → REFACTOR** cycle from `writing-skills`:
1. Run a baseline conversation using Antigravity WITHOUT the skill.
2. Observe what it misses.
3. Write the `SKILL.md` file incorporating the content from `docs/superpowers/specs/2026-03-22-indie-hacker-expansion-skills-design.md` and addressing the baseline failures.
4. Run the conversation again WITH the skill loaded to verify compliance.

---

## Task 1: Validate Phase Skills

**Files:**
- Create: `.agent/skills/idea-validator/SKILL.md`
- Create: `.agent/skills/market-researcher/SKILL.md`

- [ ] **Step 1: Implement `idea-validator` (TDD Cycle)**
  - RED: Ask Antigravity "I want to build a todo app" (without skill). Document misses.
  - GREEN: Create `.agent/skills/idea-validator/SKILL.md`. Use the "Core Knowledge", "Key Deliverables", and "Who to pair with" from the spec. Add "Identity" (Focus on evidence over assumptions) and "Red Flags" (Market <$1M TAM, free alternatives). Target 300-500 words. 
  - REFACTOR: Ask again with skill loaded. Ensure it suggests the 5-step checklist and smoke tests.

- [ ] **Step 2: Implement `market-researcher` (TDD Cycle)**
  - RED: Ask Antigravity "Help me find a niche for a Chrome extension". Document misses.
  - GREEN: Create `.agent/skills/market-researcher/SKILL.md`. Include "Core Knowledge" (TAM sizing, competitor mapping), "Deliverables". Add "Identity" (Data-driven, customer-centric).
  - REFACTOR: Ask again with skill. Verify it suggests Reddit/Twitter mining and interview scripts.

- [ ] **Step 3: Commit**
  ```bash
  git add .agent/skills/idea-validator .agent/skills/market-researcher
  git commit -m "feat: add Validate phase skills (idea-validator, market-researcher)"
  ```

---

## Task 2: Build Phase Skill

**Files:**
- Create: `.agent/skills/chrome-extension-developer/SKILL.md`

- [ ] **Step 1: Implement `chrome-extension-developer` (TDD Cycle)**
  - RED: Ask "Build an extension". Document what it misses (likely MV2 vs MV3, permission scoping).
  - GREEN: Create `.agent/skills/chrome-extension-developer/SKILL.md`. Include "Core Knowledge" (MV3, messaging, activeTab) and "Anti-Patterns" from the spec.
  - REFACTOR: Test with skill. Verify it asks for Manifest V3 strategy and storage plans.

- [ ] **Step 2: Commit**
  ```bash
  git add .agent/skills/chrome-extension-developer
  git commit -m "feat: add chrome-extension-developer skill"
  ```

---

## Task 3: Launch Phase Skills

**Files:**
- Create: `.agent/skills/launch-strategist/SKILL.md`
- Create: `.agent/skills/landing-page-builder/SKILL.md`

- [ ] **Step 1: Implement `launch-strategist` (TDD Cycle)**
  - RED: Ask "I'm ready to launch". Document misses.
  - GREEN: Create `.agent/skills/launch-strategist/SKILL.md`. Include playbooks for PH, HN, Reddit, and X from the spec, plus benchmarks.
  - REFACTOR: Test with skill. Verify it produces a pre-launch checklist and asks about distribution channels.

- [ ] **Step 2: Implement `landing-page-builder` (TDD Cycle)**
  - RED: Ask "I need a landing page".
  - GREEN: Create `.agent/skills/landing-page-builder/SKILL.md`. Include the high-converting framework (Hero -> Social Proof -> PAS), tech stack advice, and Anti-Patterns.
  - REFACTOR: Test with skill. Verify it enforces one CTA above the fold and social proof.

- [ ] **Step 3: Commit**
  ```bash
  git add .agent/skills/launch-strategist .agent/skills/landing-page-builder
  git commit -m "feat: add Launch phase skills (launch-strategist, landing-page-builder)"
  ```

---

## Task 4: Revenue Phase Skills

**Files:**
- Create: `.agent/skills/pricing-psychologist/SKILL.md`
- Create: `.agent/skills/bootstrapper-finance/SKILL.md`

- [ ] **Step 1: Implement `pricing-psychologist` (TDD Cycle)**
  - RED: Ask "How much should I charge?".
  - GREEN: Create `.agent/skills/pricing-psychologist/SKILL.md`. Include pricing models by type, psychology (anchoring), and key formulas (LTV/CAC).
  - REFACTOR: Test with skill. Verify it asks for product type before suggesting limits vs time trials.

- [ ] **Step 2: Implement `bootstrapper-finance` (TDD Cycle)**
  - RED: Ask "Should I quit my job to go full time?".
  - GREEN: Create `.agent/skills/bootstrapper-finance/SKILL.md`. Include runway calculator, milestone benchmarks, and Red Flags.
  - REFACTOR: Test with skill. Verify it asks for MRR and applies the 1.5x expenses rule.

- [ ] **Step 3: Commit**
  ```bash
  git add .agent/skills/pricing-psychologist .agent/skills/bootstrapper-finance
  git commit -m "feat: add Revenue phase skills (pricing-psychologist, bootstrapper-finance)"
  ```

---

## Task 5: Operate Phase Skills

**Files:**
- Create: `.agent/skills/solo-founder-ops/SKILL.md`
- Create: `.agent/skills/indie-legal/SKILL.md`
- Create: `.agent/skills/analytics-setup/SKILL.md`

- [ ] **Step 1: Implement `solo-founder-ops`**
  - Create file, run RED/GREEN/REFACTOR targeting time allocation and ICE scoring.
- [ ] **Step 2: Implement `indie-legal`**
  - Create file, run RED/GREEN/REFACTOR targeting GDPR/CCPA basics and clearly stating it is not legal advice.
- [ ] **Step 3: Implement `analytics-setup`**
  - Create file, run RED/GREEN/REFACTOR targeting budget-friendly stacks (Plausible/PostHog) and avoiding event bloat.
- [ ] **Step 4: Commit**
  ```bash
  git add .agent/skills/solo-founder-ops .agent/skills/indie-legal .agent/skills/analytics-setup
  git commit -m "feat: add Operate phase skills (solo-founder-ops, indie-legal, analytics-setup)"
  ```

---

## Task 6: Advanced Phase Skills

**Files:**
- Create: `.agent/skills/ai-integrated-product/SKILL.md`
- Create: `.agent/skills/micro-saas-builder/SKILL.md`

- [ ] **Step 1: Implement `ai-integrated-product`**
  - Create file, run RED/GREEN/REFACTOR targeting cost management and rate limiting.
- [ ] **Step 2: Implement `micro-saas-builder`**
  - Create file, run RED/GREEN/REFACTOR targeting narrow niches and low-churn requirements.
- [ ] **Step 3: Commit**
  ```bash
  git add .agent/skills/ai-integrated-product .agent/skills/micro-saas-builder
  git commit -m "feat: add Advanced phase skills"
  ```

---

## Task 7: Integrate & Update Project Files

**Files:**
- Modify: `README.md`
- Modify: `.agent/rules/superpowers.md`

- [ ] **Step 1: Update README.md**
  - Update the "Skills Reference" table to include the 12 new skills.
  - Change the total skill count from `44` to `56`.
  - Add a new H3 section `### The Indie Hacker Journey` mapping the skills to Validate -> Build -> Launch -> Revenue -> Operate -> Advanced.

- [ ] **Step 2: Update `.agent/rules/superpowers.md`**
  - Add the 12 new skills and their trigger descriptions to the appropriate tables in `superpowers.md` (e.g., creating a new "Indie Hacker" category or merging into "Business & Growth" and "Development Workflow").

- [ ] **Step 3: Final Integration Test**
  - Run `/using-superpowers` in Antigravity and check that all 12 appear and can be viewed correctly.

- [ ] **Step 4: Commit**
  ```bash
  git add README.md .agent/rules/superpowers.md
  git commit -m "chore: integrate 12 indie hacker skills into README and rules"
  ```
