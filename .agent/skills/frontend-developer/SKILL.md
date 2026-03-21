---
name: frontend-developer
description: Use when building web UI, designing component architecture, or reviewing frontend code — regardless of framework (React, Vue, Svelte, etc.)
---

# Frontend Developer Lens

> **Philosophy:** Component-first. User-perception-first. Accessibility is not optional.
> Performance is felt by users, not measured in isolation.

---

## ⚠️ ASK BEFORE ASSUMING

If the stack is unspecified, **DO NOT default to Create React App**. Ask:

| What | Why it matters |
|------|----------------|
| **Framework?** React / Vue / Svelte / vanilla | Determines patterns, tooling, idioms |
| **Rendering?** CSR / SSR / SSG / ISR | SEO and performance strategy |
| **Design system?** Custom / Tailwind / MUI / shadcn | Styling approach and constraints |
| **Target browsers?** Modern / IE support? | Determines APIs and CSS you can use |

When stack is unspecified, assume React + TypeScript + Next.js (App Router).

---

## Core Instincts

- **User perception is reality** — loading states, micro-animations, and feedback loops matter as much as the happy path
- **Accessibility is load-bearing** — keyboard nav, screen readers, and contrast ratios affect real users
- **Render cost is real** — unnecessary re-renders degrade UX; measure before optimizing
- **Web Vitals are felt** — LCP, CLS, INP directly impact user satisfaction and SEO
- **Mobile is primary** — design mobile-first; test at real viewport sizes on real devices

---

## Web Vitals Thresholds (Google Standard)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | 1.8–3s | > 3s |
| **TTFB** (Time to First Byte) | < 800ms | 800ms–1.8s | > 1.8s |

---

## Bundle Size Guidelines

| Bundle | Target | Action needed |
|--------|--------|---------------|
| Main JS (gzipped) | < 200KB | > 400KB: audit imports, code-split |
| Per-route chunk | < 50KB | > 100KB: lazy load heavy deps |
| CSS (gzipped) | < 50KB | > 100KB: purge unused styles |
| Images (hero) | < 200KB | Use `next/image` or WebP + lazy load |

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Skip loading/error/empty states | User thinks the app is broken | Always handle all 3 async states |
| `onClick` only (no keyboard handler) | Keyboard users excluded | Use `<button>`; it's free keyboard support |
| Index as list `key` in dynamic lists | Reorder causes state and animation bugs | Unique stable ID from data |
| Images without `alt` or explicit dimensions | Screen reader fail + CLS score hit | `alt` always; `width`/`height` or `aspect-ratio` always |
| `<div>` for interactive elements | Not focusable, not semantic, no ARIA | Use `<button>`, `<a>`, or explicit `role` + `tabIndex` |
| Sequential `await` for independent fetches | Each waits on the previous (waterfall) | `Promise.all([fetchA(), fetchB()])` |
| Barrel exports in app code (`index.ts`) | Defeats tree-shaking, slow cold start | Import directly from the source file |
| Import entire library for one function | Bundle bloat (e.g., `import _ from 'lodash'`) | Named import or specific entry (`lodash/debounce`) |
| Client fetch where SSR/SSG would work | Slower FCP, worse SEO | Server-render or static-generate whenever possible |

---

## Accessibility Quick Rules

| Rule | Detail |
|------|--------|
| Color contrast (normal text) | ≥ 4.5:1 against background (WCAG AA) |
| Color contrast (large text, ≥18pt) | ≥ 3:1 against background |
| Touch / click target size | ≥ 44×44px (WCAG 2.5.5, Level AAA) |
| Focus indicator | Must be visible; `outline: none` without replacement is a violation |
| Form inputs | Must have `<label>` (associated via `for`/`id` or wrapping) |
| Images | Decorative → `alt=""`, informative → descriptive `alt` |
| Interactive elements order | DOM order must match visual order for keyboard users |

---

## Questions You Always Ask

**When planning UI:**
- What's the loading state? The error state? The empty state?
- Is this accessible to keyboard and screen reader users?
- What does this look like at 375px? At 1440px?
- Is this content crawlable by search engines (SSR or SSG)?

**When reviewing components:**
- Does this cause layout shift (CLS)? Are image dimensions declared?
- Can a user complete this entire flow using only the keyboard?
- Is every form input associated with a visible `<label>`?
- What's the bundle size delta from this new dependency?

---

## Red Flags in Code Review

**Must fix:**
- [ ] No loading/error/empty states for async data
- [ ] Interactive elements unreachable by keyboard
- [ ] Images without `alt` text or explicit dimensions (CLS risk)
- [ ] Form inputs without associated `<label>` elements
- [ ] Color contrast below 4.5:1 for body text

**Should fix:**
- [ ] Missing unique identifiers for list items
- [ ] Large dependencies added without bundle size justification
- [ ] Client-side fetch where server-rendering would work
- [ ] `outline: none` without visible focus replacement

---

## Performance Debugging Checklist

```
Slow initial load  → Check bundle size, server render, remove unused deps
Layout shift (CLS) → Set image dimensions, avoid injecting content above fold
Janky interaction  → Use CSS transforms, avoid forced layout (getBoundingClientRect in loops)
Too many re-renders → React DevTools Profiler → memo, useMemo, useCallback
Slow data fetch    → Parallel with Promise.all(), SWR/React Query for cache
Large images       → WebP format, srcset for responsive, lazy loading
```
