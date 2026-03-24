# Mobile UI/UX Pro Max Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a searchable mobile design intelligence system (`mobile-uiux-promax`) with 12 CSV data files, 4 stack files, a `mobile-search.py` script, a workflow, a skill, and an update to the brainstorming skill's UI/UX Intelligence section.

**Architecture:** Standalone folder at `.agent/.shared/mobile-uiux-promax/` parallel to the existing web tool. The script imports `core.py` from the web tool — no BM25 duplication. Style/color/typography queries continue to use the existing `search.py`; mobile-specific behavior queries use the new `mobile-search.py`.

**Tech Stack:** Python 3, CSV (no external dependencies), existing BM25 engine from `core.py`

**Spec:** `docs/superpowers/specs/2026-03-24-mobile-uiux-promax-design.md`

---

## File Map

| Action | Path |
|--------|------|
| Create | `.agent/.shared/mobile-uiux-promax/scripts/mobile-search.py` |
| Create | `.agent/.shared/mobile-uiux-promax/data/navigation.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/gestures.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/components.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/layout.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/onboarding.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/animation.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/platform.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/accessibility.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/stacks/react-native.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/stacks/flutter.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/stacks/swiftui.csv` |
| Create | `.agent/.shared/mobile-uiux-promax/data/stacks/jetpack-compose.csv` |
| Create | `.agent/workflows/mobile-uiux-promax.md` |
| Create | `.agent/skills/mobile-uiux-promax/SKILL.md` |
| Modify | `.agent/skills/brainstorming/SKILL.md` |

---

## Task 1: Directory Structure + `mobile-search.py` Script

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/scripts/mobile-search.py`
- Create: `.agent/.shared/mobile-uiux-promax/data/.gitkeep` (placeholder)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p .agent/.shared/mobile-uiux-promax/scripts
mkdir -p .agent/.shared/mobile-uiux-promax/data/stacks
```

- [ ] **Step 2: Write `mobile-search.py`**

