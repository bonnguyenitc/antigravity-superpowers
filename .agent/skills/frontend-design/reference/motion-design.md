# Motion Design

## Duration: The 100/300/500 Rule

Timing matters more than easing. These durations feel right for most UI:

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100–150ms** | Instant feedback | Button press, toggle, color change |
| **200–300ms** | State changes | Menu open, tooltip, hover states |
| **300–500ms** | Layout changes | Accordion, modal, drawer |
| **500–800ms** | Entrance animations | Page load, hero reveals |

**Exit animations are faster than entrances** — use ~75% of enter duration.

---

## Easing: Pick the Right Curve

**Don't use `ease`.** It's a compromise that's rarely optimal. Instead:

| Curve | Use For | CSS |
|-------|---------|-----|
| **ease-out** | Elements entering | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | Elements leaving | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | State toggles (there → back) | `cubic-bezier(0.65, 0, 0.35, 1)` |

**For micro-interactions, use exponential curves — they mimic real physics:**

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);   /* Smooth, refined (recommended) */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);   /* Slightly more dramatic */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);    /* Snappy, confident */
```

**Avoid bounce and elastic curves.** They were trendy in 2015 but now feel tacky and amateurish. Real objects decelerate smoothly — they don't bounce when they stop.

---

## The Only Two Properties You Should Animate

**`transform` and `opacity` only** — everything else causes layout recalculation.

For height animations (accordions, expandables), use `grid-template-rows: 0fr → 1fr` instead of animating `height` directly:

```css
.expandable {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms var(--ease-out-quart);
}

.expandable.open {
  grid-template-rows: 1fr;
}

.expandable > div {
  overflow: hidden;
}
```

---

## Staggered Animations

Use CSS custom properties for cleaner stagger:

```css
.item {
  animation: slide-up 500ms var(--ease-out-expo) both;
  animation-delay: calc(var(--i, 0) * 50ms);
}
```

```html
<div class="item" style="--i: 0">...</div>
<div class="item" style="--i: 1">...</div>
<div class="item" style="--i: 2">...</div>
```

**Cap total stagger time** — 10 items at 50ms = 500ms total. For many items, reduce per-item delay or cap staggered count.

---

## Reduced Motion

This is not optional. Vestibular disorders affect ~35% of adults over 40.

```css
/* Define animations normally */
.card {
  animation: slide-up 500ms ease-out;
}

/* Provide crossfade alternative */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;
  }
}

/* Or disable all motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**What to preserve**: Progress bars, loading spinners (slowed), and focus indicators should still work — just without spatial movement.

---

## Perceived Performance

Nobody cares how fast your site is — just how fast it **feels**.

**The 80ms threshold**: Anything under 80ms feels instant. This is your target for micro-interactions.

**Strategies:**
- **Optimistic UI**: Update immediately, sync later. Instagram likes work offline — the UI updates instantly. Use for low-stakes actions; avoid for payments or destructive operations.
- **Skeleton screens**: Show structure before content. Beats blank loading states.
- **Progressive loading**: Show content as it arrives — don't wait for everything.

**Caution**: Too-fast responses can decrease perceived value. Users may distrust instant results for complex operations (search, analysis). Sometimes a brief delay signals "real work" is happening.

---

## Performance

Don't use `will-change` preemptively — only when animation is imminent (`:hover`, `.animating`). For scroll-triggered animations, use Intersection Observer instead of scroll events; unobserve after animating once.

Create motion tokens for consistency:

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

**Avoid**: Animating everything (animation fatigue is real). Using >500ms for UI feedback. Ignoring `prefers-reduced-motion`. Using animation to hide slow loading.
