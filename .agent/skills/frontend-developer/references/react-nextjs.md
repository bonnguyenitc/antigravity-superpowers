# React + Next.js (App Router) Reference

> **Philosophy:** Server-first. Components render on the server by default.
> Client components are opt-in. React Server Components change everything.

---

## Project Setup & Detection

**Stack indicators:** `next.config.js` / `next.config.ts`, `package.json` with `next` dependency.

**Key config files:**

| File | Purpose |
|------|---------|
| `next.config.js` / `.ts` | Next.js configuration (redirects, rewrites, images) |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | TailwindCSS configuration (if used) |
| `.env.local` | Local environment variables |
| `middleware.ts` | Edge middleware (auth, redirects) |

**Recommended project structure (App Router):**

```
app/
  layout.tsx                  # Root layout (Server Component)
  page.tsx                    # Home page
  loading.tsx                 # Loading UI (Suspense boundary)
  error.tsx                   # Error boundary
  not-found.tsx               # 404 page
  (auth)/
    login/page.tsx
    register/page.tsx
  (dashboard)/
    layout.tsx                # Dashboard layout with sidebar
    page.tsx
    settings/page.tsx
  api/
    route.ts                  # API route handlers
components/
  ui/                         # Reusable UI components (shadcn, etc.)
  forms/                      # Form-specific components
lib/
  db.ts                       # Database client
  auth.ts                     # Auth configuration
  utils.ts                    # Utility functions
  actions/                    # Server Actions
hooks/                        # Custom React hooks (client-side)
```

---

## Architecture Patterns

### Server vs Client Components

```
Server Components (default)    | Client Components ('use client')
-------------------------------|----------------------------------
Fetch data directly            | useState, useEffect, event handlers
Access backend resources       | Browser APIs (localStorage, etc.)
Keep secrets server-side       | Interactivity (onClick, onChange)
Reduce bundle size             | Third-party client libraries
```

**Rules of thumb:**
- Start everything as Server Component
- Add `'use client'` only when you need interactivity or browser APIs
- Push `'use client'` boundary as low as possible in the component tree
- Server Components can render Client Components (not vice versa)

### Data Fetching

| Pattern | Use When |
|---------|----------|
| **Server Components + `fetch`** | Default — data fetched at request or build time |
| **Server Actions** | Mutations (forms, button clicks) |
| **Route Handlers** (`app/api/`) | External API clients, webhooks |
| **`use` hook + Suspense** | Streaming data to client |
| **React Query / SWR** | Client-side caching, polling, optimistic updates |

**Server Actions** replace API routes for mutations:

```tsx
// lib/actions/user.ts
'use server'

export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string
  await db.user.update({ where: { id: userId }, data: { name } })
  revalidatePath('/profile')
}
```

### State Management

| Approach | Use When |
|----------|----------|
| **Server state** (fetch in Server Components) | Most data — no client state needed |
| **React Context** | Theme, locale, auth — infrequently changing |
| **Zustand** | Complex client-side state |
| **URL state** (`useSearchParams`) | Filters, pagination, shareable state |
| **React Query / SWR** | Client-side server state cache |

---

## Performance Optimization

### Core Web Vitals (Target)

| Metric | Good | Poor |
|--------|------|------|
| **LCP** | < 2.5s | > 4s |
| **INP** | < 200ms | > 500ms |
| **CLS** | < 0.1 | > 0.25 |

### Key Optimizations

1. **Eliminate waterfalls** — parallel data fetching is critical.

```tsx
// ❌ Bad: sequential (waterfall)
const user = await getUser(id)
const posts = await getPosts(user.id)

// ✅ Good: parallel
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])
```

2. **`next/image`** — automatic optimization, lazy loading, responsive sizes.

3. **Dynamic imports** — code-split heavy components.

```tsx
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // client-only if needed
})
```

4. **Streaming with Suspense** — show content progressively.

```tsx
export default function Page() {
  return (
    <main>
      <Header />  {/* instant */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />  {/* streams when ready */}
      </Suspense>
    </main>
  )
}
```

5. **Route segment config** — control caching behavior.

```tsx
export const dynamic = 'force-dynamic' // or 'auto', 'force-static'
export const revalidate = 3600 // ISR: revalidate every hour
```

---

## Common Libraries Ecosystem

