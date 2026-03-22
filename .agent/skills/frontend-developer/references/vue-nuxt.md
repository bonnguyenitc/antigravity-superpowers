# Vue 3 + Nuxt Reference

> **Philosophy:** Progressive framework. Reactivity-first. Convention over configuration.
> Vue makes the simple things simple and the complex things manageable.

---

## Project Setup & Detection

**Stack indicators:** `nuxt.config.ts` / `vue.config.js`, `package.json` with `vue` or `nuxt` dependency.

**Key config files:**

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration (modules, plugins, runtime config) |
| `app.config.ts` | App-level configuration (reactive, client-side) |
| `tsconfig.json` | TypeScript configuration |
| `.env` | Environment variables |

**Recommended project structure (Nuxt 3):**

```
app/
  pages/
    index.vue                   # Home (/), file-based routing
    about.vue                   # /about
    users/
      [id].vue                  # /users/:id (dynamic route)
  layouts/
    default.vue                 # Default layout
    dashboard.vue               # Dashboard layout
  components/
    ui/                         # Reusable UI components
    forms/                      # Form components
  composables/                  # Auto-imported composables (useAuth, etc.)
  stores/                       # Pinia stores
  server/
    api/                        # Server API routes
    middleware/                  # Server middleware
  plugins/                      # Vue plugins
  middleware/                    # Route middleware (auth guards)
  utils/                        # Auto-imported utility functions
  assets/                       # Styles, images (processed by Vite)
  public/                       # Static files (served as-is)
```

---

## Architecture Patterns

### Composition API (Default)

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <button @click="increment">{{ count }} ({{ doubled }})</button>
</template>
```

### State Management

| Approach | Use When |
|----------|----------|
| **Pinia** (recommended) | Global/shared state — devtools, SSR, TypeScript |
| **Composables** (`useState` in Nuxt) | SSR-safe state shared across components |
| **`ref`/`reactive`** | Component-local state |
| **URL state** (`useRoute().query`) | Filters, pagination, shareable state |

**Pinia store:**

```ts
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: Credentials) {
    user.value = await $fetch('/api/auth/login', { method: 'POST', body: credentials })
  }

  return { user, isLoggedIn, login }
})
```

### Data Fetching (Nuxt)

| Composable | Use When |
|------------|----------|
| **`useFetch`** | SSR + client — auto-deduplication, caching |
| **`useAsyncData`** | Custom async logic, multiple sources |
| **`$fetch`** | Client-only calls, server API routes, event handlers |
| **`useLazyFetch`** | Non-blocking fetch (shows page immediately) |

```vue
<script setup>
const { data: posts, pending, error } = await useFetch('/api/posts')
</script>
```

---

## Performance Optimization

### Key Optimizations

1. **Auto-imports** — Nuxt auto-imports composables, components, and utils. No manual imports needed.

2. **`<Suspense>` and `<NuxtLoadingIndicator>`** — built-in loading states.

3. **`defineAsyncComponent`** — lazy load heavy components.

```ts
const HeavyChart = defineAsyncComponent(() => import('~/components/Chart.vue'))
```

4. **`v-once`** — render static content once, skip future updates.

5. **`v-memo`** — memoize template sub-trees (Vue 3.2+).

6. **`shallowRef`** — avoid deep reactivity for large objects.

7. **Route-based code splitting** — Nuxt splits by page automatically.

8. **Image optimization** — use `nuxt/image` module for `<NuxtImg>` and `<NuxtPicture>`.

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **UI** | `nuxt-ui` / `primevue` | `vuetify`, `quasar` |
| **Styling** | `tailwindcss` (via `@nuxtjs/tailwindcss`) | `unocss` |
| **State** | `pinia` (built-in Nuxt module) | `vuex` (legacy) |
| **Forms** | `vee-validate` + `zod` | `formkit` |
| **Auth** | `sidebase/nuxt-auth` | `nuxt-auth-utils` |
| **Database** | `prisma` / `drizzle` | `nuxt-mongoose` |
| **i18n** | `@nuxtjs/i18n` | — |
| **Testing** | `vitest` + `@vue/test-utils` | — |
| **E2E** | `playwright` | `cypress` |
| **Icons** | `nuxt-icon` | `unplugin-icons` |
| **SEO** | `nuxt-seo` module suite | manual `useHead()` |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| Options API for new code | Less composable, worse TypeScript | `<script setup>` Composition API |
| `this.$store` (Vuex) | Legacy, replaced by Pinia | Use Pinia stores |
| Mutating props | One-way data flow violation, bugs | Emit events or use `v-model` |
| `watch` for derived state | Extra re-render cycle | Use `computed` |
| `$fetch` in `setup` for SSR data | Runs on both server AND client (duplicate) | `useFetch` or `useAsyncData` |
| `ref.value` in template | `.value` is auto-unwrapped in templates | Just `{{ count }}`, not `{{ count.value }}` |
| Missing `key` on `v-for` | Re-render bugs, broken state | Always `:key="item.id"` |
| Barrel exports in composables | Nuxt auto-imports from `composables/` | One composable per file |
| `process.env` in client | Only works in Node.js | `useRuntimeConfig()` |

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest + `@vue/test-utils` | Components, composables |
| **Component** | `@nuxt/test-utils` | Full Nuxt component context |
| **E2E** | Playwright | Full user flows |

```ts
import { mount } from '@vue/test-utils'
import Counter from '~/components/Counter.vue'

test('increments', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})
```

---

## Deployment & Distribution

### Nitro Server (Nuxt 3)

Nuxt 3 uses Nitro — deploy anywhere:

```bash
# Build
nuxt build            # Server (SSR)
nuxt generate         # Static (SSG)

