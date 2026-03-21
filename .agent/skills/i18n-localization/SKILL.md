---
name: i18n-localization
description: Use when planning internationalization (i18n) architecture, localizing an app for new markets, managing translations, or optimizing for non-English app store listings
---

# i18n / Localization Lens

> **Philosophy:** Localization is not translation. It's redesigning the experience for a different culture.
> A poorly localized app signals "we don't really care about your market."

---

## Core Instincts

- **i18n first, l10n second** — build the architecture for internationalization before translating
- **Never hardcode strings** — every user-visible string lives in an external translation file
- **RTL is a layout problem, not a text problem** — Hebrew, Arabic require mirrored layouts
- **Local market ≠ translated market** — date formats, numbers, currencies, cultural norms all differ
- **App Store localization = free ASO** — localized store listings rank in local search without app changes

---

## i18n vs l10n

| Term | Definition |
|------|-----------|
| **i18n** (internationalization) | Engineering — building support for multiple locales |
| **l10n** (localization) | Content — adapting content for a specific locale |
| **t9n** (translation) | Linguistic — converting text between languages |

---

## Technical Requirements

### Strings
- Never concatenate user-visible strings: `"Hello " + name` → use named placeholders: `"Hello {name}"`
- Pluralization rules differ by language (Russian has 4 plural forms; English has 2)
- Use ICU message format for complex strings: `{count, plural, one {# item} other {# items}}`

### Date / Time / Numbers
| Category | Example variance |
|----------|-----------------|
| Date format | US: 12/31/2024, EU: 31/12/2024, ISO: 2024-12-31 |
| Time format | 12h (US) vs 24h (EU/Asia) |
| Number format | 1,234.56 (US) vs 1.234,56 (EU) vs 1 234,56 (FR) |
| Currency | Symbol position varies; decimal precision varies by currency |
| Calendar | Gregorian default; some markets use Islamic, Hebrew, Chinese calendars |

**Always use:** `Intl.DateTimeFormat`, `Intl.NumberFormat` (JS) or locale-aware libraries — never manually format.

### Right-to-Left (RTL) Languages
Arabic, Hebrew, Persian, Urdu — require:
- Mirrored layout (left → right becomes right → left)
- Text alignment: `start` / `end` instead of `left` / `right`
- Icons that indicate direction must be flipped
- Test with: RTL pseudo-localization before translating

---

## App Store Localization Priority

Localize store listings first — no code changes needed, immediate revenue impact.

| Market | Language | Potential uplift |
|--------|----------|-----------------|
| China | Simplified Chinese | 🔴 High (largest iOS market) |
| Japan | Japanese | 🔴 High (highest ARPU per user) |
| Germany | German | 🟠 Medium-high |
| Brazil | Portuguese (BR) | 🟠 Medium-high |
| France | French | 🟡 Medium |
| South Korea | Korean | 🟡 Medium |

**Rule:** Localize App Store listing → measure download increase → justify full app localization.

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| Hardcode strings in UI components | Impossible to translate in future | All strings in `i18n/en.json` from day one |
| Use string concatenation for sentences | Word order differs by language | Named placeholders in translation keys |
| Assume text length = English length | German is ~35% longer; Chinese is ~50% shorter | Design UI for 150% of English text length |
| Use machine translation (Google Translate) for store listing | Quality signals carelessness | Professional translation for app store copy |
| Translate only UI — not error messages, emails, notifications | Inconsistent experience | All user-visible text in translation files |
| Design with only LTR in mind | RTL markets are large (Arabic = 400M speakers) | Use logical CSS properties (`inset-inline-start`) from start |

---

## Questions You Always Ask

**When architecting i18n:**
- Are all strings externalized into translation files (zero hardcoded UI text)?
- Does the date/number/currency formatting use locale-aware APIs?
- Is the layout system using logical properties (`start`/`end`) for RTL readiness?

**When planning a new market:**
- What's the current revenue from that country without localization?
- What's the expected uplift from App Store listing localization vs full app localization?
- Are there cultural norms that affect UX? (e.g., messaging apps are primary in some markets)

---

## Red Flags

**Must fix:**
- [ ] Hardcoded strings in UI code
- [ ] String concatenation for user-visible sentences
- [ ] Manual date/number formatting (not using `Intl.*` or locale library)

**Should fix:**
- [ ] App Store listing not localized for top 3 download markets
- [ ] Layout uses `left`/`right` instead of `start`/`end` (RTL-incompatible)
- [ ] No pseudo-localization test (catches text overflow and layout issues before real translation)

---

## Who to Pair With
- `app-store-optimizer` — for App Store listing localization strategy
- `mobile-developer` — for React Native / Flutter i18n implementation
- `frontend-developer` — for web i18n and RTL CSS

---

## Tools
**React:** `react-i18next` / `next-intl` · **Flutter:** `flutter_localizations` + ARB files · **iOS native:** `NSLocalizedString` + `.xcstrings` · **Translation management:** Lokalise · Phrase · Crowdin · **Quality:** Pseudo-localization testing → Appium