| Category | Recommended | Alternative |
|----------|-------------|-------------|
| **UI** | `shadcn/ui` (copy-paste) | `radix-ui`, `headless-ui` |
| **Styling** | `tailwindcss` | `css modules`, `vanilla-extract` |
| **Forms** | `react-hook-form` + `zod` | `formik` |
| **Auth** | `next-auth` / `clerk` | `lucia`, `supabase auth` |
| **Database** | `prisma` / `drizzle` | `kysely` |
| **Server State** | `@tanstack/react-query` | `swr` |
| **Tables** | `@tanstack/react-table` | `ag-grid` |
| **Email** | `react-email` + `resend` | `nodemailer` |
| **Testing** | `vitest` + `@testing-library/react` | `jest` |
| **E2E** | `playwright` | `cypress` |
| **Analytics** | `@vercel/analytics` | `posthog` |
| **Icons** | `lucide-react` | `heroicons`, `phosphor` |
| **Date** | `date-fns` | `dayjs` |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| `'use client'` on every component | Bloats bundle, loses RSC benefits | Default to Server Components |
| `useEffect` for data fetching | Waterfall, no SSR, loading state | Fetch in Server Components |
| Sequential `await` for independent data | Each waits on previous (waterfall) | `Promise.all()` |
| `localStorage` in Server Component | Doesn't exist on server, hydration mismatch | Move to Client Component |
| Barrel exports (`index.ts`) | Defeats tree-shaking, slow cold start | Import directly from source file |
| `next/router` (Pages Router) | Legacy | `next/navigation` (App Router) |
| Missing `loading.tsx` | No loading UI, blank screen | Add `loading.tsx` per route segment |
| Missing `error.tsx` | Unhandled errors crash entire page | Add `error.tsx` error boundaries |
| Fetch in Client Component for initial data | Extra round trip, no SSR | Pass data from Server Component as props |
| `console.log` in Server Components | Logs on server, not browser | Use proper logging (pino, winston) |

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest + Testing Library | Components, hooks, utils |
| **Integration** | Vitest + MSW | API mocking, server actions |
| **E2E** | Playwright | Full user flows |
| **Visual** | Chromatic / Percy | Visual regression |

---

## Deployment & Distribution

### Vercel (recommended for Next.js)

```bash
# Deploy
vercel deploy          # Preview
vercel --prod          # Production

# Environment variables
vercel env add         # Add env var
```

### Self-hosted

```bash
# Build
next build

# Start (requires Node.js server)
next start

# Docker
FROM node:20-alpine
COPY . .
RUN npm ci && npm run build
CMD ["npm", "start"]
```

### Static Export

```js
// next.config.js
module.exports = { output: 'export' }
```

Generates static HTML — deployable to any CDN (Cloudflare Pages, Netlify, S3).

---

## Quick Reference — Granular Rules

Individual rule files in `react-rules/` with detailed incorrect/correct
code examples. Read the specific rule when working in that area.