# Preview
nuxt preview
```

| Platform | Preset |
|----------|--------|
| **Vercel** | `vercel` (auto-detected) |
| **Netlify** | `netlify` |
| **Cloudflare** | `cloudflare-pages` |
| **Node.js** | `node-server` |
| **Docker** | `node-server` + Dockerfile |
| **Static** | `nuxt generate` → any CDN |

---

## Quick Reference — Granular Rules

Individual rule files in `vue-rules/` with detailed code examples and best
practices from the Vue ecosystem. Read the specific rule when working in that area.

> Source: [antfu/skills](https://github.com/antfu/skills) (from [vuejs-ai/skills](https://github.com/vuejs-ai/skills))

### Best Practices — Components

- [sfc.md](vue-rules/best-practices/sfc.md) — Single File Component patterns
- [component-data-flow.md](vue-rules/best-practices/component-data-flow.md) — Props, events, v-model
- [component-slots.md](vue-rules/best-practices/component-slots.md) — Slot patterns
- [component-fallthrough-attrs.md](vue-rules/best-practices/component-fallthrough-attrs.md) — Fallthrough attributes
- [component-async.md](vue-rules/best-practices/component-async.md) — Async components
- [component-keep-alive.md](vue-rules/best-practices/component-keep-alive.md) — KeepAlive caching
- [component-suspense.md](vue-rules/best-practices/component-suspense.md) — Suspense for async
- [component-teleport.md](vue-rules/best-practices/component-teleport.md) — Teleport for portals
- [component-transition.md](vue-rules/best-practices/component-transition.md) — Transition animations
- [component-transition-group.md](vue-rules/best-practices/component-transition-group.md) — TransitionGroup for lists

### Best Practices — Core

- [reactivity.md](vue-rules/best-practices/reactivity.md) — Reactivity system deep dive
- [composables.md](vue-rules/best-practices/composables.md) — Composable patterns
- [state-management.md](vue-rules/best-practices/state-management.md) — State management approaches
- [directives.md](vue-rules/best-practices/directives.md) — Custom directives
- [plugins.md](vue-rules/best-practices/plugins.md) — Plugin architecture
- [render-functions.md](vue-rules/best-practices/render-functions.md) — Render functions & JSX

### Best Practices — Performance

- [perf-virtualize-large-lists.md](vue-rules/best-practices/perf-virtualize-large-lists.md) — Virtualize large lists
- [perf-avoid-component-abstraction-in-lists.md](vue-rules/best-practices/perf-avoid-component-abstraction-in-lists.md) — Avoid abstraction in lists
- [perf-v-once-v-memo-directives.md](vue-rules/best-practices/perf-v-once-v-memo-directives.md) — v-once and v-memo
- [updated-hook-performance.md](vue-rules/best-practices/updated-hook-performance.md) — Updated hook pitfalls

### Best Practices — Animation

- [animation-class-based-technique.md](vue-rules/best-practices/animation-class-based-technique.md) — CSS class-based animations
- [animation-state-driven-technique.md](vue-rules/best-practices/animation-state-driven-technique.md) — State-driven animations

### Router

- [router-guard-async-await-pattern.md](vue-rules/router/router-guard-async-await-pattern.md) — Async guard pattern
- [router-navigation-guard-next-deprecated.md](vue-rules/router/router-navigation-guard-next-deprecated.md) — next() is deprecated
- [router-navigation-guard-infinite-loop.md](vue-rules/router/router-navigation-guard-infinite-loop.md) — Avoid guard infinite loops
- [router-param-change-no-lifecycle.md](vue-rules/router/router-param-change-no-lifecycle.md) — Param changes skip lifecycle
- [router-beforerouteenter-no-this.md](vue-rules/router/router-beforerouteenter-no-this.md) — No `this` in beforeRouteEnter
- [router-beforeenter-no-param-trigger.md](vue-rules/router/router-beforeenter-no-param-trigger.md) — beforeEnter vs param changes
- [router-simple-routing-cleanup.md](vue-rules/router/router-simple-routing-cleanup.md) — Simple routing cleanup
- [router-use-vue-router-for-production.md](vue-rules/router/router-use-vue-router-for-production.md) — Use Vue Router in production

### Testing

- [testing-vitest-recommended-for-vue.md](vue-rules/testing/testing-vitest-recommended-for-vue.md) — Vitest is recommended
- [testing-component-blackbox-approach.md](vue-rules/testing/testing-component-blackbox-approach.md) — Black-box testing
- [testing-composables-helper-wrapper.md](vue-rules/testing/testing-composables-helper-wrapper.md) — Test composables with wrapper
- [testing-pinia-store-setup.md](vue-rules/testing/testing-pinia-store-setup.md) — Pinia store testing setup
- [testing-async-await-flushpromises.md](vue-rules/testing/testing-async-await-flushpromises.md) — Async testing patterns
- [testing-suspense-async-components.md](vue-rules/testing/testing-suspense-async-components.md) — Suspense testing
- [async-component-testing.md](vue-rules/testing/async-component-testing.md) — Async component testing
- [teleport-testing-complexity.md](vue-rules/testing/teleport-testing-complexity.md) — Teleport testing
- [testing-no-snapshot-only.md](vue-rules/testing/testing-no-snapshot-only.md) — Don't rely on snapshots only
- [testing-browser-vs-node-runners.md](vue-rules/testing/testing-browser-vs-node-runners.md) — Browser vs Node runners
- [testing-e2e-playwright-recommended.md](vue-rules/testing/testing-e2e-playwright-recommended.md) — Playwright for E2E

