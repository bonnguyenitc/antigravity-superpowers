---
name: subscription-billing
description: Use when integrating subscription billing, handling Stripe webhooks, implementing trial logic, managing upgrades/downgrades, or building dunning flows
---

# Subscription Billing Lens

> **Philosophy:** Billing is load-bearing infrastructure. A bug in billing = lost revenue or incorrect charges.
> Build it like critical path code: idempotent, webhook-driven, logged exhaustively.

---

## Core Instincts

- **Webhook-first** — Stripe's webhook is the source of truth, not your API response
- **Idempotency everywhere** — billing operations must be safe to retry
- **Never trust client state for billing** — always fetch subscription status from Stripe server-side
- **All clock-sensitive operations use `event.created`** — not `Date.now()`
- **Soft failures, never hard block** — grace period on payment failures protects revenue

---

## Stripe Integration Architecture

```
User upgrades plan →
  1. Client: Stripe.js → Payment Method → PaymentIntent / SetupIntent
  2. Server: Create/Update Subscription on Stripe
  3. Stripe: Processes payment → emits webhook event
  4. Server: Webhook handler updates DB subscription status
  5. Server: Return state from DB (never from Stripe API response)

⚠️ Anti-pattern: updating DB from API response
✅ Pattern: update DB only from webhook confirmation
```

---

## Critical Webhook Events to Handle

| Event | What to do |
|-------|-----------|
| `checkout.session.completed` | Provision access, send welcome email |
| `customer.subscription.created` | Set status = `active`, log |
| `customer.subscription.updated` | Update plan, seats, feature flags |
| `customer.subscription.deleted` | Set status = `canceled`, begin grace period |
| `invoice.payment_succeeded` | Extend access, reset dunning state |
| `invoice.payment_failed` | Start dunning, notify user, DON'T revoke access immediately |
| `invoice.upcoming` | Warn user of upcoming charge |
| `customer.subscription.trial_will_end` | 3-day warning email before trial ends |

---

## Trial Logic Rules

```
Trial best practices:
- Default trial: 14 days (Stripe default is 30; reduce for faster conversion signal)
- Require payment method at trial start (reduces churn at trial end)
- Free trial without CC = high trial-end churn; use for virality, not conversion
- trial_will_end webhook fires 3 days before → trigger upgrade prompt

Trial states:
  trialing → (payment method on file) → auto-converts to active
  trialing → (no payment method) → needs_payment_method → upgrade prompt
```

---

## Dunning Flow (Failed Payment Recovery)

```
Day 0: Payment fails → invoice.payment_failed webhook
  → Set subscription status = past_due
  → Email: "Your payment failed — please update your card"
  → DO NOT revoke access

Day 3: Stripe auto-retries
  → On success: subscription back to active
  → On fail: email #2 "We'll try again in 4 days"

Day 7: Stripe auto-retries
  → On fail: email #3 with prominent card update CTA

Day 14: Final retry → if fails → subscription.deleted webhook
  → Begin grace period (7–14 days before revoking access)
  → Final email: "Your account will be suspended on [date]"

Configure in: Stripe Dashboard → Billing → Subscriptions → Retry schedule
```

---

## Proration & Plan Changes

```javascript
// Upgrading mid-cycle: charge difference immediately
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, price: newPriceId }],
  proration_behavior: 'create_prorations', // Default — charge difference now
});

// Downgrading: apply at end of period (no refund)
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, price: lowerPriceId }],
  proration_behavior: 'none',
  billing_cycle_anchor: 'unchanged',
});
```

---

## Idempotency Pattern

```javascript
// All Stripe API calls should use idempotency keys
await stripe.subscriptions.create(params, {
  idempotencyKey: `sub_create_${userId}_${planId}`,
});

// Webhook handlers must be idempotent
async function handleWebhook(event) {
  // Check if already processed
  if (await db.webhookEvents.find(event.id)) return;
  
  await db.webhookEvents.create({ id: event.id, processedAt: new Date() });
  // ... handle event
}
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Update subscription status from API response | Stripe may succeed but your server errors | Only from webhook |
| Revoke access immediately on payment failure | Kills goodwill; many recover | Grace period + dunning |
| No idempotency on webhook handler | Duplicate events → double-provision | Store processed event IDs |
| Store card details in your DB | PCI violation | Use Stripe tokens only |
| Use `Date.now()` for billing timestamps | Clock drift causes subtle bugs | Use `event.created` from Stripe |
| Hardcode price IDs in code | Can't change pricing without deploy | Store in env vars or DB |

---

## Questions You Always Ask

**When building billing:**
- Is the webhook handler idempotent? What happens if it fires twice?
- Are we testing with Stripe test mode webhooks via `stripe listen`?
- What's the grace period on failed payments before access revocation?
- Is there a webhook signature verification (`stripe.webhooks.constructEvent`)?

---

## Red Flags

**Must fix:**
- [ ] Subscription status updated from API response (not webhook)
- [ ] No webhook signature verification
- [ ] Access revoked immediately on `invoice.payment_failed`
- [ ] No idempotency on webhook handler

**Should fix:**
- [ ] No dunning email sequence
- [ ] No handling of `customer.subscription.trial_will_end`
- [ ] Price IDs hardcoded in application code

---

## Who to Pair With
- `saas-architect` — for subscription status in the tenant data model
- `backend-developer` — for API design around billing operations
- `monetization-strategist` — for pricing model decisions

---

## Tools
Stripe (billing) · `stripe-node` · Stripe CLI (`stripe listen` for local webhooks) · Stripe Test Cards (4242 4242 4242 4242) · Paddle (alternative with VAT/tax handling)
