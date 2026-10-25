# Phase 3 Hardware commercial experience — pre-implementation audit

25 October 2026. Baseline GetOyi 3ee9ed8; Office 7c35784. Production remains unchanged. Public activation remains disabled. No migrations, deployments, pushes, approvals or product publication are part of this audit.

## Design evidence

The owner confirmed a white/light storefront, navy Oyi branding, unchanged GetOyi navigation, full-width cinematic hero, left-aligned heading/description/CTA, centered lower progress controls with small leading play/pause, edge arrows, categories, featured products, arrivals and enquiries. The Office Products reference is explicitly excluded.

The accessible conversation is titled “Oyi Business Website Plan” in the Ochiga development platform project. Historical user messages confirm carousel reuse and positioning. Its generated-image responses are returned as content references rather than image pixels. The approved mockup has not yet been visually inspected; visual implementation and side-by-side sign-off require the original image. Do not substitute a newly generated design.

## Exact carousel source

Read-only source: /Users/ochigaidoko/Documents/Ochiga-website/app/components/HomeHeroCarousel.tsx, imported by app/page.tsx. The reusable counterpart is app/components/StoryCarousel.tsx. Repository HEAD: 8b2024e. Corporate repository is untouched, including its unrelated untracked supabase directory.

Reuse the reusable StoryCarousel architecture and homepage interaction behavior: active slide state, elapsed-time pause/resume, autoplay, visibility suspension, user/system pause distinction, 48px swipe threshold, edge arrows, a single accessible active text panel and reduced-motion preference. Adapt only within GetOyi: remove AbstractSurface/Ochiga colour dependencies, use approved Office image renditions and navy styles, per-slide durations, segmented indicators and controls immediately before the centered segments. Keep left text alignment. Check horizontal-vs-vertical swipe intent, keyboard focus, explicit pause and hidden-tab/reduced-motion interactions; do not copy existing behavior without testing it.

## Reuse and genuine gaps

| Existing file | Reuse | Missing Phase 3 work |
|---|---|---|
| src/app/hardware/page.tsx | Disabled static fallback; gated category/catalogue view | Commercial section composition behind existing gate only |
| src/components/hardware/HardwareCatalogue.tsx | Public cards, category links, actual prices/availability, honest empty/unavailable states | Light storefront presentation, search/sort/pagination and collections/arrivals |
| src/components/hardware/ProductDetail.tsx and ProductShowcase.tsx | Published/preview shared renderer, gallery, variant price/availability, specifications | Consistent storefront treatment and quote/contact actions without checkout |
| src/lib/catalogue.ts | Server-side scoped API client, image paths, existing cache tags, feature flags | Typed merchandising projection; browsing parameters |
| src/app/contact/page.tsx | Existing idempotent CRM/email submission | Product slug is currently dropped despite detail links supplying it; safely preserve bounded product context in enquiry payload/message without changing unrelated form behavior |
| Office src/lead-agents/catalogue-public-api.js | Explicit published-only projection and scoped read authentication | Filtering/pagination contract; merchandising endpoint that rechecks current product eligibility |
| Office src/lead-agents/catalogue-public.js | Safe public field allow-list; media/price/availability | Do not infer first arrival from updated_at: this currently means released_at and can change on re-release |
| Office src/lead-agents/catalogue-store.js | Conditional transitions, immutable versions, shared database/file-store contract | Versioned campaign/collection records and atomic approval/publication/withdrawal transitions |
| Office public/office/catalogue/catalogue.mjs | Products-local UI and permission conventions | Merchandising tab/editor; no global shell change |
| Office catalogue-media.js and storage.js | Validated processing, private originals, WebP renditions, existing Office storage | Campaign asset ownership/reference model; current catalogue media is product-associated, so arbitrary campaign uploads are not already supported |

Corporate content publishing is Sanity-oriented and its mutable content records/check-then-write transitions should not be used unchanged as a campaign approval system. Reuse existing storage/audit/notification services and catalogue workflow patterns, not a second product database.

## Smallest safe implementation sequence

1. Inspect the approved storefront image and record a section-level comparison against this audit.
2. Port the reusable story interaction locally; use light Hardware-only styling and unchanged shared navigation. Keep static public fallback byte-for-byte equivalent while disabled.
3. Extend existing catalogue browsing and reuse product cards/details. Add featured/new-arrival sections only from authoritative public product references; hide unsupported articles rather than inventing content.
4. Add a narrow merchandising model: immutable draft versions, independent review, explicit release permission, start/end scheduling, ordered slides/durations, featured product references and collections. Validate CTA destinations. Edits must not mutate the approved live version. Withdrawal and scheduled expiry must remove campaign/media exposure; define cache behavior around schedule boundaries and failed refreshes.
5. Add Products-local campaign forms and media selection/upload through the existing Office pipeline. Record every workflow action in audit/notifications. Do not grant permissions automatically. Prepare additive SQL for review but do not apply it without release authorization.
6. Exercise isolated database/storage and HTTP tests for permissions, author-review denial, concurrent transitions, unapproved asset denial, invalid CTA, invalid schedule/duration, withdrawal, expiry, and current product eligibility. No live enquiries are authorized for Phase 3 by the prior R6 test authorization.
7. Test responsive desktop/mobile rendering, keyboard/touch controls, reduced motion, exact pause/resume and background visibility. Capture implementation beside the approved image; label test-only fixtures clearly. Never present synthetic products/prices as real catalogue content.

## Release gates

Phase 3 is not implemented or tested yet. Release review: NO-GO. Public activation: NO-GO. Mandatory independent product publication/withdrawal test is still deferred from Phase 2 and cannot be bypassed. Any new campaign schema must pass reviewed database/security gates before separately authorized migration. No changes to checkout, Paystack, S7, corporate site, unrelated GetOyi pages or Office shell.

## Local isolation

GetOyi worktree: /Users/ochigaidoko/getoyi-work/oyi-phase3, branch codex/phase3-hardware.
Office worktree: /Users/ochigaidoko/getoyi-work/office-phase3, branch codex/phase3-merchandising.
Both start from accepted Phase 2 commits; no production environment files were copied.
