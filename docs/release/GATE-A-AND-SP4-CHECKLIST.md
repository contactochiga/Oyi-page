# Gate A and SP4 release checklist — draft only

PR #4 is preserved at 34f0859802e8a0e5d02cd0ab386c95339dc6ccd0. This SP4 PR is stacked on `codex/store-gate-a`; it must not be used to bypass PR #4's approval. Accepted SP4 source 1875fbb is preserved. Only that commit was cherry-picked; no Phase 4/5 storefront, cart, checkout, order, payment or booking code is included.

## Still open

- [ ] G3: named, dated legal sign-off on `/privacy` and `/terms#store` at 34f0859.
- [ ] G4: owner/legal acceptance of principle-only retention wording and an operational request-handling procedure. No fixed retention or automated deletion promise.
- [ ] G5: final visual approval for that Store/Terms/Privacy revision. SP visual acceptance does not sign the legal release record.
- [ ] Hosting: evidence commercial-use-compliant Vercel plan; separately authorize an Office always-on upgrade or acknowledge the documented enquiry-only cold-start limitation. No billing changes here.
- [ ] Office follow-redirects patch and separate inherited zod finding resolved or explicitly reviewed; package-only Office integration and schema gate approved.
- [ ] Capture kind-aware Office rollback c9d67cb (never roll back to b256550 after packages exist).
- [ ] After Office is ready, PR #4 is approved and separately released, retarget this PR to the updated main and verify its diff contains SP4 only.
- [ ] Separate production migration/deployment authorization, followed by authenticated smoke checks.
- [ ] Real package content, image rights, device compatibility, installation scope and independent price approval.
- [ ] Independent production product/package approval, release/update/withdrawal verification.
- [ ] Separate public Store/package activation decision. Keep `HARDWARE_CATALOGUE_ENABLED` and `HARDWARE_PACKAGES_ENABLED` absent/false meanwhile.

## Integration evidence

No SP4 code conflict. Existing Office readers, preview renderer and CRM context reused. Package reads/media are no-store, scoped, and independently gated. Customer-provided prices/names do not authorize anything. Version/size context is re-read from Office. Pages remain noindex. Existing accepted visual design is unchanged.

Production-based Office integration resolves only Packages tab/dispatch and asset routing, with additional hardware kind containment. Financial and fulfilment modules remain excluded. See the separate Office draft PR.

Completed local tests: package unit 17; package HTTP 25 (four flag combinations, withdrawal and verified CRM context); Release A unit 31 and HTTP 33; build and targeted lint (zero errors, existing image/performance warnings). No production enquiries or data writes. Dependency audit: zero findings for GetOyi production dependencies. Separate Office audit is not clean.

Vercel Git auto-deploy is disabled only for `codex/sp-getoyi-release`; production and PR #4 configuration are not changed. A draft push must not create a preview deployment. No deployment, merge, activation or booking is authorized by this PR.
