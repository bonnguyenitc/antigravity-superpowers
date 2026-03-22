# Android Native (Kotlin / Jetpack Compose) Reference

> **Philosophy:** Material Design, Kotlin-first, Compose-first.
> Lifecycle-aware, configuration-change-safe, backwards-compatible.

---

## Project Setup & Detection

**Stack indicators:** `build.gradle.kts` or `build.gradle`, `AndroidManifest.xml`, `settings.gradle.kts`.

**Key config files:**

| File | Purpose |
|------|---------|
| `build.gradle.kts` (app module) | App dependencies, minSdk, targetSdk, signing |
| `build.gradle.kts` (project) | Plugin versions, repositories |
| `settings.gradle.kts` | Module declarations, version catalog |
| `gradle/libs.versions.toml` | Gradle Version Catalog (centralized dependency versions) |
| `AndroidManifest.xml` | Permissions, components, intent filters |
| `proguard-rules.pro` | R8/ProGuard minification rules |

**Recommended project structure (feature-based, multi-module):**

```
app/
  src/main/
    java/com/example/myapp/
      MyApp.kt                      # Application class
      MainActivity.kt               # Single Activity
      navigation/
        AppNavigation.kt            # NavHost setup
    res/
      values/themes.xml
feature/
  auth/
    src/main/java/.../auth/
      ui/LoginScreen.kt
      LoginViewModel.kt
      data/AuthRepository.kt
  home/
    src/main/java/.../home/
      ui/HomeScreen.kt
      HomeViewModel.kt
core/
  data/                             # Shared data layer
  ui/                               # Shared Compose components
  network/                          # Retrofit setup, API definitions
```

---

## Architecture Patterns

### MVVM with ViewModel + StateFlow

```kotlin
class ProfileViewModel @Inject constructor(
    private val userRepository: UserRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading)
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init { loadProfile() }

    private fun loadProfile() {
        viewModelScope.launch {
            _uiState.value = ProfileUiState.Loading
            userRepository.getProfile()
                .onSuccess { _uiState.value = ProfileUiState.Success(it) }
                .onFailure { _uiState.value = ProfileUiState.Error(it.message) }
        }
    }
}

sealed interface ProfileUiState {
    data object Loading : ProfileUiState
    data class Success(val user: User) : ProfileUiState
    data class Error(val message: String?) : ProfileUiState
}
```

### Dependency Injection

| Framework | Use When |
|-----------|----------|
| **Hilt** (recommended) | Most apps — Google-supported, integrates with ViewModel, WorkManager |
| **Koin** | Lightweight, no annotation processing, multiplatform support |

```kotlin
// Hilt module
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .addConverterFactory(MoshiConverterFactory.create())
        .build()
}

// ViewModel injection
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: ItemRepository,
) : ViewModel()
```

### Navigation

**Navigation Compose** — type-safe with Kotlin serialization:

```kotlin
@Serializable data class Profile(val id: String)

NavHost(navController, startDestination = Home) {
    composable<Home> { HomeScreen(onNavigate = { navController.navigate(Profile(it)) }) }
    composable<Profile> { backStackEntry ->
        val profile: Profile = backStackEntry.toRoute()
        ProfileScreen(id = profile.id)
    }
}
```

- Use **single-Activity** architecture with Compose Navigation
- Use `NavBackStackEntry.toRoute()` for type-safe argument extraction
- Handle deep links via `deepLinks` parameter in `composable()`

---

## Performance Optimization

### Critical Thresholds

| Metric | Target | Investigate |
|--------|--------|-------------|
| Cold start | < 1s | > 2s |
| Frame rendering | 16ms (60fps) | > 32ms |
| APK/AAB size | < 20MB | > 50MB |
| Memory (foreground) | < 150MB | > 300MB |

### Compose Performance

1. **Stability matters** — Compose skips recomposition for stable parameters. Unstable types (lists, lambdas) prevent skipping.

```kotlin
// ❌ Bad: List<Item> is unstable, recomposes every time
@Composable fun ItemList(items: List<Item>) { ... }

// ✅ Good: ImmutableList is stable, skips recomposition when data unchanged
@Composable fun ItemList(items: ImmutableList<Item>) { ... }
```

2. **`@Stable` and `@Immutable` annotations** — tell Compose your types are stable.

