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
antigravity-superpowers/
├── .agent/
│   ├── rules/
│   │   └── superpowers.md          # Always-on rule: agent checks skills before acting
│   ├── skills/                     # 44 skills (patched from upstream)
│   │   ├── brainstorming/
│   │   ├── writing-plans/
│   │   ├── executing-plans/
│   │   ├── backend-developer/
│   │   ├── frontend-developer/
│   │   ├── mobile-developer/
│   │   ├── growth-hacker/
│   │   ├── monetization-strategist/
│   │   └── ...                     # + 36 more skills
│   ├── workflows/
│   │   ├── brainstorm.md           # /brainstorm
│   │   ├── write-plan.md           # /write-plan
│   │   ├── execute-plan.md         # /execute-plan
│   │   ├── code-review.md          # /code-review
│   │   ├── debug.md                # /debug
│   │   ├── publish.md              # /publish
│   │   └── update-superpowers.md   # /update-superpowers
│   ├── patches/
│   │   └── skills-patches.md       # AI-driven skill patches (see below)
│   └── .shared/
│       └── update-superpowers.sh   # Shell script for version management
├── bin/
│   └── init.js                     # npx entry point
├── scripts/
│   └── build-template.js           # Builds publishable template from .agent/
├── template/                       # Pre-built .agent/ for npm distribution
└── superpowers/                    # Upstream source (git-managed)
    └── skills/                     # Original skill SKILL.md files
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

| Workflow              | What happens                                                 |
| --------------------- | ------------------------------------------------------------ |
| `/debug`              | Systematic 4-phase debugging process                         |
| `/publish`            | Publish to npm with version bump, git tag, and push          |
| `/update-superpowers` | Pull latest upstream release, re-sync skills, AI-rewrite rules |

---

## AI-Driven Skill Patching

Skills are sourced from upstream Superpowers but automatically patched to be Antigravity-native. The patching system uses a human-readable spec at `.agent/patches/skills-patches.md` which the AI interprets semantically — making patches resilient to upstream changes.

When you run `/update-superpowers`, skills are:
1. Copied fresh from `superpowers/skills/`
2. Patched via AI to remove non-Antigravity references
3. Ready to use immediately

---

## Skills Reference

| Skill | Triggers automatically when... |
| ----- | ------------------------------ |
| `api-design` | Designing REST or GraphQL APIs, versioning, rate limiting, pagination, or API docs |
| `app-store-optimizer` | Working on App Store / Google Play listing optimization, keyword strategy, or A/B testing |
| `auth-and-identity` | Implementing authentication, authorization, SSO/SAML/OIDC, session management, or RBAC |
| `backend-developer` | Designing APIs, server-side logic, database schemas, or reviewing backend code |
| `brainstorming` | Adding a feature, building a component, or modifying behavior |
| `community-manager` | Building and managing communities on Discord, Reddit, Slack, or social platforms |
| `content-marketer` | Planning content strategy, SEO content, social media, or email newsletters |
| `conversion-optimizer` | Optimizing landing pages, trial-to-paid funnels, paywall design, or onboarding flows |
| `copywriter` | Writing landing page copy, app store descriptions, email sequences, or user-facing text |
| `cto-architect` | Making system design decisions, managing tech debt, planning for scale |
| `customer-success-manager` | Managing user support, feedback loops, NPS/CSAT tracking, or handling churn |
| `data-analyst` | Setting up metrics, analyzing funnels, cohort analysis, dashboards, or A/B test results |
| `devops-engineer` | Working on CI/CD pipelines, infrastructure, deployment, monitoring, or reliability |
| `dispatching-parallel-agents` | Facing 2+ independent tasks that can run without shared state |
| `email-infrastructure` | Setting up transactional email, deliverability, SPF/DKIM/DMARC, or email templates |
| `executing-plans` | Running a plan step-by-step with checkpoints |
| `finishing-a-development-branch` | Implementation is complete and you need to merge / PR / discard |
| `frontend-developer` | Building web UI, component architecture, or reviewing frontend code |
| `game-design` | Designing game mechanics, core loops, progression, monetization, or difficulty curves |
| `game-developer` | Working on game app features, reviewing game code, or game architecture decisions |
| `growth-hacker` | Planning user acquisition, viral loops, activation funnels, or growth experiments |
| `i18n-localization` | Planning i18n architecture, localizing for new markets, or managing translations |
| `influencer-marketer` | Planning UGC campaigns, creator partnerships, TikTok/YouTube/Instagram marketing |
| `mobile-developer` | Working on mobile app features, reviewing mobile code, or mobile architecture |
| `monetization-strategist` | Designing pricing models, freemium strategy, IAP, or modeling unit economics |
| `paid-acquisition-specialist` | Running Meta Ads, Google Ads, Apple Search Ads, or any paid acquisition channel |
| `product-manager` | Defining requirements, prioritizing features, planning roadmaps, or validating problems |
| `real-time-features` | Implementing WebSockets, SSE, live collaboration, or real-time notifications |
| `receiving-code-review` | Receiving code review feedback, before implementing suggestions |
| `requesting-code-review` | Completing tasks or before merging to verify work meets requirements |
| `retention-specialist` | Improving user retention, reducing churn, analyzing engagement, or re-engagement |
| `saas-architect` | Designing multi-tenant SaaS architecture, tenant isolation, or data models |
| `security-engineer` | Reviewing app security, handling user data, ensuring GDPR/App Store compliance |
| `seo-specialist` | Working on technical SEO, keyword research, on-page optimization, or backlink strategy |
| `subagent-driven-development` | Executing implementation plans with independent tasks in the current session |
| `subscription-billing` | Integrating subscription billing, Stripe webhooks, trial logic, or dunning flows |
| `systematic-debugging` | Debugging any issue |
| `test-driven-development` | Implementing any feature or bugfix |
| `using-git-worktrees` | Starting work on an isolated branch |
| `using-superpowers` | Starting any conversation — checks for relevant skills |
| `ux-designer` | Designing UI, wireframes, user research, or information architecture |
| `verification-before-completion` | Before declaring a fix or task done |
| `writing-plans` | Design is approved — breaking work into tasks |
| `writing-skills` | Creating or editing a skill |

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

| Setting | Default | Description |
|---|---|---|
| `auto_commit` | `true` | AI auto-commits after tasks and design docs. Set to `false` to skip all commits. |

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

- **[Superpowers](https://github.com/obra/superpowers)** by [Jesse Vincent](https://blog.fsck.com) & [Prime Radiant](https://primeradiant.com) — the upstream skills library this repo is built on.
- Antigravity integration & workflow adaptation by [@bonnguyenitc](https://github.com/bonnguyenitc).

---

## License

MIT — see [LICENSE](./LICENSE) for details.
