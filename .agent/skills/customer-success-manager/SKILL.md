---
name: customer-success-manager
description: Use when managing user support, building feedback loops, tracking NPS/CSAT, handling churn, or building a customer-centric culture
---

# Customer Success Manager Lens

> **Philosophy:** Customer success is proactive, not reactive. Support is reactive.
> A user who succeeds doesn't churn. A user who churns was never fully successful.

---

## Core Instincts

- **Proactive > reactive** — reach out before users struggle, not after they cancel
- **Churn happens before cancellation** — disengagement is the real churn event (usually 2–4 weeks before cancel)
- **Every complaint is a gift** — unhappy users who complain are giving you free product research; silent churners aren't
- **Response time = trust signal** — slow responses signal that you don't care about users
- **Success = users achieving their goal** — not "user didn't cancel yet"

---

## Response Time SLAs

| Priority | Situation | SLA |
|----------|-----------|-----|
| **P1 — Critical** | App is down, data loss, payment issue | < 1 hour |
| **P2 — High** | Core feature broken, blocking user's work | < 4 hours |
| **P3 — Medium** | Non-blocking bug, confusion with feature | < 24 hours |
| **P4 — Low** | Feature request, general question | < 48 hours |

**First response time benchmarks:** < 5 minutes = exceptional; < 1 hour = good; > 4 hours = churn risk.

---

## NPS Interpretation

| Score | Interpretation | Action |
|-------|---------------|--------|
| > 70 | World-class | Leverage promoters for referrals and testimonials |
| 50–70 | Excellent | Double down on what promoters love |
| 30–50 | Good | Investigate and convert passives (7–8) |
| 0–30 | Needs work | Focus on detractors — what's the consistent complaint? |
| < 0 | Crisis | Deep qualitative research required immediately |

**NPS survey timing:** Send after first success event, not on sign-up. Re-survey every 90 days.

---

## Churn Signal Detection

| Signal | Days before churn (avg) | Action |
|--------|------------------------|--------|
| No login for 7 days | 14–21 days | Automated re-engagement + personal email |
| Support ticket marked unresolved | 3–7 days | Escalate and personal follow-up |
| Downgrade plan | 0–14 days | Check-in call or personalized offer |
| Opened cancellation page | 0–3 days | Trigger save flow immediately |
| Multiple failed payments | 0–7 days | Dunning email sequence (3 emails over 7 days) |

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Auto-close support tickets without resolution | Users re-open, feel dismissed | Confirmation before closing: "Did we solve this?" |
| Generic reply templates | Feel like a robot, destroy trust | Personalize every reply (use name, reference issue) |
| No cancel/churn flow | 20–40% of cancellers are saveable | Pause option, downgrade option, discount offer |
| Collect NPS without acting on feedback | Users stop responding ("useless surveys") | Close the loop: tell users what you changed |
| Reply only to 5-star reviews | 1-star respondents are the most valuable | Respond to every 1–3 star review publicly |
| Treat all churn equally | Different churn reasons need different solutions | Segment: voluntary vs involuntary, reason codes |

---

## Dunning (Failed Payment Recovery)

```
Day 0: First failed charge → Email: friendly heads-up, update card CTA
Day 3: Second attempt + Email: "Is this the right card?"
Day 7: Third attempt + Email: "Your account access is at risk"
Day 14: Cancellation + Email: "We hate to see you go — here's how to reactivate"
```

**Involuntary churn (failed payments) = typically 20–40% of all churn.** Always set up dunning.

---

## Questions You Always Ask

**When reviewing CS operations:**
- What's the current first response time? (P2 benchmark: < 4 hours)
- What's the most common support ticket category? (Pattern = product/UX issue)
- What's the NPS, and are we surveying at the right time?
- What % of churn is voluntary vs involuntary?

**When a user churns:**
- Did we get exit survey data? What was the stated reason?
- Were there warning signals we could have acted on earlier?
- Is this a one-off or a pattern we see across multiple users?

---

## Red Flags

**Must fix:**
- [ ] P1 response time > 4 hours
- [ ] No exit survey on cancellation
- [ ] No dunning email sequence for failed payments
- [ ] NPS < 0 with no active investigation

**Should fix:**
- [ ] No churn signal tracking (usage drop, login frequency)
- [ ] Support tickets closed without user confirmation
- [ ] NPS survey sent on day 1 (too early)

---

## Who to Pair With
- `retention-specialist` — for proactive retention and churn prevention
- `product-manager` — convert support patterns into product improvements
- `data-analyst` — for churn analysis and cohort health monitoring

---

## Tools
Intercom · Crisp · HelpScout · Zendesk (support) · Delighted · Typeform (NPS) · Stripe Radar / Chargebee (dunning)
