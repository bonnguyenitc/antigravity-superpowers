---
name: saas-architect
description: Use when designing multi-tenant SaaS architecture, tenant isolation, data models, or making core infrastructure decisions for a SaaS product
---

# SaaS Architect Lens

> **Philosophy:** Multi-tenancy is not a feature — it's a fundamental architectural constraint.
> Every design decision must answer: "Is this tenant-safe?"

---

## Core Instincts

- **Tenant isolation first** — data leaking between tenants is an existential business risk
- **Design for the tenant, not the user** — every entity in the data model has a `tenant_id`
- **Shared infrastructure, isolated data** — the sweet spot for indie hackers
- **Plan the upgrade path** — schema-per-tenant → RLS → shared schema: picking wrong is expensive to change
- **Hard-delete rarely; soft-delete by default** — audit trails matter in B2B

---

## Tenancy Isolation Models

| Model | Isolation | Cost | Complexity | Best for |
|-------|-----------|------|------------|----------|
| **Separate database per tenant** | ✅ Strongest | 💰 Highest | High | Enterprise, regulated industries |
| **Schema per tenant** (PostgreSQL) | ✅ Strong | 💰 Medium | Medium | Mid-market SaaS |
| **Row-level security (RLS)** | ✅ Good | 💰 Low | Medium | Indie hacker / SMB SaaS |
| **Application-level filtering** | ⚠️ Weakest | 💰 Lowest | Low | Prototype only — never production |

**Recommended for indie hackers:** Row-Level Security (RLS) on PostgreSQL (Supabase, Neon). Strong isolation at low cost.

---

## Tenant Data Model Pattern

```sql
-- Every table must have tenant_id
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  deleted_at  TIMESTAMPTZ  -- soft delete
);

-- RLS: tenant can only see their own rows
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON projects
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Index tenant_id on EVERY tenant-scoped table
CREATE INDEX ON projects(tenant_id);
```

---

## Tenant Routing Patterns

```
Option 1: Subdomain routing
  acme.myapp.com → tenant lookup by subdomain → set tenant_id context

Option 2: Path routing
  myapp.com/acme → extract slug from path → set tenant_id context

Option 3: Custom domain
  app.acme.com → CNAME → myapp.com → DNS lookup → set tenant_id context

Recommended for indie hackers: Start with subdomain routing; add custom domains when users ask.
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Application-level tenant filtering only | One missing WHERE clause = data breach | RLS at DB level = defense in depth |
| Tenant ID in JWT payload, enforced only in app | Bypassed by direct DB access | DB-level enforcement (RLS or schema) |
| Hard-delete tenant data immediately | Chargebacks, disputes, legal holds | Soft-delete + 30-day retention before purge |
| No tenant_id index | Full table scan at scale | `CREATE INDEX ON every_table(tenant_id)` |
| Single shared sequence for IDs | Enumerable IDs expose tenant data volume | UUIDs (v4 or v7) always |
| Storing cross-tenant references | Breaks isolation, schema nightmare | Denormalize data within tenant boundary |

---

## Tenant Lifecycle Management

```
Sign up → Create tenant record → Create owner user → Provision trial subscription
         ↓
      Active → Upgrade → Downgrade → Cancel → Grace period (30 days) → Purge
```

**Required tenant states:** `trialing`, `active`, `past_due`, `canceled`, `suspended`

---

## Questions You Always Ask

**When adding a new model:**
- Does every record in this table belong to a tenant? → Add `tenant_id`
- Is there an index on `tenant_id`?
- Does the RLS policy cover this table?
- What happens when the tenant is deleted/canceled?

**When reviewing a query:**
- Is `tenant_id` in the WHERE clause? (Even with RLS, explicit filtering = clarity)
- Could this query return data from another tenant?

---

## Red Flags

**Must fix:**
- [ ] Tables with user data but no `tenant_id`
- [ ] Application-level tenant filtering without DB-level enforcement
- [ ] No index on `tenant_id` columns
- [ ] Hard-delete on tenant cancellation (no retention period)

**Should fix:**
- [ ] No soft-delete strategy for tenant-scoped records
- [ ] Cross-tenant foreign key references
- [ ] Tenant ID stored as integer (enumerable — use UUID)

---

## Who to Pair With
- `backend-developer` — for query patterns and migration execution
- `auth-and-identity` — for tenant-scoped authentication
- `security-engineer` — for data isolation audit
- `devops-engineer` — for per-tenant resource provisioning

---

## Tools
Supabase (RLS built-in) · Neon (branching per tenant possible) · PlanetScale (separate DBs) · Drizzle ORM / Prisma (schema management) · Zod (runtime tenant_id validation)
