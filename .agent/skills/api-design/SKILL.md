---
name: api-design
description: Use when designing REST or GraphQL APIs, defining versioning strategy, implementing rate limiting, pagination, or writing API documentation
---

# API Design Lens

> **Philosophy:** An API is a contract. Breaking it breaks your users' production systems.
> Design APIs for the client's needs, not the server's convenience.

---

## Core Instincts

- **API contracts are forever** — breaking changes in v1 are unforgivable; version aggressively
- **Design for the consumer** — the client's workflow, not the server's data model, drives resource design
- **Idempotency is non-negotiable** — safe to retry = safe to build reliable systems on top of
- **Errors must be informative** — vague errors waste developer hours
- **Consistency over cleverness** — a boring, predictable API is a beloved API

---

## REST Resource Design Rules

```
Resource naming:
  ✅ /users/{id}/projects          (noun, plural, hierarchical)
  ❌ /getProjectsForUser/{id}      (verb, confusing)
  ❌ /user-projects/{userId}       (mixed conventions)

HTTP verbs:
  GET    /resources        → list (paginated)
  GET    /resources/{id}   → get one
  POST   /resources        → create
  PUT    /resources/{id}   → full replace (idempotent)
  PATCH  /resources/{id}   → partial update
  DELETE /resources/{id}   → delete (idempotent)

Idempotency:
  GET, PUT, DELETE = always idempotent
  POST = not idempotent by default → use Idempotency-Key header
```

---

## HTTP Status Codes (Precise Usage)

| Status | Use when | Body |
|--------|----------|------|
| 200 | Success, returns data | Resource |
| 201 | Created | Resource + `Location` header |
| 204 | Success, no body | Empty |
| 400 | Malformed request / validation failure | Error with field details |
| 401 | Missing or invalid auth | Error |
| 403 | Auth valid, no permission | Error (don't reveal resource existence) |
| 404 | Resource not found | Error |
| 409 | Conflict (duplicate, state clash) | Error with conflict detail |
| 422 | Valid format, business rule violation | Error with reason |
| 429 | Rate limited | Error + `Retry-After` header |
| 500 | Unexpected server error | Generic error (log full details server-side) |

---

## Error Response Standard (RFC 7807 / Problem Details)

```json
{
  "type": "https://docs.myapp.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "One or more fields are invalid",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "name",  "message": "Required" }
  ],
  "requestId": "01HX7Y3Z..."
}
```

**Always include `requestId`** — allows support to find logs immediately.

---

## Pagination

```
Offset-based (simple, less scalable):
  GET /users?page=2&limit=20
  ✅ Good for: admin UIs, small datasets
  ❌ Bad for: large datasets (OFFSET N scans N rows)

Cursor-based (scalable, real-time safe):
  GET /users?cursor=eyJpZCI6MTIzfQ&limit=20
  Response: { data: [...], nextCursor: "eyJpZCI6MTQzfQ", hasMore: true }
  ✅ Good for: feeds, large datasets, infinite scroll
  ❌ Bad for: jump-to-page UI

Default recommendation: Cursor-based with opaque base64 cursors.
Expose total count only when necessary (expensive for large tables).
```

---

## Rate Limiting

```
Strategy: Token bucket or sliding window

Headers to include:
  X-RateLimit-Limit:     1000    (max requests per window)
  X-RateLimit-Remaining: 847     (requests left)
  X-RateLimit-Reset:     1711234567  (Unix timestamp when window resets)
  Retry-After:           60      (seconds to wait, on 429 only)

Recommended limits for SaaS APIs:
  Authenticated:   1000 req/min per user
  Unauthenticated: 60 req/min per IP
  Sensitive (auth endpoints): 5 req/15min per IP
```

---

## API Versioning

```
Strategy options:
  URL versioning:    /v1/users   ← RECOMMENDED (explicit, cacheable)
  Header versioning: Accept: application/vnd.myapp.v1+json  (less visible)
  Query param:       /users?version=1  (ugly, cache issues)

Breaking vs non-breaking changes:
  Non-breaking (safe without versioning):
    ✅ Adding new optional fields to response
    ✅ Adding new optional request parameters
    ✅ Adding new endpoints
  
  Breaking (requires new version):
    ❌ Removing fields from response
    ❌ Changing field types
    ❌ Changing endpoint behavior
    ❌ Renaming fields
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Return 200 for errors | Clients parse status codes; 200 failure = broken integrations | Use correct status codes |
| Expose internal IDs (auto-increment integers) | Enumerable, leaks count of records | UUIDs always |
| Breaking changes without versioning | Clients' production breaks silently | `/v2/` or deprecation period |
| Unbounded list endpoints | OOM at scale | Always paginate; default limit 20, max 100 |
| Verbose errors in production | Leaks internals to attackers | Generic message to client; details in server logs only |
| Synchronous long-running operations | Timeout at 30s+, bad UX | Accept → 202 Accepted → polling or webhook |

---

## Questions You Always Ask

**When designing a new endpoint:**
- Is this resource name a noun (not a verb)?
- What's the idempotency story? Can the client safely retry?
- What's the pagination strategy? What's the max page size?
- Is this a breaking change to existing consumers?

---

## Red Flags

**Must fix:**
- [ ] `200 OK` returned for error responses
- [ ] No pagination on list endpoints
- [ ] Auto-increment integer IDs exposed
- [ ] Breaking API change without version bump

**Should fix:**
- [ ] No rate limiting on public endpoints
- [ ] Error responses without field-level details
- [ ] No `requestId` in error responses (prevents support lookup)
- [ ] No OpenAPI/Swagger spec

---

## Who to Pair With
- `backend-developer` — for implementation of API patterns
- `auth-and-identity` — for auth design on API endpoints
- `saas-architect` — for multi-tenant API context

---

## Tools
OpenAPI / Swagger (spec) · Scalar / Stoplight (docs) · Hono / Fastify / Express (Node.js) · Zod / Joi (validation) · `express-rate-limit` / Upstash Rate Limit · Postman / Insomnia (testing)
