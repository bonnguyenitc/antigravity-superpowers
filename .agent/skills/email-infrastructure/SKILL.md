---
name: email-infrastructure
description: Use when setting up transactional email, managing deliverability, configuring SPF/DKIM/DMARC, building email templates, or debugging email delivery issues
---

# Email Infrastructure Lens

> **Philosophy:** Deliverability is a reputation game. One spam complaint can blacklist your domain for weeks.
> Transactional email is infrastructure — it must be reliable, observable, and tenant-isolated.

---

## Core Instincts

- **Domain reputation is fragile** — separate transactional from marketing; don't let bulk mail ruin auth emails
- **Sending ≠ delivering** — always verify delivery via bounce/open tracking and suppression lists
- **Never send from your root domain** — use a subdomain (`mail.yourdomain.com`) to protect your primary domain's reputation
- **Warm up new IPs/domains** — cold domains go to spam; ramp gradually
- **Unsubscribes are legal obligations** — CAN-SPAM, GDPR require easy opt-out

---

## Email Type Separation

| Type | Examples | Volume | Sender domain | Provider pool |
|------|----------|--------|---------------|--------------|
| **Transactional** | Password reset, invoice, welcome | Low | `mail.yourdomain.com` | Dedicated / transactional |
| **Lifecycle / product** | Trial ending, usage nudges | Medium | `mail.yourdomain.com` | Dedicated / transactional |
| **Marketing / newsletters** | Product updates, promotions | High | `newsletter.yourdomain.com` | Separate / marketing |

❗ **Critical:** Marketing and transactional must use separate sending pools. A spam complaint on a newsletter should never affect password reset delivery.

---

## DNS Authentication (Must Have)

```
SPF (Sender Policy Framework)
  → Declares which IPs are allowed to send email from your domain
  → Add to DNS: TXT record on yourdomain.com
  → Example: "v=spf1 include:sendgrid.net include:resend.com ~all"
  → Max 10 DNS lookups (hard limit); use flattening tools if exceeded

DKIM (DomainKeys Identified Mail)
  → Cryptographic signature proving email wasn't tampered with
  → Your ESP generates CNAME records; add to DNS
  → Check: "selector._domainkey.yourdomain.com"

DMARC (Domain-based Message Authentication)
  → Policy: what to do with emails that fail SPF/DKIM
  → Start: p=none (monitor) → move to p=quarantine → p=reject
  → Add: _dmarc.yourdomain.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
  → DMARC aggregate reports tell you who's failing and why

Required order: SPF → DKIM → DMARC
Without all three: Google/Yahoo bulk sender requirements (2024) → emails rejected
```

---

## Deliverability Rules

| Rule | Why |
|------|-----|
| Spam complaint rate < **0.08%** | Google/Yahoo threshold; above = Gmail blocks |
| Hard bounce rate < **2%** | Remove bounced emails immediately |
| List hygiene: unverified emails | Never send to addresses that haven't confirmed |
| Unsubscribe link required | CAN-SPAM (US) + GDPR (EU) legal requirement |
| One-click unsubscribe (RFC 8058) | Gmail requires for bulk senders (> 5K/day) |
| Text version alongside HTML | Many spam filters penalize HTML-only |

---

## Email Queue Architecture

```
❌ NEVER send email synchronously in request handler:
  POST /reset-password → send email → respond

✅ Queue email jobs:
  POST /reset-password → create job in queue → respond 200
                                ↓ (async)
                         Worker picks up job → send via ESP → log result

Why: Email sending can take 1–3 seconds; timeouts → duplicate sends → user frustration
Queue retry: 3 attempts with exponential backoff (1s, 5s, 30s)
```

---

## Template Best Practices

```
Structure:
- Max width: 600px (renders correctly in all clients)
- Always include plaintext alternative
- Inline CSS only (Gmail strips <style> blocks)
- Images: always include alt text; assume images are blocked
- CTA button: use table-based HTML (VML for Outlook)

Testing:
- Litmus / Email on Acid for client rendering
- SpamAssassin score < 2 (most spam filters use SA)
- Check: mail-tester.com (free quick test)
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Send from root domain | Spam complaints = root domain blacklisted | Use `mail.yourdomain.com` subdomain |
| Marketing + transactional same pool | Marketing spam rates kill auth email delivery | Separate sender pools |
| No SPF/DKIM/DMARC | Emails rejected by Gmail/Yahoo (2024 policy) | Configure all three before launch |
| Retry email without checking bounces | Sending to bounced emails = reputation damage | Remove hard bounces immediately |
| Suppress all email on one unsubscribe | User unsubscribes from marketing, loses auth emails | Separate marketing vs transactional opt-out lists |
| Send email synchronously in API handler | Timeouts → duplicate sends → user sees email twice | Job queue always |

---

## Questions You Always Ask

**When setting up email:**
- Are SPF, DKIM, and DMARC configured? (Check: `mxtoolbox.com`)
- Are transactional and marketing emails on separate sending pools?
- Is email sending queued (not synchronous in the request)?
- What happens when an email bounces? Is the address suppressed?

**When debugging delivery issues:**
- What does the ESP delivery log show? Was it accepted or rejected?
- Is the DMARC report showing authentication failures?
- What's the spam complaint rate this week?

---

## Red Flags

**Must fix:**
- [ ] No DKIM/SPF/DMARC configured (emails fail Gmail/Yahoo)
- [ ] Transactional and marketing sent from same pool
- [ ] Bounced addresses not being suppressed
- [ ] Email sent synchronously in request handler

**Should fix:**
- [ ] No plaintext version of HTML emails
- [ ] No DMARC report monitoring
- [ ] Unsubscribe doesn't work within 10 seconds (CAN-SPAM requirement)

---

## Who to Pair With
- `backend-developer` — for queue implementation and webhook handling
- `security-engineer` — for email token security (reset links, magic links)
- `devops-engineer` — for DNS configuration and monitoring

---

## Tools
**ESP:** Resend · SendGrid · Postmark · AWS SES  
**Testing:** mail-tester.com · Litmus · Email on Acid  
**DNS check:** MXToolbox · DMARC Analyzer  
**Templates:** React Email · MJML  
**Queue:** BullMQ / Inngest / Trigger.dev
