---
description: Plan and implement mobile app UI (iOS, Android, React Native, Flutter, SwiftUI, Compose)
---

# Mobile UI/UX Pro Max

Data-driven mobile design intelligence. Runs a 4-step search sequence — style layer (web tool) → mobile behavior layer → stack guidelines → synthesize — before presenting any mobile UI design.

## Prerequisites

```bash
python3 --version  # 3.8+ required
```

## When to Use

When asked to design, build, or review mobile app UI. Activate for any request involving:
- Mobile app screen design
- iOS or Android UI
- React Native, Flutter, SwiftUI, or Jetpack Compose UI
- Navigation, gestures, onboarding, or mobile-specific UX patterns

## 4-Step Search Sequence

### Step 1 — Style Layer (web tool, same as web flow)

Search for style, color, typography, and product inspiration:

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<app type>" --domain product
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<style keywords>" --domain style
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<industry mood>" --domain color
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography
```

### Step 2 — Mobile Behavior Layer (mobile tool)

Search for mobile-specific UX patterns and platform conventions:

```bash
# Step 2: Mobile behavior (navigation, gestures, components, layout, platform, animation, onboarding, accessibility, ux-laws)
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<nav pattern>" --domain navigation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<gesture>" --domain gestures
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<component>" --domain components
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<layout topic>" --domain layout
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<platform difference>" --domain platform
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<animation type>" --domain animation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<onboarding pattern>" --domain onboarding
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<a11y concern>" --domain accessibility
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<psychology principle>" --domain ux-laws
```

### Step 3 — Stack Guidelines

Search for your specific stack's implementation patterns:

```bash
# React Native
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<topic>" --stack react-native

# Flutter
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<topic>" --stack flutter

# SwiftUI
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<topic>" --stack swiftui

# Jetpack Compose
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "<topic>" --stack jetpack-compose
```

Use `-n 5` to get more results: `--domain navigation -n 5`

### Step 4 — Synthesize and Design

Combine all search results to inform:
- Visual style (from Step 1)
- Navigation structure and gestures (from Step 2)
- Platform conventions and component choices (from Step 2)
- Stack-specific implementation patterns (from Step 3)

Present as **screen flows** not isolated component lists.

## Pre-Delivery Checklist

Before presenting any mobile UI design or implementation:

- [ ] All touch targets ≥ 44pt (iOS) / 48dp (Android)
- [ ] Safe areas respected (notch, Dynamic Island, home indicator)
- [ ] Haptic feedback for key interactions (selection toggle success error)
- [ ] `prefers-reduced-motion` / Reduce Motion respected on both platforms
- [ ] Platform back navigation supported (iOS swipe-back + Android system back)
- [ ] Accessibility labels on all interactive elements
- [ ] Dark mode tested on both platforms
- [ ] No hardcoded pixel values (use responsive units: pt/sp not px)

## Domain Reference

| Domain | When to search |
|--------|---------------|
| `navigation` | Nav structure, tab bar vs drawer, modals, deep links |
| `gestures` | Swipe pull-to-refresh long press pinch |
| `components` | Bottom sheet FAB snackbar chips skeleton |
| `layout` | Safe areas thumb zone spacing keyboard |
| `platform` | iOS vs Android conventions HIG vs MD3 |
| `animation` | Transitions micro-interactions haptic timing |
| `onboarding` | First-time flow permissions paywall signup timing |
| `accessibility` | Touch targets screen reader labels contrast |
| `ux-laws` | Psychology principles: Fitts Hick Miller Jakob Goal-Gradient Peak-End Doherty etc. |

## Stack Reference

| Stack | When to use |
|-------|------------|
| `react-native` | React Native (iOS + Android) |
| `flutter` | Flutter (iOS + Android) |
| `swiftui` | SwiftUI (iOS native) |
| `jetpack-compose` | Jetpack Compose (Android native) |

## Example: Fitness Tracker App (Dark Mode, RN)

```bash
# Step 1: Style
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fitness health tracker" --domain product
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "dark energetic bold sport" --domain style
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fitness sport energy" --domain color
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "bold dynamic" --domain typography

# Step 2: Mobile behavior
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "tab bar navigation bottom" --domain navigation
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "swipe gesture workouts list" --domain gestures
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "progress card stat tracker component" --domain components
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "dark mode" --domain platform
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "spring animation progress" --domain animation

# Step 3: Stack
python3 .agent/.shared/mobile-uiux-promax/scripts/mobile-search.py "list performance animation" --stack react-native
```
