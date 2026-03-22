# Vanilla JS/TS + Web Components Reference

> **Philosophy:** Zero dependencies. Platform APIs first.
> The best framework is the one you don't need.

---

## Project Setup & Detection

**Stack indicators:** No framework dependency in `package.json`. Plain `index.html` + `<script>` tags, or Vite with no framework plugin.

**Key config files:**

| File | Purpose |
|------|---------|
| `index.html` | Entry point |
| `vite.config.ts` | Build tool (if using Vite) |
| `tsconfig.json` | TypeScript configuration |
| `package.json` | Dependencies (minimal or none) |

**Recommended project structure:**

```
src/
  components/
    header.ts                   # Custom elements / component modules
    modal.ts
  services/
    api.ts                      # Fetch wrapper
    storage.ts                  # localStorage abstraction
  utils/
    dom.ts                      # DOM utility functions
    events.ts                   # Event system
  styles/
    main.css                    # Global styles
    components/                 # Component-scoped CSS
  main.ts                       # Entry point
  router.ts                     # Client-side router (if SPA)
index.html
```

---

## Architecture Patterns

### Web Components (Custom Elements)

```ts
class MyCounter extends HTMLElement {
  #count = 0
  #shadow: ShadowRoot

  constructor() {
    super()
    this.#shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.#shadow.innerHTML = `
      <style>
        button { font-size: 1rem; padding: 0.5rem 1rem; cursor: pointer; }
      </style>
      <button>${this.#count}</button>
    `
    this.#shadow.querySelector('button')!
      .addEventListener('click', () => { this.#count++; this.render() })
  }
}

customElements.define('my-counter', MyCounter)
```

### Module Pattern

```ts
// services/api.ts
const BASE_URL = '/api'

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

### State Management

| Approach | Use When |
|----------|----------|
| **Module-level variables** | Simple state, single module access |
| **Custom EventTarget** | Pub/sub across modules |
| **Proxy-based reactivity** | Automatic DOM updates |
| **URL state** (`URLSearchParams`) | Shareable, bookmarkable state |

**Proxy-based reactivity:**

```ts
function createStore<T extends object>(initial: T, onChange: () => void): T {
  return new Proxy(initial, {
    set(target, prop, value) {
      Reflect.set(target, prop, value)
      onChange()
      return true
    }
  })
}
```

---

## Performance Optimization

### Modern Browser APIs to Use

| API | Purpose |
|-----|---------|
| `fetch` | Network requests (replaces XMLHttpRequest) |
| `IntersectionObserver` | Lazy loading, infinite scroll |
| `ResizeObserver` | Responsive components |
| `MutationObserver` | DOM change detection |
| `requestIdleCallback` | Defer non-critical work |
| `requestAnimationFrame` | Smooth animations |
| `Web Workers` | Offload heavy computation |
| `AbortController` | Cancel fetch requests |
| `structuredClone` | Deep clone objects |
| `URLPattern` | URL matching/routing |
| `View Transitions API` | Page transition animations |
| `Popover API` | Native popovers (no JS library) |
| `<dialog>` | Native modal dialogs |

### Key Optimizations

1. **Event delegation** — one listener on parent, not N listeners on children.

```ts
// ❌ Bad: N listeners
items.forEach(item => item.addEventListener('click', handler))

// ✅ Good: 1 listener with delegation
list.addEventListener('click', (e) => {
  const item = (e.target as HTMLElement).closest('[data-id]')
  if (item) handleClick(item.dataset.id!)
})
```

2. **`DocumentFragment`** — batch DOM insertions.

```ts
const fragment = document.createDocumentFragment()
items.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item.name
  fragment.appendChild(li)
})
list.appendChild(fragment) // single reflow
```

3. **CSS `content-visibility: auto`** — skip rendering off-screen content.

4. **`<link rel="modulepreload">`** — preload ES modules.

5. **`loading="lazy"`** on images and iframes — native lazy loading.

---

## Common Libraries (Minimal Dependencies)

| Category | Lightweight Pick | Why Not Full Framework |
|----------|-----------------|----------------------|
| **Routing** | `navigo` / custom History API | 2KB vs router libraries |
| **HTTP** | `fetch` (built-in) | No library needed |
| **Templating** | `lit-html` | Tagged templates, 5KB |
| **State** | `nanostores` | Framework-agnostic, 1KB |
| **Build** | `vite` | Fast, ESM-native |
| **Testing** | `vitest` | Fast, compatible |
| **E2E** | `playwright` | Cross-browser |
| **CSS** | CSS custom properties | Native variables |

---

## Anti-Patterns & Gotchas

| ❌ Don't | Why | ✅ Do Instead |
|----------|-----|---------------|
| `innerHTML` with user input | XSS vulnerability | `textContent` or sanitize |
| `document.write()` | Blocks parsing, destroys page | DOM manipulation methods |
| jQuery for new projects | Unnecessary, browser APIs suffice | Native `querySelector`, `fetch` |
| Sync XHR | Blocks main thread | `fetch` with async/await |
| `var` declarations | Hoisting bugs, no block scope | `const` / `let` |
| `==` loose equality | Type coercion bugs | `===` strict equality |
| Missing `type="module"` on scripts | No ES module support | `<script type="module">` |
| Global variables | Namespace pollution | ES modules |
| Polling for DOM changes | Wasteful | `MutationObserver` |
| `setTimeout` for animations | Inconsistent frame rate | `requestAnimationFrame` |

---

## Testing

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest | Functions, modules |
| **DOM** | Vitest + `happy-dom` | Component rendering |
| **E2E** | Playwright | Full browser flows |

```ts
import { describe, it, expect } from 'vitest'
import { createStore } from '../src/store'

describe('Store', () => {
  it('notifies on change', () => {
    let called = false
    const store = createStore({ count: 0 }, () => { called = true })
    store.count = 1
    expect(called).toBe(true)
  })
})
```

---

## Deployment & Distribution

### Static Hosting (Most Common)

```bash
# Build (Vite)
vite build

# Output: dist/
```

Deploy `dist/` to any static host: Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3 + CloudFront.

### No-Build Option

For simple projects, no build step needed:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <script type="module" src="src/main.ts"></script>
</body>
</html>
```

Modern browsers support ES modules natively. Use import maps for bare specifiers:

```html
<script type="importmap">
{
  "imports": {
    "lit-html": "https://esm.sh/lit-html"
  }
}
</script>
```
