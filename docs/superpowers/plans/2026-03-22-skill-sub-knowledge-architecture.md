# Skill Sub-Knowledge Architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deep reference knowledge files to the `mobile-developer` skill, with selective loading based on project stack.

**Architecture:** Add a `references/` directory inside `mobile-developer/` containing 4 platform-specific reference files (~1000+ words each). Update `SKILL.md` with a `Platform References` section that instructs AI to detect the project stack and load the matching file(s).

**Tech Stack:** Markdown documentation, distilled from Vercel agent-skills repo (React Native) and official docs (Flutter, iOS, Android).

**Design Spec:** `docs/superpowers/specs/2026-03-22-skill-sub-knowledge-architecture-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `.agent/skills/mobile-developer/SKILL.md` | Add Platform References section at end |
| Create | `.agent/skills/mobile-developer/references/react-native.md` | React Native + Expo deep reference |
| Create | `.agent/skills/mobile-developer/references/flutter.md` | Flutter + Dart deep reference |
| Create | `.agent/skills/mobile-developer/references/ios-native.md` | SwiftUI / UIKit deep reference |
| Create | `.agent/skills/mobile-developer/references/android-native.md` | Kotlin / Jetpack Compose deep reference |

---

### Task 1: Update SKILL.md with Platform References Section

**Files:**
- Modify: `.agent/skills/mobile-developer/SKILL.md:142-143` (append after last line)

- [ ] **Step 1: Add Platform References section**

Append the following section at the end of the existing SKILL.md:

```markdown
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
```

- [ ] **Step 2: Verify SKILL.md has the new section**

Run: `grep -c "Platform References" .agent/skills/mobile-developer/SKILL.md`
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add .agent/skills/mobile-developer/SKILL.md
git commit -m "feat(mobile-developer): add Platform References section for selective sub-knowledge loading"
```

---

### Task 2: Create React Native Reference

**Files:**
- Create: `.agent/skills/mobile-developer/references/react-native.md`

**Sources to reference while writing:**
- Vercel `agent-skills/react-native-skills` rules (40+ rule files): https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills/rules
- Read the Vercel SKILL.md for category overview: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-native-skills/SKILL.md
- Distill key rules from each priority category into our 7-section template

- [ ] **Step 1: Read Vercel rule files for each category**

Read these key rule files from the Vercel repo to distill best patterns:

```
# CRITICAL
rules/list-performance-virtualize.md
rules/list-performance-function-references.md
rules/list-performance-item-memo.md

# HIGH  
rules/animation-gpu-properties.md
rules/animation-derived-value.md
rules/navigation-native-navigators.md
rules/ui-expo-image.md
rules/ui-pressable.md
rules/ui-safe-area-scroll.md
rules/scroll-position-no-state.md

# MEDIUM
rules/react-state-minimize.md
rules/react-state-dispatcher.md
rules/react-compiler-destructure-functions.md
rules/rendering-text-in-text-component.md
rules/rendering-no-falsy-and.md
rules/ui-styling.md
```

- [ ] **Step 2: Write `react-native.md` following the 7-section template**

Content must cover (~1000+ words):

1. **Project Setup & Detection** — `package.json` with `react-native`/`expo`, Expo project structure, key files (`app.json`, `metro.config.js`, `babel.config.js`)
2. **Architecture Patterns** — Feature-based folder structure, Zustand/Redux Toolkit for state, React Navigation v7 / expo-router, New Architecture (TurboModules/Fabric)
3. **Performance Optimization** — Hermes engine, FlashList/LegendList (from Vercel), GPU-only animations (transform/opacity), `useDerivedValue`, scroll position handling, React Compiler compatibility
4. **Common Libraries Ecosystem** — Table with categories: Navigation, State, Networking, Storage, Images, Animation, Testing, Security, OTA
5. **Anti-Patterns & Gotchas** — Distilled from Vercel rules: text not in `<Text>`, falsy `&&`, ScrollView for lists, inline objects in renderItem, `TouchableOpacity` vs `Pressable`, `useState` for scroll position, layout property animations
6. **Testing** — Jest + React Native Testing Library, Detox, Maestro
7. **Deployment & Distribution** — EAS Build, EAS Submit, expo-updates OTA, Hermes bytecode

