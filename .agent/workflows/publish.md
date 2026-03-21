---
description: Publish agy-superpowers to npm with version bump, git tag, and push
---

Publish `agy-superpowers` to npm.

**Current version:** check `package.json` → `"version"`
**npm page:** https://www.npmjs.com/package/agy-superpowers

---

## Usage

// turbo
1. Run the publish script with the desired version bump:

```bash
# patch bump: 5.0.5 → 5.0.6 (default, use after minor fixes)
./scripts/publish.sh

# minor bump: 5.0.5 → 5.1.0 (new features)
./scripts/publish.sh minor

# exact version: match upstream superpowers tag (use after /update-superpowers)
./scripts/publish.sh 5.1.0
```

2. Script will automatically:
   - Bump `package.json` version
   - Run `npm run build` (via `prepublishOnly`)
   - Publish to npm registry
   - `git commit` + `git tag` + `git push`

---

## After running `/update-superpowers`

When superpowers upstream releases a new version, sync and publish:

1. Run `/update-superpowers` (updates `superpowers/` and `.agent/`)
2. Check new version: `cat .agent/superpowers-version.json`
3. Publish with matching version:
   ```bash
   ./scripts/publish.sh 5.1.0   # replace with actual new version
   ```
