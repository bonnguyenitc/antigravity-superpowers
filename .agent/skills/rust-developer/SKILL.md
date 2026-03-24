---
name: rust-developer
description: Use when writing Rust code, reviewing Rust, debugging ownership/borrow errors, designing APIs in Rust, or choosing async patterns, memory strategies, and idiomatic Rust conventions
---

# Rust Developer Lens

> **Philosophy:** Make invalid states unrepresentable. Let the compiler prove correctness.
> If it compiles without `unsafe`, `unwrap`, or `clone` sprawl, it's probably right.

---

## ⚠️ ASK BEFORE ASSUMING

If the context is unspecified, ask:

| What | Why it matters |
|------|----------------|
| **Async runtime?** Tokio / async-std / none | Shapes the entire async stack |
| **Library or application?** | Changes error handling strategy (`thiserror` vs `anyhow`) |
| **Target?** WASM / embedded / server / CLI | Changes allowed dependencies and allocation model |
| **Edition?** 2021 / 2018 | Affects imports, closures, `let`-chains |

---

## Core Instincts

- **Borrow, don't clone** — every `.clone()` is a cost; most can be avoided with `&T`
- **`unwrap()` is a panic bug waiting to happen** — use `?`, `.context()`, or pattern match
- **Parse, don't validate** — convert untrusted input into a well-typed value at the boundary
- **Make illegal states unrepresentable** — enums over booleans, newtypes over raw primitives
- **Async is not free** — wrong executor choices and `Mutex` across `.await` cause silent deadlocks
- **Run `cargo clippy` and `cargo fmt`** — treat clippy warnings as errors in CI

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| `.unwrap()` in production | Panics on unexpected input | Use `?` operator with proper error types |
| `&String` / `&Vec<T>` as params | Unnecessarily restrictive | Accept `&str` / `&[T]` |
| `.clone()` to satisfy borrow checker | Wasted allocation | Restructure ownership or borrow correctly |
| `Box<dyn Error>` as return type | Loses type info, hard to match | Use `thiserror` enum or `anyhow::Error` |
| `std::fs` in async code | Blocks the executor thread | Use `tokio::fs` |
| Holding `Mutex` across `.await` | Deadlock risk | Release lock before awaiting |
| Stringly-typed IDs / states | Runtime errors, no compiler help | Newtypes: `UserId(u64)`, enums for state |
| `format!()` to build strings repeatedly | Unnecessary allocations | Use `write!()` or `String::with_capacity()` |
| `Vec<T>` when size is fixed | Heap indirection | `Box<[T]>` or `ArrayVec` |
| Ignoring clippy lint | Dead code, perf issues, bugs | Fix or `#[allow(...)]` with comment |
| `unsafe` without justification | Undefined behavior, soundness hole | Minimize scope, document invariants, wrap in safe API |

---

## Ownership Quick Reference

| Situation | Pattern |
|-----------|---------|
| Shared read-only | `&T` — borrow |
| Shared multi-thread | `Arc<T>` |
| Single-thread shared mutable | `Rc<RefCell<T>>` |
| Multi-thread shared mutable | `Arc<Mutex<T>>` |
| Read-heavy shared mutable | `Arc<RwLock<T>>` |
| Conditional ownership | `Cow<'a, T>` |
| Small, `Copy`able types | Derive `Copy` |
| Large data transfer | Move, don't clone |
| Function param (read) | `&str` / `&[T]` / `&T` |
| Function param (owned) | `impl Into<T>` |

---

## Error Handling Strategy

```
Library crate? → thiserror + custom enum
Application? → anyhow + .context("what failed")
Both? → thiserror internally, anyhow at main/binary layer
```

**Pattern:**
```rust
// Library: typed, matchable errors
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("user {0} not found")]
    NotFound(UserId),
    #[error("database error")]
    Db(#[from] sqlx::Error),
}

// Application: add context at call site
let user = db.find_user(id).await.context("loading user for request")?;
```

**Rules:**
- Error messages: lowercase, no trailing punctuation
- Use `?` for propagation — not `match Ok/Err`
- Document errors with `# Errors` section in doc comments
- `.expect()` only for programming errors (invariants): `vec.first().expect("vec always has one element")`

---

## Async Patterns

| Pattern | Use when |
|---------|----------|
| `tokio::spawn` | Fire-and-forget task |
| `tokio::join!` | Parallel independent futures |
| `tokio::try_join!` | Parallel fallible futures |
| `tokio::select!` | Race / timeout |
| `JoinSet` | Dynamic set of tasks |
| `mpsc` channel | Work queue, producer → consumer |
| `broadcast` channel | Pub/sub, one → many |
| `watch` channel | Latest value (config, state) |
| `oneshot` channel | Request/response pattern |
| `spawn_blocking` | CPU-bound work from async context |
| `CancellationToken` | Graceful shutdown signal |

**Critical rules:**
- Never hold `Mutex` / `RwLock` guard across `.await`
- Use `tokio::fs`, not `std::fs` in async code
- Clone data *before* await points, release locks *before* yield

---

## Memory Optimization Quick Reference

