# Indie Hacker Expansion Skills Design

**Date:** 2026-03-22  
**Status:** Draft  
**Builds on:** [2026-03-21 indie-hacker-journey-skills-design](./2026-03-21-indie-hacker-journey-skills-design.md)  
**Reference:** [agency-agents](https://github.com/msitarzewski/agency-agents) — deliverable-focused, workflow-oriented agent patterns

## Overview

Add **12 new skills** to fill gaps in the indie hacker journey that existing skills don't cover. The current 44 skills handle development, marketing, and growth well, but lack skills for **idea validation, product launch, Chrome extension development, pricing psychology, solo operations, legal basics, analytics setup, and bootstrapped finance**.

Target product types: **Mobile app, SaaS/Web app, Chrome extension**.

### Design Principles (inherited from existing spec)

1. **Role-based** — each skill is a professional role, not a topic
2. **Precision policy** — concrete numbers, named tools, formulas; no vague advice
3. **Standard anatomy** — Identity, Core Instincts, Questions You Always Ask, Red Flags/Anti-Patterns
4. **Token budget** — concise but complete; target 300-800 words per SKILL.md depending on complexity; use `references/` sub-files for heavy knowledge (like `mobile-developer` does)
5. **Deliverable-focused** (new, from agency-agents) — each skill produces concrete artifacts/outputs
6. **Indie-scale** — all advice, benchmarks, and tools sized for solo founders, not enterprise

---

## 12 New Skills

### Phase 🔍 Validate (2 skills)

#### `idea-validator`

**Description:** Use when starting a new project, evaluating a product idea, or assessing market fit before building.

**Core Knowledge:**
- Quick validation framework — 5-step checklist: Problem exists? → People pay for solutions? → You can reach them? → You can build it solo? → Defensible moat?
- Smoke test playbook — landing page + waitlist, fake door test, concierge MVP, Wizard of Oz
- Competitive analysis template — features grid, pricing comparison, App Store/Chrome Web Store reviews mining, weak points identification
- Red flag checklist — market too small (<$1M TAM), customer can't/won't pay, saturated with free alternatives, requires network effects you can't bootstrap
- Decision matrix — build / skip / pivot scoring based on validation data

**Key Deliverables:**
- Validation scorecard (go/no-go with evidence)
- Competitive analysis grid
- Smoke test plan with success criteria

**Who to pair with:** `market-researcher`, `product-manager`

---

#### `market-researcher`

**Description:** Use when finding a niche, analyzing market size, researching customer segments, or doing customer discovery.

**Core Knowledge:**
- Niche finding framework — mine Reddit pain points, Twitter/X complaints, App Store 1-star reviews, Google autocomplete, forum threads
- TAM/SAM/SOM estimation — simplified for indie scale; bottom-up sizing from searchable demand signals
- Customer discovery interviews — 5-question script for solo founders, 10 interviews = enough signal to act
- Keyword & demand signals — Google Trends, Ahrefs free tier, search volume → demand proxy
- Competitor mapping — 2×2 positioning map (price vs feature depth), find the underserved quadrant

**Key Deliverables:**
- Market sizing estimate with sources
- Niche opportunity brief
- Customer interview script + synthesis template

**Who to pair with:** `idea-validator`, `seo-specialist`, `product-manager`

---

### Phase 🔨 Build (1 skill)

#### `chrome-extension-developer`

**Description:** Use when building a Chrome extension, browser extension, or browser-based tool.

**Core Knowledge:**
- Manifest V3 architecture — service workers (not background pages), content scripts, popup/options page, side panel API
- Permission strategy — minimal permissions, prefer `activeTab` over broad host permissions, Chrome Web Store review implications
- Storage patterns — `chrome.storage.local` vs `chrome.storage.sync`, message passing between popup ↔ content script ↔ service worker
- Common extension patterns — content injection, sidebar overlay, new tab override, omnibox integration, context menu items
- Distribution — Chrome Web Store listing optimization, pricing models (free + premium via Stripe, freemium with feature gating), Firefox/Edge cross-browser
- Security — CSP headers, no `eval()`, safe `chrome.scripting.executeScript`, permission justification for review

**Anti-Patterns:**
- ❌ Requesting `<all_urls>` permission when `activeTab` suffices → instant review rejection
- ❌ Background page instead of service worker (MV3 incompatible)
- ❌ Storing sensitive data in `chrome.storage.sync` (syncs to Google account)
- ❌ No error handling for `chrome.runtime.lastError`

**Who to pair with:** `frontend-developer`, `security-engineer`

---

### Phase 🚀 Launch (2 skills)

#### `launch-strategist`

**Description:** Use when preparing to launch a product, planning go-to-market, or running a pre-launch campaign.

**Core Knowledge:**
- Pre-launch checklist — landing page live, waitlist > 100, 10+ beta testers with feedback, social proof collected, launch day content ready
- Product Hunt playbook — find a hunter (or self-hunt), optimal posting time (12:01 AM PT Tuesday–Thursday), tagline < 60 chars, first comment template, gallery images (5 recommended), supporter mobilization (DM 20+ people before launch)
- Hacker News playbook — "Show HN:" prefix, factual title (no hype), post between 6-8 AM ET weekdays, engage genuinely in comments, link directly to product (not blog post)
- Reddit launch — identify 3-5 relevant subreddits, participate genuinely 2+ weeks before, format as "I built X because Y" (not promotion), offer free access to community
- Twitter/X build-in-public — launch day thread template (problem → solution → demo → link), build audience 4+ weeks pre-launch
- Post-launch playbook — day 1-3: respond to every comment/review, day 3-7: collect feedback and prioritize, week 2: ship first improvement based on feedback

**Benchmarks:**
| Platform | Good launch | Great launch |
|---|---|---|
| Product Hunt | Top 10 of the day | Top 5, 500+ upvotes |
| Hacker News | Front page | 100+ points, 50+ comments |
| Reddit | 50+ upvotes in niche sub | Cross-posted to 3+ subs organically |

**Who to pair with:** `copywriter`, `landing-page-builder`, `content-marketer`

---

#### `landing-page-builder`

**Description:** Use when creating a landing page, waitlist page, product page, or marketing site.

**Core Knowledge:**
- High-converting page framework — Hero (headline + subline + CTA) → Social proof (logos, testimonials, numbers) → Problem/Solution → Features (3-5 max) → Pricing → Final CTA
- Copywriting formulas — PAS (Problem-Agitation-Solution), AIDA (Attention-Interest-Desire-Action), headline patterns: "X without Y", "The Y for Z"
- Tech stack for indie — Next.js + Vercel (free tier), or simple HTML + Netlify/Cloudflare Pages; avoid overengineering
- Conversion optimization — single CTA per page, CTA above fold, reduce form fields to minimum, social proof near CTA, urgency without sleaze
- Analytics integration — Plausible/Umami for privacy-first analytics, PostHog for session replay, conversion tracking via URL parameters
- SEO foundation — meta title/description, Open Graph images (use og-image generators), structured data for product pages

**Benchmarks:**
| Metric | Average | Good | Great |
|---|---|---|---|
| Landing page conversion (email signup) | 2-3% | 5-8% | 10%+ |
| Bounce rate | 60% | 40-50% | < 35% |
| Time on page | 30s | 1-2 min | 3+ min |

**Anti-Patterns:**
- ❌ Multiple CTAs competing for attention
- ❌ Feature lists without benefits ("AI-powered" means nothing without context)
- ❌ No social proof (even "Built by [name], maker of [X]" is better than nothing)
- ❌ Overengineered tech stack for a landing page (don't use a full React app for a static page)

**Who to pair with:** `copywriter`, `conversion-optimizer`, `seo-specialist`

---

### Phase 💰 Revenue (2 skills)

#### `pricing-psychologist`

**Description:** Use when designing pricing, paywalls, free-to-paid conversion, or optimizing upgrade flows.

**Core Knowledge:**
- Pricing models by product type:
  - Mobile app: freemium + subscription ($2.99-$9.99/mo), or one-time IAP ($4.99-$29.99)
  - SaaS: free tier → $9-$29/mo starter → $49-$99/mo pro (3-tier standard)
  - Chrome extension: freemium most common, premium $3-$10/mo or $29-$99 lifetime
- Pricing page psychology — anchoring (show expensive plan first or middle), decoy (add a plan that makes target plan look better), annual discount (show savings, 15-25% off monthly)
- Free-to-paid strategy — feature gating (lock premium features) vs usage limits (5 free uses/day) vs time trial (7/14/30 days); time trials convert better for SaaS, feature gating for mobile
- Price testing shortcuts — for low traffic: sequential A/B (change price for 2 weeks, measure), or ask "would you pay $X?" in customer interviews; for decent traffic: Stripe test mode with price variations
- Upgrade triggers — hit usage limit, discover locked feature, in-app prompt after value moment, email sequence after trial day 3/7/12
- Regional pricing — Purchasing Power Parity via Stripe, App Store territory pricing tiers

**Key Formulas:**
```
Trial-to-paid conversion: target > 15% (SaaS), > 5% (mobile)
LTV = ARPU × (1 / monthly_churn_rate)
Payback period = CAC / monthly_revenue_per_user → target < 3 months for indie
```

**Who to pair with:** `monetization-strategist`, `conversion-optimizer`, `data-analyst`

---

#### `bootstrapper-finance`

**Description:** Use when tracking MRR, calculating runway, making financial decisions for a solo/bootstrapped business, or evaluating "quit your job" timing.

**Core Knowledge:**
- MRR tracking template — monthly revenue, churn rate, net new MRR, expansion MRR; use a simple spreadsheet, not enterprise tools
- Runway calculator — `months_remaining = (savings + projected_income) / monthly_burn`; include personal expenses, server costs, tool subscriptions
- "Quit your job" framework — safe when: MRR ≥ 1.5× personal monthly expenses for 3+ consecutive months, 6+ months savings as buffer, trending up not flat
- Expense prioritization for indie:
  - Worth paying: domain ($12/yr), hosting (free tier → $20/mo), email service ($0-20/mo), error tracking ($0-26/mo)
  - Free alternatives exist: analytics (Plausible self-hosted), design (Figma free), CI/CD (GitHub Actions free tier)
  - Don't pay until PMF: paid ads, premium tools, full-featured analytics
- Revenue milestones:
  - $100 MRR: validate pricing works
  - $1K MRR: consider it a real business
  - $5K MRR: could cover living expenses in many regions
  - $10K MRR: comfortable indie lifestyle, consider going full-time
- Tax basics — track all business expenses, separate business bank account, quarterly estimated taxes (US), VAT registration threshold (EU), consult accountant when MRR > $3K

**Red Flags:**
- [ ] Spending on paid acquisition before $1K MRR
- [ ] No tracking of monthly expenses vs revenue
- [ ] Running at negative unit economics (LTV < CAC) while scaling
- [ ] Quitting job with < 6 months runway

**Who to pair with:** `monetization-strategist`, `pricing-psychologist`

---

### Phase ⚙️ Operate (3 skills)

#### `solo-founder-ops`

**Description:** Use when managing time, prioritizing features, or running multiple products as a solo founder.

**Core Knowledge:**
- Time allocation framework for solo founders:
  - 60% building (code, design, product)
  - 20% marketing/distribution
  - 10% support/operations
  - 10% learning/research
- Prioritization — ICE scoring: Impact (1-10) × Confidence (1-10) × Ease (1-10); do highest score first; limit WIP to 1-2 features max
- Automation playbook — automate support (FAQ page, chatbot), automate deployment (CI/CD from day 1), automate monitoring (uptime alerts, error tracking), automate billing (Stripe fully managed)
- Multi-product management — don't start product #2 until product #1 has PMF (>40% "very disappointed" in Sean Ellis test); share infrastructure across products (auth, billing, analytics)
- Energy management — batch similar tasks (all marketing Monday, all support Tuesday), protect deep work blocks (4h uninterrupted coding), use async by default
- Decision velocity — "2-way door" decisions (reversible): decide in < 5 min; "1-way door" decisions (irreversible): sleep on it, max 48h

**Anti-Patterns:**
- ❌ Building features nobody asked for (check support tickets first)
- ❌ Spending > 30% time on support (automate or raise prices)
- ❌ Starting product #2 while product #1 has < $1K MRR
- ❌ Perfectionism on v1 (ship good enough, iterate)

**Who to pair with:** `product-manager`, `data-analyst`

---

#### `indie-legal`

**Description:** Use when creating privacy policies, terms of service, handling GDPR/CCPA basics, or understanding legal requirements for a solo-run product.

**Core Knowledge:**
- Privacy policy essentials — what data you collect, why, how long you keep it, who you share with, how users can delete; MUST have one if you collect any personal data
- Terms of Service basics — limitation of liability, acceptable use, termination rights, dispute resolution; protect yourself from liability
- GDPR quick compliance (EU users) — lawful basis for processing, right to access/delete/export, cookie consent banner, DPA with processors (Stripe, analytics, etc.), breach notification within 72h
- CCPA quick compliance (California users) — "Do Not Sell" option, right to know/delete, privacy policy must disclose categories of data collected
- App Store compliance — Apple/Google privacy nutrition labels, ATT framework (iOS), data safety section (Android)
- Cookie consent — consent banner required for EU, essential cookies exempt, analytics = non-essential (needs consent), use Cookiebot/CookieYes or simple self-built banner
- Business structure for indie — sole proprietor (simplest, personal liability) vs LLC (liability protection, ~$100-800/yr), defer until meaningful revenue

> [!CAUTION]
> This skill provides general guidance only, not legal advice. Complex situations (venture funding, employee hiring, IP disputes) require a real lawyer.

**Key Deliverables:**
- Privacy policy template (customizable)
- Terms of Service template (customizable)
- GDPR compliance checklist
- App Store privacy label guide

**Who to pair with:** `security-engineer`

---

#### `analytics-setup`

**Description:** Use when setting up analytics, choosing tracking tools, or designing a metrics dashboard for an indie product.

**Core Knowledge:**
- Analytics stack for indie (budget-friendly):
  - **Product analytics:** PostHog (free self-hosted, or 1M events free cloud) or Mixpanel (free up to 20M events)
  - **Web analytics:** Plausible ($9/mo, privacy-first) or Umami (free self-hosted) or Google Analytics (free, privacy trade-off)
  - **Error tracking:** Sentry (free tier: 5K events/mo) or BugSnag
  - **Uptime:** BetterUptime free tier or UptimeRobot
  - **Session replay:** PostHog (included) or Hotjar (free tier: 35 sessions/day)
- Essential events to track (day 1):
  - `signup`, `activation` (aha moment), `feature_used` (top 3 features), `upgrade_started`, `payment_completed`, `churned`
  - Mobile: `app_opened`, `session_duration`, `notification_opened`, `iap_initiated`
  - Extension: `installed`, `extension_opened`, `feature_used`, `upgraded`
- Dashboard template — 5 metrics that matter:
  1. Daily/Weekly Active Users (DAU/WAU)
  2. Activation rate (% reaching aha moment)
  3. Retention (D1/D7/D30)
  4. Revenue (MRR, trial-to-paid conversion)
  5. Acquisition source breakdown
- Implementation patterns:
  - Event naming convention: `noun_verb` (e.g., `subscription_started`, `feature_clicked`)
  - User properties: plan, signup_date, platform, country
  - Group analytics by cohort (signup week) for meaningful trends

**Anti-Patterns:**
- ❌ Tracking everything (event bloat makes data unusable)
- ❌ No tracking at all ("I'll add analytics later" = never)
- ❌ Vanity metrics only (page views, total signups without activation)
- ❌ No event naming convention (leads to duplicate/inconsistent events)

**Who to pair with:** `data-analyst`, `growth-hacker`, `retention-specialist`

---

### Phase 🧪 Advanced (2 optional skills)

#### `ai-integrated-product`

**Description:** Use when integrating AI/LLM capabilities into a product, building AI-powered features, or evaluating AI APIs for an indie product.

**Core Knowledge:**
- AI API landscape for indie:
  - **OpenAI** (GPT-4o, GPT-4o-mini): best general-purpose, pay-per-token
  - **Anthropic** (Claude): strong for long context, coding tasks
  - **Google** (Gemini): competitive pricing, multimodal
  - **Open-source** (Llama, Mistral via Together/Groq): cheapest at scale, self-hostable
- Cost management — estimate tokens per request, set usage caps per user, cache common responses, use cheaper models for simple tasks (GPT-4o-mini) and expensive for complex (GPT-4o)
- Common AI feature patterns:
  - Text generation/summarization (content tools, writing assistants)
  - Chat/conversational UI (customer support, tutoring)
  - Classification/tagging (email sorting, content moderation)
  - Image generation/analysis (design tools, accessibility)
- Prompt engineering basics — system prompt design, few-shot examples, output format specification (JSON mode), temperature tuning
- Monetization of AI features — usage-based tiers (X queries/mo per plan), AI as premium upsell, cost pass-through + margin
- Rate limiting & abuse prevention — per-user rate limits, content moderation, cost circuit breakers

**Cost Benchmarks (approximate, 2025-2026):**
| Model | Input (1M tokens) | Output (1M tokens) |
|---|---|---|
| GPT-4o-mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Gemini 2.0 Flash | $0.10 | $0.40 |

**Who to pair with:** `backend-developer`, `pricing-psychologist`, `security-engineer`

---

#### `micro-saas-builder`

**Description:** Use when building a micro-SaaS product ($1K–$10K MRR target), choosing a niche SaaS idea, or designing a small but profitable SaaS.

**Core Knowledge:**
- Micro-SaaS characteristics — solves one narrow problem well, < 1000 customers needed, $10-100/mo pricing, can be run solo, low support burden
- Ideal niche indicators — existing tools are enterprise-priced ($100+/mo) for a simple use case, users complain about complexity of current solutions, you can build 80% of the value in 2-4 weeks
- Tech stack recommendation:
  - Backend: Next.js API routes or Express + Supabase/PlanetScale
  - Auth: Supabase Auth, Clerk, or NextAuth
  - Billing: Stripe Checkout + Customer Portal (don't build billing UI)
  - Deployment: Vercel (free tier covers most micro-SaaS)
- Multi-tenant architecture (simplified) — single database with `org_id` column, Row Level Security (RLS) if using Supabase, shared infrastructure (no per-tenant deployment)
- Churn management — < 5% monthly churn target, cancellation survey (mandatory), win-back email sequence, annual plan discount to lock in retention
- Growth playbook for micro-SaaS — SEO-driven (long-tail keywords), integrations as distribution (Zapier, marketplace listings), build in public for awareness

**Revenue Math:**
```
100 users × $29/mo = $2,900 MRR
200 users × $49/mo = $9,800 MRR
At 5% churn, need 5-10 new users/mo to maintain
```

**Who to pair with:** `saas-architect`, `backend-developer`, `pricing-psychologist`

---

## File Structure

```
.agent/skills/
  # Validate
  idea-validator/SKILL.md             [NEW]
  market-researcher/SKILL.md          [NEW]
  # Build
  chrome-extension-developer/SKILL.md [NEW]
  # Launch
  launch-strategist/SKILL.md          [NEW]
  landing-page-builder/SKILL.md       [NEW]
  # Revenue
  pricing-psychologist/SKILL.md       [NEW]
  bootstrapper-finance/SKILL.md       [NEW]
  # Operate
  solo-founder-ops/SKILL.md           [NEW]
  indie-legal/SKILL.md                [NEW]
  analytics-setup/SKILL.md            [NEW]
  # Advanced
  ai-integrated-product/SKILL.md      [NEW]
  micro-saas-builder/SKILL.md         [NEW]
```

Each SKILL.md follows the standard anatomy: YAML frontmatter → Identity/Philosophy → Core Instincts → Detailed Knowledge → Anti-Patterns → Questions You Always Ask → Red Flags → Who to Pair With.

---

## Integration with Existing Skills

The 12 new skills complement (not replace) existing skills:

| Existing Skill | New Companion | Relationship |
|---|---|---|
| `product-manager` | `idea-validator` | PM defines requirements; validator checks if idea is worth pursuing |
| `monetization-strategist` | `pricing-psychologist` | Strategist picks the model; psychologist optimizes the pricing page |
| `conversion-optimizer` | `landing-page-builder` | Builder creates the page; optimizer runs A/B tests on it |
| `data-analyst` | `analytics-setup` | Setup gets the tracking right; analyst interprets the data |
| `security-engineer` | `indie-legal` | Engineer handles technical security; legal handles compliance docs |
| `growth-hacker` | `launch-strategist` | Strategist runs the launch; hacker builds ongoing growth loops |
| `frontend-developer` | `chrome-extension-developer` | Frontend for web; extension dev for browser-native tools |
| `saas-architect` | `micro-saas-builder` | Architect designs systems; micro-SaaS focuses on small, profitable scope |

---

## Updates to Existing Files

### README.md
- Add 12 new skills to the Skills Reference table
- Update skill count from 44 to 56
- Add "Indie Hacker Journey" section showing all skills mapped to phases

### `.agent/rules/superpowers.md`
- Add trigger descriptions for 12 new skills so they auto-activate

---

## Verification Plan

### Automated Tests

Each skill verified via the `writing-skills` TDD approach:
1. **RED** — run a scenario without the skill, document what AI misses
2. **GREEN** — add skill, verify AI applies correct domain instincts
3. **REFACTOR** — tighten red flags, close rationalization loopholes

**Concrete test scenarios (1 per skill):**

| Skill | Test Scenario |
|---|---|
| `idea-validator` | "I want to build a todo app" → should flag saturation, ask for differentiation |
| `market-researcher` | "Help me find a niche for a Chrome extension" → should suggest research methods, not jump to building |
| `chrome-extension-developer` | "Build an extension" → should ask Manifest V3, permissions, storage strategy |
| `launch-strategist` | "I'm ready to launch" → should produce pre-launch checklist, platform-specific playbooks |
| `landing-page-builder` | "I need a landing page" → should follow high-converting framework, not just build HTML |
| `pricing-psychologist` | "How much should I charge?" → should ask product type, then apply appropriate pricing model |
| `bootstrapper-finance` | "Should I quit my job?" → should ask for MRR, expenses, runway; apply framework |
| `solo-founder-ops` | "I have too many things to do" → should apply ICE scoring, time allocation framework |
| `indie-legal` | "Do I need a privacy policy?" → should say yes and produce one, with GDPR/CCPA awareness |
| `analytics-setup` | "Set up analytics for my app" → should recommend budget-appropriate stack, define core events |
| `ai-integrated-product` | "Add AI to my product" → should discuss models, costs, rate limiting |
| `micro-saas-builder` | "I want to build a micro-SaaS" → should apply niche indicators, revenue math |

### Manual Verification
- Review each SKILL.md against the precision policy: no vague advice, all numbers verifiable
- Cross-check benchmarks against industry sources
- Ensure token budget: 300-800 words per skill, heavy knowledge in `references/` sub-files
