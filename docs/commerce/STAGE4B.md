# Stage 4B cart and guest checkout — local candidate

The cart stores only product slug, selected SKU and quantity. Product/variant presentation reuses ProductDetail/ProductShowcase. Add to Cart appears only when checkout is enabled, the selected variant is priced/in stock, and the page is not a private preview. Quote-only and unconfirmed stock retain the existing quotation enquiry action.

New pages: `/hardware/cart` and `/hardware/checkout`. Existing navigation, contact/deployment integrations and unrelated pages are unchanged. Cart quantity edits/removal survive reload; invalid stored payloads are discarded. Checkout has guest contact fields, all 36 states + FCT, city/address/postcode and an optional installation-assessment request. There is no invented delivery tariff, appointment, payment or stock reservation.

The summary uses Office's fresh integer-kobo quote. VAT is included in the product total, shown separately without double-counting. Unknown delivery is “To be confirmed”; payable total is “Not yet payable”. Submission creates a durable non-payable order request. Errors explain changed prices, unavailable stock, restricted delivery and expired quotes. A busy guard prevents duplicate clicks; a retained opaque submission key and server receipt recovery handle uncertain responses/reloads. PII is not stored in local/session storage or URLs.

Server boundary: `/api/hardware/checkout/[action]` handles session, quote, submit and status. Signed HttpOnly guest cookie, exact-origin + CSRF validation, guest/cart-bound expiring quote tokens, strict input fields, 32 KiB body limit, private/no-store responses and a dedicated Office scoped key. No browser totals are trusted and no production URL fallback exists. Environment names and Office permission/migration contracts are documented in the sibling Office `docs/commerce/STAGE4B.md`.

Tests:
- `node tests/phase4/unit.cjs`: cart manipulation, token tampering/expiry and flag boundaries.
- `node tests/phase4/cart-ui.cjs`: selected variant, quote-only exclusion and browser-storage privacy.
- `node tests/phase4/disabled-http.cjs`: after build, loopback production-mode server; checkout OFF and existing public pages preserved.
- `tests/phase4/checkout-http.cjs`: run by Office's disposable integration harness, not against production.
- Existing carousel and merchandising DOM regressions retained.

Browser rehearsal used actual GetOyi → Office → disposable Postgres requests, synthetic data and synthetic credentials. Desktop 1440px and mobile 390px had no horizontal overflow. The mobile form created a non-payable order, cart quantity persisted after reload, and removal produced the empty-cart state. No production cookies or live enquiries were used. Screenshots live in `/Users/ochigaidoko/getoyi-commerce/phase4/stage4b/screenshots/`.

GO for local Stage 4C development only. Production checkout/public activation/live payments remain NO-GO. Stock reservation/expiry, verified delivery charges, payment verification/reconciliation, production abuse protection and operational/privacy processes are outstanding. The independent real production approval/release/withdrawal prerequisite from Phase 3 is retained. No credentials were provisioned, production records migrated, code pushed/deployed or public flags enabled.
