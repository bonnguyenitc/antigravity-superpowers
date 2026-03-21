# Dev Profession Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 thin-lens profession skills (`mobile-developer`, `frontend-developer`, `backend-developer`) to Antigravity Superpowers.

**Architecture:** Each skill is a standalone `SKILL.md` file (~300-400 words) with 4 sections: Identity, Core Instincts, Questions You Always Ask, Red Flags in Code Review. Skills are platform-agnostic and composable with existing workflow skills (brainstorming, systematic-debugging, requesting-code-review).

**Tech Stack:** Markdown only. No code dependencies. Files go into `.agent/skills/` following the existing flat namespace.

---

## File Structure

```
.agent/skills/
  mobile-developer/
    SKILL.md    [NEW]
  frontend-developer/
    SKILL.md    [NEW]
  backend-developer/
    SKILL.md    [NEW]
```

---

## Task 1: `mobile-developer` Skill

**Files:**
- Create: `.agent/skills/mobile-developer/SKILL.md`

### Testing (TDD for documentation)

- [ ] **Step 1: Write a baseline pressure scenario (RED)**

  In a fresh conversation WITHOUT the `mobile-developer` skill, ask:
  > "Help me brainstorm an offline sync feature for my app."

  Document what the AI misses: Does it ask about offline behavior? Platform parity? Startup cost?
  Expected (baseline): AI focuses on happy-path features, doesn't ask cross-platform questions.

- [ ] **Step 2: Write the skill (GREEN)**

  Create `.agent/skills/mobile-developer/SKILL.md`:

  ```markdown
  ---
  name: mobile-developer
  description: Use when working on mobile app features, reviewing mobile code,
  or making architecture decisions — regardless of platform (React Native, Flutter, iOS, Android)
  ---

  # Mobile Developer Lens

  ## Identity
  Think cross-platform and offline-first by default.
  When stack is unspecified, assume React Native + Expo.
  Flagship concerns: startup time, app size, battery usage, platform parity.

  ## Core Instincts
  - **Offline-first** — assume the network will fail; design around it from day one
  - **Platform parity** — iOS and Android have different behaviors, gestures, and APIs; both must work
  - **Startup cost** — every dependency adds to cold start time and binary size; justify each one
  - **UI/main thread is precious** — heavy computation and animations must run off the main thread
  - **Battery budget** — background tasks, location, and push use real energy; minimize wake-ups

  ## Questions You Always Ask

  **When planning features:**
  - What happens when the user is offline or on a flaky connection?
  - What's the behavior on first install (no cached data)?
  - What happens when the app is backgrounded or killed mid-task?
  - Is this feature tested on both iOS and Android?

  **When reviewing architecture:**
  - Does this increase cold start time or app size? By how much?
  - Are we handling permission denial gracefully (location, camera, notifications)?
  - What's the upgrade path if a user has an old app version with stale local data?

  ## Red Flags in Code Review
  - [ ] No loading/error state for async operations
  - [ ] Platform-specific logic hardcoded inline (use platform-aware abstractions)
  - [ ] Animations or heavy computation blocking the UI/main thread
  - [ ] Deep links not handled in navigation flows
  - [ ] No handling of permission denied/revoked scenarios
  - [ ] Local storage schema changes with no migration strategy
  ```

- [ ] **Step 3: Test with skill present (GREEN verification)**

  In a fresh conversation WITH the `mobile-developer` skill loaded, repeat the same scenario:
  > "Help me brainstorm an offline sync feature for my app."

  Expected: AI proactively asks about offline behavior, platform parity, and startup cost.

- [ ] **Step 4: Commit**

  ```bash
  git add .agent/skills/mobile-developer/SKILL.md
  git commit -m "feat: add mobile-developer profession skill"
  ```

---

## Task 2: `frontend-developer` Skill

**Files:**
- Create: `.agent/skills/frontend-developer/SKILL.md`

### Testing (TDD for documentation)

- [ ] **Step 1: Write a baseline pressure scenario (RED)**

  In a fresh conversation WITHOUT the skill, ask:
  > "Help me design a product listing page with filters and cart."

  Expected (baseline): AI focuses on data/logic, misses loading states, a11y, web vitals, CLS.

