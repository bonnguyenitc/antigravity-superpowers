# Dev Profession Skills Design

**Date:** 2026-03-21  
**Status:** Approved

## Overview

Antigravity Superpowers currently has 14 skills focused on workflow and process (brainstorming, planning, executing, debugging, etc.) but lacks skills that represent professional developer **roles**. This spec defines a new category of skills — **profession skills** — that act as domain-specific lenses composable with existing workflow skills.

## Problem

When an AI uses `brainstorming` to design a mobile feature, it lacks mobile-specific instincts: it doesn't automatically ask about offline behavior, platform parity, or startup cost. Profession skills fill this gap by injecting domain expertise without duplicating workflow logic.

## Design Decisions

### Composable Lens (not standalone role manuals)

Profession skills are **thin domain profiles**, not self-contained workflow guides. They work as a layer on top of existing skills:

```
mobile-developer + brainstorming  → brainstorm with mobile instincts
backend-developer + systematic-debugging → debug with backend expertise
frontend-developer + requesting-code-review → review with web/UX lens
```

This avoids duplicating workflow logic and keeps each skill token-efficient (<200 words).

### Generic over Platform-Specific

Skills are platform-agnostic to avoid skill explosion. `mobile-developer` covers cross-platform concerns shared across React Native, Flutter, iOS, and Android — not framework specifics.

| Skill | Scope |
|---|---|
| `mobile-developer` | Mobile-first thinking, cross-platform concerns |
| `frontend-developer` | Web UI, UX, browser concerns |
| `backend-developer` | APIs, databases, scalability, security |

### Standard 4-Section Anatomy

Every profession skill uses the same 4-section structure:

1. **Identity** — default stack assumptions, 1-3 lines
2. **Core Instincts** — mental models that define how this role thinks
3. **Questions You Always Ask** — triggers when combined with `brainstorming` or `systematic-debugging`
4. **Red Flags in Code Review** — triggers when combined with `requesting-code-review`

## Skill Specs

### `mobile-developer`

```markdown
---
name: mobile-developer
description: Use when working on mobile app features, making mobile architecture 
decisions, or reviewing mobile code — regardless of platform
---

# Mobile Developer Lens

## Identity
Think cross-platform by default. When stack is unspecified, assume React Native + Expo.

## Core Instincts
- **Offline-first** — assume the network will fail; design for it
- **Platform parity** — iOS and Android differ; test both
- **Startup cost** — every dependency adds to cold start and app size
- **UI/main thread is precious** — heavy work belongs off the main thread

## Questions You Always Ask
When planning: "What happens offline? On first install? When the app is backgrounded?"  
When reviewing: "Tested on both platforms? Can this scroll at 60fps?"

## Red Flags in Code Review
- [ ] No loading/error state for async operations
- [ ] Platform-specific logic hardcoded inline (use platform-aware abstractions)
- [ ] Animations or heavy computation blocking the UI thread
- [ ] Deep links not wired into navigation
```

---

### `frontend-developer`

```markdown
---
name: frontend-developer
description: Use when building web UI, designing component architecture, 
or reviewing frontend code for a web application
---

# Frontend Developer Lens

## Identity
Think component-first and user-first. When stack is unspecified, assume React + TypeScript.

## Core Instincts
- **User perception is reality** — loading states, micro-animations, and feedback matter
- **Accessibility is not optional** — keyboard nav, screen readers, contrast ratios
- **Render cost** — avoid unnecessary re-renders; profile before optimizing
- **Web Vitals** — LCP, CLS, and INP are real metrics users feel

## Questions You Always Ask
When planning: "What's the loading state? What happens on error? Is this mobile-responsive?"  
When reviewing: "Can a keyboard user complete this flow? What's the bundle size impact?"

## Red Flags in Code Review
- [ ] No loading/error/empty states
- [ ] Click handlers without keyboard equivalents
- [ ] Missing unique identifiers for list items (causes re-render issues)
- [ ] Images without `alt` text or explicit dimensions (CLS risk)
```

---

### `backend-developer`

```markdown
---
name: backend-developer
description: Use when designing APIs, working on server-side logic, 
database schemas, or reviewing backend code
---

# Backend Developer Lens

## Identity
Think in contracts and boundaries. When stack is unspecified, assume Node.js + PostgreSQL + REST.

## Core Instincts
- **API contracts are public** — breaking changes must be versioned
- **N+1 is always lurking** — query patterns matter at scale
- **Fail loudly in dev, gracefully in prod** — errors should be observable
- **Auth is load-bearing** — authentication and authorization belong in every design

## Questions You Always Ask
When planning: "What's the auth model? What happens if this service is down? How does this scale to 10x?"  
When reviewing: "Are inputs validated? Is this query indexed? What gets logged on failure?"

## Red Flags in Code Review
- [ ] Missing input validation or sanitization
- [ ] No error handling / silent catch blocks
- [ ] N+1 queries (fetching in loops)
- [ ] Secrets or credentials in code or logs
```

## Skill Location

```
.agent/skills/
  mobile-developer/
    SKILL.md
  frontend-developer/
    SKILL.md
  backend-developer/
    SKILL.md
```

All three go into `.agent/skills/` following the existing flat namespace convention.

## Token Budget

Profession skills are **on-demand** (loaded only when explicitly invoked), not always-loaded. Per the `writing-skills` guideline, on-demand skills may go up to **<500 words**.

| Skill | Target |
|---|---|
| `mobile-developer` | <400 words |
| `frontend-developer` | <400 words |
| `backend-developer` | <400 words |

This allows richer instincts, more review flags, and concrete examples — without the pressure of trimming useful content to fit a word count designed for always-loaded skills.

## Verification Plan

Each skill will be tested using `writing-skills` TDD methodology:

1. **RED** — Run a brainstorming scenario WITHOUT the skill; confirm AI misses domain-specific concerns
2. **GREEN** — Add skill; confirm AI now asks/flags correct domain concerns  
3. **REFACTOR** — Identify loopholes, tighten wording, re-test

Success criterion: With `mobile-developer` + `brainstorming`, AI proactively asks about offline behavior, platform parity, and startup cost without being prompted.
