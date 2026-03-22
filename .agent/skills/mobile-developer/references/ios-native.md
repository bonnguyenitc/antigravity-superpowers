# iOS Native (SwiftUI / UIKit) Reference

> **Philosophy:** Platform-native, human-interface-first. Respect Apple's design language.
> SwiftUI for new code, UIKit for legacy and complex custom views.

---

## Project Setup & Detection

**Stack indicators:** `*.xcodeproj`, `*.xcworkspace`, `Package.swift`, or `*.swift` files.

**Key config files:**

| File | Purpose |
|------|---------|
| `*.xcodeproj` / `*.xcworkspace` | Xcode project/workspace configuration |
| `Info.plist` | App metadata, permissions, capabilities |
| `Package.swift` | Swift Package Manager dependencies |
| `Podfile` | CocoaPods dependencies (legacy) |
| `*.entitlements` | App capabilities (push, iCloud, etc.) |
| `Assets.xcassets` | App icons, images, colors |

**Recommended project structure:**

```
MyApp/
  App/
    MyAppApp.swift              # @main entry point
    ContentView.swift           # Root view
  Features/
    Auth/
      Views/LoginView.swift
      ViewModels/AuthViewModel.swift
      Models/User.swift
      Services/AuthService.swift
    Home/
      Views/HomeView.swift
      ViewModels/HomeViewModel.swift
  Shared/
    Components/                 # Reusable SwiftUI views
    Extensions/                 # Swift extensions
    Services/                   # Networking, storage
    Utilities/                  # Helpers
  Resources/
    Assets.xcassets
    Localizable.xcstrings
```

---

## Architecture Patterns

### MVVM (Recommended for SwiftUI)

```swift
// ViewModel
@Observable
class ProfileViewModel {
    var user: User?
    var isLoading = false
    var error: Error?

    func loadProfile() async {
        isLoading = true
        defer { isLoading = false }
        do {
            user = try await userService.fetchProfile()
        } catch {
            self.error = error
        }
    }
}

// View
struct ProfileView: View {
    @State private var viewModel = ProfileViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let user = viewModel.user {
                UserProfileContent(user: user)
            }
        }
        .task { await viewModel.loadProfile() }
    }
}
```

### State Management

| Property Wrapper | Use When |
|-----------------|----------|
| `@State` | View-local value types (toggles, text input) |
| `@Binding` | Pass write access to a child view |
| `@Observable` (iOS 17+) | ViewModel or shared model classes |
| `@Environment` | Inject dependencies or system values |
| `@AppStorage` | Persist simple values to UserDefaults |

**SwiftData** (iOS 17+) replaces Core Data for persistence:

```swift
@Model
class Task {
    var title: String
    var isComplete: Bool
    var createdAt: Date

    init(title: String) {
        self.title = title
        self.isComplete = false
        self.createdAt = .now
    }
}
```

### The Composable Architecture (TCA)

For complex apps needing predictable state, testable effects, and feature composition:
- Centralized state tree with reducers
- Side effects managed through `Effect` type
- Built-in testing with `TestStore`
- Steep learning curve but excellent testability

### Navigation

**NavigationStack** (iOS 16+) — type-safe, value-driven navigation:

```swift
NavigationStack(path: $path) {
    HomeView()
        .navigationDestination(for: Item.self) { item in
            ItemDetailView(item: item)
        }
}
```

- Use `NavigationSplitView` for iPad/Mac adaptive layouts
- Use `sheet()` and `fullScreenCover()` for modals
- Deep link handling through `.onOpenURL`

---

## Performance Optimization

### Critical Thresholds

| Metric | Target | Investigate |
|--------|--------|-------------|
| App launch (time to first frame) | < 1s | > 2s |
| Memory (foreground) | < 100MB | > 200MB |
| UI frame rate | 60fps / 120fps (ProMotion) | < 60fps |
| Binary size | < 30MB | > 100MB |

### Key Optimizations

1. **`LazyVStack` / `LazyHStack`** — only creates views when they scroll into the visible area.

```swift
// ❌ Bad: creates all rows immediately
VStack { ForEach(items) { ItemRow(item: $0) } }

// ✅ Good: lazy, only visible rows created
LazyVStack { ForEach(items) { ItemRow(item: $0) } }
```

2. **Avoid recomputing views** — extract subviews, use `@Observable` fine-grained tracking.

3. **Background tasks** — use `BGTaskScheduler` for deferred work (push refresh, data sync). Minimize wake-ups for battery.

4. **Network monitoring** — use `NWPathMonitor` to detect connectivity changes and adapt behavior.

