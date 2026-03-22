# React Native + Expo Reference

> **Philosophy:** JavaScript-first, native-quality. Ship fast with OTA updates, but never sacrifice 60fps.
> Expo is the default — eject only when you must.

---

## Project Setup & Detection

**Stack indicators:** `package.json` with `react-native` or `expo` dependency.

**Key config files:**

| File | Purpose |
|------|---------|
| `app.json` / `app.config.js` | Expo configuration (app name, version, plugins) |
| `metro.config.js` | Metro bundler configuration |
| `babel.config.js` | Babel presets and plugins |
| `tsconfig.json` | TypeScript configuration |
| `eas.json` | EAS Build/Submit/Update configuration |

**Recommended project structure (feature-based):**

```
src/
  features/
    auth/
      screens/LoginScreen.tsx
      components/AuthForm.tsx
      hooks/useAuth.ts
      store/authStore.ts
    home/
      screens/HomeScreen.tsx
      components/FeedList.tsx
  shared/
    components/    # Reusable UI components
    hooks/         # Shared hooks
    utils/         # Pure utility functions
    services/      # API clients, storage wrappers
    constants/     # Theme, config values
app/               # expo-router file-based routing
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    settings.tsx
```

---

## Architecture Patterns

### State Management

| Approach | Use When |
|----------|----------|
| **Zustand** (recommended) | Most apps — simple API, selector-based subscriptions, minimal boilerplate |
| **Redux Toolkit** | Large teams, complex state with many reducers, need Redux DevTools |
| **Jotai** | Atomic state, when individual pieces of state are independent |
| **React Context** | Infrequently-changing values (theme, locale, auth status) |

**State design principles:**
- State should be the **minimal source of truth**. If a value can be derived from other state or props, derive it during render — don't store it.
- Use **selector functions** in Zustand to subscribe to specific slices and avoid unnecessary re-renders.
- Keep UI state local (`useState`), share only what multiple components need.

### Navigation

Use **native navigators** over JS-based navigators for performance:

| Navigator | Correct | Incorrect |
|-----------|---------|-----------|
| Stack | `createNativeStackNavigator` / `expo-router Stack` | `createStackNavigator` (JS-based, slow transitions) |
| Tabs | `createNativeBottomTabNavigator` / `expo-router NativeTabs` | `createBottomTabNavigator` (JS-based) |

Native navigators run transitions on the UI thread, provide platform-native gestures, large titles (iOS), search bars, and proper safe area handling automatically.

**Prefer native header options over custom header components.** Native headers support iOS large titles, blur effects, and search bars out of the box.

### New Architecture

React Native's New Architecture includes:
- **TurboModules** — lazy-loaded, synchronous native module access (replaces Bridge)
- **Fabric** — concurrent renderer with synchronous layout (replaces old renderer)
- **Bridgeless mode** — eliminates the JS-native bridge entirely
- **React Compiler** — automatic memoization (eliminates `React.memo`, `useCallback`, `useMemo`)

When using **React Compiler**, `memo()` and `useCallback()` are unnecessary. However, **object reference stability** still matters for list virtualization.

---

## Performance Optimization

### Critical Thresholds

| Metric | Target | Critical |
|--------|--------|----------|
| Cold start (JS bundle ready) | < 1s | > 2s |
| Time to interactive | < 2s | > 4s |
| List scroll frame rate | 60fps | < 45fps |
| JS bundle size (gzipped) | < 1MB | > 3MB |
| IPA/APK download size | < 30MB | > 100MB |

### List Performance (CRITICAL)

**Always use a list virtualizer** — even for short lists. Virtualizers only render visible items, reducing memory and mount time.

| Library | When to Use |
|---------|------------|
| **LegendList** | Default choice — excellent recycling, great performance |
| **FlashList** (@shopify) | Alternative — well-tested, widely adopted |
| **FlatList** (built-in) | Legacy — avoid if possible, use LegendList/FlashList |

**Key rules for list performance:**

1. **Stable object references** — don't `.map()` or `.filter()` data before passing to lists. Transform data inside list items instead.
2. **Pass primitives to list items** — enables shallow comparison in `memo()`. Pass `id`, `name`, `email` instead of entire objects.
3. **Hoist callbacks to list root** — extract `renderItem` and callbacks outside the component, or use `useCallback` if not using React Compiler.
4. **No inline objects in renderItem** — every render creates new references, causing full re-renders of all visible items.
5. **Use compressed images** — large images in lists destroy scroll performance.
6. **Use item types** for heterogeneous lists — helps the virtualizer recycle views correctly.

```tsx
// ❌ Bad: creates new references on every render
<LegendList
  data={items.map(i => ({ ...i, label: i.name.toUpperCase() }))}
  renderItem={({ item }) => <ItemCard item={item} />}
/>

// ✅ Good: stable data, transform inside item
const renderItem = ({ item }) => <ItemCard item={item} />

<LegendList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  estimatedItemSize={80}
/>
```

### Animation (HIGH)

**Only animate GPU-accelerated properties:** `transform` (translate, scale, rotate) and `opacity`. Animating `width`, `height`, `top`, `left`, `margin`, `padding` triggers layout recalculation on every frame.

