# antigravity-superpowers

> **Superpowers for [Google Antigravity](https://antigravity.google)** — a complete development workflow powered by composable skills, workflows, and rules.

This repo ports the [Superpowers](https://github.com/obra/superpowers) skills library to work natively with **Google Antigravity agent**, with Antigravity-compatible path conventions, an auto-update workflow, and curated workflow files translated from the upstream skills.

---

## What's Inside

```
antigravity-superpowers/
├── .agent/
│   ├── rules/
│   │   └── superpowers.md        # Always-on rule: agent checks skills before acting
│   ├── skills/                   # Symlinks → superpowers/skills/*
│   │   ├── brainstorming/
│   │   ├── writing-plans/
│   │   ├── executing-plans/
│   │   ├── subagent-driven-development/
│   │   ├── test-driven-development/
│   │   ├── systematic-debugging/
│   │   ├── verification-before-completion/
│   │   ├── requesting-code-review/
│   │   ├── receiving-code-review/
│   │   ├── using-git-worktrees/
│   │   ├── finishing-a-development-branch/
│   │   ├── dispatching-parallel-agents/
│   │   ├── writing-skills/
│   │   └── using-superpowers/
│   ├── workflows/
│   │   ├── brainstorm.md         # /brainstorm
│   │   ├── write-plan.md         # /write-plan
│   │   ├── execute-plan.md       # /execute-plan
│   │   ├── code-review.md        # /code-review
│   │   ├── debug.md              # /debug
│   │   └── update-superpowers.md # /update-superpowers
│   └── .shared/
│       └── update-superpowers.sh # Shell script for version management
└── superpowers/                  # Upstream source (git-managed)
    └── skills/                   # All skill SKILL.md files live here
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

---

## Skills Reference

| Skill                            | Triggers automatically when...                                       |
| -------------------------------- | -------------------------------------------------------------------- |
| `brainstorming`                  | You're adding a feature, building a component, or modifying behavior |
| `writing-plans`                  | Design is approved — breaking work into tasks                        |
| `executing-plans`                | Running a plan step-by-step with checkpoints                         |
| `subagent-driven-development`    | Dispatching subagents per task with two-stage review                 |
| `test-driven-development`        | During ALL implementation (RED → GREEN → REFACTOR)                   |
| `systematic-debugging`           | Debugging any issue                                                  |
| `verification-before-completion` | Before declaring a fix or task done                                  |
| `requesting-code-review`         | Before submitting code for review                                    |
| `receiving-code-review`          | Responding to review feedback                                        |
| `using-git-worktrees`            | Starting work on a new isolated branch                               |
| `finishing-a-development-branch` | When tasks are complete                                              |
| `dispatching-parallel-agents`    | Running concurrent subagent workflows                                |
| `writing-skills`                 | Creating a new skill                                                 |

---

## Keeping Up to Date

Upstream Superpowers releases are tracked automatically. To update:

```
/update-superpowers
```

This workflow will:

1. Pull the latest Superpowers release from GitHub
2. Re-sync all skill symlinks
3. AI-rewrite any changed workflows and rules to stay Antigravity-compatible
4. Commit all changes with a versioned commit message

---

## Installation

### Using This Repo in Your Project

Copy the `.agent/` folder into your project root:

```bash
cp -r /path/to/antigravity-superpowers/.agent /your/project/
```

Or clone this repo as a submodule and symlink `.agent/`:

```bash
git submodule add https://github.com/<your-username>/antigravity-superpowers .antigravity-superpowers
ln -s .antigravity-superpowers/.agent .agent
```

### Starting Fresh

```bash
git clone https://github.com/<your-username>/antigravity-superpowers
cd antigravity-superpowers
# Open with Antigravity — the agent will detect .agent/ automatically
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
