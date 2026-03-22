# Flutter + Dart Reference

> **Philosophy:** Everything is a widget. Composition over inheritance. Declarative UI with immutable state.
> Flutter owns the pixels — no bridge, no compromise.

---

## Project Setup & Detection

**Stack indicators:** `pubspec.yaml` file in project root.

**Key config files:**

| File | Purpose |
|------|---------|
| `pubspec.yaml` | Dependencies, assets, metadata |
| `analysis_options.yaml` | Linter rules and static analysis |
| `lib/main.dart` | App entry point |
| `android/` | Android-specific config (Gradle, manifest) |
| `ios/` | iOS-specific config (Xcode project, Info.plist) |
| `.dart_tool/` | Generated config (do not edit) |

**Recommended project structure (feature-based):**

```
lib/
  app/
    app.dart                  # MaterialApp / CupertinoApp setup
    router.dart               # GoRouter configuration
  features/
    auth/
      presentation/
        login_screen.dart
        widgets/auth_form.dart
      domain/
        auth_repository.dart
      data/
        auth_api.dart
    home/
      presentation/
        home_screen.dart
  shared/
    widgets/                  # Reusable UI widgets
    extensions/               # Dart extension methods
    theme/                    # ThemeData, colors, typography
    utils/                    # Pure utility functions
  main.dart                   # Entry point, ProviderScope
```

---

## Architecture Patterns

### State Management

| Approach | Use When |
|----------|----------|
| **Riverpod** (recommended) | Most apps — compile-safe, testable, fine-grained reactivity |
| **BLoC** | Teams familiar with reactive streams, complex event-driven flows |
| **Provider** | Simpler apps, legacy codebases (Riverpod supersedes Provider) |
| **GetX** | Rapid prototyping only — avoid for production (magic, hard to test) |

**Riverpod patterns:**
- Use `@riverpod` annotation (code generation) for type-safe providers
- Prefer `AsyncNotifier` over `StateNotifier` (built-in async handling)
- Keep providers at feature level, not global
- Use `ref.watch()` for reactive, `ref.read()` for one-shot

### Navigation

**`go_router`** (recommended) — declarative, type-safe routing with deep link support.

```dart
final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/profile/:id', builder: (_, state) =>
      ProfileScreen(id: state.pathParameters['id']!)),
  ],
);
```

- Use `ShellRoute` for persistent bottom navigation
- Use `StatefulShellRoute` for preserving tab state
- Define routes as constants to avoid typos

### Widget Composition

- **Extract widgets into separate classes** — don't build deeply nested widget trees in a single `build()` method
- **Use `const` constructors** wherever possible — marks widget subtrees as immutable so Flutter skips rebuilding them
- **Prefer composition over inheritance** — compose widgets from smaller pieces rather than extending
- **Keep `build()` methods lean** — if a build method exceeds ~50 lines, extract sub-widgets

---

## Performance Optimization

### Critical Rules

| Metric | Target | Investigate |
|--------|--------|-------------|
| App startup | < 2s | > 3s |
| Frame rendering | 16ms (60fps) | > 16ms (jank) |
| APK size | < 20MB | > 50MB |
| Memory (foreground) | < 150MB | > 300MB |

### Key Optimizations

1. **`const` constructors everywhere** — prevents unnecessary rebuilds. A `const` widget is created once and reused.

```dart
// ❌ Bad: rebuilds every time parent rebuilds
return Container(color: Colors.blue, child: Text('Hello'));

// ✅ Good: created once, never rebuilt
return const SizedBox(height: 16);
```

2. **`RepaintBoundary`** — isolates repaint regions for complex widgets (animations, canvases). Prevents entire subtree from repainting.

3. **`ListView.builder`** over `ListView` — lazy construction, only builds visible items.

```dart
// ❌ Bad: builds all children immediately
ListView(children: items.map((i) => ItemCard(i)).toList());

// ✅ Good: lazy, only visible items built
ListView.builder(
  itemCount: items.length,
  itemBuilder: (_, i) => ItemCard(items[i]),
);
```

4. **Impeller rendering engine** — Flutter's new graphics engine (default on iOS, opt-in on Android). Eliminates shader compilation jank.

5. **Avoid `setState` in large widget trees** — use fine-grained state solutions (Riverpod, BLoC) to rebuild only affected widgets.

6. **Profile with DevTools** — use the Performance overlay to identify jank, the Widget Inspector for layout issues, and the Memory view for leaks.

### Shader Warmup

For custom shaders, warm them up during a splash screen to avoid first-frame jank:

