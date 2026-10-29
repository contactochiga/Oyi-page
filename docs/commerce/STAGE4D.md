# Stage4D customer payment handoff (local only)

Base7d4a593. No main navigation, catalogue, cart pricing, checkout/contact/deployment integration or unrelated page redesign.

The payment-start and payment-quote proxy actions reuse the signed guest cookie, CSRF/origin checks, rate limit and existing Office checkout scope. Browser totals are accepted only as customer consent; Office revalidates the authoritative amount, delivery and reservation. No card details or provider credentials enter the browser.

HARDWARE_PAYMENTS_ENABLED defaults OFF and is additionally gated by the existing Hardware catalogue and checkout flags. No environment value was changed. When enabled in an isolated rehearsal, the receipt offers payment-status refresh, displays confirmed delivery and included tax, and requires acceptance of the total before navigating to allowlisted hosted Paystack checkout.

The browser return URL ignores reference/status query claims. A tab-scoped last-order ID restores the owner-bound receipt after navigation; it is not an access credential. Paid/refund-required states come only from Office. Privileged provider details are never exposed. A callback or refresh does not mark payment successful. Webhook/reconciliation independently verifies the provider.

Tests: existing23 cart/token assertions and5 cart/variant/privacy DOM checks;9 new payment-status/consent/redirect-boundary DOM assertions; real local GetOyi→Office→PostgreSQL checkout regressions with reservations ON/OFF; production build and lint. No live Paystack/merchant test was performed. Public activation and payments remain NO-GO pending separate gates.

Rollback hides new initialization first. Keep Backend webhook/recovery and Office confirmation active for possible late payments; reverting the website must not delete financial evidence or disable recovery. See Office/Backend Stage4D documents for migrations, dedicated credentials, dependency blockers and the retained Phase3 independent production approval requirement.
