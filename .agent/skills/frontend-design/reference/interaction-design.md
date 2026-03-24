# Interaction Design

## Make Interactions Feel Fast

Use **optimistic UI** — update immediately, sync later. This is the single biggest perceived-performance improvement you can make.

```javascript
// BAD: Wait for server
async function likePost(id) {
  const result = await api.like(id);
  setLiked(result.liked);
}

// GOOD: Optimistic update
function likePost(id) {
  setLiked(true);  // Instant feedback
  api.like(id).catch(() => {
    setLiked(false);  // Revert on failure
    showError('Could not save like');
  });
}
```

Use optimistic UI for low-stakes actions. Avoid for payments, destructive operations, or anything requiring server validation first.

---

## Progressive Disclosure

Start simple, reveal sophistication through interaction:

- Basic options visible immediately
- Advanced options behind expandable sections
- Hover/focus states reveal secondary actions
- "Show more" patterns for secondary content

This prevents overwhelming users while keeping power-user features accessible.

---

## Form Design

### Fields
- Show format with placeholders, not fixed instruction text (instructions disappear on focus)
- For non-obvious fields, explain **why** you're asking, not just what to enter
- Group related fields visually with spacing, not just labels
- Use `autocomplete` attributes — they're free UX

```html
<input 
  type="email" 
  autocomplete="email"
  placeholder="you@company.com"
  aria-describedby="email-hint"
>
<span id="email-hint">We'll send your receipt here</span>
```

### Validation
**Validate on blur, not on keystroke** — keystroke validation creates stress (errors appear before you've finished typing). Clear errors immediately when the user corrects them.

```css
/* Visual validation state */
input:invalid:not(:focus):not(:placeholder-shown) {
  border-color: oklch(55% 0.2 25);
  background: oklch(98% 0.01 25);
}
```

---

## Loading States

Three types — use the right one:

| State | When | Pattern |
|-------|------|---------|
| **Skeleton** | Content structure is known | Placeholder shapes in layout position |
| **Spinner** | Action feedback (button click) | Small inline spinner, disable button |
| **Progress** | Long operations | Bar with estimated time if >10s |

**Specific loading messages beat generic ones:**
- `"Saving your draft..."` not `"Loading..."`
- `"Analyzing 40 files..."` not `"Processing..."`
- `"This usually takes 30 seconds"` for long waits

---

## Error States

Every error needs: (1) What happened, (2) Why, (3) How to fix it.

- `"Email address isn't valid. Please include an @ symbol."` ✅
- `"Invalid input"` ❌

For field errors, place them directly below the field, not in a banner far away.

---

## Empty States

Empty states are **onboarding moments**:
1. Acknowledge briefly ("No projects yet")
2. Explain the value of filling it
3. Provide a clear action ("Create your first project →")

Empty states that just say "No items found" are missed opportunities.

---

## Focus Management

Always visible focus indicators — don't set `outline: none` without providing an alternative.

```css
:focus-visible {
  outline: 2px solid oklch(60% 0.15 250);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Hide focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

Move focus intentionally after actions — after closing a modal, return focus to the trigger. After deleting an item, move focus to the next item.

---

## Button Hierarchy

Not every action deserves a primary button. Create clear hierarchy:

| Style | Use For | Frequency |
|-------|---------|-----------|
| **Primary** (filled) | The one main action | 1 per view |
| **Secondary** (outlined) | Important but not primary | 2–3 max |
| **Ghost/text** | Low-priority actions | Multiple OK |
| **Destructive** (red) | Delete, remove | When needed |

Never put two primary buttons side by side — the user can't tell which is "more primary."

---

## Modals: Use Sparingly

Modals are lazy default design. Ask: does this need to interrupt the user? Alternatives:
- **Inline editing**: Edit in place
- **Slide-over panel**: For complex forms
- **Undo**: For destructive actions instead of confirmation
- **Toast**: For confirmations that don't need user input

When you must use a modal: trap focus inside, close on Escape and backdrop click, return focus to trigger on close.

---

**Avoid**: Confirming every action with a modal. Showing errors only in banners. Disabled buttons without explanation. Making hover the only way to access functionality (touch users can't hover).