```dart
await ShaderConfiguration()
  .warmupShader('shaders/gradient.frag');
```

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **State** | `riverpod` + `riverpod_generator` | `flutter_bloc`, `provider` |
| **Navigation** | `go_router` | `auto_route` |
| **HTTP** | `dio` | `http`, `chopper` |
| **Local Storage** | `shared_preferences` | `hive`, `objectbox` |
| **Database** | `drift` (SQLite) | `isar`, `floor` |
| **Secure Storage** | `flutter_secure_storage` | — |
| **Images** | `cached_network_image` | `extended_image` |
| **JSON** | `json_serializable` + `freezed` | `built_value` |
| **Icons** | `flutter_svg` + `hugeicons` | `font_awesome_flutter` |
| **Forms** | `reactive_forms` | `flutter_form_builder` |
| **Testing** | `mocktail` | `mockito` |
| **Linting** | `very_good_analysis` | `flutter_lints` |
| **Code Gen** | `build_runner` | — |
| **Deep Links** | `go_router` (built-in) | `uni_links` |
| **Analytics** | `firebase_analytics` | `amplitude_flutter` |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| Deeply nested widget trees (10+ levels) | Unreadable, hard to debug, poor perf | Extract into named widget classes |
| `setState` for global/shared state | Rebuilds entire widget subtree | Riverpod/BLoC for shared state |
| `FutureBuilder` with inline `Future` | Re-fetches on every rebuild | Cache Future in `initState` or use `AsyncNotifier` |
| Missing `const` constructors | Unnecessary rebuilds every frame | Add `const` to every eligible constructor |
| `print()` for debugging | No log levels, clutters output | Use `dart:developer` `log()` or `logger` package |
| `dynamic` types everywhere | No compile-time safety | Strong typing with generics + `freezed` |
| Business logic in `build()` | Untestable, mixed concerns | Separate into providers/blocs/services |
| Ignoring `dispose()` | Memory leaks (streams, controllers) | Always dispose controllers, subscriptions |
| Platform channels for simple tasks | Complex, error-prone | Use existing plugins (`url_launcher`, etc.) |
| Single massive `lib/main.dart` | Impossible to navigate or test | Feature-based folder structure |

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | `flutter_test` + `mocktail` | Business logic, providers, repositories |
| **Widget** | `flutter_test` (widget testing) | Component rendering and interaction |
| **BLoC** | `bloc_test` | State machine transitions |
| **Integration** | `integration_test` package | Full app flows on real device/emulator |
| **Golden** | `golden_toolkit` | Visual regression (screenshot comparison) |

**Testing principles:**
- Test behavior through public API, not widget internals
- Use `pumpWidget` + `pumpAndSettle` for async widget tests
- Mock dependencies at the repository/service boundary
- Golden tests for design-system components (catch visual regressions)

```dart
testWidgets('shows login button', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
  expect(find.text('Log In'), findsOneWidget);
});
```

---

## Deployment & Distribution

### Build Commands

```bash
# Debug (hot reload enabled)
flutter run

# Release build
flutter build apk --release          # Android APK
flutter build appbundle --release     # Android App Bundle (Play Store)
flutter build ipa --release           # iOS (requires Xcode)

# Analyze app size
flutter build apk --analyze-size
```

### CI/CD Options

| Tool | Strength |
|------|----------|
| **Codemagic** | Flutter-first CI/CD, code signing built-in |
| **Fastlane** | Flexible, widely adopted, multi-platform |
| **GitHub Actions** | Free for open source, custom workflows |
| **Bitrise** | Mobile-focused, visual workflow builder |

### OTA Code Push

**Shorebird** — Flutter's code push solution. Push Dart code updates without app store review.

```bash
# Initialize Shorebird
shorebird init

# Create a release
shorebird release android
shorebird release ios

# Push a patch
shorebird patch android
shorebird patch ios
```

**Limitations:** Dart code only — native code changes still require full build + store submission.

### App Size Optimization
- Use `--split-per-abi` for Android to reduce per-device APK size
- Enable `--obfuscate --split-debug-info=symbols/` for release builds
- Use deferred components for large features (lazy loading)
- Audit unused packages with `dart pub outdated`

---

## Quick Reference — Granular Rules

Individual Dart skill files in `flutter-rules/` with detailed patterns and
best practices for the Dart language foundation that underpins Flutter development.

> Source: [kevmoo/dash_skills](https://github.com/kevmoo/dash_skills) — Agent Skills for Dart & Flutter ecosystem

### Dart Language & Best Practices

- [dart-best-practices.md](flutter-rules/dart-best-practices.md) — Dart coding best practices
- [dart-modern-features.md](flutter-rules/dart-modern-features.md) — Modern Dart features (patterns, records, sealed classes)
- [dart-cli-app-best-practices.md](flutter-rules/dart-cli-app-best-practices.md) — CLI app patterns

### Testing & Quality

- [dart-test-fundamentals.md](flutter-rules/dart-test-fundamentals.md) — Test patterns with `package:test`
- [dart-matcher-best-practices.md](flutter-rules/dart-matcher-best-practices.md) — Matcher expressions (expect, isA)
- [dart-checks-migration.md](flutter-rules/dart-checks-migration.md) — Migrating from `package:matcher` to `package:checks`

### Documentation & Maintenance

- [dart-doc-validation.md](flutter-rules/dart-doc-validation.md) — Doc comment validation
- [dart-package-maintenance.md](flutter-rules/dart-package-maintenance.md) — Package maintenance standards