- [ ] **Step 3: Verify word count**

Run: `wc -w .agent/skills/mobile-developer/references/react-native.md`
Expected: 1000+ words

- [ ] **Step 4: Commit**

```bash
git add .agent/skills/mobile-developer/references/react-native.md
git commit -m "feat(mobile-developer): add React Native deep reference (distilled from Vercel agent-skills)"
```

---

### Task 3: Create Flutter Reference

**Files:**
- Create: `.agent/skills/mobile-developer/references/flutter.md`

- [ ] **Step 1: Research Flutter best practices**

Reference official Flutter docs and community patterns for content accuracy:
- https://docs.flutter.dev/
- https://pub.dev/ (for package ecosystem)

- [ ] **Step 2: Write `flutter.md` following the 7-section template**

Content must cover (~1000+ words):

1. **Project Setup & Detection** — `pubspec.yaml`, Flutter project structure, `lib/` directory, `analysis_options.yaml`
2. **Architecture Patterns** — Clean Architecture / Riverpod architecture, BLoC pattern, Provider vs Riverpod vs GetX, `go_router` for navigation, widget composition
3. **Performance Optimization** — `const` constructors, `RepaintBoundary`, Impeller rendering engine, DevTools Performance view, `ListView.builder` vs `ListView`, shader warmup
4. **Common Libraries Ecosystem** — Table: State (Riverpod, BLoC, Provider), HTTP (dio, http), Storage (shared_preferences, hive, drift), Navigation (go_router), Testing (mockito, bloc_test), Images (cached_network_image)
5. **Anti-Patterns & Gotchas** — `setState` in large trees, deeply nested widget trees (extract widgets), missing `const`, `FutureBuilder` in `build()` without caching, platform channel misuse
6. **Testing** — `flutter_test`, `mockito`, `bloc_test`, integration testing with `integration_test`, golden tests
7. **Deployment & Distribution** — `flutter build`, Fastlane, Codemagic, Shorebird (code push)

- [ ] **Step 3: Verify word count**

Run: `wc -w .agent/skills/mobile-developer/references/flutter.md`
Expected: 1000+ words

- [ ] **Step 4: Commit**

```bash
git add .agent/skills/mobile-developer/references/flutter.md
git commit -m "feat(mobile-developer): add Flutter deep reference"
```

---

### Task 4: Create iOS Native Reference

**Files:**
- Create: `.agent/skills/mobile-developer/references/ios-native.md`

- [ ] **Step 1: Research iOS/SwiftUI best practices**

Reference official Apple docs:
- https://developer.apple.com/documentation/swiftui
- https://developer.apple.com/design/human-interface-guidelines

- [ ] **Step 2: Write `ios-native.md` following the 7-section template**

Content must cover (~1000+ words):

1. **Project Setup & Detection** — `*.xcodeproj`, `Package.swift`, Xcode project structure, `Info.plist`, SPM vs CocoaPods
2. **Architecture Patterns** — MVVM with SwiftUI, The Composable Architecture (TCA), Coordinator pattern, SwiftUI `@Observable` (iOS 17+), SwiftData vs Core Data
3. **Performance Optimization** — Instruments profiling, `LazyVStack`/`LazyHStack`, `@State` vs `@Binding` vs `@Environment`, background tasks with `BGTaskScheduler`, `NWPathMonitor`
4. **Common Libraries Ecosystem** — Table: Networking (URLSession, Alamofire), Storage (SwiftData, Core Data, UserDefaults, Keychain), UI (SwiftUI built-ins), Testing (XCTest, Swift Testing), Dependencies (SPM)
5. **Anti-Patterns & Gotchas** — Massive view bodies (extract subviews), force unwrapping, missing `@MainActor`, synchronous network calls, ignoring `Sendable` requirements (Swift 6)
6. **Testing** — XCTest, Swift Testing framework, UI testing with XCUITest, snapshot testing
7. **Deployment & Distribution** — Xcode Archive, App Store Connect, TestFlight, Fastlane, entitlements and capabilities

