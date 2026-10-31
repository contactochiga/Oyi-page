# Solutions & Packages (SP4)

`HARDWARE_PACKAGES_ENABLED=true` is the independent, server-side package switch. Missing, false or any other value disables it. Do not enable it in production without separate release/activation approval. No committed environment enables it.

- Solutions hub and each supported solution type display Office-published package collections. Store displays the same collection where enabled.
- `/solutions/packages/<slug>` shows approved package size, hardware price or consultation, required/optional/recommended components, per-size/per-unit quantities, scope and separately quoted/included installation.
- No cart, checkout, booking, order or payment routes are added.
- Existing site navigation is unchanged. Layout reuses Store navy/white conventions.
- Readers use existing `OCHIGA_OFFICE_BASE_URL` and read-only `OCHIGA_OFFICE_CATALOGUE_KEY`. Explicit Office targets are mandatory for local/preview environments under the existing target policy. No production fallback is added.
- Package reads and media use no-store. Office withdrawal takes effect on the next authoritative request without source edits or a site redeploy. Pages remain noindex for this review stage.
- `/solutions/packages/media/<sha>.webp` is independently gated, bounded and proxies only current package media, with nosniff and no-store.
- Private Office previews reuse the same package renderer and existing signed-preview media route; preview pages have no enquiry actions.
- Contact and deployment forms carry bounded slug, size and version context. The server re-reads Office before CRM intake, rejects missing/withdrawn options and rejects changed versions. Client prices/names are ignored. Existing submissions without package context retain their behavior.

Tests:

    node tests/packages/unit.cjs
    npm run build
    node tests/packages/http.cjs
    node tests/release-a/unit.cjs
    node tests/release-a/http.cjs

Real local Office staging (synthetic fixtures, loopback only):

    PACKAGE_STAGING_DIR=<private path> node tests/packages/staging-browser.cjs
    PACKAGE_STAGING_DIR=<private path> node tests/packages/staging-intake.cjs

Staging browser expects the separately started built site at 127.0.0.1:4397 with the generated Office connection bindings and loopback-only egress guard. It generates desktop/tablet/mobile screenshots. The runtime connection file must remain private and untracked. No production login or cookie is used.

Limitations: staging pictures are generated colour tiles, not approved commercial photography. Production copy, package composition, independent approval, compatibility claims, real approved pricing and installation scope need owner/staff review. Ordering and billing are explicitly deferred.