- [ ] **Step 2: Write the skill (GREEN)**

  Create `.agent/skills/frontend-developer/SKILL.md`:

  ```markdown
  ---
  name: frontend-developer
  description: Use when building web UI, designing component architecture,
  or reviewing frontend code — regardless of framework (React, Vue, Svelte, etc.)
  ---

  # Frontend Developer Lens

  ## Identity
  Think component-first and user-perception-first.
  When stack is unspecified, assume React + TypeScript + Next.js.
  Flagship concerns: render performance, accessibility, Core Web Vitals, responsive layout.

  ## Core Instincts
  - **User perception is reality** — loading states, micro-animations, and feedback loops matter as much as the happy path
  - **Accessibility is load-bearing** — keyboard nav, screen readers, and contrast ratios affect real users
  - **Render cost is real** — unnecessary re-renders degrade UX; measure before assuming
  - **Web Vitals are felt** — LCP, CLS, INP directly impact user satisfaction and SEO
  - **Mobile is primary** — design mobile-first; test on real devices, not just desktop Chrome

  ## Questions You Always Ask

  **When planning UI:**
  - What's the loading state? The error state? The empty state?
  - Is this accessible to keyboard and screen reader users?
  - What does this look like on a 375px screen?
  - What's the SEO story (is this content crawlable)?

  **When reviewing components:**
  - Does this cause layout shift (CLS)? Are image dimensions set?
  - Can a keyboard user complete this flow without a mouse?
  - What's the bundle size impact of this dependency?
  - Are form inputs properly labeled for screen readers?

  ## Red Flags in Code Review
  - [ ] No loading/error/empty states for async data
  - [ ] Interactive elements not reachable by keyboard
  - [ ] Images without `alt` text or explicit width/height (CLS risk)
  - [ ] Missing unique identifiers for list items (causes re-render issues)
  - [ ] Form inputs without associated `<label>` elements
  - [ ] Large dependencies added without justifying the bundle size trade-off
  ```

- [ ] **Step 3: Test with skill present (GREEN verification)**

  Repeat the scenario with skill loaded.
  Expected: AI asks about loading/error/empty states, keyboard accessibility, and mobile layout.

- [ ] **Step 4: Commit**

  ```bash
  git add .agent/skills/frontend-developer/SKILL.md
  git commit -m "feat: add frontend-developer profession skill"
  ```

---

## Task 3: `backend-developer` Skill

**Files:**
- Create: `.agent/skills/backend-developer/SKILL.md`

### Testing (TDD for documentation)

- [ ] **Step 1: Write a baseline pressure scenario (RED)**

  In a fresh conversation WITHOUT the skill, ask:
  > "Help me design a user authentication API."

  Expected (baseline): AI designs happy-path routes, misses auth edge cases, rate limiting, input validation, observability.

- [ ] **Step 2: Write the skill (GREEN)**

  Create `.agent/skills/backend-developer/SKILL.md`:

  ```markdown
  ---
  name: backend-developer
  description: Use when designing APIs, working on server-side logic,
  database schemas, or reviewing backend code — regardless of stack
  ---

  # Backend Developer Lens

  ## Identity
  Think in contracts, boundaries, and failure modes.
  When stack is unspecified, assume Node.js + PostgreSQL + REST.
  Flagship concerns: API stability, data integrity, observability, security.

  ## Core Instincts
  - **API contracts are public** — breaking changes require versioning; consumers break silently
  - **N+1 is always lurking** — query patterns that work in dev collapse in production
  - **Fail loudly in dev, gracefully in prod** — errors must be observable; silent failures are unacceptable
  - **Auth is load-bearing** — authentication and authorization must be in every design from the start
  - **Schema changes are permanent** — migrations must be backward-compatible; rollback must be possible

  ## Questions You Always Ask

  **When designing APIs:**
  - What's the auth model? Who can call this endpoint and how?
  - What happens if a downstream service is unavailable?
  - How does this behave at 10x current load?
  - What gets logged when this fails in production?

  **When reviewing database work:**
  - Is this query indexed? What's the query plan at scale?
  - Does this migration have a safe rollback path?
  - Are we handling concurrent writes correctly (race conditions, locks)?

  ## Red Flags in Code Review
  - [ ] Missing input validation or sanitization
  - [ ] Silent catch blocks (errors swallowed without logging)
  - [ ] Queries inside loops (N+1 pattern)
  - [ ] Secrets or credentials in source code or logs
  - [ ] No rate limiting on public-facing endpoints
  - [ ] Schema migrations without a rollback strategy
  ```

- [ ] **Step 3: Test with skill present (GREEN verification)**

  Repeat the scenario with skill loaded.
  Expected: AI asks about auth model, rate limiting, input validation, and observability.

- [ ] **Step 4: Commit**

  ```bash
  git add .agent/skills/backend-developer/SKILL.md
  git commit -m "feat: add backend-developer profession skill"
  ```

---

## Task 4: Integration Check

- [ ] **Step 1: Verify all 3 skills appear in the skills list**

  Run in Antigravity:
  ```
  /using-superpowers
  ```
  Expected: `mobile-developer`, `frontend-developer`, `backend-developer` visible in skill list.

- [ ] **Step 2: Compose test — skill + brainstorming**

  With both `mobile-developer` + `brainstorming` active:
  > "I want to add push notifications to my app."

  Expected: AI applies brainstorming workflow AND asks mobile-specific questions (battery budget, permission handling, background behavior).

- [ ] **Step 3: Final commit**

  ```bash
  git add .
  git commit -m "feat: add 3 dev profession skills to antigravity-superpowers"
  ```
