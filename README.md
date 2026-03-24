# antigravity-superpowers

[![npm version](https://img.shields.io/npm/v/agy-superpowers.svg)](https://www.npmjs.com/package/agy-superpowers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Superpowers for [Google Antigravity](https://antigravity.google)** — a complete development workflow powered by composable skills, workflows, and rules.

This repo ports the [Superpowers](https://github.com/obra/superpowers) skills library to work natively with **Google Antigravity agent**, with Antigravity-compatible path conventions, an auto-update workflow, and curated workflow files translated from the upstream skills.

---

## Quick Start

### Option 1 — npx (recommended, no install needed)

Inside any project directory:

```bash
npx agy-superpowers@latest init
```

This scaffolds `.agent/` with all Superpowers skills, workflows, and rules.
Open the project with **Google Antigravity** — Superpowers activates automatically.

To overwrite an existing `.agent/`:

```bash
npx agy-superpowers@latest init --force
```

### Option 2 — Global install

```bash
npm install -g agy-superpowers
agy-superpowers init
```

---

## What's Inside

```
.agent/
├── rules/
│   └── superpowers.md          # Always-on rule: agent checks skills before acting
├── skills/                     # 58 skills (14 upstream + 44 expansion skills)
│   ├── brainstorming/
│   ├── writing-plans/
│   ├── executing-plans/
│   ├── backend-developer/
│   ├── frontend-developer/
│   ├── mobile-developer/
│   ├── growth-hacker/
│   ├── monetization-strategist/
│   └── ...                     # + 48 more skills
├── workflows/
│   ├── brainstorm.md           # /brainstorm
│   ├── write-plan.md           # /write-plan
│   ├── execute-plan.md         # /execute-plan
│   ├── code-review.md          # /code-review
│   ├── debug.md                # /debug
│   ├── publish.md              # /publish
│   └── update-superpowers.md   # /update-superpowers
├── patches/
│   └── skills-patches.md       # AI-driven skill patches (see below)
└── .shared/
    └── update-superpowers.sh   # Shell script for version management
```

---

## How It Works

**Antigravity automatically reads skills before every response.** You don't need to invoke them manually — the `superpowers.md` rule (set to `alwaysApply: true`) instructs the agent to check for a relevant skill before acting.

### The Core Development Loop

```
💡 Idea → /brainstorm → /write-plan → /execute-plan → /code-review → merge
```

| Step | Workflow        | What happens                                                   |
| ---- | --------------- | -------------------------------------------------------------- |
| 1    | `/brainstorm`   | Agent asks clarifying questions, refines your idea into a spec |
| 2    | `/write-plan`   | Spec → bite-sized tasks (2–5 min each) with exact file paths   |
| 3    | `/execute-plan` | Tasks run in batches with human checkpoints                    |
| 4    | `/code-review`  | Pre-review checklist, severity-based issue reporting           |
| 5    | _(auto)_        | `finishing-a-development-branch` — merge / PR / discard        |

### Additional Workflows

| Workflow               | What happens                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `/debug`               | Systematic 4-phase debugging process                           |
| `/publish`             | Publish to npm with version bump, git tag, and push            |
| `/update-superpowers`  | Pull latest upstream release, re-sync skills, AI-rewrite rules |
| `/ui-ux-pro-max`       | Plan and implement UI with curated design intelligence         |
| `/mobile-uiux-promax`  | Plan and implement mobile app UI across all major platforms    |

---

## Usage Guide

### Getting Started in 5 Minutes

**How it works:** Superpowers gives your agent 58 specialized skills. You don't need to remember or invoke them — the agent **automatically reads and selects the right skill** based on what you ask. Just describe what you need in natural language.

#### Your First Feature: A Walkthrough

Let's say you want to add dark mode to your React app. Here's what the full cycle looks like:

| Step | You type                                    | What happens                                                                       |
| ---- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1    | `/brainstorm add dark mode to my React app` | Agent asks clarifying questions, explores approaches, and produces a design spec   |
| 2    | `/write-plan`                               | Spec gets converted into a task list with exact file paths and acceptance criteria |
| 3    | `/execute-plan`                             | Agent implements tasks one by one, pausing for your review at checkpoints          |
| 4    | `/code-review`                              | Agent reviews the completed code against the plan, reports issues by severity      |
| 5    | _(automatic)_                               | Agent offers to merge, create a PR, or discard the branch                          |

That's it. Five steps from idea to merge-ready code.

#### Quick Reference: The 5 Commands You'll Use Most

| Command         | What it does                                   | Example                                |
| --------------- | ---------------------------------------------- | -------------------------------------- |
| `/brainstorm`   | Turn a rough idea into a validated design spec | `/brainstorm add user onboarding flow` |
| `/write-plan`   | Break an approved spec into bite-sized tasks   | `/write-plan` (after brainstorm)       |
| `/execute-plan` | Execute tasks with human review checkpoints    | `/execute-plan` (after write-plan)     |
| `/code-review`  | Review completed work before merging           | `/code-review`                         |
| `/debug`        | Systematic 4-phase debugging for any issue     | `/debug users can't log in on Safari`  |

---

### Beyond Code — Skills That Work For You

The agent doesn't just write code — it has specialized knowledge in marketing, pricing, security, legal, and more. When you mention a topic, the relevant skill activates automatically.

#### 🔧 Development Workflow

These are triggered via slash commands or activate automatically during the dev loop:

| Skill                            | When it activates                                             |
| -------------------------------- | ------------------------------------------------------------- |
| `brainstorming`                  | Adding a feature, building a component, or modifying behavior |
| `writing-plans`                  | Design is approved — breaking work into tasks                 |
| `executing-plans`                | Running a plan step-by-step with checkpoints                  |
| `test-driven-development`        | Implementing any feature or bugfix                            |
| `systematic-debugging`           | Debugging any issue                                           |
| `verification-before-completion` | Before declaring a fix or task done                           |
| `requesting-code-review`         | Completing tasks or before merging                            |
| `receiving-code-review`          | Receiving code review feedback                                |
| `finishing-a-development-branch` | Implementation is complete — merge / PR / discard             |
| `using-git-worktrees`            | Starting work on an isolated branch                           |
| `dispatching-parallel-agents`    | 2+ independent tasks that can run in parallel                 |
| `subagent-driven-development`    | Executing plan tasks in the current session                   |

#### 💻 Technical Skills

Activate when you work on specific technical domains:

| Skill                        | When it activates                                            |
| ---------------------------- | ------------------------------------------------------------ |
| `backend-developer`          | Designing APIs, server-side logic, database schemas          |
| `frontend-developer`         | Building web UI, component architecture                      |
| `mobile-developer`           | Mobile app features, React Native / Flutter / iOS / Android  |
| `game-developer`             | Game app features, game code, game architecture              |
| `api-design`                 | REST or GraphQL APIs, versioning, rate limiting, pagination  |
| `real-time-features`         | WebSockets, SSE, live collaboration, real-time notifications |
| `auth-and-identity`          | Authentication, authorization, SSO, RBAC                     |
| `devops-engineer`            | CI/CD, infrastructure, deployment, monitoring                |
| `security-engineer`          | App security, user data handling, GDPR/App Store compliance  |
| `email-infrastructure`       | Transactional email, deliverability, SPF/DKIM/DMARC          |
| `saas-architect`             | Multi-tenant SaaS architecture, tenant isolation             |
| `chrome-extension-developer` | Chrome extensions, browser-based tools                       |

> **Example prompt:** _"Design a REST API for user management with rate limiting and pagination"_ → activates `api-design` + `backend-developer`

#### 🎨 Product & Design

| Skill               | When it activates                                                 |
| ------------------- | ----------------------------------------------------------------- |
| `product-manager`   | Defining requirements, prioritizing features, planning roadmaps   |
| `ux-designer`       | Designing UI, wireframes, user research, information architecture |
| `cto-architect`     | System design decisions, tech debt, planning for scale            |
| `i18n-localization` | Internationalization, localizing for new markets                  |
| `game-design`       | Game mechanics, core loops, progression, difficulty curves        |

> **Example prompt:** _"Help me prioritize features for the next sprint based on user feedback"_ → activates `product-manager`

#### 📈 Marketing & Growth

| Skill                         | When it activates                                              |
| ----------------------------- | -------------------------------------------------------------- |
| `growth-hacker`               | User acquisition, viral loops, activation funnels              |
| `content-marketer`            | Content strategy, SEO content, social media, newsletters       |
| `seo-specialist`              | Technical SEO, keyword research, on-page optimization          |
| `conversion-optimizer`        | Landing pages, trial-to-paid funnels, paywall design           |
| `copywriter`                  | Landing page copy, app store descriptions, email sequences     |
| `community-manager`           | Discord, Reddit, Slack communities, engagement strategy        |
| `influencer-marketer`         | UGC campaigns, creator partnerships, TikTok/YouTube marketing  |
| `paid-acquisition-specialist` | Meta Ads, Google Ads, Apple Search Ads, ROAS optimization      |
| `launch-strategist`           | Product launch, go-to-market, pre-launch campaigns             |
| `landing-page-builder`        | Landing pages, waitlist pages, marketing sites                 |
| `app-store-optimizer`         | App Store / Google Play listing optimization, keyword strategy |

> **Example prompt:** _"Write an ASO-optimized App Store description for my meditation app"_ → activates `app-store-optimizer` + `copywriter`

#### 💰 Revenue & Operations

| Skill                      | When it activates                                                  |
| -------------------------- | ------------------------------------------------------------------ |
| `monetization-strategist`  | Pricing models, freemium strategy, IAP, unit economics             |
| `pricing-psychologist`     | Pricing, paywalls, free-to-paid conversion                         |
| `subscription-billing`     | Stripe integration, webhooks, trial logic, dunning flows           |
| `bootstrapper-finance`     | MRR tracking, runway calculation, financial decisions              |
| `solo-founder-ops`         | Time management, feature prioritization, running multiple products |
| `analytics-setup`          | Analytics, tracking tools, metrics dashboards                      |
| `customer-success-manager` | User support, feedback loops, NPS/CSAT, churn                      |
| `data-analyst`             | Metrics frameworks, funnel analysis, cohort analysis, A/B tests    |
| `indie-legal`              | Privacy policies, terms of service, GDPR/CCPA                      |

> **Example prompt:** _"Should I charge $9/mo or $29/mo for my SaaS? Here's my target audience..."_ → activates `pricing-psychologist` + `monetization-strategist`

#### 🚀 Validate & Scale

| Skill                   | When it activates                                               |
| ----------------------- | --------------------------------------------------------------- |
| `idea-validator`        | Evaluating a product idea, assessing market fit before building |
| `market-researcher`     | Finding a niche, analyzing market size, customer discovery      |
| `ai-integrated-product` | Integrating AI/LLM capabilities, building AI-powered features   |
| `micro-saas-builder`    | Building a micro-SaaS, choosing a niche SaaS idea               |

> **Example prompt:** _"I have an idea for an AI writing tool — is it worth building?"_ → activates `idea-validator` + `market-researcher`

---

### Power User Tips

#### When to `/brainstorm` vs Just Ask

| Situation                                               | What to do                                         |
| ------------------------------------------------------- | -------------------------------------------------- |
| Multi-file feature, new component, architectural change | `/brainstorm` → full design cycle                  |
| Quick fix, rename, typo, single-line change             | Just ask directly                                  |
| Knowledge question ("What's the best auth library?")    | Just ask directly                                  |
| Not sure about scope                                    | Start with `/brainstorm` — it's safe to exit early |

**Rule of thumb:** if it touches more than one file or involves design tradeoffs → `/brainstorm`.

#### How to Write Better Prompts

- **Provide context** — mention your tech stack, project name, and constraints: _"In my Next.js app with Supabase auth..."_
- **State goals, not solutions** — _"Users drop off during signup"_ gives the agent room to find the best fix, vs _"Add a progress bar to the signup form"_
- **Mention specific domains** to activate the right skills — _"Review the **security** of my auth flow"_ triggers `security-engineer`, _"Optimize the **SEO** for my landing page"_ triggers `seo-specialist`

#### Combining Workflows for Complex Projects

**Full product launch cycle:**

```
/brainstorm → /write-plan → /execute-plan → /code-review
    ↓ then in separate conversations:
    "Write marketing copy for..." → copywriter skill
    "Optimize my App Store listing..." → ASO skill
    "Design a pricing strategy..." → pricing skill
```

**Idea → Validation → Build:**

```
"I have an idea for X, is it viable?" → idea-validator
"Research the market for X" → market-researcher
/brainstorm → /write-plan → /execute-plan → build it
```

**Debugging effectively:**

```
/debug → systematic investigation
    ↓ if architectural issue found:
/brainstorm → redesign the component
```

#### Configuration

Per-project settings (like `auto_commit`) live in `.agent/config.yml` — see [Configuration](#configuration-1) for details.

#### Common Pitfalls

| ❌ Don't                                           | ✅ Do instead                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| Skip `/brainstorm` for large features              | Always brainstorm features that touch multiple files              |
| Cram multiple goals into one prompt                | One conversation = one clear objective                            |
| Jump to `/execute-plan` without reviewing the spec | Review and approve the design spec before execution               |
| Skip `/code-review` before merging                 | Always review before merge — catch bugs early                     |
| Assume the agent only writes code                  | Ask about pricing, marketing, legal — it has skills for those too |

---

## AI-Driven Skill Patching

Skills are sourced from upstream Superpowers but automatically patched to be Antigravity-native. The patching system uses a human-readable spec at `.agent/patches/skills-patches.md` which the AI interprets semantically — making patches resilient to upstream changes.

When you run `/update-superpowers`, skills are:

1. Copied fresh from `superpowers/skills/`
2. Patched via AI to remove non-Antigravity references
3. Ready to use immediately

---

## Skills Reference

| Skill                            | Triggers automatically when...                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `ai-integrated-product`          | Integrating AI/LLM capabilities into a product, building AI-powered features                                |
| `analytics-setup`                | Setting up analytics, choosing tracking tools, or designing a metrics dashboard for an indie product        |
| `api-design`                     | Designing REST or GraphQL APIs, versioning, rate limiting, pagination, or API docs                          |
| `app-store-optimizer`            | Working on App Store / Google Play listing optimization, keyword strategy, or A/B testing                   |
| `auth-and-identity`              | Implementing authentication, authorization, SSO/SAML/OIDC, session management, or RBAC                      |
| `backend-developer`              | Designing APIs, server-side logic, database schemas, or reviewing backend code                              |
| `bootstrapper-finance`           | Tracking MRR, calculating runway, making financial decisions for a solo/bootstrapped business               |
| `brainstorming`                  | Adding a feature, building a component, or modifying behavior                                               |
| `chrome-extension-developer`     | Building a Chrome extension, browser extension, or browser-based tool                                       |
| `community-manager`              | Building and managing communities on Discord, Reddit, Slack, or social platforms                            |
| `content-marketer`               | Planning content strategy, SEO content, social media, or email newsletters                                  |
| `conversion-optimizer`           | Optimizing landing pages, trial-to-paid funnels, paywall design, or onboarding flows                        |
| `copywriter`                     | Writing landing page copy, app store descriptions, email sequences, or user-facing text                     |
| `cto-architect`                  | Making system design decisions, managing tech debt, planning for scale                                      |
| `customer-success-manager`       | Managing user support, feedback loops, NPS/CSAT tracking, or handling churn                                 |
| `data-analyst`                   | Setting up metrics, analyzing funnels, cohort analysis, dashboards, or A/B test results                     |
| `devops-engineer`                | Working on CI/CD pipelines, infrastructure, deployment, monitoring, or reliability                          |
| `dispatching-parallel-agents`    | Facing 2+ independent tasks that can run without shared state                                               |
| `email-infrastructure`           | Setting up transactional email, deliverability, SPF/DKIM/DMARC, or email templates                          |
| `executing-plans`                | Running a plan step-by-step with checkpoints                                                                |
| `finishing-a-development-branch` | Implementation is complete and you need to merge / PR / discard                                             |
| `frontend-design`                | Building web components, pages, or apps with high design quality — avoids generic AI aesthetics             |
| `frontend-developer`             | Building web UI, component architecture, or reviewing frontend code                                         |
| `game-design`                    | Designing game mechanics, core loops, progression, monetization, or difficulty curves                       |
| `game-developer`                 | Working on game app features, reviewing game code, or game architecture decisions                           |
| `growth-hacker`                  | Planning user acquisition, viral loops, activation funnels, or growth experiments                           |
| `i18n-localization`              | Planning i18n architecture, localizing for new markets, or managing translations                            |
| `idea-validator`                 | Starting a new project, evaluating a product idea, or assessing market fit before building                  |
| `indie-legal`                    | Creating privacy policies, terms of service, handling GDPR/CCPA basics, or understanding legal requirements |
| `influencer-marketer`            | Planning UGC campaigns, creator partnerships, TikTok/YouTube/Instagram marketing                            |
| `landing-page-builder`           | Creating a landing page, waitlist page, product page, or marketing site                                     |
| `launch-strategist`              | Preparing to launch a product, planning go-to-market, or running a pre-launch campaign                      |
| `market-researcher`              | Finding a niche, analyzing market size, researching customer segments, or doing customer discovery          |
| `micro-saas-builder`             | Building a micro-SaaS product, choosing a niche SaaS idea, or designing a small scalable SaaS               |
| `mobile-developer`               | Working on mobile app features, reviewing mobile code, or mobile architecture                               |
| `mobile-uiux-promax`            | Designing or building mobile app UI for iOS, Android, React Native, Flutter, SwiftUI, or Compose           |
| `monetization-strategist`        | Designing pricing models, freemium strategy, IAP, or modeling unit economics                                |
| `paid-acquisition-specialist`    | Running Meta Ads, Google Ads, Apple Search Ads, or any paid acquisition channel                             |
| `pricing-psychologist`           | Designing pricing, paywalls, free-to-paid conversion, or optimizing upgrade flows                           |
| `product-manager`                | Defining requirements, prioritizing features, planning roadmaps, or validating problems                     |
| `real-time-features`             | Implementing WebSockets, SSE, live collaboration, or real-time notifications                                |
| `receiving-code-review`          | Receiving code review feedback, before implementing suggestions                                             |
| `requesting-code-review`         | Completing tasks or before merging to verify work meets requirements                                        |
| `retention-specialist`           | Improving user retention, reducing churn, analyzing engagement, or re-engagement                            |
| `saas-architect`                 | Designing multi-tenant SaaS architecture, tenant isolation, or data models                                  |
| `security-engineer`              | Reviewing app security, handling user data, ensuring GDPR/App Store compliance                              |
| `seo-specialist`                 | Working on technical SEO, keyword research, on-page optimization, or backlink strategy                      |
| `solo-founder-ops`               | Managing time, prioritizing features, or running multiple products as a solo founder                        |
| `subagent-driven-development`    | Executing implementation plans with independent tasks in the current session                                |
| `subscription-billing`           | Integrating subscription billing, Stripe webhooks, trial logic, or dunning flows                            |
| `systematic-debugging`           | Debugging any issue                                                                                         |
| `test-driven-development`        | Implementing any feature or bugfix                                                                          |
| `using-git-worktrees`            | Starting work on an isolated branch                                                                         |
| `using-superpowers`              | Starting any conversation — checks for relevant skills                                                      |
| `ux-designer`                    | Designing UI, wireframes, user research, or information architecture                                        |
| `verification-before-completion` | Before declaring a fix or task done                                                                         |
| `writing-plans`                  | Design is approved — breaking work into tasks                                                               |
| `writing-skills`                 | Creating or editing a skill                                                                                 |

---

### The Indie Hacker Journey

44 expansion skills cover the full indie hacker lifecycle — from first idea to sustainable business:

- **Validate:** `idea-validator`, `market-researcher`
- **Design:** `product-manager`, `ux-designer`, `cto-architect`
- **Build:** `backend-developer`, `frontend-developer`, `frontend-design`, `mobile-developer`, `mobile-uiux-promax`, `game-developer`, `game-design`, `chrome-extension-developer`, `api-design`, `real-time-features`, `auth-and-identity`, `email-infrastructure`, `saas-architect`, `devops-engineer`, `security-engineer`, `i18n-localization`, `ai-integrated-product`, `micro-saas-builder`
- **Launch:** `launch-strategist`, `landing-page-builder`, `app-store-optimizer`, `copywriter`
- **Grow:** `growth-hacker`, `content-marketer`, `seo-specialist`, `conversion-optimizer`, `community-manager`, `influencer-marketer`, `paid-acquisition-specialist`, `retention-specialist`
- **Revenue:** `monetization-strategist`, `pricing-psychologist`, `subscription-billing`, `bootstrapper-finance`
- **Operate:** `solo-founder-ops`, `analytics-setup`, `customer-success-manager`, `data-analyst`, `indie-legal`

---

## Keeping Up to Date

Upstream Superpowers releases are tracked automatically. To update:

```
/update-superpowers
```

This workflow will:

1. Pull the latest Superpowers release from GitHub
2. Copy fresh skills from upstream
3. AI-rewrite any changed workflows and rules to stay Antigravity-compatible
4. Apply skill patches via `.agent/patches/skills-patches.md`
5. Commit all changes with a versioned commit message

---

## Configuration

Per-project settings live in `.agent/config.yml`. Create or edit this file in your project's `.agent/` folder:

```yaml
# .agent/config.yml

# auto_commit: true | false
# When true (default), Superpowers skills automatically commit after completing
# tasks and writing design docs.
# When false, all git commits and staging are skipped — files are left as
# modified for you to commit manually.
auto_commit: true
```

| Setting       | Default | Description                                                                      |
| ------------- | ------- | -------------------------------------------------------------------------------- |
| `auto_commit` | `true`  | AI auto-commits after tasks and design docs. Set to `false` to skip all commits. |

This file is preserved across `/update-superpowers` runs.

---

## Installation

### Using This Repo in Your Project

The recommended way is `npx` (see Quick Start above). Alternatively, clone and copy:

```bash
git clone https://github.com/bonnguyenitc/antigravity-superpowers
cp -r antigravity-superpowers/.agent /your/project/
```

---

## Philosophy

This setup enforces four core principles across every task:

- **Test-Driven Development** — Write the failing test first, always
- **YAGNI** — Don't build what isn't needed yet
- **Systematic over ad-hoc** — Follow the skill process, don't guess
- **Evidence over claims** — Verify before declaring success

---

## Credits

This project stands on the shoulders of many great open-source projects. A huge thank you to all of them! 🙏

### 🏗️ Skill Sources

Content from these repos was ported, adapted, and integrated into the skills library:

| Repository                                                                                                    | Author                                                                             | Skills                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [obra/superpowers](https://github.com/obra/superpowers)                                                       | [Jesse Vincent](https://blog.fsck.com) & [Prime Radiant](https://primeradiant.com) | **Core foundation** — upstream skills library this repo is built on                                                     |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)                                       | Vercel Labs                                                                        | 66 React/Next.js rules + 36 React Native rules (in `frontend-developer` + `mobile-developer`)                           |
| [antfu/skills](https://github.com/antfu/skills)                                                               | [Anthony Fu](https://github.com/antfu)                                             | 44 Vue/Nuxt rules (in `frontend-developer`)                                                                             |
| [vuejs-ai/skills](https://github.com/vuejs-ai/skills)                                                         | vuejs-ai                                                                           | Vue ecosystem agent skill rules (upstream of antfu/skills)                                                              |
| [kevmoo/dash_skills](https://github.com/kevmoo/dash_skills)                                                   | [Kevin Moore](https://github.com/kevmoo)                                           | 8 Dart & Flutter best-practice rules (in `mobile-developer`)                                                            |
| [new-silvermoon/awesome-android-agent-skills](https://github.com/new-silvermoon/awesome-android-agent-skills) | new-silvermoon                                                                     | 17 Android/Compose/Kotlin rules (in `mobile-developer`)                                                                 |
| [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill)                                   | [Antoine van der Lee](https://github.com/AvdLee)                                   | 19 SwiftUI reference files (in `mobile-developer`)                                                                      |
| [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)                                   | msitarzewski                                                                       | Deliverable-focused, workflow-oriented agent patterns (inspired indie hacker skills)                                    |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)               | nextlevelbuilder                                                                   | UI/UX Pro Max search databases — curated style, typography, color, UX, and stack knowledge (in `.shared/ui-ux-pro-max`) |

---

Antigravity integration, workflow adaptation & 44 expansion skills (UI/UX intelligence databases, mobile design system) by [@bonnguyenitc](https://github.com/bonnguyenitc).

---

## License

MIT — see [LICENSE](./LICENSE) for details.