```tsx
// ❌ Bad: animates height (layout recalc every frame)
useAnimatedStyle(() => ({ height: withTiming(expanded ? 200 : 0) }))

// ✅ Good: animates transform (GPU-accelerated)
useAnimatedStyle(() => ({
  transform: [{ scaleY: withTiming(expanded ? 1 : 0) }],
  opacity: withTiming(expanded ? 1 : 0),
}))
```

- Use `useDerivedValue` over `useAnimatedReaction` for computed animations.
- Use `GestureDetector` (from `react-native-gesture-handler`) for press animations instead of `Pressable`.

### Scroll Performance

**Never track scroll position in useState** — it triggers a JS re-render on every frame. Use `useSharedValue` from Reanimated instead.

### Hermes Engine

Hermes is the default JS engine. It pre-compiles JavaScript to bytecode at build time, reducing cold start time and memory usage. Ensure Hermes is enabled in your project (`"jsEngine": "hermes"` in `app.json`).

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **Navigation** | `expo-router` (file-based) | `@react-navigation/native` (imperative) |
| **State** | `zustand` | `@reduxjs/toolkit`, `jotai` |
| **Server State** | `@tanstack/react-query` | `swr` |
| **HTTP** | `fetch` (built-in) | `axios`, `ky` |
| **Storage (non-sensitive)** | `react-native-mmkv` | `@react-native-async-storage/async-storage` |
| **Storage (sensitive)** | `expo-secure-store` | `react-native-keychain` |
| **Images** | `expo-image` | `react-native-fast-image` |
| **Animation** | `react-native-reanimated` | `react-native-animated` (built-in, limited) |
| **Gestures** | `react-native-gesture-handler` | — |
| **Lists** | `@legendapp/list` (LegendList) | `@shopify/flash-list` (FlashList) |
| **Forms** | `react-hook-form` | `formik` |
| **Modals** | Native `Modal` with `formSheet` | `react-native-bottom-sheet` |
| **Menus** | `zeego` (native context/dropdown) | — |
| **Image Gallery** | `galeria` | — |
| **Icons** | `expo-symbols` (SF Symbols) | `@expo/vector-icons` |
| **Fonts** | Config plugin (native load) | `expo-font` (runtime load) |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| `ScrollView` with `.map()` for lists | Renders ALL items, memory explodes | `LegendList` / `FlashList` |
| `TouchableOpacity` for press | Legacy, limited API | `Pressable` — standard, more flexible |
| Text not wrapped in `<Text>` | Crashes on Android, undefined behavior | Always wrap strings in `<Text>` |
| `{condition && <Component/>}` with falsy value | `0` or `NaN` renders as text on Android | `{condition ? <Component/> : null}` |
| `useState` for scroll position | Re-renders on every frame, janky | `useSharedValue` from Reanimated |
| Inline objects in `style` prop | New reference every render | `StyleSheet.create()` or `borderCurve: 'continuous'` |
| `shadowColor`/`elevation` for shadows | Legacy, inconsistent cross-platform | CSS `boxShadow` string syntax |
| Margin between siblings | Fragile, breaks when children change | `gap` on parent container |
| `LinearGradient` third-party | Extra dependency | `experimental_backgroundImage: 'linear-gradient(...)'` |
| Custom header components | Misses native features (large titles, blur) | Native header `options` |
| `{ borderRadius: 12 }` alone | Sharp iOS corners | Add `borderCurve: 'continuous'` for smooth corners |
| Import entire lodash | Bundle bloat | `import debounce from 'lodash/debounce'` |
| `console.log` in production | Blocks JS thread, leaks data | Use a logger with levels, strip in release |
| Tokens in `AsyncStorage` | Plaintext, exposed on rooted device | `expo-secure-store` / Keychain |

### React Compiler Gotchas

When React Compiler is enabled:
- **Destructure functions early** — the compiler optimizes better with destructured function references.
- **Use `.get()`/`.set()` for Reanimated shared values** — the compiler cannot optimize `.value` property access patterns.

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Jest + React Native Testing Library | Component logic, hooks, utils |
| **Component** | `@testing-library/react-native` | Render + interact with components |
| **E2E** | Maestro | Full flow testing, easy YAML syntax |
| **E2E (alt)** | Detox (Wix) | Full flow testing, JS-based |