| Situation | Tool |
|-----------|------|
| Know the size upfront | `Vec::with_capacity(n)` |
| Usually small (≤ ~8 items) | `SmallVec<[T; 8]>` |
| Bounded max size | `ArrayVec<T, N>` |
| Often-empty vec | `ThinVec<T>` |
| Fixed-size, no growth | `Box<[T]>` |
| Small strings (≤ 24 bytes) | `CompactString` |
| Reuse allocation in loop | `vec.clear()` (don't drop) |
| Zero-copy reads | `&[u8]` / `bytes::Bytes` |

---

## API Design Rules

- **Builder pattern** for structs with ≥ 3 optional fields; add `#[must_use]` to builder type
- **Newtype** for domain primitives: `struct UserId(u64)`, `struct Email(String)`
- **Typestate** for compile-time state machines: `Connection<Connected>` vs `Connection<Idle>`
- **`impl Into<T>`** for string parameters (accepts `&str`, `String`, `Cow<str>`)
- **`impl AsRef<T>`** for borrowed inputs (accepts `String`, `&str`, `Path`, etc.)
- **`From<X> for Y`**, not `Into<Y> for X` — `Into` is auto-derived
- **`#[non_exhaustive]`** on enums / structs you may extend in a minor version
- **`#[must_use]`** on `Result`-returning functions
- Gate `serde` behind a feature flag in libraries

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Types, traits, enums | `UpperCamelCase` | `UserService` |
| Enum variants | `UpperCamelCase` | `NotFound` |
| Functions, methods, modules | `snake_case` | `find_user` |
| Constants, statics | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Lifetimes | Short lowercase | `'a`, `'de`, `'src` |
| Type params | Single uppercase | `T`, `E`, `K`, `V` |
| Getter (cheap) | No `get_` prefix | `.name()` not `.get_name()` |
| Boolean methods | `is_`, `has_`, `can_` | `.is_empty()` |
| Free conversion (ref) | `as_` prefix | `.as_str()` |
| Expensive conversion | `to_` prefix | `.to_string()` |
| Ownership transfer | `into_` prefix | `.into_bytes()` |
| Acronyms | Treat as word | `Uuid`, `HttpClient` |
| Crate names | No `-rs` suffix | `my-tool` not `my-tool-rs` |

---

## Testing Checklist

```rust
// Unit tests: inline, same file
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_name_describes_what_and_expected_result() {
        // Arrange
        // Act
        // Assert
    }

    #[tokio::test]
    async fn async_test_name() { ... }
}
```

- Integration tests → `tests/` directory
- Property-based testing → `proptest` crate
- Trait mocking → `mockall` crate
- Benchmarks → `criterion` crate
- Doc examples must be runnable (they are tested)
- RAII pattern for test cleanup (implement `Drop`)

---

## Questions You Always Ask

**When writing Rust code:**
- Is this a library or an application? (determines error handling strategy)
- Can I borrow instead of clone here?
- What happens if this `.unwrap()` receives `None` / `Err` in production?
- Is this `unsafe` block minimized and its invariants documented?

**When reviewing Rust code:**
- Are all `?` propagations wrapped with `.context()`?
- Would a newtype prevent misuse here (e.g., mixing up `UserId` and `PostId`)?
- Is this async code holding a lock guard across an `.await`?
- Does `cargo clippy` pass clean? Any suppressed lints without justification?

---

## Validation Checklist Before Finishing

```bash
cargo fmt          # Format
cargo clippy       # Lint (treat warnings as errors)
cargo test         # All tests pass
cargo doc --open   # Docs render correctly (check `# Errors`, examples)
```

For performance-sensitive code:
```bash
cargo bench        # via criterion
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

---

## Red Flags in Code Review

**Must fix:**
- [ ] `.unwrap()` or `.expect()` in non-obvious invariant code
- [ ] `&String` / `&Vec<T>` function parameters
- [ ] `Box<dyn Error>` as error type in library
- [ ] `std::fs` used in async function
- [ ] Mutex/RwLock guard held across `.await`
- [ ] Clones that could be borrows

**Should fix:**
- [ ] Missing `# Errors` doc section on fallible public functions
- [ ] No error context added (`?` with no `.context()`)
- [ ] Missing `with_capacity` when size is known
- [ ] Stringly-typed IDs or status values
- [ ] Clippy warnings left unaddressed

---

## Platform References

When this skill is invoked for a Rust project, check `references/rust-rules/`
for 179 individual rule files from [leonardomso/rust-skills](https://github.com/leonardomso/rust-skills).

Each rule covers one specific pattern with:
- Why it matters
- Bad code example
- Good code example
- Links to official docs

Read `references/rust-rules/_sections.md` for the full index organized by
priority (CRITICAL → REFERENCE). Reference individual rules when working
on specific areas (ownership, error handling, async, memory, API design, etc.).

---

## Sources

Rules curated from:
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
- [Rust Design Patterns](https://rust-unofficial.github.io/patterns/)
- [leonardomso/rust-skills](https://github.com/leonardomso/rust-skills) — 179 rules for AI coding agents
- [Ranrar/rustic-prompt](https://github.com/Ranrar/rustic-prompt) — multi-agent Rust instruction set
- Real-world code from: ripgrep, tokio, serde, axum, polars
