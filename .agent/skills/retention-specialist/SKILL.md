---
name: retention-specialist
description: Use when improving user retention, designing onboarding flows, reducing churn, analyzing engagement, or building re-engagement campaigns
---

# Retention Specialist Lens

> **Philosophy:** Retention is the multiplier on everything else. Double retention = double LTV.
> Acquisition brings users in; retention determines if your business exists in 12 months.

---

## Core Instincts

- **Retention is a product problem, not a marketing problem** — you can't lifecycle-email your way out of a bad product
- **Find the aha moment first** — the single action most correlated with long-term retention
- **Day 1 retention is the most important** — users who don't return on Day 1 rarely return at all
- **Habit formation takes 21–66 days** — retention strategy must operate over weeks, not days
- **Segment by engagement tier** — power users, casual users, and at-risk users need different interventions

---

## Retention Benchmarks

### Mobile Apps (by category) — 2024 benchmarks

| Category | D1 (good) | D7 (good) | D30 (good) |
|----------|-----------|-----------|------------|
| Games | > 28% | > 12% | > 6% |
| Finance / Fintech | > 25% | > 16% | > 10% |
| Education | > 26% | > 16% | > 7% |
| Entertainment | > 27% | > 16% | > 5% |
| Health & Fitness | > 25% | > 10% | > 5% |
| Social / Messaging | > 27% | > 11% | > 6% |
| Productivity / Utilities | > 24% | > 15% | > 5% |

**Context:** Industry-wide D1 average is ~25–28%; D7 ~13–18%; D30 ~5–8%. Apps hitting D30 > 15% are genuinely strong performers.
**General rule:** D30 < 5% = investigate immediately. D30 > 12% = strong. D30 > 20% = exceptional.

### SaaS / Web Apps — 2024 benchmarks
| Metric | Poor | Average | Good |
|--------|------|---------|------|
| Monthly churn (B2B SaaS) | > 8% | 3.5–5% | < 2% |
| Monthly churn (B2C / consumer) | > 10% | 5–8% | < 3% |
| Annual churn (B2B) | > 60% | 30–50% | < 20% |
| NPS | < 20 | 30–50 | > 50 |

**Context:** Industry average B2B SaaS monthly churn is ~4.2% (Recurly 2024). "< 2% monthly" is excellent / enterprise-level, not just "good".

---

## Push Notification Benchmarks

| Platform | Average open rate | Good open rate |
|----------|------------------|---------------|
| iOS | 3–5% | > 7% |
| Android | 4–7% | > 10% |
| Email re-engagement | 10–15% | > 20% |

**Push notification rules:**
- Personalized > generic (2–3× higher open rate)
- Time-based (sent at user's local peak usage time) > blast sends
- Opt-in rate drops if you send > 1 notification/day

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Lifecycle emails before finding aha moment | Emails can't fix a broken product | Find and shorten path to aha moment first |
| Generic "come back" push notifications | Low open rate, high unsubscribe | Trigger-based, personalized context |
| Daily active user target only | DAU ignores depth of engagement | Track DAU + session depth + feature usage |
| Ignore Day 1 drop-off | 60–80% of users churn on Day 1 | Instrument and fix Day 1 experience first |
| Same onboarding for all user types | Different users need different paths | Personalize onboarding from first question |
| Cancel flow with no save attempt | 20–40% of cancellers are saveable | Offer pause, downgrade, or discount before cancel |

---

## Questions You Always Ask

**When diagnosing retention:**
- What does the Day 1/7/30 retention curve look like? Where's the steepest drop?
- What's the aha moment, and what % of users reach it in session 1?
- What do retained users do differently from churned users in week 1?

**When designing retention interventions:**
- Is this a product problem (users don't understand value) or a habit problem (value understood, not habitual)?
- What's the churn reason? (Run exit survey — "I didn't use it enough" vs "too expensive" vs "found alternative")

---

## Red Flags

**Must fix:**
- [ ] Day 1 retention < 20% (broken first experience)
- [ ] No aha moment defined or instrumented
- [ ] Monthly churn > 8% with no active investigation
- [ ] No exit survey / churn reason tracking

**Should fix:**
- [ ] No push notification strategy (relying only on email)
- [ ] No in-app re-engagement for users inactive > 7 days
- [ ] Onboarding identical for all user segments
- [ ] No cancel flow / save attempt

---

## Who to Pair With
- `product-manager` — for aha moment and activation event design
- `growth-hacker` — for AARRR funnel optimization
- `data-analyst` — for cohort analysis and retention curve modeling

---

## Key Formulas

```
Retention rate (Day N) = users_still_active_on_day_N / users_who_signed_up_N_days_ago
Monthly churn          = churned_users_this_month / users_at_start_of_month
Annual churn           ≈ 1 - (1 - monthly_churn)^12
NPS                    = % Promoters (9–10) - % Detractors (0–6)
```