**Testing principles:**
- Test behavior, not implementation (don't test component internals)
- Use `screen.getByRole()` and `getByText()` over `getByTestId()`
- Mock native modules at the module level (`jest.mock('expo-secure-store')`)
- Test loading, error, and empty states for every async component

---

## Deployment & Distribution

### EAS (Expo Application Services)

| Service | Purpose |
|---------|---------|
| **EAS Build** | Cloud builds for iOS and Android (no local Xcode/Android Studio needed) |
| **EAS Submit** | Publish to App Store / Google Play directly from CLI |
| **EAS Update** | OTA JavaScript updates (code push without app store review) |

**OTA update strategy:**
- Use `expo-updates` for JS-only changes (bug fixes, UI tweaks)
- Native changes (new native modules, SDK version bump) require a full build + store submission
- Set update channels: `production`, `staging`, `preview`

### Build commands

```bash
# Development build (with dev client)
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA update
eas update --branch production --message "Fix login bug"
```

### App size optimization
- Enable Hermes (pre-compiled bytecode, smaller bundle)
- Use `expo-image` instead of `Image` (optimized loading)
- Tree-shake unused code with Metro bundler
- Use `expo-asset` for preloading critical assets
- Audit dependencies with `npx expo-doctor`

---

## Quick Reference — Granular Rules

Individual rule files in `react-native-rules/` with detailed incorrect/correct
code examples. Read the specific rule when working in that area.

> Source: [Vercel agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills)

### CRITICAL — Core Rendering

- [rendering-text-in-text-component.md](react-native-rules/rendering-text-in-text-component.md) — All text must be inside `<Text>`
- [rendering-no-falsy-and.md](react-native-rules/rendering-no-falsy-and.md) — Avoid falsy `&&` rendering

### HIGH — List Performance

- [list-performance-virtualize.md](react-native-rules/list-performance-virtualize.md) — Always use LegendList/FlashList
- [list-performance-function-references.md](react-native-rules/list-performance-function-references.md) — Stable object references
- [list-performance-item-memo.md](react-native-rules/list-performance-item-memo.md) — Pass primitives for memo
- [list-performance-callbacks.md](react-native-rules/list-performance-callbacks.md) — Hoist callbacks
- [list-performance-inline-objects.md](react-native-rules/list-performance-inline-objects.md) — No inline objects
- [list-performance-images.md](react-native-rules/list-performance-images.md) — Compressed images in lists
- [list-performance-item-types.md](react-native-rules/list-performance-item-types.md) — Item types for recycling
- [list-performance-item-expensive.md](react-native-rules/list-performance-item-expensive.md) — Defer expensive items

### HIGH — Animation

- [animation-gpu-properties.md](react-native-rules/animation-gpu-properties.md) — GPU-only properties (transform, opacity)
- [animation-derived-value.md](react-native-rules/animation-derived-value.md) — useDerivedValue over useAnimatedReaction
- [animation-gesture-detector-press.md](react-native-rules/animation-gesture-detector-press.md) — GestureDetector for press animations

### HIGH — Scroll & Navigation

- [scroll-position-no-state.md](react-native-rules/scroll-position-no-state.md) — Never track scroll in useState
- [navigation-native-navigators.md](react-native-rules/navigation-native-navigators.md) — Native stack/tab navigators

### MEDIUM — React State

- [react-state-minimize.md](react-native-rules/react-state-minimize.md) — Minimize state, derive values
- [react-state-dispatcher.md](react-native-rules/react-state-dispatcher.md) — Dispatch pattern for state
- [react-state-fallback.md](react-native-rules/react-state-fallback.md) — Fallback rendering pattern
- [state-ground-truth.md](react-native-rules/state-ground-truth.md) — State ground truth principles

### MEDIUM — React Compiler

- [react-compiler-destructure-functions.md](react-native-rules/react-compiler-destructure-functions.md) — Destructure functions early
- [react-compiler-reanimated-shared-values.md](react-native-rules/react-compiler-reanimated-shared-values.md) — .get()/.set() for shared values

### MEDIUM — UI Patterns

- [ui-expo-image.md](react-native-rules/ui-expo-image.md) — Use expo-image
- [ui-pressable.md](react-native-rules/ui-pressable.md) — Pressable over TouchableOpacity
- [ui-native-modals.md](react-native-rules/ui-native-modals.md) — Native modal presentations
- [ui-menus.md](react-native-rules/ui-menus.md) — Native context/dropdown menus (zeego)
- [ui-image-gallery.md](react-native-rules/ui-image-gallery.md) — Native image gallery (galeria)
- [ui-measure-views.md](react-native-rules/ui-measure-views.md) — Measure views correctly
- [ui-safe-area-scroll.md](react-native-rules/ui-safe-area-scroll.md) — Safe area with scroll
- [ui-scrollview-content-inset.md](react-native-rules/ui-scrollview-content-inset.md) — ScrollView content inset
- [ui-styling.md](react-native-rules/ui-styling.md) — Modern styling patterns (gap, boxShadow, borderCurve)

### MEDIUM — Design System

- [design-system-compound-components.md](react-native-rules/design-system-compound-components.md) — Compound component pattern

### LOW — Monorepo, Dependencies, JS, Fonts

- [monorepo-native-deps-in-app.md](react-native-rules/monorepo-native-deps-in-app.md) — Native deps in app package
- [monorepo-single-dependency-versions.md](react-native-rules/monorepo-single-dependency-versions.md) — Single dependency versions
- [imports-design-system-folder.md](react-native-rules/imports-design-system-folder.md) — Re-export third-party deps
- [js-hoist-intl.md](react-native-rules/js-hoist-intl.md) — Hoist Intl formatters
- [fonts-config-plugin.md](react-native-rules/fonts-config-plugin.md) — Config plugin for fonts
