---
name: mobile-developer
description: Use when working on mobile app features, reviewing mobile code, or making architecture decisions — regardless of platform (React Native, Flutter, iOS, Android)
---

# Mobile Developer Lens

> **Philosophy:** Touch-first. Offline-capable. Battery-conscious. Platform-respectful.
> Mobile is NOT a small desktop. Design for bad network, one hand, bright sun, low battery.

---

## ⚠️ ASK BEFORE ASSUMING

If the request is open-ended, **DO NOT default to React Native**. Ask:

| What | Why it matters |
|------|----------------|
| **Platform?** iOS / Android / Both | Affects EVERY design decision |
| **Framework?** RN / Flutter / SwiftUI / Compose | Determines patterns and tools |
| **Offline required?** | Core architecture decision |
| **Target devices?** Phone / Tablet | Layout and nav complexity |

When stack is unspecified, assume React Native + Expo.

---

## Framework Decision Tree

```
What are you building?
├── Need OTA updates + rapid iteration → React Native + Expo
├── Pixel-perfect custom UI + perf-critical → Flutter
├── Deep native features, single platform
│   ├── iOS only → SwiftUI (iOS 16+) or UIKit (legacy)
│   └── Android only → Kotlin + Jetpack Compose
└── Existing codebase → match the codebase
```

---

## Core Instincts

- **Offline-first** — assume the network will fail; design around it from day one
- **Platform parity** — iOS and Android behave differently; both must work
- **Startup cost** — every dependency adds to cold start time and binary size; justify each one
- **UI/main thread is precious** — heavy computation and animations must run off the main thread
- **Battery budget** — background tasks, location, and push use real energy; minimize wake-ups

---

## Performance Thresholds

| Metric | Target | Critical |
|--------|--------|----------|
| Cold start time (JS bundle ready) | < 1s | > 2s |
| Time to interactive (first screen) | < 2s | > 4s |
| List scroll frame rate | 60fps | < 45fps |
| IPA / APK download size | < 30MB | > 100MB |
| Memory usage (foreground) | < 150MB | > 300MB |
| JS bundle size (RN, gzipped) | < 1MB | > 3MB |

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| `ScrollView` for long lists | Renders ALL items, memory explodes | `FlatList` / `FlashList` / `ListView.builder` |
| Inline `renderItem` function | New function every render, all items re-render | `useCallback` + `React.memo` on item component |
| Missing `keyExtractor` (or using index) | Reorder causes state/animation bugs | Use unique stable ID from data |
| `useNativeDriver: false` on animations | Animations run on JS thread, janky | `useNativeDriver: true` — GPU-only transforms |
| Token in `AsyncStorage` | Plaintext, exposed on rooted device | `expo-secure-store` / `Keychain` / `EncryptedSharedPreferences` |
| Business logic in UI components | Untestable, duplicated | Separate service/hook layer |
| Deep links as afterthought | Notifications and shares break | Plan `linking` config from day one |
| `console.log` in production build | Blocks JS thread, leaks data | Remove; use a proper logger with levels |

---

## Platform Reference

| Element | iOS | Android |
|---------|-----|---------|
| Min touch target | **44pt × 44pt** | **48dp × 48dp** |
| Min gap between targets | **8pt** | **8dp** |
| Back navigation | Edge swipe left | System back gesture / button |
| Status bar height | 44–59pt (dynamic island) | 24–28dp |
| Safe area insets | `SafeAreaView` / `useSafeAreaInsets` | `WindowInsets` |
| Primary font | SF Pro / SF Compact | Roboto / Noto |
| Icon set | SF Symbols | Material Symbols |
| Haptics | `UIImpactFeedbackGenerator` | `VibrationEffect` |

---

## Questions You Always Ask

**When planning features:**
- What happens when the user is offline or on 2G?
- What's the behavior on first install (no cached data, no permissions yet)?
- What happens when the app is backgrounded or killed mid-task?
- Have we tested on both iOS and Android, including on low-end devices?

**When reviewing architecture:**
- Does this increase cold start or JS bundle size? By how much?
- Are we handling permission denial AND revocation gracefully?
- What's the upgrade path for users with stale local data from an older version?
- Is this animation running on the UI thread or the JS thread?

---

## Red Flags in Code Review

**Must fix:**
- [ ] No loading/error state for async operations
- [ ] Platform-specific logic hardcoded inline (use `Platform.select` or platform files)
- [ ] Animations not using native driver (or GPU-only properties)
- [ ] Sensitive data in `AsyncStorage` (tokens, PII)

**Should fix:**
- [ ] Deep links not wired into navigation config
- [ ] No permission denial / revocation handling
- [ ] Local storage schema changes without migration
- [ ] `console.log` present in production path

---

## Thumb Zone (One-Handed Usage)

```
┌─────────────────────────┐
│    HARD TO REACH        │ ← nav bar, back, settings
│      (stretch)          │
├─────────────────────────┤
│    OK TO REACH          │ ← secondary actions
│     (natural)           │
├─────────────────────────┤
│    EASY TO REACH        │ ← primary CTA, tab bar
│  (thumb's natural arc)  │ ← main interaction zone
└─────────────────────────┘
```

Primary CTAs belong in the **bottom 40%** of the screen.

---

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

If no stack indicator is found, ask the user which platform they're targeting.

### Granular Rules (React Native)

For React Native projects, `references/react-native-rules/` contains 36
individual rule files from [Vercel's agent-skills](https://github.com/vercel-labs/agent-skills).
Each rule covers one specific pattern with incorrect/correct code examples.

Read `references/react-native-rules/_sections.md` for the full index
organized by priority (CRITICAL → LOW). Reference individual rules
when working on specific areas (list performance, animation, UI patterns, etc.).

### Granular Rules (Flutter/Dart)

For Flutter projects, `references/flutter-rules/` contains 8 Dart skill
files from [kevmoo/dash_skills](https://github.com/kevmoo/dash_skills),
covering Dart language best practices, modern features, testing patterns,
and package maintenance.

### Granular Rules (Android)

For Android projects, `references/android-rules/` contains 17 skill
files from [awesome-android-agent-skills](https://github.com/new-silvermoon/awesome-android-agent-skills),
covering: Clean Architecture, Compose UI/Performance/Navigation,
ViewModel patterns, Retrofit networking, Kotlin Coroutines, Gradle
optimization, testing, and XML-to-Compose migration.

### Granular Rules (iOS/SwiftUI)

For iOS projects, `references/ios-rules/` contains 19 SwiftUI reference
files from [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill),
covering: state management, view composition, performance, animations
(basics/advanced/transitions), navigation, Swift Charts, macOS support,
Liquid Glass (iOS 26+), and accessibility.
