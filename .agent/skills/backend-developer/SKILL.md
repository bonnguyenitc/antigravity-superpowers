---
name: backend-developer
description: Use when designing APIs, working on server-side logic, database schemas, or reviewing backend code — regardless of stack
---

# Backend Developer Lens

> **Philosophy:** Design for contracts, failure modes, and observability.
> If you can't observe it failing, you can't fix it. If you can't roll it back, don't ship it.

---

## ⚠️ ASK BEFORE ASSUMING

If the stack is unspecified, **DO NOT default to Express + MongoDB**. Ask:

| What | Why it matters |
|------|----------------|
| **Language/framework?** Node / Python / Go / etc. | Determines idioms and patterns |
| **Database?** SQL / NoSQL / in-memory | Shapes the entire data model |
| **Auth model?** JWT / session / API key / OAuth | Must be decided before the first endpoint |
| **Deployment?** Container / serverless / VM | Affects scaling, connection pooling |
| **Existing API contract?** | Determines versioning constraints |

When stack is unspecified, assume Node.js + PostgreSQL + REST.

---

## Core Instincts

- **API contracts are public** — breaking changes require versioning; consumers break silently
- **N+1 is always lurking** — query patterns that work in dev collapse at scale
- **Fail loudly in dev, gracefully in prod** — errors must be observable; silent failures are unacceptable
- **Auth is load-bearing** — authentication and authorization must be in the design from the start
- **Schema changes are permanent** — migrations must be backward-compatible; rollback path required

---

## Performance & Scale Thresholds

| Metric | Target | Investigate |
|--------|--------|-------------|
| API response time (p99) | < 500ms | > 1s |
| Database query time (p99) | < 100ms | > 500ms |
| DB connection pool size | CPU cores × 2–4 | > 100 (connection thrash) |
| Max payload size (JSON) | < 1MB | > 5MB → stream or paginate |
| Background job retry limit | 3–5 retries | Unbounded = infinite loops |
| Rate limit (public API) | 60–100 req/min per IP | Application-specific |
| Pagination page size | 20–100 items | > 500 → server load + slow clients |

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Database queries in a loop | N+1 = catastrophic at scale | Batch query with `IN (...)`, JOIN, or eager load |
| Silent `catch {}` blocks | Failures invisible, impossible to debug | Log with context (req ID, user ID), re-throw or return structured error |
| Secrets in source code | Leaked via git, logs, stack traces | `process.env` + secret manager (Vault, AWS Secrets Manager) |
| No input validation | Injection, crashes, bad data in DB | Validate at the API boundary (Zod, Joi, Pydantic, etc.) |
| No rate limiting on public endpoints | Trivially abused, DDoS surface | Rate limit per IP + per user at gateway or middleware |
| Schema migration without rollback | One bad deploy = DB emergency | Always write `up` AND `down` migration |
| Breaking API change without versioning | Consumers silently break in prod | `/v2/` prefix + deprecation headers + sunset date |
| Business logic in controllers | Untestable, duplicated across routes | Service layer for all business rules |
| Unbounded queries | Full table scan in prod at 10M rows | Always paginate: `LIMIT` + `OFFSET` or cursor-based |
| Storing plaintext passwords | One breach = all accounts compromised | `bcrypt` (cost ≥ 12) or `argon2id` |

---

## HTTP Status Code Reference

| Situation | Status | Notes |
|-----------|--------|-------|
| Success, returns data | 200 | |
| Created resource | 201 | Include `Location` header |
| Success, no body | 204 | |
| Permanent redirect | 301 | Browser caches; use with care |
| Temporary redirect | 302 | Common for auth flows |
| Bad input from client | 400 | Include field-level validation errors |
| Missing / invalid auth token | 401 | Trigger re-auth on client |
| Valid auth, no permission | 403 | Do NOT reveal resource existence |
| Resource not found | 404 | |
| Method not allowed | 405 | Include `Allow` header |
| Duplicate or state conflict | 409 | Idempotency conflicts, duplicate key |
| Business rule violation | 422 | Structurally valid, semantically wrong |
| Rate limit exceeded | 429 | Include `Retry-After` header |
| Our fault (unhandled error) | 500 | Log full context; return safe message |
| Upstream service down | 502 / 503 | |

---

## Auth Quick Rules

| Concern | Rule |
|---------|------|
| JWT expiry | Access token: 15 min–1h. Refresh token: 7–30 days |
| JWT secret rotation | Rotate on breach; support multiple valid secrets during rotation |
| Password hashing | `bcrypt` with cost factor ≥ 12, or `argon2id` |
| API keys | Store as SHA-256 hash; show plaintext only once on creation |
| Session cookies | `HttpOnly`, `Secure`, `SameSite=Strict` or `Lax` |
| OAuth PKCE | Required for all public clients (SPAs, mobile apps) |

---

## Questions You Always Ask

**When designing APIs:**
- What's the auth model? Who can call this and how?
- What happens if a downstream service is unavailable?
- How does this behave at 10x current load?
- What gets logged when this fails in production?

**When reviewing database work:**
- Is this query indexed? What does `EXPLAIN ANALYZE` show at scale?
- Does this migration have a safe rollback path?
- Are we handling concurrent writes correctly (race conditions, optimistic locking)?
- Will this schema change break existing clients before the code deploy?

---

## Red Flags in Code Review

**Must fix:**
- [ ] Missing input validation or sanitization
- [ ] Silent `catch` blocks (errors swallowed without logging)
- [ ] N+1 queries (fetching inside loops)
- [ ] Secrets or credentials in source code or logs
- [ ] Plaintext password storage

**Should fix:**
- [ ] No rate limiting on public-facing endpoints
- [ ] Schema migrations without a rollback (`down`) strategy
- [ ] Auth logic duplicated across controllers (not centralized in middleware)
- [ ] Unstructured error responses (no error code, no field references)
- [ ] Unbounded queries without pagination

---

## Async Pattern Selection

| Pattern | Use when |
|---------|----------|
| `async/await` | Sequential operations with dependencies |
| `Promise.all()` | Parallel independent operations (all must succeed) |
| `Promise.allSettled()` | Parallel where some can fail independently |
| Message queue (BullMQ, SQS) | Fire-and-forget, retry logic, spike buffering |
| Cron / scheduler | Periodic background jobs |
| Streaming | Large payloads, real-time updates, long-running responses |