> Source: [Vercel agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

### CRITICAL — Eliminating Waterfalls

- [async-parallel.md](react-rules/async-parallel.md) — Parallel data fetching
- [async-suspense-boundaries.md](react-rules/async-suspense-boundaries.md) — Suspense for streaming
- [async-defer-await.md](react-rules/async-defer-await.md) — Defer non-critical awaits
- [async-dependencies.md](react-rules/async-dependencies.md) — Minimize async dependencies
- [async-api-routes.md](react-rules/async-api-routes.md) — API route optimization

### CRITICAL — Bundle Size

- [bundle-dynamic-imports.md](react-rules/bundle-dynamic-imports.md) — Dynamic imports for code splitting
- [bundle-barrel-imports.md](react-rules/bundle-barrel-imports.md) — Avoid barrel exports
- [bundle-conditional.md](react-rules/bundle-conditional.md) — Conditional imports
- [bundle-defer-third-party.md](react-rules/bundle-defer-third-party.md) — Defer third-party scripts
- [bundle-preload.md](react-rules/bundle-preload.md) — Preload critical resources

### HIGH — Server-Side Performance

- [server-parallel-fetching.md](react-rules/server-parallel-fetching.md) — Parallel server fetching
- [server-cache-react.md](react-rules/server-cache-react.md) — React cache for dedup
- [server-cache-lru.md](react-rules/server-cache-lru.md) — LRU cache for hot data
- [server-hoist-static-io.md](react-rules/server-hoist-static-io.md) — Hoist static I/O
- [server-dedup-props.md](react-rules/server-dedup-props.md) — Dedup prop fetching
- [server-after-nonblocking.md](react-rules/server-after-nonblocking.md) — Non-blocking after()
- [server-auth-actions.md](react-rules/server-auth-actions.md) — Auth in server actions
- [server-serialization.md](react-rules/server-serialization.md) — Serialization optimization

### MEDIUM-HIGH — Client-Side Data

- [client-swr-dedup.md](react-rules/client-swr-dedup.md) — SWR deduplication
- [client-event-listeners.md](react-rules/client-event-listeners.md) — Event listener cleanup
- [client-localstorage-schema.md](react-rules/client-localstorage-schema.md) — localStorage versioning
- [client-passive-event-listeners.md](react-rules/client-passive-event-listeners.md) — Passive listeners

### MEDIUM — Re-render Optimization

- [rerender-memo.md](react-rules/rerender-memo.md) — React.memo usage
- [rerender-derived-state.md](react-rules/rerender-derived-state.md) — Derived state pattern
- [rerender-derived-state-no-effect.md](react-rules/rerender-derived-state-no-effect.md) — No useEffect for derived state
- [rerender-functional-setstate.md](react-rules/rerender-functional-setstate.md) — Functional setState
- [rerender-lazy-state-init.md](react-rules/rerender-lazy-state-init.md) — Lazy state initialization
- [rerender-no-inline-components.md](react-rules/rerender-no-inline-components.md) — No inline components
- [rerender-transitions.md](react-rules/rerender-transitions.md) — useTransition for heavy updates
- [rerender-use-deferred-value.md](react-rules/rerender-use-deferred-value.md) — useDeferredValue
- [rerender-use-ref-transient-values.md](react-rules/rerender-use-ref-transient-values.md) — useRef for transient values
- [rerender-split-combined-hooks.md](react-rules/rerender-split-combined-hooks.md) — Split combined hooks
- [rerender-defer-reads.md](react-rules/rerender-defer-reads.md) — Defer expensive reads
- [rerender-dependencies.md](react-rules/rerender-dependencies.md) — Dependency optimization
- [rerender-memo-with-default-value.md](react-rules/rerender-memo-with-default-value.md) — Memo with defaults
- [rerender-move-effect-to-event.md](react-rules/rerender-move-effect-to-event.md) — Move effects to events
- [rerender-simple-expression-in-memo.md](react-rules/rerender-simple-expression-in-memo.md) — Simple expressions

### MEDIUM — Rendering Performance

- [rendering-conditional-render.md](react-rules/rendering-conditional-render.md) — Conditional rendering
- [rendering-hoist-jsx.md](react-rules/rendering-hoist-jsx.md) — Hoist static JSX
- [rendering-content-visibility.md](react-rules/rendering-content-visibility.md) — CSS content-visibility
- [rendering-resource-hints.md](react-rules/rendering-resource-hints.md) — Resource hints
- [rendering-script-defer-async.md](react-rules/rendering-script-defer-async.md) — Script defer/async
- [rendering-hydration-no-flicker.md](react-rules/rendering-hydration-no-flicker.md) — No hydration flicker
- [rendering-hydration-suppress-warning.md](react-rules/rendering-hydration-suppress-warning.md) — Suppress hydration warnings
- [rendering-usetransition-loading.md](react-rules/rendering-usetransition-loading.md) — useTransition loading
- [rendering-activity.md](react-rules/rendering-activity.md) — Activity API
- [rendering-animate-svg-wrapper.md](react-rules/rendering-animate-svg-wrapper.md) — SVG animation
- [rendering-svg-precision.md](react-rules/rendering-svg-precision.md) — SVG precision

### LOW — JavaScript & Advanced

- [js-early-exit.md](react-rules/js-early-exit.md) — Early exit patterns
- [js-set-map-lookups.md](react-rules/js-set-map-lookups.md) — Set/Map for lookups
- [js-index-maps.md](react-rules/js-index-maps.md) — Index maps
- [js-cache-function-results.md](react-rules/js-cache-function-results.md) — Cache function results
- [js-flatmap-filter.md](react-rules/js-flatmap-filter.md) — flatMap over filter+map
- [js-combine-iterations.md](react-rules/js-combine-iterations.md) — Combine iterations
- [js-hoist-regexp.md](react-rules/js-hoist-regexp.md) — Hoist RegExp
- [js-length-check-first.md](react-rules/js-length-check-first.md) — Length check first
- [js-tosorted-immutable.md](react-rules/js-tosorted-immutable.md) — toSorted immutable
- [js-min-max-loop.md](react-rules/js-min-max-loop.md) — Min/max in loops
- [js-cache-property-access.md](react-rules/js-cache-property-access.md) — Cache property access
- [js-cache-storage.md](react-rules/js-cache-storage.md) — Cache Storage API
- [js-batch-dom-css.md](react-rules/js-batch-dom-css.md) — Batch DOM/CSS updates
- [advanced-event-handler-refs.md](react-rules/advanced-event-handler-refs.md) — Event handler refs
- [advanced-init-once.md](react-rules/advanced-init-once.md) — Init once pattern
- [advanced-use-latest.md](react-rules/advanced-use-latest.md) — useLatest pattern
