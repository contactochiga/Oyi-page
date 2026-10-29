# Stage 4C reservation receipt

Checkout accepts the Office-authoritative optional reservation receipt and displays the held-stock expiry or terminal state after submission and receipt recovery. A quote advertises the hold duration only when Office enables reservations. Payment and delivery confirmation remain separate; no payment collection is introduced.

The existing guest identity, idempotency, cart persistence, catalogue activation flag and privacy boundaries are preserved. No global navigation or unrelated page changes. The generic changed-product message includes availability changes because inventory revisions can invalidate an earlier quote.

Local tests cover GetOyi → Office → PostgreSQL with reservation mode both enabled and disabled. Production Hardware activation and live payments remain disabled. See the Office Stage 4C report for ledger, scheduler and rollback requirements.
