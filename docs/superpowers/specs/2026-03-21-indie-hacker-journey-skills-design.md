# Indie Hacker Journey Skills Design

**Date:** 2026-03-21  
**Status:** Approved

## Overview

Extend Antigravity Superpowers with 14 new role-based profession skills covering the full indie hacker journey from launch to scale. These complement the 3 existing dev skills (`mobile-developer`, `frontend-developer`, `backend-developer`) to create a comprehensive library for solo founders and indie hackers building and growing products.

## Design Decisions

### Role-Based (Not Topic-Based)
Skills represent **roles** (professions), not topics. When invoked, AI adopts the mindset, instincts, and knowledge of that professional role — composable with workflow skills (brainstorming, debugging, code-review).

### Journey-Phase Organization
Skills are grouped by phase of the indie hacker journey. This gives a natural narrative: indie hackers know which phase they're in and which skills to use.

### Precision Policy
All skills include concrete numbers, thresholds, named tools, and formulas — not vague advice:
- Conversion rates, CAC/LTV ratios, churn thresholds
- Named tools: Mixpanel, Amplitude, Ahrefs, AppFollow
- Formulas: `LTV = ARPU × (1/churn_rate)`, `CAC = ad_spend / new_customers`

### Standard 4-Section Anatomy (same as dev skills)
1. **Identity** — role defaults, flagship concerns
2. **Core Instincts** — mental models defining how this role thinks
3. **Questions You Always Ask** — triggers for brainstorming and review
4. **Red Flags / Anti-Patterns** — named issues with concrete thresholds

### Token Budget
All skills are on-demand (loaded explicitly), so budget is up to **<500 words** per skill.

---

## Skill List: 14 New Skills

### Phase 🚀 Launch (3 skills)

#### `product-manager`
Product strategy, PRD writing, feature prioritization, user research, roadmap.

#### `copywriter`
Landing page copy, App Store descriptions, onboarding microcopy, email sequences.

#### `app-store-optimizer`
ASO — keyword research, metadata, screenshots, ratings strategy, A/B testing on store listings.

---

### Phase 📈 Grow (3 skills)

#### `growth-hacker`
Acquisition loops, viral mechanics, referral programs, A/B testing, activation funnels.

#### `content-marketer`
Blog strategy, SEO content, social media, distribution channels, content-market fit.

#### `seo-specialist`
Technical SEO, keyword research, on-page optimization, backlink strategy, Core Web Vitals.

---

### Phase 💰 Monetize (3 skills)

#### `monetization-strategist`
Pricing models (freemium, subscription, one-time, IAP), revenue modeling, upgrade flows.

#### `paid-acquisition-specialist`
Meta Ads, Google UAC, Apple Search Ads — creative strategy, ROAS, CAC optimization.

#### `conversion-optimizer`
Landing page CRO, trial-to-paid funnels, paywall design, A/B testing, onboarding flows.

---

### Phase 🔄 Retain (2 skills)

#### `retention-specialist`
Onboarding flows, engagement loops, push notification strategy, churn prediction, win-back campaigns.

#### `customer-success-manager`
Support operations, NPS/CSAT, bug triage, feedback loops, community management.

---

### Phase 📊 Scale (2 skills)

#### `data-analyst`
Metrics frameworks, funnel analysis, cohort analysis, dashboards, A/B test significance.

#### `cto-architect`
System design for scale, tech debt management, team structure, hiring, architecture reviews.

---

### Phase 🔨 Build (1 additional)

#### `devops-engineer`
CI/CD pipelines, infrastructure as code, monitoring/alerting, deployment strategy, SLOs.

---

## File Structure

```
.agent/skills/
  # Build
  devops-engineer/SKILL.md          [NEW]
  # Launch
  product-manager/SKILL.md          [NEW]
  copywriter/SKILL.md               [NEW]
  app-store-optimizer/SKILL.md      [NEW]
  # Grow
  growth-hacker/SKILL.md            [NEW]
  content-marketer/SKILL.md         [NEW]
  seo-specialist/SKILL.md           [NEW]
  # Monetize
  monetization-strategist/SKILL.md  [NEW]
  paid-acquisition-specialist/SKILL.md [NEW]
  conversion-optimizer/SKILL.md     [NEW]
  # Retain
  retention-specialist/SKILL.md     [NEW]
  customer-success-manager/SKILL.md [NEW]
  # Scale
  data-analyst/SKILL.md             [NEW]
  cto-architect/SKILL.md            [NEW]
```

---

## Verification Plan

Each skill verified using the `writing-skills` TDD approach:
1. **RED** — run scenario without skill, document what AI misses
2. **GREEN** — add skill, verify AI applies correct domain instincts
3. **REFACTOR** — close rationalization loopholes

**Success criterion per skill:** When combined with `brainstorming`, AI proactively asks/flags issues specific to that role without being prompted.