- [ ] **Step 3: Verify word count**

Run: `wc -w .agent/skills/mobile-developer/references/ios-native.md`
Expected: 1000+ words

- [ ] **Step 4: Commit**

```bash
git add .agent/skills/mobile-developer/references/ios-native.md
git commit -m "feat(mobile-developer): add iOS native deep reference"
```

---

### Task 5: Create Android Native Reference

**Files:**
- Create: `.agent/skills/mobile-developer/references/android-native.md`

- [ ] **Step 1: Research Android/Compose best practices**

Reference official Android docs:
- https://developer.android.com/develop/ui/compose
- https://developer.android.com/design

- [ ] **Step 2: Write `android-native.md` following the 7-section template**

Content must cover (~1000+ words):

1. **Project Setup & Detection** — `build.gradle.kts` / `build.gradle`, Android project structure, `AndroidManifest.xml`, Gradle version catalog
2. **Architecture Patterns** — MVVM with ViewModel + StateFlow, Navigation Compose, Hilt/Koin for DI, Repository pattern, modularization by feature
3. **Performance Optimization** — Compose stability & skipping, `@Stable`/`@Immutable` annotations, `LazyColumn` with keys, baseline profiles, R8 minification, StrictMode
4. **Common Libraries Ecosystem** — Table: Networking (Retrofit, Ktor), Storage (Room, DataStore, EncryptedSharedPreferences), DI (Hilt, Koin), UI (Material 3, Coil/Glide), Testing (JUnit, Espresso, Compose Testing)
5. **Anti-Patterns & Gotchas** — Recomposition traps (unstable lambdas, list parameters), `remember` misuse, blocking main thread, missing ProGuard rules, hardcoded dimensions
6. **Testing** — JUnit 5, Compose UI testing, Espresso, Robolectric, MockK
7. **Deployment & Distribution** — Android App Bundle (.aab), Google Play Console, internal testing tracks, Fastlane, signing configs

- [ ] **Step 3: Verify word count**

Run: `wc -w .agent/skills/mobile-developer/references/android-native.md`
Expected: 1000+ words

- [ ] **Step 4: Commit**

```bash
git add .agent/skills/mobile-developer/references/android-native.md
git commit -m "feat(mobile-developer): add Android native deep reference"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Verify directory structure**

```bash
ls -la .agent/skills/mobile-developer/references/
```

Expected: 4 files (react-native.md, flutter.md, ios-native.md, android-native.md)

- [ ] **Step 2: Verify all reference files exist and meet word count**

```bash
test -f .agent/skills/mobile-developer/references/react-native.md && echo "✅ react-native.md"
test -f .agent/skills/mobile-developer/references/flutter.md && echo "✅ flutter.md"
test -f .agent/skills/mobile-developer/references/ios-native.md && echo "✅ ios-native.md"
test -f .agent/skills/mobile-developer/references/android-native.md && echo "✅ android-native.md"

wc -w .agent/skills/mobile-developer/references/*.md
```

Expected: Each file 1000+ words, 4 ✅ checks

- [ ] **Step 3: Verify SKILL.md has Platform References section**

```bash
grep -A 10 "Platform References" .agent/skills/mobile-developer/SKILL.md
```

Expected: Shows the stack indicator table

- [ ] **Step 4: Final commit (if any remaining changes)**

```bash
git add .
git commit -m "feat(mobile-developer): complete sub-knowledge architecture pilot"
```
