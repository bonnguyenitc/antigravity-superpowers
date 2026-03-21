---
name: game-design
description: Use when designing game mechanics, core loops, progression systems, monetization for games, difficulty curves, tutorial design, or player psychology
---

# Game Design Lens

> **Philosophy:** Game design is the art of making decisions fun. Every system should answer: "Is this engaging?"
> The best games feel instantly playable and endlessly deep.

---

## Core Instincts

- **Core loop first** — if the core action isn't fun by itself, no meta-game will save it
- **Feel before balance** — a perfectly balanced but bad-feeling game fails; great feel forgives imbalance
- **Teach through play** — tutorials are a design failure if players need to read them
- **Intrinsic over extrinsic motivation** — players who play for rewards quit when rewards stop
- **Every system must serve the fantasy** — if a mechanic doesn't reinforce the core fantasy, cut it

---

## Game Loop Hierarchy

```
Core Loop (seconds):   The primary action (shoot, match, tap, build)
Meta Loop (minutes):   Progression within a session (upgrade, complete level)
Outer Loop (days):     Long-term progression (unlock, prestige, story)

Addiction comes from nested loops where each satisfies before feeding into the next.

Example: Clash Royale
  Core:  Battle (3 min)
  Meta:  Earn chest, open chest, get cards
  Outer: Climb trophies, unlock arenas, seasonal ladder
```

---

## Player Motivation (Bartle Types)

| Type | Motivation | Engage with |
|------|-----------|-------------|
| **Achiever** | Goals, completion, rewards | Achievements, leaderboards, progress bars |
| **Explorer** | Discovery, secrets, lore | Hidden content, procedural worlds, narrative |
| **Socializer** | Connection, competition, cooperation | Guilds, co-op, chat, gifting |
| **Killer** | Competition, dominance | PvP, rankings, bragging rights |

**Indie hacker tip:** Mobile casual games are mostly Achievers. Design clear goals and visible progress.

---

## Difficulty Curve Design

```
Flow State (Csikszentmihalyi):
  Too hard → frustration → quit
  Too easy → boredom → quit
  Balanced → flow → engagement

Difficulty progression rule:
  Introduce mechanic (easy) → test mechanic (medium) → combine mechanics (hard)
  Never introduce two new mechanics simultaneously

Rubber-band difficulty:
  Dynamic difficulty adjustment (DDA): losing players get slight boost
  Winning players face slight increase
  Keeps sessions competitive without feeling rigged
```

---

## Monetization Design for Games

| Model | Player experience | Retention impact | Revenue potential |
|-------|------------------|-----------------|------------------|
| **Premium** (one-time) | ✅ No friction | ✅ High | 🔴 Capped |
| **IAP — cosmetics only** | ✅ No frustration | ✅ Good | 🟡 Medium |
| **IAP — progression** | ⚠️ Pay-to-win risk | ⚠️ Can harm f2p | 🟡 Medium |
| **Rewarded ads** | ✅ Player-initiated | ✅ Good if not forced | 🟡 Medium |
| **Battle pass** | ✅ FOMO + value | ✅ High (retention driver) | 🟢 High |
| **Subscriptions** | ✅ Predictable | ✅ Good | 🟢 High |
| **Gacha / loot boxes** | ⚠️ Controversy | ⚠️ Can be predatory | 🟢 High |

**Indie hacker safe defaults:** Rewarded ads + battle pass + cosmetic IAP.
**Avoid:** Pay-to-win IAP — destroys community trust and long-term retention.

---

## Onboarding / Tutorial Design Rules

```
Rule 1: Show, don't tell — demonstrate mechanics, don't explain them
Rule 2: Force the action — don't ask "do you want a tutorial?"; just do it
Rule 3: Reward immediately — first tutorial action must give satisfying feedback
Rule 4: FTUE (First-Time User Experience) must complete in < 3 minutes
Rule 5: Every tutorial step has exactly ONE objective
Rule 6: Remove all failure states during tutorial — frustration at minute 1 = uninstall
Rule 7: No text walls — max 2 lines of instruction; ideally zero
```

---

## Game Balance Framework

```
Dominant strategy = game is solved → players get bored
No viable strategy = game is frustrating → players quit

Balanced game: multiple viable strategies, each with clear strengths and weaknesses

Rock-Paper-Scissors model:
  A beats B, B beats C, C beats A
  No single dominant option; strategy matters

Formulas:
  DPS = Damage / Attack Speed
  TTK (Time to Kill) = Target HP / DPS
  Win rate = (Wins) / (Wins + Losses) — target ~50% ± 5% for PvP balance
```

---

## Game Metrics (KPIs)

| Metric | Definition | Target |
|--------|-----------|--------|
| D1 Retention | % players returning on day 1 | > 35% |
| D7 Retention | % players returning on day 7 | > 15% |
| D28 Retention | % players returning on day 28 | > 7% |
| Session length | Average time per session | 5–15 min (casual), 20–60 min (core) |
| Sessions per DAU | Average sessions per daily user | > 2 |
| ARPDAU | Revenue per daily active user | Varies; $0.05–$0.20 mobile casual |
| IPM (Installs per Mille) | Ad creative installs / 1K impressions | > 3 for performance |
| Day 0 tutorial completion | % who finish tutorial | > 70% |

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Skip the core loop to build meta first | Meta can't save a bad core loop | Fun core loop in < 2 weeks prototype |
| Pay-to-win IAP | Destroys PvP balance, harms f2p players | Cosmetics, convenience (not power) |
| Energy/timer gates early in FTUE | Players quit before experiencing value | First gate after player is hooked (> D3) |
| Tutorial that can be failed | Guaranteed failure = guaranteed uninstall | Guided, railroaded tutorial with no lose state |
| Random difficulty spikes | Perceived unfairness = rage quit | Smooth curve with intentional "boss" moments |
| Introducing 2 mechanics at once | Cognitive overload | One mechanic per level/screen |
| Rewarded ads forced (not voluntary) | Players hate interruption | Rewarded only — player initiates |

---

## Questions You Always Ask

**When designing a new mechanic:**
- Is this fun by itself? (Test with just the mechanic, no rewards)
- Does it reinforce the core fantasy of the game?
- How does a new player encounter this for the first time?

**When reviewing a level/system:**
- Does the difficulty curve make sense? No sudden spikes?
- What's the win rate data? (If PvP or competitive)
- What's the tutorial completion rate for this flow?

---

## Red Flags

**Must fix:**
- [ ] Tutorial can be failed or skipped with no guidance
- [ ] First session longer than 5 minutes before first reward
- [ ] Pay-to-win mechanics that affect PvP balance
- [ ] No distinct core loop (what does the player DO every 30 seconds?)

**Should fix:**
- [ ] No audio/haptic feedback on primary action
- [ ] Difficulty spikes without escalation curve
- [ ] Monetization gating content needed to progress (not convenience)

---

## Who to Pair With
- `game-developer` — for technical implementation of mechanics
- `mobile-developer` — for mobile UX and platform guidelines
- `monetization-strategist` — for IAP pricing and revenue modeling
- `retention-specialist` — for D1/D7/D28 funnel analysis

---

## Reference Frameworks
- **MDA Framework** (Mechanics → Dynamics → Aesthetics) — Hunicke, LeBlanc, Zubek
- **Bartle's Player Types** — motivation segmentation for multiplayer
- **Flow State** — Csikszentmihalyi's challenge/skill balance
- **Octalysis** — Yu-kai Chou's gamification framework (8 core drives)
