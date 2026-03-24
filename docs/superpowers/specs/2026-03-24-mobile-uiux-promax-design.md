# Mobile UI/UX Pro Max — Design Spec

**Date:** 2026-03-24
**Status:** Approved
**Author:** Brainstorming session

---

## Overview

A full mobile design intelligence system that extends the existing `ui-ux-pro-max` tool. It gives agents access to a curated, searchable database of mobile-specific UX patterns covering navigation, gestures, components, layout, onboarding, animation, platform conventions, and accessibility — across iOS, Android, React Native, Flutter, SwiftUI, and Jetpack Compose.

The system follows the same BM25-powered search architecture as the web tool. Style, color, and typography queries continue to use the existing `search.py`; mobile-specific behavior queries use a new `mobile-search.py`.

---

## Goals

- Give agents accurate, data-driven mobile design guidance before proposing UI
- Reuse web tool for style/color/typography (no duplication)
- Cover iOS + Android platform conventions + cross-platform stacks (RN, Flutter, SwiftUI, Compose)
- Integrate into the `brainstorming` skill's UI/UX Intelligence section
- Ship as a standalone, isolated folder — zero risk of breaking the existing web tool

---

## Architecture

```
.agent/
├── .shared/
│   ├── ui-ux-pro-max/                   # existing — web tool (unchanged)
│   │   ├── data/                        # style, color, typography, etc.
│   │   └── scripts/
│   │       ├── core.py                  # BM25 engine (shared)
│   │       └── search.py
│   └── mobile-uiux-promax/              # NEW
│       ├── data/
│       │   ├── navigation.csv
│       │   ├── gestures.csv
│       │   ├── components.csv
│       │   ├── layout.csv
│       │   ├── onboarding.csv
│       │   ├── animation.csv
│       │   ├── platform.csv
│       │   ├── accessibility.csv
│       │   └── stacks/
│       │       ├── react-native.csv
│       │       ├── flutter.csv
│       │       ├── swiftui.csv
│       │       └── jetpack-compose.csv
│       └── scripts/
│           └── mobile-search.py         # imports core.py from web tool
├── workflows/
│   └── mobile-uiux-promax.md            # NEW workflow
└── skills/
    ├── brainstorming/
    │   └── SKILL.md                     # UPDATE: mobile detect in UI/UX Intelligence section
    └── mobile-uiux-promax/
        └── SKILL.md                     # NEW skill
```

**Key design decision:** `mobile-search.py` does not duplicate the BM25 engine. It imports `core.py` from the sibling `ui-ux-pro-max/scripts/` folder, passing mobile-specific CSV paths.

---

## Data: 8 Mobile Domains

### 1. `navigation.csv`

| Column | Description |
|--------|-------------|
| Pattern Name | e.g., "Tab Bar", "Stack Navigator", "Drawer" |
| Keywords | Search terms for BM25 |
| Pattern Type | Tab Bar / Stack / Drawer / Modal / Bottom Sheet / Deep Link |
| When to Use | Appropriate contexts |
| When to Avoid | Anti-patterns |
| iOS Convention | HIG-aligned guidance |
| Android Convention | MD3-aligned guidance |
| Cross-Platform Note | RN/Flutter recommendation |
| Accessibility | VoiceOver/TalkBack notes |

**Target rows:** ~30–50

### 2. `gestures.csv`

| Column | Description |
|--------|-------------|
| Gesture Name | e.g., "Swipe to Dismiss", "Pull to Refresh" |
| Keywords | Search terms |
| Platform | iOS / Android / Both |
| Trigger | Gesture motion description |
| Expected Response | What should happen |
| Conflicts | What gestures it may conflict with |
| iOS Hint | Implementation note |
| Android Hint | Implementation note |
| Accessibility Alternative | Non-gesture fallback |

**Target rows:** ~20–30

### 3. `components.csv`

