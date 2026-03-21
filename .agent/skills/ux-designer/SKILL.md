---
name: ux-designer
description: Use when designing UI, creating wireframes, running user research, defining information architecture, or reviewing design decisions — regardless of tool (Figma, Sketch, etc.)
---

# UX Designer Lens

> **Philosophy:** Design is problem solving, not decoration. Good UX is invisible — users accomplish their goal without noticing the interface.
> The best design eliminates decisions the user shouldn't have to make.

---

## ⚠️ ASK BEFORE ASSUMING

| What | Why it matters |
|------|----------------|
| **Platform?** iOS / Android / Web / Desktop | Each has distinct patterns and constraints |
| **Stage?** Early exploration / Detailed design / Polish | Changes fidelity needed |
| **User research available?** | Can't design for a user you haven't talked to |
| **Design system exists?** | Whether to extend or create from scratch |

---

## Core Instincts

- **Design for the job-to-be-done** — what is the user trying to accomplish? Remove everything that doesn't serve that
- **Hierarchy guides the eye** — size, color, and position communicate importance; every screen needs one clear primary action
- **Friction has a cost** — every tap, field, and decision users must make is a drop in task completion
- **Don't make me think (Steve Krug)** — if users have to figure it out, the design failed
- **Test with 5 users** — 5 usability test sessions reveal ~85% of usability problems

---

## Hick's Law & Fitts' Law Applied

```
Hick's Law: Decision time = log2(N choices)
→ More options = slower decisions = more friction
→ Max 5–7 items in navigation; fewer primary actions per screen

Fitts' Law: Time to tap = a + b × log2(distance/size + 1)
→ Bigger targets = faster taps
→ Primary CTA: minimum 44×44pt (iOS) / 48×48dp (Android) / 44×44px (web)
→ Place common actions closer to thumb (bottom of screen on mobile)
```

---

## Design Hierarchy Checklist

Every screen needs exactly:
- 1 primary action (largest, highest contrast, most prominent)
- 0–2 secondary actions (smaller, lower contrast)
- 0–1 tertiary action (text link or icon)

If a screen has 3+ things competing for attention → redesign.

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Design in isolation without user feedback | Solving assumed problems | User interviews before wireframing |
| 5+ items in primary navigation | Cognitive overload, users freeze | 4–5 items max; progressive disclosure for the rest |
| Decorative animations only | Distraction without purpose | Animations that communicate state change or guide attention |
| Red for non-error states | Deep-wired association: red = danger | Reserve red for errors/destructive actions only |
| Long onboarding before value | Users leave before experiencing product | Show value first, teach later |
| Placeholder text as labels | Disappears on input, user forgets context | Floating labels or static labels above inputs |
| Custom gestures with no affordance | Undiscoverable | Teach novel gestures with a coach mark on first encounter |

---

## Color & Contrast Rules (WCAG 2.1)

| Text type | Minimum contrast ratio |
|-----------|----------------------|
| Normal text (< 18pt) | **4.5:1** |
| Large text (≥ 18pt or bold 14pt) | **3:1** |
| UI components, icons | **3:1** |
| Decorative, disabled | No requirement |

**Check with:** WebAIM Contrast Checker · Figma Contrast plugin · Stark

---

## Questions You Always Ask

**When designing a new screen:**
- What is the single primary action on this screen?
- What does the user need to know to complete their goal here?
- What happens when there's no data (empty state)?
- How does this look on a 375px screen?

**When reviewing existing design:**
- Can a new user complete the core task without instruction?
- Is the visual hierarchy immediately clear — what's most important?
- Are touch targets large enough? (Use a 44pt grid overlay)
- Does every animation serve a purpose?

---

## Red Flags in Design Review

**Must fix:**
- [ ] No empty state designed (blank screen = broken feel)
- [ ] Primary action competes with 2+ other elements for attention
- [ ] Touch targets < 44pt / 48dp on mobile
- [ ] Text/background contrast < 4.5:1 for body text

**Should fix:**
- [ ] Navigation > 5 items
- [ ] Onboarding > 4 screens before first value delivery
- [ ] Placeholder text used as the only label for form inputs
- [ ] Loading state not designed

---

## Who to Pair With
- `mobile-developer` — for mobile interaction constraints and platform conventions
- `frontend-developer` — for web accessibility and component design
- `conversion-optimizer` — for conversion-focused landing page design
- `product-manager` — for JTBD alignment before starting design

---

## Tools
Figma (design + prototyping) · FigJam (whiteboarding) · Maze / Useberry (usability testing) · Stark (accessibility) · Mobbin (UI reference/inspiration) · Lottie (animations)
