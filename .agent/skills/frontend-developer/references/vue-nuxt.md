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