| Column | Description |
|--------|-------------|
| Component Name | e.g., "Bottom Sheet", "FAB", "Snackbar" |
| Keywords | Search terms |
| Platform Variants | iOS name vs Android name |
| Purpose | What it's for |
| Do | Best practices |
| Don't | Anti-patterns |
| Haptic Feedback | Yes / No / Optional |
| Animation Spec | Duration and easing |
| Accessibility | Label and role requirements |

**Target rows:** ~30–40

### 4. `layout.csv`

| Column | Description |
|--------|-------------|
| Topic | e.g., "Safe Area", "Thumb Zone", "Dynamic Island" |
| Keywords | Search terms |
| Platform | iOS / Android / Both |
| Rule | The guideline |
| Value/Spec | Concrete measurement (e.g., "44pt minimum touch target") |
| Do | Correct implementation |
| Don't | Common mistake |
| Code Example | Snippet hint |

**Target rows:** ~20–30

### 5. `onboarding.csv`

| Column | Description |
|--------|-------------|
| Pattern Name | e.g., "Permission Priming", "Progressive Disclosure" |
| Keywords | Search terms |
| Stage | Pre-signup / Permission / Tutorial / Paywall / Empty State |
| Purpose | Goal of the pattern |
| When to Use | Trigger conditions |
| Conversion Impact | Impact rating and notes |
| iOS Convention | Platform-specific note |
| Android Convention | Platform-specific note |
| Anti-Pattern | What to avoid |

**Target rows:** ~20–30

### 6. `animation.csv`

| Column | Description |
|--------|-------------|
| Animation Type | e.g., "Page Transition", "Shared Element", "Micro-interaction" |
| Keywords | Search terms |
| Platform | iOS / Android / Both / RN / Flutter |
| Duration (ms) | Recommended timing |
| Easing | e.g., "ease-out", "spring" |
| Do | Correct usage |
| Don't | Common mistake |
| Performance Impact | Low / Medium / High |
| Reduced Motion Handling | How to respect `prefers-reduced-motion` on mobile |

**Target rows:** ~25–35

### 7. `platform.csv`

| Column | Description |
|--------|-------------|
| Topic | e.g., "Back Navigation", "Typography Scale", "Bottom Nav" |
| Keywords | Search terms |
| iOS Convention | HIG reference |
| Android Convention | MD3 reference |
| Cross-Platform Recommendation | Best choice for RN/Flutter |
| When to Deviate | When to break platform convention for brand |

**Target rows:** ~40–50

### 8. `accessibility.csv`

| Column | Description |
|--------|-------------|
| Category | e.g., "Touch Target", "Screen Reader", "Dynamic Type" |
| Issue | Specific problem |
| Platform | iOS / Android / Both |
| iOS Tool | VoiceOver guidance |
| Android Tool | TalkBack guidance |
| Minimum Spec | e.g., "44×44pt / 48×48dp" |
| Do | Correct implementation |
| Don't | Anti-pattern |
| Code Example | Snippet hint |
| WCAG Level | A / AA / AAA |

**Target rows:** ~25–35

---

## Data: 4 Mobile Stacks

All stacks share the same column schema as existing web stacks:

> Category · Guideline · Description · Do · Don't · Code Good · Code Bad · Severity · Docs URL

| Stack file | Focus areas |
|-----------|-------------|
| `react-native.csv` | FlatList optimization, React Navigation, StyleSheet, Platform.OS, SafeAreaView, Animated API |
| `flutter.csv` | ListView.builder, MaterialApp/CupertinoApp, MediaQuery, SafeArea, Hero, state management |
| `swiftui.csv` | LazyVStack, NavigationStack, safeAreaInset, GeometryReader, matchedGeometryEffect, accessibility |
| `jetpack-compose.csv` | LazyColumn, Scaffold, WindowInsets, Navigation Compose, AnimatedVisibility, semantics |

**Target rows per stack:** ~40

---

## Script: `mobile-search.py`

Thin wrapper around `core.py`. No BM25 duplication.

