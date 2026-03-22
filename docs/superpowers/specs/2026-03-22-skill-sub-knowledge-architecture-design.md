# Skill Sub-Knowledge Architecture

## Problem

All 44 skills currently have a flat structure — a single `SKILL.md` file with general guidance. When AI invokes a skill like `mobile-developer`, it gets high-level patterns but lacks **deep, technology-specific knowledge** (e.g., React Native performance patterns, Flutter widget architecture, iOS SwiftUI idioms).

This means AI must rely on general knowledge rather than curated, opinionated best practices tailored to specific technology stacks.

## Goal

Enrich skills with **deep reference knowledge files** that:
1. Provide technology-specific patterns, anti-patterns, and ecosystem guidance
2. Are **selectively loaded** based on the current project's stack
3. Follow a consistent, extensible pattern usable across all skills

## Approach

**Approach 1: Flat References** — one reference file per technology, placed inside a `references/` subdirectory within the skill folder. SKILL.md contains loading instructions that guide AI to detect the project stack and read the matching file(s).

## Pilot

**`mobile-developer`** skill, with 4 reference files:
- `react-native.md` — React Native + Expo
- `flutter.md` — Flutter + Dart  
- `ios-native.md` — SwiftUI / UIKit
- `android-native.md` — Kotlin / Jetpack Compose

Pattern will be extended to other skills (frontend-developer, backend-developer, etc.) after pilot validation.

---

## Design

### 1. Directory Structure

```
mobile-developer/
  SKILL.md                      # Main lens (add Platform References section)
  references/
    react-native.md             # React Native + Expo deep reference
    flutter.md                  # Flutter + Dart deep reference
    ios-native.md               # SwiftUI / UIKit deep reference
    android-native.md           # Kotlin / Jetpack Compose deep reference
```

### 2. SKILL.md Changes

Add a new `## Platform References` section at the end of the existing SKILL.md:

```markdown
## Platform References

When this skill is invoked, detect the project's platform stack and read
the matching reference file(s) from `references/` before proceeding:

| Stack indicator                       | Reference file                |
|---------------------------------------|-------------------------------|
| `package.json` with `react-native`    | `references/react-native.md`  |
| `pubspec.yaml`                        | `references/flutter.md`       |
| `*.xcodeproj` or `Package.swift`      | `references/ios-native.md`    |
| `build.gradle.kts` or `build.gradle`  | `references/android-native.md`|

If the project uses multiple stacks (e.g., React Native with native
modules), read ALL matching references.
```

### 3. Reference File Template

Each reference file follows a consistent 7-section structure (~1000+ words):

```markdown
# [Platform Name] Reference

> One-liner philosophy

## Project Setup & Detection
- How to identify this platform in a project
- Recommended project structure
- Key config files and their purpose

## Architecture Patterns
- Recommended architecture (feature-based modules, etc.)
- State management patterns + recommended libraries
- Navigation patterns

## Performance Optimization
- Platform-specific performance thresholds
- Common bottlenecks and fixes
- Profiling tools and usage

## Common Libraries Ecosystem
| Category     | Recommended        | Alternative          |
- Navigation, state, networking, storage, testing, etc.

## Anti-Patterns & Gotchas
| ❌ Don't     | Why                | ✅ Do Instead        |
- Platform-specific pitfalls with incorrect/correct code examples

## Testing
- Unit test setup & patterns
- Integration test approach
- E2E testing tools

## Deployment & Distribution
- Build process
- Code signing / store submission
- OTA updates (if applicable)
```

### 4. React Native Reference — Content Sources

The `react-native.md` file will incorporate knowledge from:

**Vercel's `agent-skills/react-native-skills`** ([source](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills)):
- 40+ granular rules organized by priority (CRITICAL → LOW)
- Categories: List Performance, Animation, Scroll, Navigation, React State, UI Patterns, React Compiler, Design System, Monorepo, Fonts
- Incorrect/correct code pattern format

**Key content to distill:**

