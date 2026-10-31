# Gate A and SP4 release checklist — draft only

PR #4 is preserved at 34f0859802e8a0e5d02cd0ab386c95339dc6ccd0. This SP4 PR is stacked on `codex/store-gate-a`; it must not be used to bypass PR #4's approval. Accepted SP4 source 1875fbb is preserved. Only that commit was cherry-picked; no Phase 4/5 storefront, cart, checkout, order, payment or booking code is included.

## Still open

- [ ] G3: named, dated legal sign-off on `/privacy` and `/terms#store` at 34f0859.
- [ ] G4: owner/legal acceptance of principle-only retention wording and an operational request-handling procedure. No fixed retention or automated deletion promise.
- [ ] G5: final visual approval for that Store/Terms/Privacy revision. SP visual acceptance does not sign the legal release record.
- [ ] Hosting: evidence commercial-use-compliant Vercel plan; separately authorize an Office always-on upgrade or acknowledge the documented enquiry-only cold-start limitation. No billing changes here.
- [x] Local Office follow-redirects and inherited Zod remediations reviewed: exact scoped Zod 4.6.6 fix, full dependency audit zero, config compatibility 19/19, routing 30/30 and redirect 10/10.
- [ ] Separate Office patch/integration release authorization and fresh production schema gate.
- [ ] Capture kind-aware, security-patched Office rollback c95cc73 (successor to verified ba0e0d6) (never roll back to b256550 after packages exist).
- [ ] After Office is ready, PR #4 is approved and separately released, retarget this PR to the updated main and verify its diff contains SP4 only.
- [ ] Separate production migration/deployment authorization, followed by authenticated smoke checks.
- [ ] Real package content, image rights, device compatibility, installation scope and independent price approval.
- [ ] Independent production product/package approval, release/update/withdrawal verification.
- [ ] Separate public Store/package activation decision. Keep `HARDWARE_CATALOGUE_ENABLED` and `HARDWARE_PACKAGES_ENABLED` absent/false meanwhile.

## Integration evidence

2026-10-31 focused engineering review: no new SP4 code changes. Reuse the completed tests below; legal, visual and hosting approvals remain open. PR #4 stays unchanged at 34f0859. Office rollback proof now includes 19/19 checks against persisted synthetic package data and 16/16 boundary checks. No supplier costs, internal actor identifiers or payment authority are accepted from browser context.

No SP4 code conflict. Existing Office readers, preview renderer and CRM context reused. Package reads/media are no-store, scoped, and independently gated. Customer-provided prices/names do not authorize anything. Version/size context is re-read from Office. Pages remain noindex. Existing accepted visual design is unchanged.

Production-based Office integration resolves only Packages tab/dispatch and asset routing, with additional hardware kind containment. Financial and fulfilment modules remain excluded. See the separate Office draft PR.

Completed local tests: package unit 17; package HTTP 25 (four flag combinations, withdrawal and verified CRM context); Release A unit 31 and HTTP 33; build and targeted lint (zero errors, existing image/performance warnings). No production enquiries or data writes. Dependency audit: zero findings for GetOyi production dependencies. Updated Office security/integration/rollback dependency audits are zero after the scoped Zod fix.

Vercel Git auto-deploy is disabled only for `codex/sp-getoyi-release`; production and PR #4 configuration are not changed. A draft push must not create a preview deployment. No deployment, merge, activation or booking is authorized by this PR.