```kotlin
@Immutable
data class UserProfile(val id: String, val name: String, val avatarUrl: String)
```

3. **`LazyColumn` with stable keys** — always provide unique keys for correct recomposition and animation.

```kotlin
LazyColumn {
    items(items, key = { it.id }) { item ->
        ItemRow(item = item)
    }
}
```

4. **`remember` wisely** — use `remember` for expensive computations, not simple derivations. Don't use `remember` with unstable keys.

5. **Baseline Profiles** — pre-compile hot paths at install time, reducing cold start time by 30-50%.

```kotlin
// benchmark/src/main/java/BaselineProfileGenerator.kt
@RunWith(AndroidJUnit4::class)
class BaselineProfileGenerator {
    @get:Rule val rule = BaselineProfileRule()

    @Test
    fun generate() {
        rule.collect("com.example.myapp") {
            pressHome()
            startActivityAndWait()
            // Navigate through critical flows
        }
    }
}
```

6. **R8 minification** — always enable for release builds. Removes unused code and obfuscates.

7. **StrictMode** — enable in debug to catch disk/network on main thread:

```kotlin
if (BuildConfig.DEBUG) {
    StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.Builder()
        .detectAll().penaltyLog().build())
}
```

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **Networking** | `Retrofit` + `OkHttp` | `Ktor` |
| **JSON** | `Moshi` / `Kotlin Serialization` | `Gson` (legacy) |
| **Database** | `Room` | `SQLDelight` |
| **Preferences** | `DataStore` | `SharedPreferences` (legacy) |
| **Secure Storage** | `EncryptedSharedPreferences` | `Tink` |
| **Images** | `Coil` (Compose-native) | `Glide` |
| **DI** | `Hilt` | `Koin` |
| **UI** | Material 3 (`material3`) | — |
| **Async** | Kotlin `Flow` + `Coroutines` | RxJava (legacy) |
| **Paging** | `Paging 3` | — |
| **Work** | `WorkManager` | — |
| **Testing** | `JUnit 5` + `MockK` | `Mockito-Kotlin` |
| **Compose Testing** | `compose-test` | — |
| **Analytics** | Firebase Analytics | Amplitude |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| Unstable lambdas in Compose | Prevents recomposition skipping | Extract to ViewModel, hoist to caller, or use `remember` |
| `MutableList`/`List` parameters | Unstable in Compose, always recomposes | `ImmutableList` from `kotlinx.collections.immutable` |
| `remember { mutableStateOf() }` for ViewModel state | ViewModel outlives Compose, wrong lifecycle | `StateFlow` in ViewModel, `collectAsStateWithLifecycle` in UI |
| Blocking main thread | ANR (Application Not Responding) | Coroutines with `Dispatchers.IO` |
| Missing ProGuard rules | Crashes in release (reflection-based libs) | Add keep rules for Retrofit, Moshi, Room models |
| Hardcoded dp/sp values everywhere | Inconsistent across screens | Design tokens / theme values |
| `GlobalScope.launch` | Lifecycle leak, no cancellation | `viewModelScope`, `lifecycleScope`, or custom scope |
| `SharedPreferences` for complex data | Race conditions, no type safety | `DataStore` with Proto or Preferences |
| Multiple Activities for navigation | Complex backstack, state loss | Single Activity + Compose Navigation |
| `@Preview` without sample data | Previews are useless | Use `@PreviewParameter` with sample providers |

### Compose-Specific Pitfalls

- **`derivedStateOf`** — use for expensive computations that depend on state. Don't use for simple reads.
- **`LaunchedEffect` vs `SideEffect`** — `LaunchedEffect` for suspend functions (runs once per key), `SideEffect` for every recomposition.
- **`rememberSaveable`** — survives configuration changes and process death. Use for user input, scroll position.

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | JUnit 5 + MockK | ViewModel, Repository, UseCase |
| **Compose UI** | `createComposeRule()` | Component rendering and interaction |
| **Integration** | Espresso (+ Compose) | Full screen flows |
| **Robolectric** | JVM-based Android tests | Fast feedback, no emulator needed |
| **Screenshot** | Compose Preview Screenshot Testing | Visual regression |

**Testing Compose:**