| Vercel Category | Our Section | Key Rules |
|----------------|-------------|-----------|
| List Performance (CRITICAL) | Performance Optimization | LegendList/FlashList, stable refs, memoization, compressed images |
| Animation (HIGH) | Performance Optimization | GPU properties (transform/opacity), `useDerivedValue`, `GestureDetector` |
| Navigation (HIGH) | Architecture Patterns | Native stack/tabs over JS navigators |
| UI Patterns (HIGH) | Anti-Patterns & Gotchas | `expo-image`, `Pressable`, safe area, native modals, Zeego menus |
| React State (MEDIUM) | Architecture Patterns | Minimize state, dispatcher pattern, derive values |
| React Compiler (MEDIUM) | Anti-Patterns & Gotchas | Destructure functions, `.get()/.set()` for shared values |
| Rendering (MEDIUM) | Anti-Patterns & Gotchas | Text in `<Text>`, no falsy `&&` |

**Additional curated knowledge:**
- Expo ecosystem (expo-router, EAS Build, EAS Submit, expo-updates OTA)
- State management (Zustand, Redux Toolkit, Jotai, react-native-mmkv)
- Networking (@tanstack/react-query, axios)
- New Architecture (TurboModules, Fabric, Bridgeless mode)
- Testing (Jest + RNTL, Detox, Maestro)
- Security (expo-secure-store, Hermes bytecode)

### 5. Extensibility Convention

Rules for extending this pattern to other skills:

1. **Sub-knowledge always lives in `references/`** — never directly alongside SKILL.md
2. **One file per platform/technology** — flat, no nested folders
3. **SKILL.md contains loading instructions** — stack indicator → reference file table
4. **Reference files follow the 7-section template** — consistent structure across all skills
5. **Naming convention:** `kebab-case.md`, matching technology name (e.g., `react-native.md`, not `rn.md`)
6. **No frontmatter required** — reference files are loaded via SKILL.md instruction, not skill discovery

### 6. Future Extension Candidates

| Skill | Possible `references/` files |
|-------|------------------------------|
| `frontend-developer` | `react.md`, `vue.md`, `svelte.md`, `nextjs.md` |
| `backend-developer` | `nodejs.md`, `python.md`, `golang.md`, `postgresql.md` |
| `game-developer` | `unity.md`, `godot.md`, `unreal.md` |
| `devops-engineer` | `docker.md`, `kubernetes.md`, `terraform.md`, `github-actions.md` |
| `security-engineer` | `owasp-web.md`, `owasp-mobile.md`, `compliance.md` |

---

## What Does NOT Change

- **`writing-skills` SKILL.md** — the "Skill with Heavy Reference" convention already supports this pattern
- **Other skills** — untouched until pilot is validated
- **Skill discovery** — sub-knowledge files are loaded through SKILL.md instruction, not through skill matching

---

## Verification Plan

### Manual Verification

1. **Structure check:** Verify directory structure matches design after implementation
2. **SKILL.md loading instruction test:** Open a React Native project, invoke mobile-developer skill, and verify AI reads `references/react-native.md`
3. **Multi-stack test:** Open a project with both RN and native iOS code, verify AI loads both `react-native.md` and `ios-native.md`
4. **Content quality check:** Review each reference file for accuracy against official docs and Vercel source
5. **Word count check:** Verify each reference file is ~1000+ words with comprehensive coverage

### Automated Verification

```bash
# Verify directory structure
ls -la .agent/skills/mobile-developer/references/

# Verify all 4 reference files exist
test -f .agent/skills/mobile-developer/references/react-native.md && echo "✅ react-native.md"
test -f .agent/skills/mobile-developer/references/flutter.md && echo "✅ flutter.md"
test -f .agent/skills/mobile-developer/references/ios-native.md && echo "✅ ios-native.md"
test -f .agent/skills/mobile-developer/references/android-native.md && echo "✅ android-native.md"

# Word count check (target: 1000+ each)
wc -w .agent/skills/mobile-developer/references/*.md

# Verify SKILL.md contains Platform References section
grep -c "Platform References" .agent/skills/mobile-developer/SKILL.md
```

---

## References

- [Vercel agent-skills: react-native-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills) — source for React Native patterns and rules