5. **Instruments profiling:**
   - **Time Profiler** — find slow functions
   - **Allocations** — track memory leaks
   - **SwiftUI** instrument — identify excessive view body evaluations
   - **Energy Log** — battery impact analysis

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **Networking** | `URLSession` (built-in) | `Alamofire` |
| **JSON** | `Codable` (built-in) | — |
| **Storage (simple)** | `UserDefaults` / `@AppStorage` | — |
| **Storage (encrypted)** | `Keychain Services` | `KeychainAccess` |
| **Database** | `SwiftData` (iOS 17+) | `Core Data`, `GRDB`, `Realm` |
| **Images** | `AsyncImage` (built-in) | `Kingfisher`, `Nuke` |
| **DI** | `@Environment` / manual | `Factory`, `Swinject` |
| **Analytics** | `Firebase Analytics` | `Mixpanel`, `Amplitude` |
| **Testing** | `Swift Testing` + `XCTest` | — |
| **Linting** | `SwiftLint` | `swift-format` |
| **Package Manager** | Swift Package Manager | CocoaPods (legacy) |

**Prefer built-in frameworks** — Apple provides excellent APIs. Only add third-party dependencies when built-in solutions are insufficient.

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| Massive `body` properties (100+ lines) | SwiftUI compiles slow, unreadable | Extract into named subviews |
| Force unwrapping (`!`) | Crash at runtime | `guard let`, `if let`, or `??` with default |
| Missing `@MainActor` on UI updates | Crash from background thread | Annotate ViewModels with `@MainActor` |
| Synchronous network calls | Blocks main thread, UI freezes | `async/await` with `Task {}` |
| Ignoring `Sendable` (Swift 6) | Concurrency warnings → errors in Swift 6 | Mark types `Sendable`, use actors for mutable state |
| Core Data for new projects | Complex, boilerplate-heavy | SwiftData (iOS 17+) for new code |
| `ObservableObject` (legacy) | Less efficient than `@Observable` | Use `@Observable` macro (iOS 17+) |
| `AnyView` for type erasure | Breaks SwiftUI diffing, poor performance | Use `@ViewBuilder`, generics, or concrete types |
| Navigation via state booleans | Unscalable, unmaintainable | `NavigationStack` with value-based navigation |
| Tight coupling to UIKit | Limits SwiftUI adoption | Use `UIViewRepresentable` only when needed |

### Swift 6 Concurrency

Swift 6 enforces strict concurrency checking:
- All mutable shared state must be in `actor` or `@MainActor`
- Types crossing concurrency boundaries must conform to `Sendable`
- Enable strict concurrency checking early: `SWIFT_STRICT_CONCURRENCY = complete`

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | `Swift Testing` (new) / `XCTest` | Logic, ViewModels, services |
| **UI** | `XCUITest` | Full UI flow automation |
| **Snapshot** | `swift-snapshot-testing` | Visual regression |
| **Performance** | `XCTest` + `measure {}` | Execution time benchmarks |

**Swift Testing** (Xcode 16+) replaces XCTest with modern syntax:

```swift
import Testing

@Test func userDisplayName() {
    let user = User(first: "John", last: "Doe")
    #expect(user.displayName == "John Doe")
}

@Test(arguments: ["", " ", "   "])
func rejectsBlankNames(name: String) {
    #expect(throws: ValidationError.self) {
        try User(name: name)
    }
}
```

- Use `@MainActor` on tests that touch UI state
- Mock network with `URLProtocol` subclass — no third-party mock library needed
- Golden/snapshot testing for design-system components

---

## Deployment & Distribution

### Build & Release

```bash
# Archive for distribution
xcodebuild archive -scheme MyApp -archivePath build/MyApp.xcarchive

# Export IPA
xcodebuild -exportArchive -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist -exportPath build/
```

### Distribution Channels

| Channel | Use When |
|---------|----------|
| **TestFlight** | Internal + external beta testing (up to 10,000 testers) |
| **App Store Connect** | Production release |
| **Ad Hoc** | Direct install for registered devices |
| **Enterprise** | In-house apps (requires Enterprise Program) |

### CI/CD

| Tool | Strength |
|------|----------|
| **Xcode Cloud** | Apple-native, integrated with App Store Connect |
| **Fastlane** | Community standard, `match` for code signing |
| **GitHub Actions** + `macos-latest` | Free for open source |

### Fastlane essentials

```bash
# Install
gem install fastlane

# Beta release
fastlane beta    # build + upload to TestFlight

# Production release
fastlane release # build + upload to App Store
```

### Entitlements & Capabilities
- Configure in Xcode → Signing & Capabilities
- Push Notifications, In-App Purchase, iCloud, HealthKit each require specific entitlements
- App Groups for sharing data between app and extensions (widgets, intents)
