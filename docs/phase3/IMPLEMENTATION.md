# Phase 3 local implementation and release review

## Scope and state

Local review only. Public Hardware activation remains OFF. No production requests that mutate data, permissions, environment settings, credentials, migrations, pushes or deployments were made. The pre-existing GetOyi header/footer and disabled `/hardware` fallback are preserved. Corporate Ochiga and S7 were not changed.

Locked visual reference: `/Users/ochigaidoko/Downloads/getoyi_smart_home_hardware_store.png`. No replacement design was generated. The image contains illustrative products and commercial claims; these are not catalogue data and were not inserted into the application.

## Implementation

- `StoryCarousel.tsx` ports the architecture and mechanics of Ochiga `app/components/HomeHeroCarousel.tsx` and `app/components/StoryCarousel.tsx` at 8b2024e. It retains elapsed-time playback, automatic progression, previous/next, 48px horizontal swipe, explicit/system pause, visibility suspension and reduced-motion handling. Adaptations: Oyi colours, per-slide durations, centred segmented progress with a small leading play/pause, left-aligned text/CTA, vertical-scroll discrimination. One static fallback story has no redundant playback controls.
- `HardwareCatalogue.tsx`, `HardwareBrowser.tsx`, `hardware.css` implement full-width hero, light category tiles, staff-selected featured products/new arrivals/collections, search/category/availability/name/price filtering and 12-card pagination. Cards use existing public images/prices/availability. No invented bestsellers, reviews, offers, stock counts or checkout. Unsupported editorial sections are omitted.
- Existing ProductDetail/ProductShowcase retain media and variant behavior with scoped light styling. Existing contact form now preserves a bounded product slug in message and page URL for CRM context. Submission behavior is unchanged.
- Server-only `catalogue.ts` reads the new no-store merchandising projection through the existing scoped API key. Existing product projection and image routes remain authoritative. Browsing is client-side over the existing full public catalogue; larger catalogues may eventually need server pagination.
- Office paired branch adds a Products-local Hardware campaigns editor. Staff select images from existing released product galleries, edit headings/descriptions/CTA/order/duration/schedules, and select featured products/new arrivals/collections. No separate product database or image-processing system.
- Immutable campaign versions, independent author/reviewer checks, existing permission scopes, optimistic concurrency, audit/notification hooks, explicit publication/withdrawal and current product eligibility are enforced. Editing keeps the existing live snapshot. Expired slides, withdrawn/unavailable products and obsolete image references are excluded on every projection.
- Dedicated campaign-only photography uploads are not implemented. Campaign assets currently must pass through the existing product-gallery review/release workflow. This is a deliberate reuse boundary and requires content-team acceptance before release; it limits hero composition to approved gallery assets.

## Verification

| Check | Result |
|---|---|
| GetOyi lint, TypeScript and production build | PASS |
| Carousel DOM/unit tests | 15 PASS |
| Office merchandising validation + isolated authenticated HTTP | 41 PASS |
| Office existing catalogue HTTP regression | 104 PASS |
| Office existing public projection unit suite | 8 PASS |
| Disposable PostgreSQL/PostgREST regression including new migration/workflow | 151 PASS, 0 failures |
| Campaign editor DOM harness | 6 PASS |
| Office lint/runtime asset build | PASS |
| Browser desktop 1440 and mobile 390 | No horizontal overflow; controls centred, leading pause/play, next/previous; filtering, search, pagination and quote prefill PASS |
| Flag OFF production-mode local server | Existing Hardware page 200; product detail/media 404; commercial hero absent |
| Live production mutation/CRM send | Not run; prior accepted Phase 2 evidence retained |

The first database test exposed missing truncate guards on new history tables; these were added and the final 151-check suite passed. No production schema was touched. Editor testing used a DOM harness plus real isolated HTTP API tests, not a live staff browser session. Browser touch simulation and reduced-motion/timing were covered at unit level; physical mobile hardware was not used.

Tests: `npm run test:hardware:carousel`; `node tests/phase3/merchandising-ui.cjs /path/to/office-worktree`; in Office run `node scripts/test-catalogue-merchandising.js` and `node scripts/test-catalogue-postgres.js` (disposable Docker environment). `fixture-page.tsx` is a test-only module, not an application route. During browser verification a temporary `/phase3-check` route exposed it; that route was removed before the final production build.

## Visual evidence and honest limitations

Screenshots are in `/Users/ochigaidoko/getoyi-commerce/phase3/screens/`; comparison report is `../comparison.html` relative to that folder. Primary screenshots use a loopback-only empty-catalogue adapter, consistent with the unreleased catalogue. They prove layout and empty-state behavior, not a populated commercial launch. No production API keys were copied into this environment. Separate screenshots explicitly label synthetic interaction fixtures and contain no invented product prices/images.

The navy/white hierarchy, left hero text, blue CTA, full-width imagery slot, category/product grids and story interaction follow the locked reference. The existing dark navigation is intentionally unchanged. Exact cinematic photography, populated category tiles, featured sections and image crops cannot receive visual sign-off until approved Office assets/products/campaigns are available. Do not describe empty screenshots as a full visual match.

Dependency audit matches baseline: 13 advisories (1 low, 3 moderate, 8 high, 1 critical), no newly affected package names. Existing Next.js 16.2.7 advisories require a separate scoped remediation/retest before production release. No unrelated dependency upgrade was mixed into this work.

## Verdict and release prerequisites

Local implementation is ready for code/design review. **Production release: NO-GO. Public activation: NO-GO.**

1. Review the additive Office schema, new function/grants and stricter privileges; update/review the deployment security-gate baseline before any separately authorized migration. No production migration has been applied.
2. Resolve inherited dependency advisories and rerun relevant regressions.
3. Supply approved released products and campaign assets, confirm the gallery-based campaign asset workflow, then capture populated desktop/mobile screenshots and obtain visual sign-off against the locked reference.
4. Complete independent product approval/publication/withdrawal and campaign release/withdrawal tests under separate explicit authorization; no automatic permission grants. Verify cache/eligibility behavior through the deployed stack before public activation.
5. Verify the deployed Products campaign editor with authorized staff and perform a controlled CRM regression only if separately authorized. Existing accepted Phase 2 CRM evidence is retained; Phase 3 quote-prefill browser check sent nothing.
6. Separate release review must authorize deployment/migration. Public flag remains OFF until its own mandatory activation checks pass.
