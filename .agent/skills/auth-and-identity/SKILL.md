---
name: auth-and-identity
description: Use when implementing authentication, authorization, SSO/SAML/OIDC, multi-tenant identity, session management, or role-based access control for a SaaS product
---

# Auth & Identity Lens

> **Philosophy:** Authentication proves who you are. Authorization proves what you can do.
> Mixing them up is the most common source of privilege escalation bugs.

---

## Core Instincts

- **AuthN ≠ AuthZ** — always handle them as separate concerns
- **Every request must be authenticated AND authorized** — auth middleware is not authorization
- **Tenant context must be established on every request** — after AuthN, before any DB query
- **Fail closed** — when in doubt, deny; never default to permissive
- **Never roll your own crypto** — use proven libraries and protocols

---

## Multi-Tenant Auth Flow

```
Request arrives →
1. Verify token/session (AuthN) → get user_id
2. Load user + tenant membership → get tenant_id, role
3. Set tenant context (RLS / app context)
4. Check permission for this route/resource (AuthZ)
5. Execute request
```

**Order matters:** If you skip step 3, RLS doesn't know which tenant. If you skip step 4, any authenticated user can do anything.

---

## Auth Strategy Selection

| Method | Best for | Not for |
|--------|----------|---------|
| **JWT (stateless)** | Stateless APIs, microservices | When you need instant revocation |
| **Session cookie** | Web apps, SSR | Mobile-first or API-only |
| **API key** | Machine-to-machine, developer APIs | User-facing login |
| **SAML 2.0** | Enterprise SSO (Okta, Azure AD) | Consumer apps |
| **OIDC / OAuth 2.0** | Social login, federated identity | Internal-only systems |

**Indie hacker default:** Session cookies for web (HttpOnly, Secure, SameSite=Strict) + JWT for API endpoints.

---

## JWT Rules

```
Access token:
- Expiry: 15 minutes (short-lived; compromised → limited damage window)
- Payload: user_id, tenant_id, role, exp — NO sensitive data
- Store: Memory (never localStorage) or HttpOnly cookie

Refresh token:
- Expiry: 7–30 days
- Store: HttpOnly cookie ONLY
- Rotate on every use (refresh token rotation)
- Invalidate all refresh tokens on password change/logout all

Signing:
- Algorithm: RS256 (asymmetric, allows public verification) or HS256 (simpler, shared secret)
- Secret: ≥ 32 random bytes; rotate if compromised (support multiple valid secrets during rotation)
```

---

## RBAC Pattern (Role-Based Access Control)

```typescript
// Roles per tenant membership (not global)
type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';

// Permissions defined as capability strings
const PERMISSIONS = {
  owner:  ['billing:manage', 'members:manage', 'data:delete', 'data:write', 'data:read'],
  admin:  ['members:manage', 'data:write', 'data:read'],
  member: ['data:write', 'data:read'],
  viewer: ['data:read'],
} satisfies Record<TenantRole, string[]>;

// Check at every protected route/action
function can(user: User, permission: string): boolean {
  return PERMISSIONS[user.tenantRole]?.includes(permission) ?? false;
}
```

---

## SSO / SAML Integration (Enterprise)

```
When to build SAML:
- Enterprise customers require it (Okta, Azure AD, Google Workspace)
- Single "SAML" request in a deal is worth building immediately

Implementation options for indie hackers:
1. WorkOS — $0 to start, pay per enterprise connection; fastest path
2. Auth0 / Clerk — SAML add-on; higher cost at scale
3. Roll your own — samlify / passport-saml; significant complexity

SAML Flow:
  User → Your SP (Service Provider) → IdP (Okta/AzureAD) → SAML assertion → SP → Session
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| JWT in `localStorage` | XSS attack steals token, unlimited access | `HttpOnly` cookie |
| Long-lived access tokens (> 1 hour) | Compromised token = long exposure window | 15 min expiry + refresh token rotation |
| Storing passwords as anything but bcrypt/argon2id | Rainbow table crack in seconds | bcrypt cost ≥12 or argon2id |
| Checking auth at route level only | Bypassed by internal calls | Check permissions at the service/data layer |
| Global admin role without per-tenant scope | One compromised admin = all tenants affected | Admin role always scoped to a tenant |
| No rate limiting on auth endpoints | Brute force, credential stuffing | Max 5 attempts / 15 min per IP |
| Email as unique identifier across tenants | Same email in multiple tenants = collision | `(email, tenant_id)` composite unique |

---

## Questions You Always Ask

**When designing auth:**
- Is tenant context established before any DB query happens?
- Does AuthZ happen at the service layer, not just route middleware?
- Are refresh tokens rotated on every use?
- What's the logout flow? Does it invalidate server-side session/refresh token?

**When adding a new role or permission:**
- Is this the least privilege needed for this action?
- Have we tested that a lower-privileged role cannot access this?

---

## Red Flags

**Must fix:**
- [ ] JWT stored in `localStorage`
- [ ] No tenant_id in auth context (tenant isolation can't work)
- [ ] Authorization only checked at route level (not service/data layer)
- [ ] No rate limiting on `/login`, `/forgot-password`, `/reset-password`

**Should fix:**
- [ ] Refresh tokens not rotated on use
- [ ] No MFA option for admin/owner roles
- [ ] Email uniqueness checked globally (not per-tenant)

---

## Who to Pair With
- `saas-architect` — for tenant context in data model
- `security-engineer` — for token storage and auth security audit
- `backend-developer` — for middleware and session management

---

## Tools
**Hosted auth:** Clerk · Auth0 · Supabase Auth · Firebase Auth  
**Self-hosted:** NextAuth.js / Auth.js · Lucia · Better Auth  
**Enterprise SSO:** WorkOS · Boxyhq (open source)  
**Libraries:** `jose` (JWT) · `bcrypt` / `argon2` (passwords) · `samlify` (SAML)