```python
# Imports core engine from sibling web tool folder
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "ui-ux-pro-max" / "scripts"))
from core import _search_csv, BM25, _load_csv

DATA_DIR = Path(__file__).parent.parent / "data"

MOBILE_CONFIG = {
    "navigation": { "file": "navigation.csv", "search_cols": [...], "output_cols": [...] },
    "gestures":   { "file": "gestures.csv",   ... },
    "components": { "file": "components.csv", ... },
    "layout":     { "file": "layout.csv",     ... },
    "onboarding": { "file": "onboarding.csv", ... },
    "animation":  { "file": "animation.csv",  ... },
    "platform":   { "file": "platform.csv",   ... },
    "accessibility": { "file": "accessibility.csv", ... },
}

MOBILE_STACK_CONFIG = {
    "react-native":     { "file": "stacks/react-native.csv" },
    "flutter":          { "file": "stacks/flutter.csv" },
    "swiftui":          { "file": "stacks/swiftui.csv" },
    "jetpack-compose":  { "file": "stacks/jetpack-compose.csv" },
}
```

**CLI interface** (same as web tool):
```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<query>" --domain <domain>
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<query>" --stack <stack>
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<query>" --domain <domain> -n 5
```

---

## Workflow: `mobile-uiux-promax.md`

When agent receives a mobile UI task, the workflow directs this search sequence:

**Step 1 — Style layer** (web tool, same as web flow):
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<app type>" --domain product
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<style keywords>" --domain style
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<industry>" --domain color
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography
```

**Step 2 — Mobile behavior layer** (mobile tool):
```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<nav pattern>" --domain navigation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<gesture>" --domain gestures
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<component>" --domain components
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "safe area layout" --domain layout
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<platform>" --domain platform
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "animation" --domain animation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "accessibility" --domain accessibility
```

**Step 3 — Stack guidelines**:
```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<topic>" --stack react-native
```

**Step 4 — Synthesize** all results and implement design.

**Pre-delivery checklist** (mobile-specific):
- [ ] All touch targets ≥ 44pt (iOS) / 48dp (Android)
- [ ] Safe areas respected (notch, Dynamic Island, home indicator)
- [ ] Haptic feedback for key interactions
- [ ] `prefers-reduced-motion` respected on both platforms
- [ ] Platform back navigation supported
- [ ] Accessibility labels on all interactive elements
- [ ] Dark mode tested on both platforms
- [ ] No hardcoded pixel values (use responsive units)

---

## Skill: `mobile-uiux-promax/SKILL.md`

The skill is invoked by `brainstorming/SKILL.md` when a mobile context is detected. It provides:

- Full search sequence (steps 1-4 above)
- Domain cheat sheet: which domain to search for which design question
- Common mobile anti-patterns from the data
- How to present mobile design (screen flows, not isolated component lists)
- Reference to the pre-delivery checklist

---

## Brainstorming Integration Update

Update `brainstorming/SKILL.md` — UI/UX Intelligence section:

Add mobile detect logic:

> **Mobile task detected?** (keywords in user request: mobile, app, iOS, Android, React Native, Flutter, SwiftUI, Compose, screen, gesture, navigation)
>
> → Invoke `skills/mobile-uiux-promax/SKILL.md` for the full search sequence
>
> **Web task?** → Use `search.py` directly as before

---

## Success Criteria

1. `mobile-search.py` returns relevant results for mobile-specific queries
2. Web tool is completely unaffected
3. Brainstorming skill correctly routes mobile tasks to mobile tool
4. All 12 CSVs populated with enough rows to produce useful BM25 results (~20–50 rows each)
5. All 4 stack CSVs populated (~40 rows each)
6. Workflow and skill guide agent through correct 4-step search sequence

---

## Out of Scope

- Mobile testing strategies
- CI/CD for mobile
- App store optimization
- Backend/API design for mobile apps
- React Native Web or adaptive layouts (web + mobile)
