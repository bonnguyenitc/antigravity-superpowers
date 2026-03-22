---
description: Superpowers workflow rules - apply when building features, debugging, or planning any development task
alwaysApply: true
---

# Superpowers Skills Integration

This workspace uses the **Superpowers** skills library located in `superpowers/skills/`.
All skills are symlinked into `.agent/skills/` and are automatically available.

## Core Rule: Check Skills Before Acting

**Before any response or action**, check if a relevant skill applies. If there's even a 1% chance a skill applies, read it via `view_file` on its `SKILL.md` and follow it exactly.

## Available Skills

### Development Workflow

| Skill | When to Use |
|---|---|
| `brainstorming` | Before ANY creative work — adding features, building components, modifying behavior |
| `writing-plans` | After design is approved — break work into 2-5 min tasks |
| `executing-plans` | When running a plan in batches with human checkpoints |
| `subagent-driven-development` | When dispatching subagents per task with two-stage review |
| `test-driven-development` | During ALL implementation — RED → GREEN → REFACTOR |
| `systematic-debugging` | When debugging any issue |
| `verification-before-completion` | Before declaring any fix or task is done |
| `requesting-code-review` | Before submitting code for review |
| `receiving-code-review` | When responding to review feedback |
| `using-git-worktrees` | When starting work on a new isolated branch |
| `finishing-a-development-branch` | When tasks complete — merge / PR / discard |
| `dispatching-parallel-agents` | When running concurrent subagent workflows |
| `writing-skills` | When creating new skills |
| `using-superpowers` | When starting any conversation — find and use skills |

### Technical Roles

| Skill | When to Use |
|---|---|
| `frontend-developer` | Web UI, component architecture, React/Vue/Svelte/Vanilla. Has `react-rules/` (66 Vercel rules) and `vue-rules/` (44 antfu rules) |
| `backend-developer` | APIs, server-side logic, database schemas |
| `mobile-developer` | Mobile apps — React Native, Flutter, iOS, Android. Has `react-native-rules/` (38), `flutter-rules/` (8), `android-rules/` (17), `ios-rules/` (19) |
| `game-developer` | Mobile game features, architecture decisions |
| `game-design` | Game mechanics, core loops, progression, monetization |
| `cto-architect` | System design, tech debt, scaling, architecture |
| `saas-architect` | Multi-tenant SaaS architecture, tenant isolation |
| `devops-engineer` | CI/CD, infrastructure, deployment, monitoring |
| `security-engineer` | App security, auth, GDPR, security audits |

### Business & Growth

| Skill | When to Use |
|---|---|
| `product-manager` | Product requirements, feature prioritization, roadmap |
| `data-analyst` | Metrics, funnels, cohort analysis, A/B tests |
| `growth-hacker` | User acquisition, viral loops, activation funnels |
| `monetization-strategist` | Pricing, freemium, IAP, unit economics |
| `conversion-optimizer` | Landing pages, trial-to-paid, onboarding, CRO |
| `retention-specialist` | Onboarding flows, churn reduction, re-engagement |
| `customer-success-manager` | User support, feedback loops, NPS/CSAT |
| `app-store-optimizer` | ASO, keyword strategy, screenshots, ratings |
| `ux-designer` | UI design, wireframes, user research, IA |
| `copywriter` | Landing copy, app descriptions, email sequences |

### Marketing & Content

| Skill | When to Use |
|---|---|
| `content-marketer` | Content strategy, SEO content, social media |
| `seo-specialist` | Technical SEO, keywords, backlinks, organic search |
| `community-manager` | Discord, Reddit, Slack community management |
| `influencer-marketer` | UGC, creator partnerships, affiliate programs |
| `paid-acquisition-specialist` | Meta Ads, Google Ads, Apple Search Ads, ROAS |

### Infrastructure & Integration

| Skill | When to Use |
|---|---|
| `api-design` | REST/GraphQL APIs, versioning, rate limiting |
| `auth-and-identity` | Auth, SSO/SAML/OIDC, RBAC, session management |
| `subscription-billing` | Stripe, IAP, trials, dunning flows |
| `email-infrastructure` | Transactional email, SPF/DKIM/DMARC, deliverability |
| `real-time-features` | WebSockets, SSE, live collaboration, presence |
| `i18n-localization` | Internationalization, translations, localized ASO |


### Indie Hacker & Solopreneur

| Skill | When to Use |
|---|---|
| `idea-validator` | Validating problems, markets, and distribution channels before building |
| `market-researcher` | Finding a niche, sizing markets, customer interviews |
| `chrome-extension-developer` | Building browser extensions (MV3, activeTab, permissions) |
| `launch-strategist` | Product Hunt, Hacker News, Reddit launches, pre-launch |
| `landing-page-builder` | High converting page framework, SaaS landing pages |
| `pricing-psychologist` | Paywalls, pricing tiers, anchoring, LTV/CAC |
| `bootstrapper-finance` | MRR tracking, runway calculation, when to quit job |
| `solo-founder-ops` | Time allocation, ICE scoring, automation, burnout |
| `indie-legal` | Privacy policies, TOS, basic GDPR/CCPA compliance |
| `analytics-setup` | PostHog/Plausible setup, event taxonomy, core metrics |
| `ai-integrated-product` | LLM APIs, cost management, prompt engineering |
| `micro-saas-builder` | Building $1K-$10K MRR highly niched SaaS businesses |

## How to Read a Skill (Antigravity)

Use `view_file` on the skill's `SKILL.md`:
```
.agent/skills/<skill-name>/SKILL.md
```
Example: `.agent/skills/brainstorming/SKILL.md`

## Instruction Priority

1. **User's explicit instructions** — highest priority
2. **Superpowers skills** — override default behavior
3. **Default system behavior** — lowest priority

## Key Principles

- **YAGNI**: Don't build what isn't needed yet
- **TDD always**: Write failing tests first, then code
- **Systematic over ad-hoc**: Follow the skill process, don't guess
- **Evidence over claims**: Verify before declaring success