```kotlin
@get:Rule val composeTestRule = createComposeRule()

@Test
fun showsLoginButton() {
    composeTestRule.setContent { LoginScreen() }
    composeTestRule.onNodeWithText("Log In").assertIsDisplayed()
}

@Test
fun submitForm() {
    composeTestRule.setContent { LoginScreen() }
    composeTestRule.onNodeWithTag("email_input").performTextInput("test@example.com")
    composeTestRule.onNodeWithText("Log In").performClick()
    composeTestRule.onNodeWithText("Welcome").assertIsDisplayed()
}
```

**ViewModel testing:**

```kotlin
@Test
fun loadProfile_success() = runTest {
    val repo = mockk<UserRepository> {
        coEvery { getProfile() } returns Result.success(testUser)
    }
    val vm = ProfileViewModel(repo)
    vm.uiState.test {
        assertThat(awaitItem()).isEqualTo(ProfileUiState.Loading)
        assertThat(awaitItem()).isEqualTo(ProfileUiState.Success(testUser))
    }
}
```

---

## Deployment & Distribution

### Build Commands

```bash
# Debug build
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Release AAB (Play Store required format)
./gradlew bundleRelease

# Run tests
./gradlew test                    # Unit tests
./gradlew connectedAndroidTest    # Instrumented tests
```

### Distribution Channels

| Channel | Use When |
|---------|----------|
| **Google Play Internal Testing** | Fast internal feedback (up to 100 testers) |
| **Google Play Closed Testing** | Beta testing with larger groups |
| **Google Play Production** | Public release (staged rollout recommended) |
| **Firebase App Distribution** | Ad hoc testing, no Play Store needed |

### Signing Configuration

```kotlin
// build.gradle.kts
android {
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_PATH"))
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

### App Size Optimization
- Enable R8 minification (`isMinifyEnabled = true`)
- Use Android App Bundle (`.aab`) — Google Play delivers optimized APK per device
- Remove unused resources with `shrinkResources = true`
- Use WebP for images (30% smaller than PNG)
- Split APKs by ABI if distributing outside Play Store

---

## Quick Reference — Granular Rules

Individual skill files in `android-rules/` with detailed patterns, code
examples, and audit workflows for Android/Kotlin/Compose development.

> Source: [awesome-android-agent-skills](https://github.com/new-silvermoon/awesome-android-agent-skills)

### Architecture & Core

- [android-architecture.md](android-rules/android-architecture.md) — Clean Architecture, modularization, Hilt DI
- [android-viewmodel.md](android-rules/android-viewmodel.md) — ViewModel + StateFlow/SharedFlow patterns
- [android-data-layer.md](android-rules/android-data-layer.md) — Repository pattern, offline-first sync
- [kotlin-concurrency-expert.md](android-rules/kotlin-concurrency-expert.md) — Coroutines triage & structured concurrency
- [android-coroutines.md](android-rules/android-coroutines.md) — Coroutines patterns

### Compose UI & Performance

- [compose-ui.md](android-rules/compose-ui.md) — Stateless composables, state hoisting, theming
- [compose-performance-audit.md](android-rules/compose-performance-audit.md) — Recomposition storms, unstable keys audit
- [compose-navigation.md](android-rules/compose-navigation.md) — Type-safe navigation, deep links, nested graphs
- [coil-compose.md](android-rules/coil-compose.md) — Coil image loading in Compose

### Networking & Data

- [android-retrofit.md](android-rules/android-retrofit.md) — Retrofit, OkHttp, serialization, interceptors
- [android-accessibility.md](android-rules/android-accessibility.md) — Content descriptions, touch targets, contrast

### Testing & Build

- [android-testing.md](android-rules/android-testing.md) — Unit, Hilt, screenshot testing (Roborazzi)
- [android-gradle-logic.md](android-rules/android-gradle-logic.md) — Convention plugins, version catalogs
- [gradle-build-performance.md](android-rules/gradle-build-performance.md) — Build time optimization (12 patterns)
- [android-emulator-skill.md](android-rules/android-emulator-skill.md) — ADB, emulator automation

### Migration

- [xml-to-compose-migration.md](android-rules/xml-to-compose-migration.md) — XML to Compose mapping tables
- [rxjava-to-coroutines-migration.md](android-rules/rxjava-to-coroutines-migration.md) — RxJava to Coroutines/Flow