Create `.agent/.shared/mobile-uiux-promax/scripts/mobile-search.py`:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mobile UI/UX Pro Max - BM25 search for mobile design patterns.
Reuses the BM25 engine from the sibling ui-ux-pro-max tool.
"""

import sys
import argparse
from pathlib import Path

# Import the BM25 engine from the sibling web tool (no duplication)
_CORE_PATH = Path(__file__).resolve().parent.parent.parent / "ui-ux-pro-max" / "scripts"
sys.path.insert(0, str(_CORE_PATH))
from core import _search_csv, _load_csv

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MAX_RESULTS = 3

MOBILE_CONFIG = {
    "navigation": {
        "file": "navigation.csv",
        "search_cols": ["Pattern Name", "Keywords", "Pattern Type", "When to Use", "iOS Convention", "Android Convention"],
        "output_cols": ["Pattern Name", "Keywords", "Pattern Type", "When to Use", "When to Avoid", "iOS Convention", "Android Convention", "Cross-Platform Note", "Accessibility"]
    },
    "gestures": {
        "file": "gestures.csv",
        "search_cols": ["Gesture Name", "Keywords", "Platform", "Trigger", "Expected Response"],
        "output_cols": ["Gesture Name", "Keywords", "Platform", "Trigger", "Expected Response", "Conflicts", "iOS Hint", "Android Hint", "Accessibility Alternative"]
    },
    "components": {
        "file": "components.csv",
        "search_cols": ["Component Name", "Keywords", "Platform Variants", "Purpose"],
        "output_cols": ["Component Name", "Keywords", "Platform Variants", "Purpose", "Do", "Don't", "Haptic Feedback", "Animation Spec", "Accessibility"]
    },
    "layout": {
        "file": "layout.csv",
        "search_cols": ["Topic", "Keywords", "Platform", "Rule"],
        "output_cols": ["Topic", "Keywords", "Platform", "Rule", "Value/Spec", "Do", "Don't", "Code Example"]
    },
    "onboarding": {
        "file": "onboarding.csv",
        "search_cols": ["Pattern Name", "Keywords", "Stage", "Purpose", "When to Use"],
        "output_cols": ["Pattern Name", "Keywords", "Stage", "Purpose", "When to Use", "Conversion Impact", "iOS Convention", "Android Convention", "Anti-Pattern"]
    },
    "animation": {
        "file": "animation.csv",
        "search_cols": ["Animation Type", "Keywords", "Platform", "Do", "Don't"],
        "output_cols": ["Animation Type", "Keywords", "Platform", "Duration (ms)", "Easing", "Do", "Don't", "Performance Impact", "Reduced Motion Handling"]
    },
    "platform": {
        "file": "platform.csv",
        "search_cols": ["Topic", "Keywords", "iOS Convention", "Android Convention"],
        "output_cols": ["Topic", "Keywords", "iOS Convention", "Android Convention", "Cross-Platform Recommendation", "When to Deviate"]
    },
    "accessibility": {
        "file": "accessibility.csv",
        "search_cols": ["Category", "Issue", "Platform", "Description"],
        "output_cols": ["Category", "Issue", "Platform", "iOS Tool", "Android Tool", "Minimum Spec", "Do", "Don't", "Code Example", "WCAG Level"]
    },
}

MOBILE_STACK_CONFIG = {
    "react-native":    {"file": "stacks/react-native.csv"},
    "flutter":         {"file": "stacks/flutter.csv"},
    "swiftui":         {"file": "stacks/swiftui.csv"},
    "jetpack-compose": {"file": "stacks/jetpack-compose.csv"},
}

_STACK_COLS = {
    "search_cols": ["Category", "Guideline", "Description", "Do", "Don't"],
    "output_cols": ["Category", "Guideline", "Description", "Do", "Don't", "Code Good", "Code Bad", "Severity", "Docs URL"]
}

AVAILABLE_DOMAINS = list(MOBILE_CONFIG.keys())
AVAILABLE_STACKS = list(MOBILE_STACK_CONFIG.keys())


def _format_result(result, index):
    lines = [f"\n### Result {index + 1}"]
    for key, value in result.items():
        if value:
            lines.append(f"- **{key}:** {value}")
    return "\n".join(lines)


def search(query, domain, max_results=MAX_RESULTS):
    if domain not in MOBILE_CONFIG:
        print(f"Error: Unknown domain '{domain}'. Available: {', '.join(AVAILABLE_DOMAINS)}")
        sys.exit(1)

    config = MOBILE_CONFIG[domain]
    filepath = DATA_DIR / config["file"]

    if not filepath.exists():
        print(f"Error: Data file not found: {filepath}")
        sys.exit(1)

    results = _search_csv(filepath, config["search_cols"], config["output_cols"], query, max_results)

    print(f"## Mobile UI Pro Max Search Results")
    print(f"**Domain:** {domain} | **Query:** {query}")
    print(f"**Source:** {config['file']} | **Found:** {len(results)} results")

    for i, result in enumerate(results):
        print(_format_result(result, i))

    if not results:
        print("\nNo results found. Try different keywords.")


def search_stack(query, stack, max_results=MAX_RESULTS):
    if stack not in MOBILE_STACK_CONFIG:
        print(f"Error: Unknown stack '{stack}'. Available: {', '.join(AVAILABLE_STACKS)}")
        sys.exit(1)

    filepath = DATA_DIR / MOBILE_STACK_CONFIG[stack]["file"]

    if not filepath.exists():
        print(f"Error: Stack file not found: {filepath}")
        sys.exit(1)

    results = _search_csv(filepath, _STACK_COLS["search_cols"], _STACK_COLS["output_cols"], query, max_results)

    print(f"## Mobile UI Pro Max Search Results")
    print(f"**Stack:** {stack} | **Query:** {query}")
    print(f"**Found:** {len(results)} results")

    for i, result in enumerate(results):
        print(_format_result(result, i))


def main():
    parser = argparse.ArgumentParser(description="Mobile UI/UX Pro Max - Search mobile design patterns")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=AVAILABLE_DOMAINS, help="Domain to search")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help="Stack-specific guidelines")
    parser.add_argument("-n", "--max-results", type=int, default=MAX_RESULTS, help="Max results (default: 3)")

    args = parser.parse_args()

    if args.stack:
        search_stack(args.query, args.stack, args.max_results)
    elif args.domain:
        search(args.query, args.domain, args.max_results)
    else:
        parser.error("Provide either --domain or --stack")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Verify script syntax**

```bash
python3 -c "import ast; ast.parse(open('.agent/.shared/mobile-uiux-promax/scripts/mobile-search.py').read()); print('OK')"
```

Expected: `OK`

- [ ] **Step 4: Verify import resolves (no data needed)**

```bash
cd .agent/.shared/mobile-uiux-promax/scripts && python3 -c "
import sys
from pathlib import Path
sys.path.insert(0, str(Path('__file__').resolve().parent.parent.parent / 'ui-ux-pro-max' / 'scripts'))
from core import _search_csv
print('Import OK')
"
```

Expected: `Import OK`

- [ ] **Step 5: Skip commit** (`auto_commit: false` in `.agent/config.yml`)

---

## Task 2: `navigation.csv` + `gestures.csv` (Priority Domains)

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/navigation.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/gestures.csv`

### `navigation.csv` columns:
`Pattern Name,Keywords,Pattern Type,When to Use,When to Avoid,iOS Convention,Android Convention,Cross-Platform Note,Accessibility`

Target: ~35 rows covering Tab Bar, Stack, Drawer, Modal Sheet, Bottom Sheet, Nested Navigation, Deep Linking, Split View (iPad).

### `gestures.csv` columns:
`Gesture Name,Keywords,Platform,Trigger,Expected Response,Conflicts,iOS Hint,Android Hint,Accessibility Alternative`

Target: ~25 rows covering Swipe to Dismiss, Pull to Refresh, Long Press, Pinch to Zoom, Swipe Left/Right (actions), Edge Swipe (back), Double Tap, Pan/Drag.

- [ ] **Step 1: Create `navigation.csv` with header + ~35 rows**

The file must start with the exact header row, then data rows. Cover these patterns at minimum:
Tab Bar, Stack Navigator, Drawer Navigation, Modal (full-screen), Sheet (half-screen), Bottom Sheet, Search/Overlay, Deep Link, Tab-within-tab (nested), Split View.

- [ ] **Step 2: Create `gestures.csv` with header + ~25 rows**

Cover: Swipe (dismiss), Swipe (list actions: delete/archive), Pull to Refresh, Long Press (context menu), Pinch to Zoom, Double Tap (zoom/like), Edge Swipe (iOS back), Android Back Gesture, Pan (drag), Scroll (momentum), Two-finger Scroll, Tap and Hold (haptic peek).

- [ ] **Step 3: Test navigation search**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "tab bar bottom navigation" --domain navigation
```

Expected: ≥1 result mentioning Tab Bar pattern

- [ ] **Step 4: Test gestures search**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "swipe dismiss modal" --domain gestures
```

Expected: ≥1 result mentioning Swipe to Dismiss

- [ ] **Step 5: Skip commit** (`auto_commit: false`)

---

## Task 3: `components.csv` + `layout.csv`

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/components.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/layout.csv`

### `components.csv` columns:
`Component Name,Keywords,Platform Variants,Purpose,Do,Don't,Haptic Feedback,Animation Spec,Accessibility`

Target: ~35 rows. Cover: Bottom Sheet, FAB (Floating Action Button), Snackbar/Toast, Action Sheet, Alert Dialog, Skeleton Loader, Pull-to-Refresh, Tab Bar, Navigation Bar, Search Bar, Context Menu, Chip, Badge, Progress Indicator, Empty State.

### `layout.csv` columns:
`Topic,Keywords,Platform,Rule,Value/Spec,Do,Don't,Code Example`

Target: ~25 rows. Cover: Safe Area (top/bottom), Notch handling, Dynamic Island, Home Indicator, Keyboard avoidance, Thumb zone ergonomics, Touch target minimum, Minimum tap area, Content margins, Status bar height, Navigation bar height, Fold screen (Samsung), Landscape orientation.

- [ ] **Step 1: Create `components.csv` with header + ~35 rows**

- [ ] **Step 2: Create `layout.csv` with header + ~25 rows**

- [ ] **Step 3: Test components search**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "bottom sheet modal overlay" --domain components
```

Expected: ≥1 result mentioning Bottom Sheet

- [ ] **Step 4: Test layout search**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "safe area notch home indicator" --domain layout
```

Expected: ≥1 result with Value/Spec populated (e.g., "34pt")

- [ ] **Step 5: Skip commit** (`auto_commit: false`)

---

## Task 4: `platform.csv` — Largest, Most Foundational

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/platform.csv`

### Columns:
`Topic,Keywords,iOS Convention,Android Convention,Cross-Platform Recommendation,When to Deviate`

Target: ~45 rows. This file covers the HIG vs MD3 differences that matter most in practice.

Must include rows for:
- Back Navigation (swipe vs system back)
- Typography Scale (SF Pro vs Roboto sizing norms)
- Color System (system colors, semantic colors)
- Dark Mode (vibrancy vs elevation)
- Icons (SF Symbols vs Material Symbols)
- Bottom Navigation vs Tab Bar
- FAB placement (Android MD3 vs iOS alternative)
- Status Bar appearance
- Keyboard type defaults
- Haptic feedback patterns (UIImpactFeedbackGenerator vs HapticFeedback)
- Alert dialogs (UIAlertController style vs AlertDialog)
- Share sheet (UIActivityViewController vs Android Sharesheet)
- Date/Time pickers
- App icon shape (rounded rect vs adaptive icon)
- Splash screen / Launch screen
- Scroll behavior (rubber band vs overscroll)
- Long press context menu (UIContextMenuInteraction vs popup menu)
- Notifications (iOS categories vs Android channels)
- Permissions (one-time vs always/when-in-use)
- Deep links (Universal Links vs App Links)

- [ ] **Step 1: Create `platform.csv` with header + ~45 rows**

- [ ] **Step 2: Test iOS vs Android lookup**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "back navigation gesture button" --domain platform
```

Expected: Result showing iOS swipe-back vs Android system back differences

- [ ] **Step 3: Test dark mode lookup**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "dark mode" --domain platform
```

Expected: Result with iOS vibrancy vs Android elevation differences

- [ ] **Step 4: Skip commit** (`auto_commit: false`)

---

## Task 5: `onboarding.csv` + `animation.csv` + `accessibility.csv`

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/onboarding.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/animation.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/accessibility.csv`

### `onboarding.csv` columns:
`Pattern Name,Keywords,Stage,Purpose,When to Use,Conversion Impact,iOS Convention,Android Convention,Anti-Pattern`

Target: ~25 rows. Cover: Permission Priming, Progressive Disclosure, Value-First Onboarding, Social Proof Screen, Feature Spotlight, Paywall (after value), Account Creation (late), Tutorial (interactive), Empty State (first), Skeleton screens, Sign in with Apple/Google, Biometric setup prompt.

### `animation.csv` columns:
`Animation Type,Keywords,Platform,Duration (ms),Easing,Do,Don't,Performance Impact,Reduced Motion Handling`

Target: ~30 rows. Cover: Page transitions (push/pop/modal), Shared element transition (Hero), Spring animation, Fade in/out, Scale (expand/collapse), Skeleton pulse, Loading spinner, Pull-to-refresh animation, Tab switch, Keyboard appear/disappear, Haptic + visual pairing, List row delete animation, Lottie integration pattern.

### `accessibility.csv` columns:
`Category,Issue,Platform,iOS Tool,Android Tool,Minimum Spec,Do,Don't,Code Example,WCAG Level`

Target: ~30 rows. Cover: Touch target size, Screen reader label, Heading hierarchy, Focus order, Dynamic Type (iOS) / Font Scale (Android), Color contrast, Color not sole indicator, Announcement for state changes, Image alt text, Custom actions (VoiceOver), Grouped vs individual elements, Reduce Motion, Reduce Transparency.

- [ ] **Step 1: Create `onboarding.csv` with header + ~25 rows**

- [ ] **Step 2: Create `animation.csv` with header + ~30 rows**

- [ ] **Step 3: Create `accessibility.csv` with header + ~30 rows**

- [ ] **Step 4: Spot-check all three**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "permission request priming" --domain onboarding
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "shared element hero transition" --domain animation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "touch target size minimum" --domain accessibility
```

Expected: ≥1 result per query with non-empty output columns

- [ ] **Step 5: Skip commit** (`auto_commit: false`)

---

## Task 6: Stack files — `react-native.csv` + `flutter.csv`

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/stacks/react-native.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/stacks/flutter.csv`

### Columns (same as web stacks):
`Category,Guideline,Description,Do,Don't,Code Good,Code Bad,Severity,Docs URL`

### `react-native.csv` — ~40 rows covering:
Performance (FlatList vs ScrollView, keyExtractor, getItemLayout, memo), Navigation (React Navigation v6, Stack/Tab/Drawer config, deep links), Layout (StyleSheet.create, SafeAreaView, KeyboardAvoidingView, Platform.OS), Styling (no CSS inheritance, use StyleSheet not inline), Images (FastImage, resizeMode), State (avoid re-render, useMemo/useCallback), Accessibility (accessibilityLabel, accessibilityRole, accessibilityHint), Bridge (native modules, Hermes), Testing (Jest + React Native Testing Library).

### `flutter.csv` — ~40 rows covering:
Performance (ListView.builder vs children, const widgets, RepaintBoundary), Navigation (GoRouter vs Navigator 2.0, deep links), Layout (MediaQuery, SafeArea, LayoutBuilder, Expanded/Flexible), State (Riverpod/Bloc/Provider patterns), Widgets (StatelessWidget preferred, keys), Theming (ThemeData, ColorScheme, TextTheme), Images (CachedNetworkImage, precacheImage), Accessibility (Semantics widget, ExcludeSemantics), Testing (widget tests, golden tests).

- [ ] **Step 1: Create `react-native.csv` with header + ~40 rows**

- [ ] **Step 2: Create `flutter.csv` with header + ~40 rows**

- [ ] **Step 3: Test both stacks**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "list performance" --stack react-native
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "list performance" --stack flutter
```

Expected: RN returns FlatList guidance, Flutter returns ListView.builder guidance

- [ ] **Step 4: Skip commit** (`auto_commit: false`)

---

## Task 7: Stack files — `swiftui.csv` + `jetpack-compose.csv`

**Files:**
- Create: `.agent/.shared/mobile-uiux-promax/data/stacks/swiftui.csv`
- Create: `.agent/.shared/mobile-uiux-promax/data/stacks/jetpack-compose.csv`

### `swiftui.csv` — ~40 rows covering:
Performance (LazyVStack vs VStack, @State scope, avoid heavy bodies), Navigation (NavigationStack, NavigationLink, .navigationDestination, programmatic), Layout (GeometryReader, safeAreaInset, ignoresSafeArea, padding), Modifiers (order matters, view modifier vs environment), State (@State, @Binding, @ObservableObject, @EnvironmentObject), Animation (withAnimation, matchedGeometryEffect, .animation), Accessibility (.accessibilityLabel, .accessibilityHidden, .accessibilityAction), Lists (List vs LazyVStack tradeoffs, swipeActions), Theming (Color assets, dynamic colors).

### `jetpack-compose.csv` — ~40 rows covering:
Performance (LazyColumn, key lambda, derivedStateOf, remember), Navigation (Navigation Compose, NavHost, type-safe routes), Layout (WindowInsets, Scaffold, padding, imePadding), State (remember, rememberSaveable, ViewModel, collectAsState), Theming (MaterialTheme, ColorScheme, dark mode), Animation (AnimatedVisibility, animateContentSize, shared element), Accessibility (semantics, clearAndSetSemantics, contentDescription), Modifiers (order is semantics, Modifier.then), Testing (ComposeTestRule, semantics node), Shared element (experimental Compose 1.7+).

- [ ] **Step 1: Create `swiftui.csv` with header + ~40 rows**

- [ ] **Step 2: Create `jetpack-compose.csv` with header + ~40 rows**

- [ ] **Step 3: Test both stacks**

```bash
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "navigation routing" --stack swiftui
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "navigation routing" --stack jetpack-compose
```

Expected: SwiftUI returns NavigationStack guidance, Compose returns NavHost guidance

- [ ] **Step 4: Full end-to-end test across all domains and stacks**

```bash
for domain in navigation gestures components layout onboarding animation platform accessibility; do
  echo "=== $domain ==="; python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "test" --domain $domain | head -5; echo
done
for stack in react-native flutter swiftui jetpack-compose; do
  echo "=== $stack ==="; python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "performance" --stack $stack | head -5; echo
done
```

Expected: All domains and stacks return ≥1 result each.

- [ ] **Step 5: Skip commit** (`auto_commit: false`)

---

## Task 8: Workflow — `mobile-uiux-promax.md`

**Files:**
- Create: `.agent/workflows/mobile-uiux-promax.md`

- [ ] **Step 1: Create the workflow file**

The file must include:

```markdown
---
description: Plan and implement mobile UI (iOS, Android, React Native, Flutter, SwiftUI, Compose)
---

# Mobile UI/UX Pro Max

Searchable database of mobile UI patterns, navigation systems, gesture design, platform conventions (HIG vs MD3), component best practices, onboarding flows, animation specs, and accessibility guidelines.

## Prerequisites

Check Python:
```bash
python3 --version
```

## How to Use

When user requests mobile UI work, run this 4-step search sequence:

### Step 1: Style Layer (web tool — same as web flow)
[4 search.py commands for product/style/color/typography]

### Step 2: Mobile Behavior Layer (mobile tool)
[7 mobile-search.py commands for navigation/gestures/components/layout/platform/animation/accessibility]

### Step 3: Stack Guidelines
[mobile-search.py with --stack flag]

### Step 4: Synthesize and implement

## Pre-Delivery Checklist
[8 mobile-specific checkboxes from spec]

## Domain Reference
[Table of all 8 domains with what they cover]

## Stack Reference
[Table of 4 stacks with their focus]
```

Write the full content per the spec section "Workflow: mobile-uiux-promax.md".

- [ ] **Step 2: Verify the file renders correctly**

```bash
wc -l .agent/workflows/mobile-uiux-promax.md
```

Expected: >80 lines

- [ ] **Step 3: Skip commit** (`auto_commit: false`)

---

## Task 9: Skill — `mobile-uiux-promax/SKILL.md`

**Files:**
- Create: `.agent/skills/mobile-uiux-promax/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p .agent/skills/mobile-uiux-promax
```

- [ ] **Step 2: Write `SKILL.md`**

The skill frontmatter:
```yaml
---
name: mobile-uiux-promax
description: "Use when designing mobile app UI (iOS, Android, React Native, Flutter, SwiftUI, Compose). Runs UI/UX Intelligence search sequence (style → mobile behavior → stack) before presenting any design."
---
```

Content must include:
1. **When to invoke** — detect mobile keywords (mobile, app, iOS, Android, React Native, Flutter, SwiftUI, Compose, screen, gesture, navigation)
2. **Search sequence** — 4 steps (style layer, mobile behavior layer, stack, synthesize)
3. **Domain cheat sheet** — which domain answers which type of question
4. **Common mobile anti-patterns** — list of top 10 pitfalls
5. **Design presentation guidance** — present as screen flows, not component lists
6. **Pre-delivery checklist** — 8 mobile-specific items

- [ ] **Step 3: Verify file exists and is non-empty**

```bash
wc -l .agent/skills/mobile-uiux-promax/SKILL.md
```

Expected: >60 lines

- [ ] **Step 4: Skip commit** (`auto_commit: false`)

---

## Task 10: Update `brainstorming/SKILL.md` — Add Mobile Detection

**Files:**
- Modify: `.agent/skills/brainstorming/SKILL.md`

The current UI/UX Intelligence section has a single block for web search. Add mobile detection logic below the existing web search instructions.

- [ ] **Step 1: Read current UI/UX Intelligence section**

```bash
grep -n "UI/UX Intelligence" .agent/skills/brainstorming/SKILL.md
```

Note the line numbers.

- [ ] **Step 2: Add mobile detection block to the section**

After the existing "Skip this step" note, add:

```markdown
**Mobile task detected?** If the request involves keywords like "mobile", "app", "iOS", "Android", "React Native", "Flutter", "SwiftUI", "Compose", "screen", "gesture", or "navigation pattern", use the mobile search sequence instead:

- Invoke `skills/mobile-uiux-promax/SKILL.md` for the full 4-step search sequence
- Step 1 still uses `search.py` (web tool) for style/color/typography/product
- Steps 2–3 use `mobile-search.py` for mobile-specific domains and stack guidelines

> **Skip mobile search** for web tasks, backend tasks, or any task with no mobile UI component.
```

- [ ] **Step 3: Verify the section reads correctly**

```bash
grep -A 20 "Mobile task detected" .agent/skills/brainstorming/SKILL.md
```

Expected: The new block visible with correct content

- [ ] **Step 4: Run a quick sanity check — existing web search still mentioned**

```bash
grep -c "search.py" .agent/skills/brainstorming/SKILL.md
```

Expected: ≥2 (both web search.py and mobile-search.py references)

- [ ] **Step 5: Skip commit** (`auto_commit: false`)

---

## Final Verification

- [ ] **Full system smoke test**

```bash
# Mobile domain search
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "fitness health app" --domain navigation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "dark mode" --domain platform
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "onboarding permission" --domain onboarding
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "animation spring" --domain animation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "accessibility voiceover" --domain accessibility

# Stack search
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "navigation" --stack react-native
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "navigation" --stack flutter

# Existing web tool must still work
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "dark mode" --domain style
```

Expected: All commands return results. Web tool unaffected.

- [ ] **Verify file count**

```bash
find .agent/.shared/mobile-uiux-promax -name "*.csv" | wc -l
```

Expected: 12 (8 domain + 4 stacks)

- [ ] **Verify new agent files**

```bash
ls .agent/workflows/mobile-uiux-promax.md .agent/skills/mobile-uiux-promax/SKILL.md
```

Expected: Both files exist

- [ ] **Skip final commit** (`auto_commit: false` — leave for manual commit)
