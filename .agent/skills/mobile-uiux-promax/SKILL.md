---
name: mobile-uiux-promax
description: Use when designing or building mobile app UI for iOS, Android, React Native, Flutter, SwiftUI, or Jetpack Compose
---

# Mobile UI/UX Pro Max

Data-grounded mobile design intelligence. Every design decision is backed by platform-authoritative data from Apple HIG, Material Design 3, and stack-specific best practices.

## When to Activate

Activate this skill when the request involves:
- Designing any mobile screen, flow, or component
- Reviewing mobile UI for platform-appropriateness
- Choosing between navigation patterns for mobile apps
- Implementing gesture-driven or haptic-rich interactions
- Advising on iOS vs Android design conventions
- Building onboarding flows or paywall timing
- Animation and motion design for mobile

## Workflow

Run the 4-step search sequence from: `.agent/workflows/mobile-uiux-promax.md`

**Read the workflow file before responding.** It contains the exact search commands to run.

## Core Design Principles (Memorize These)

### 1. Platform-First, Not Platform-Only
- Follow platform conventions by default
- Deviate only when there's clear UX benefit to users
- Cross-platform apps must feel native on each platform, not identical
- iOS users expect swipe-back + tab bar at bottom; Android users expect system back + nav structure

### 2. Thumb Zone Above All
- Primary actions belong in the bottom 60% of the screen
- Top-left corner = hardest to reach one-handed
- Platform back buttons (iOS top-left) are the only justified exception

### 3. Gesture + Haptic + Visual = One Interaction
- Every interaction should engage all three senses when appropriate
- Swipe reveals → haptic at threshold + visual action button
- Toggle → haptic on state change + visual state update simultaneously
- Pull-to-refresh → haptic on trigger + spinner animation + announce to screen readers

### 4. Accessibility Is Not Optional
- Minimum touch target: 44pt (iOS) / 48dp (Android)
- Every tappable element without visible text needs `accessibilityLabel`
- Every gesture needs an accessible alternative action
- Test with VoiceOver (iOS) and TalkBack (Android) before shipping
- Support Dynamic Type / sp font scaling (never lock font size)

### 5. Reduce Motion Is a Hard Requirement
- Check `UIAccessibility.isReduceMotionEnabled` (iOS) and `LocalReduceMotion` (Compose) everywhere you animate
- Replace slides with fades; replace springs with eases; reduce or eliminate particle effects
- Haptics are NOT animation — keep them even when reducing motion

### 6. Safe Area = Non-Negotiable
- Never hardcode padding for device-specific areas
- Always use `safeAreaInsets` / `SafeAreaView` / `WindowInsets` APIs
- Test on iPhone SE (small), iPhone 14 Pro (Dynamic Island), and latest iPad

## Pre-Delivery Checklist

Before presenting any design decision, implementation, or code:

**Layout & Ergonomics**
- [ ] Touch targets ≥ 44pt / 48dp everywhere
- [ ] Safe area insets respected on all edges
- [ ] Primary actions in thumb-reachable zone (bottom 60%)
- [ ] Content not hidden behind notch / Dynamic Island / home indicator
- [ ] Keyboard avoidance implemented for any screen with text inputs

**Platform Conventions**
- [ ] Back navigation: iOS swipe-back enabled + button; Android system back handled
- [ ] Navigation pattern matches platform idiom (tab bar on iOS; nav bar or drawer on Android)
- [ ] Status bar style contrasts with content behind it
- [ ] Haptic feedback added for primary interactions (where hardware supports)

**Accessibility**
- [ ] VoiceOver/TalkBack labels on all interactive elements
- [ ] Heading traits applied to screen titles and section headers
- [ ] Custom gesture actions available via accessibility Actions menu
- [ ] Dynamic Type / sp units used (no fixed font sizes)
- [ ] Color contrast ≥ 4.5:1 for body text; ≥ 3:1 for large text / UI
- [ ] Color information supplemented with shape/icon/text

**Motion**
- [ ] `reduceMotion` check before every animation
- [ ] Animation duration appropriate (200-400ms for most; <200ms for micro)
- [ ] Spring used for natural feel on expand/appear; ease-out for dismiss/collapse

**Dark Mode**
- [ ] All colors defined as adaptive (no hardcoded hex for any UI color)
- [ ] Test on OLED (true black matters for pure black backgrounds)
- [ ] Images and media contrast tested in both appearances

## Stack-Specific Reminders

### React Native
- Use `react-native-safe-area-context` not built-in SafeAreaView
- Use `react-native-reanimated` for gesture-driven animations
- Use `react-native-gesture-handler` for complex touch interactions
- FlatList not ScrollView for lists with 20+ items
- `useNativeDriver: true` on every `Animated.timing()`

### Flutter
- `ListView.builder` not `Column + ForEach` for long lists
- `const` constructors everywhere possible
- `GoRouter` for navigation with deep link support
- `Riverpod` for state management
- `cached_network_image` for network images

### SwiftUI
- `NavigationStack` not deprecated `NavigationView` (iOS 16+)
- `@StateObject` not `@ObservedObject` for own ViewModels
- `LazyVStack` not `VStack` for long lists
- `matchedGeometryEffect` for hero-like shared element transitions
- `@Environment(\.accessibilityReduceMotion)` before any animation

### Jetpack Compose
- `LazyColumn` with `key = { it.id }` for lists
- `derivedStateOf` for computed state values
- `StatefulShellRoute` for tab persistence in GoRouter
- `collectAsStateWithLifecycle()` in all state collection
- `WindowCompat.setDecorFitsSystemWindows(window, false)` for edge-to-edge

## Key Data Sources Baked Into Database

| Domain | Authority |
|--------|-----------|
| iOS conventions | Apple Human Interface Guidelines |
| Android conventions | Material Design 3 |
| React Native patterns | React Navigation docs + RN official docs |
| Flutter patterns | Flutter official docs + pub.dev best packages |
| SwiftUI patterns | Apple developer documentation |
| Compose patterns | Android Jetpack documentation |
| Accessibility | WCAG 2.1 + iOS Accessibility + Android Accessibility |
| Animation timing | Platform-standard specs (iOS spring / MD3 motion) |
