# Svelte + SvelteKit Reference

> **Philosophy:** Write less code. No virtual DOM. Compiled framework.
> Reactivity is built into the language, not bolted on.

---

## Project Setup & Detection

**Stack indicators:** `svelte.config.js`, `package.json` with `svelte` or `@sveltejs/kit` dependency.

**Key config files:**

| File | Purpose |
|------|---------|
| `svelte.config.js` | SvelteKit configuration (adapter, preprocess) |
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript configuration |
| `.env` | Environment variables (prefixed `PUBLIC_` for client) |

**Recommended project structure (SvelteKit):**

```
src/
  routes/
    +layout.svelte              # Root layout
    +page.svelte                # Home page
    +error.svelte               # Error page
    about/
      +page.svelte              # /about
    users/
      [id]/
        +page.svelte            # /users/:id
        +page.server.ts         # Server load function
    api/
      posts/
        +server.ts              # API endpoint
  lib/
    components/                 # Reusable components
    stores/                     # Svelte stores
    server/                     # Server-only code ($lib/server/)
    utils.ts                    # Shared utilities
  app.html                      # HTML template
  app.css                       # Global styles
static/                         # Static assets
```

---

## Architecture Patterns

### Svelte 5 Runes (Default)

```svelte
<script lang="ts">
  let count = $state(0)
  let doubled = $derived(count * 2)

  function increment() {
    count++
  }
</script>

<button onclick={increment}>{count} ({doubled})</button>
```

| Rune | Purpose |
|------|---------|
| `$state` | Reactive state declaration |
| `$derived` | Computed value (replaces `$:` reactive statements) |
| `$effect` | Side effect (replaces `$:` for effects) |
| `$props` | Component props |
| `$bindable` | Two-way binding capability |

### Data Loading (SvelteKit)

| Pattern | Use When |
|---------|----------|
| **`+page.server.ts` `load()`** | SSR data — runs on server only |
| **`+page.ts` `load()`** | Universal — runs on server AND client |
| **`+server.ts`** | API endpoints |
| **Form actions** | Mutations (POST/PUT/DELETE) |

```ts
// src/routes/posts/+page.server.ts
export async function load({ fetch }) {
  const posts = await fetch('/api/posts').then(r => r.json())
  return { posts }
}

// src/routes/posts/+page.svelte
<script>
  let { data } = $props()
</script>

{#each data.posts as post}
  <article>{post.title}</article>
{/each}
```

### State Management

| Approach | Use When |
|----------|----------|
| **`$state` (rune)** | Component-local state |
| **Svelte stores (`writable`)** | Shared state across components |
| **`$page.url.searchParams`** | URL state (filters, pagination) |
| **Context API** | Scoped dependency injection |

---

## Performance Optimization

### Why Svelte is Fast by Default

- **No virtual DOM** — compiles to direct DOM manipulation
- **No runtime framework** — smaller bundle (Svelte ~2KB vs React ~40KB)
- **Granular reactivity** — only updates exactly what changed
- **Automatic code splitting** — SvelteKit splits by route

### Key Optimizations

1. **`{#key}`** — force re-create a component when key changes.

2. **`{#await}`** — built-in async rendering.

```svelte
{#await fetchData()}
  <Spinner />
{:then data}
  <DataView {data} />
{:catch error}
  <ErrorMessage {error} />
{/await}
```

3. **Enhanced image** — `@sveltejs/enhanced-img` for automatic optimization.

4. **Streaming** — SvelteKit supports streaming SSR with nested `load` functions.

5. **Preloading** — `data-sveltekit-preload-data="hover"` preloads links on hover.

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **UI** | `shadcn-svelte` | `skeleton`, `melt-ui` |
| **Styling** | `tailwindcss` | `unocss` |
| **Forms** | `superforms` + `zod` | `felte` |
| **Auth** | `lucia` | `authjs-sveltekit` |
| **Database** | `prisma` / `drizzle` | `kysely` |
| **Testing** | `vitest` + `@testing-library/svelte` | — |
| **E2E** | `playwright` | `cypress` |
| **Icons** | `lucide-svelte` | `svelte-icons` |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| Svelte 4 `$:` reactive statements | Legacy (Svelte 5 uses runes) | `$derived`, `$effect` |
| `onMount` for data fetching | Runs only on client, no SSR | `load()` in `+page.server.ts` |
| Mutating `$state` arrays without reassignment | May not trigger reactivity | Push then reassign: `items = [...items, newItem]` |
| `$effect` for derived state | Extra update cycle | Use `$derived` |
| `PUBLIC_` prefix missing for client env | Variable not available in client | Prefix with `PUBLIC_` |
| Importing `$lib/server` in client code | Server secrets leak to bundle | Use `$lib/server/` only in `.server.ts` |
| Missing form `use:enhance` | Full page reload on submit | Add `use:enhance` for progressive enhancement |

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest + `@testing-library/svelte` | Components, stores |
| **E2E** | Playwright | Full user flows |

```ts
import { render, screen } from '@testing-library/svelte'
import Counter from '$lib/components/Counter.svelte'

test('increments count', async () => {
  render(Counter)
  const button = screen.getByRole('button')
  await button.click()
  expect(button.textContent).toBe('1')
})
```

---

## Deployment & Distribution

### Adapters

SvelteKit uses adapters for different deployment targets:

```bash
npm run build
```

| Adapter | Platform |
|---------|----------|
| `@sveltejs/adapter-auto` | Auto-detect (Vercel, Netlify, Cloudflare) |
| `@sveltejs/adapter-vercel` | Vercel |
| `@sveltejs/adapter-node` | Node.js server |
| `@sveltejs/adapter-static` | Static site (SSG) |
| `@sveltejs/adapter-cloudflare` | Cloudflare Pages/Workers |

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto'

export default {
  kit: { adapter: adapter() }
}
```
