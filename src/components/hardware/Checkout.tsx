"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  readCart,
  saveCart,
  STATES,
  money,
  type CartLine,
  type Quote,
  type Reservation,
} from "@/lib/checkout/cart";
import "./checkout.css";
const errors: Record<string, string> = {
  price_changed:
    "Product details or availability have changed. Refresh the summary and review it before submitting again.",
  stock_unavailable:
    "A selected quantity is no longer available. Update your cart or request a quotation.",
  product_unavailable:
    "A product is no longer available. Remove it from your cart.",
  variant_unavailable: "This option is no longer available.",
  delivery_restricted:
    "We can assess delivery within Nigeria. Choose a listed state and provide a complete address.",
  quote_expired:
    "Your price check has expired. Refresh the summary before continuing.",
  idempotency_conflict:
    "An earlier request used these submission details. Do not submit a new request; contact Sales to confirm its status.",
  session_expired: "Your session has expired. Reload this page to continue.",
  invalid_customer: "Check your name, email address and phone number.",
  checkout_unavailable:
    "We could not confirm the response. Retry with the same details; your submission reference is retained.",
};
const ATTEMPT = "getoyi-checkout-attempt-v1";
export function Checkout({
  cartOnly = false,
  testLabel = false,
}: {
  cartOnly?: boolean;
  testLabel?: boolean;
}) {
  const [lines, setLines] = useState<CartLine[] | null>(null),
    [quote, setQuote] = useState<Quote | null>(null),
    [quoteToken, setQuoteToken] = useState(""),
    [csrf, setCsrf] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [receipt, setReceipt] = useState(""),
    [reservation, setReservation] = useState<Reservation | null>(null);
  const sequence = useRef(0),
    submitting = useRef(false);
  async function load(current: CartLine[]) {
    const seq = ++sequence.current;
    setQuote(null);
    setMessage("");
    if (!current.length) return;
    try {
      const sr = await fetch("/api/hardware/checkout/session", {
        cache: "no-store",
      });
      const session = await sr.json();
      if (!sr.ok) throw Error(session.error);
      if (seq !== sequence.current) return;
      setCsrf(session.csrf);
      const pending = sessionStorage.getItem(ATTEMPT);
      if (pending) {
        const recovery = await fetch("/api/hardware/checkout/status", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-checkout-csrf": session.csrf,
          },
          body: JSON.stringify({ idempotency_key: pending }),
        });
        if (recovery.ok) {
          const found = await recovery.json();
          if (seq === sequence.current) {
            setReceipt(found.order.id);
            setReservation(found.order.reservation || null);
            saveCart([]);
            sessionStorage.removeItem(ATTEMPT);
          }
          return;
        }
        if (recovery.status !== 404) throw Error("checkout_unavailable");
      }
      const r = await fetch("/api/hardware/checkout/quote", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-checkout-csrf": session.csrf,
        },
        body: JSON.stringify({ lines: current }),
      });
      const b = await r.json();
      if (!r.ok) throw Error(b.error);
      if (seq === sequence.current) {
        setQuote(b.quote);
        setQuoteToken(b.quote_token);
      }
    } catch (e) {
      if (seq === sequence.current)
        setMessage(
          errors[(e as Error).message] ||
            "Unable to verify this cart. Review the items or contact Sales.",
        );
    }
  }
  useEffect(() => {
    // Read the browser-only external store after hydration; subscribe to cross-tab cart changes.
    const sync = () => {
      const current = readCart();
      setLines(current);
      void load(current);
    };
    queueMicrotask(sync);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(next: CartLine[]) {
    try {
      saveCart(next);
      setLines(next);
      void load(next);
    } catch {
      setMessage(
        "Choose a whole quantity between 1 and 1,000. Browser storage must be available.",
      );
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current || !quote || !lines) return;
    submitting.current = true;
    setBusy(true);
    setMessage("");
    try {
      const d = new FormData(e.currentTarget);
      let key = sessionStorage.getItem(ATTEMPT);
      if (!key) {
        key = crypto.randomUUID();
        sessionStorage.setItem(ATTEMPT, key);
      }
      const body = {
        lines,
        quote_token: quoteToken,
        idempotency_key: key,
        customer: {
          name: d.get("name"),
          email: d.get("email"),
          phone: d.get("phone"),
        },
        delivery: {
          country: "NG",
          state: d.get("state"),
          city: d.get("city"),
          address: d.get("address"),
          postcode: d.get("postcode"),
        },
        installation_requested: d.get("installation") === "on",
      };
      const r = await fetch("/api/hardware/checkout/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-checkout-csrf": csrf,
        },
        body: JSON.stringify(body),
      });
      const b = await r.json();
      if (!r.ok) throw Error(b.error);
      setReceipt(b.order.id);
      setReservation(b.order.reservation || null);
      saveCart([]);
      sessionStorage.removeItem(ATTEMPT);
    } catch (e) {
      setMessage(
        errors[(e as Error).message] ||
          "We could not complete your request. Check your details and retry using the same submission reference.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <main className="hw-checkout">
        <div className="co-success">
          <p className="co-eyebrow">Order request received</p>
          <h1>Thank you. We’ll confirm the details.</h1>
          <p>
            Reference: <strong>{receipt}</strong>
          </p>
          <p>
            No payment has been taken. Stock, delivery serviceability and
            charges still require confirmation. Installation is an assessment
            request only.
          </p>
          {reservation ? (
            <p role="status">
              {reservation.state === "held"
                ? `A temporary stock hold expires at ${new Date(reservation.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. It is not a payment or delivery confirmation.`
                : `Your stock hold is ${reservation.state}. Contact Sales before making further arrangements.`}
            </p>
          ) : null}
          <Link href="/hardware">Continue browsing Hardware</Link>
        </div>
      </main>
    );
  return (
    <main className="hw-checkout">
      {testLabel ? (
        <p className="co-test">
          LOCAL REHEARSAL · SYNTHETIC PRODUCTS AND PRICES · NO PAYMENT
        </p>
      ) : null}
      <nav aria-label="Breadcrumb">
        <Link href="/hardware">Hardware</Link> /{" "}
        <Link href="/hardware/cart">Your cart</Link>
        {!cartOnly ? " / Checkout" : ""}
      </nav>
      <p className="co-eyebrow">Oyi Hardware</p>
      <h1>{cartOnly ? "Your hardware cart" : "Guest checkout"}</h1>
      <p className="co-intro">
        {cartOnly
          ? "Review your selection. We check current prices and availability before you submit."
          : "Tell us where you need your hardware. We’ll confirm delivery and stock before payment."}
      </p>
      {lines === null ? (
        <p role="status">Loading your cart…</p>
      ) : lines.length === 0 ? (
        <div className="co-panel">
          <h2>Your cart is empty</h2>
          <Link href="/hardware">Explore Hardware</Link>
        </div>
      ) : (
        <>
          <div className="co-grid">
            <div>
              {cartOnly ? (
                <section className="co-panel" aria-label="Cart items">
                  {lines.map((l) => {
                    const item = quote?.lines.find((x) => x.sku === l.sku);
                    return (
                      <div className="co-item" key={l.sku}>
                        <div>
                          <Link href={`/hardware/${l.product}`}>
                            <h2>
                              {item?.name || l.product.replaceAll("-", " ")}
                            </h2>
                          </Link>
                          <p>{item?.variant || l.sku}</p>
                          <small>SKU {l.sku}</small>
                        </div>
                        <label>
                          Quantity
                          <input
                            aria-label={`Quantity for ${l.sku}`}
                            type="number"
                            min="1"
                            max="1000"
                            key={l.quantity}
                            defaultValue={l.quantity}
                            onBlur={(e) => {
                              const q = Number(e.target.value);
                              if (Number.isInteger(q) && q >= 1 && q <= 1000) {
                                if (q !== l.quantity)
                                  update(
                                    lines.map((x) =>
                                      x.sku === l.sku
                                        ? { ...x, quantity: q }
                                        : x,
                                    ),
                                  );
                              } else {
                                e.target.value = String(l.quantity);
                                setMessage(
                                  "Choose a whole quantity between 1 and 1,000.",
                                );
                              }
                            }}
                          />
                        </label>
                        <strong>
                          {item ? money(item.gross_kobo) : "Checking…"}
                        </strong>
                        <button
                          className="co-link"
                          type="button"
                          onClick={() =>
                            update(lines.filter((x) => x.sku !== l.sku))
                          }
                          aria-label={`Remove ${l.sku}`}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </section>
              ) : (
                <form id="guest-checkout" onSubmit={submit}>
                  <fieldset disabled={busy} className="co-panel">
                    <legend>Contact details</legend>
                    <div className="co-fields">
                      <label className="co-wide">
                        Full name
                        <input
                          name="name"
                          autoComplete="name"
                          required
                          minLength={2}
                          maxLength={160}
                        />
                      </label>
                      <label>
                        Email address
                        <input
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={254}
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          pattern="[+0-9 ()\-]{7,30}"
                          required
                          maxLength={30}
                        />
                      </label>
                    </div>
                    <p className="co-note">
                      We use these details to confirm your order request. No
                      account is required.
                    </p>
                  </fieldset>
                  <fieldset disabled={busy} className="co-panel">
                    <legend>Delivery in Nigeria</legend>
                    <p className="co-note">
                      Nationwide delivery is subject to serviceability and a
                      confirmed delivery quotation.
                    </p>
                    <div className="co-fields">
                      <label>
                        State / FCT
                        <select
                          name="state"
                          autoComplete="address-level1"
                          required
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a state
                          </option>
                          {STATES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        City / town
                        <input
                          name="city"
                          autoComplete="address-level2"
                          required
                          maxLength={120}
                        />
                      </label>
                      <label className="co-wide">
                        Delivery address
                        <textarea
                          name="address"
                          autoComplete="street-address"
                          required
                          minLength={5}
                          maxLength={500}
                          rows={3}
                        />
                      </label>
                      <label>
                        Postcode (optional)
                        <input
                          name="postcode"
                          autoComplete="postal-code"
                          maxLength={20}
                        />
                      </label>
                    </div>
                  </fieldset>
                  <fieldset disabled={busy} className="co-panel">
                    <legend>Optional support</legend>
                    <label className="co-check">
                      <input name="installation" type="checkbox" />
                      <span>
                        Request an installation assessment
                        <small>
                          We’ll discuss the scope separately. This does not book
                          an appointment or add an installation charge.
                        </small>
                      </span>
                    </label>
                  </fieldset>
                </form>
              )}
              <Link
                className="co-back"
                href={cartOnly ? "/hardware" : "/hardware/cart"}
              >
                ← {cartOnly ? "Continue browsing" : "Edit your cart"}
              </Link>
            </div>
            <aside className="co-panel co-summary">
              <h2>Order summary</h2>
              {quote ? (
                <>
                  {quote.lines.map((l) => (
                    <div className="co-summary-item" key={l.sku}>
                      <span>
                        {l.name}
                        <small>
                          {l.variant} · Qty {l.quantity}
                        </small>
                      </span>
                      <strong>{money(l.gross_kobo)}</strong>
                    </div>
                  ))}
                  <dl>
                    <div>
                      <dt>Products, excluding VAT</dt>
                      <dd>
                        {money(quote.goods_total_kobo - quote.goods_tax_kobo)}
                      </dd>
                    </div>
                    <div>
                      <dt>Applicable VAT</dt>
                      <dd>{money(quote.goods_tax_kobo)}</dd>
                    </div>
                    <div className="co-total">
                      <dt>Product total</dt>
                      <dd>{money(quote.goods_total_kobo)}</dd>
                    </div>
                    <div>
                      <dt>Delivery</dt>
                      <dd>To be confirmed</dd>
                    </div>
                    <div>
                      <dt>Payable total</dt>
                      <dd>Not yet payable</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p>Prices must be verified before you continue.</p>
              )}
              <p className="co-note">
                {quote?.reservation_ttl_seconds
                  ? `An accepted request holds available stock for ${quote.reservation_ttl_seconds / 60} minutes. No payment is taken. Delivery and the full payable amount still require confirmation.`
                  : "Submitting does not reserve stock or take payment. We’ll confirm the full amount, including delivery, before payment becomes available."}
              </p>
              {cartOnly ? (
                <Link
                  aria-disabled={!quote}
                  className={`co-primary ${!quote ? "co-disabled" : ""}`}
                  href={quote ? "/hardware/checkout" : "#"}
                >
                  Continue to checkout →
                </Link>
              ) : (
                <button
                  type="submit"
                  form="guest-checkout"
                  disabled={!quote || busy}
                  className="co-primary"
                >
                  {busy ? "Submitting…" : "Submit order request"}
                </button>
              )}
              <button
                type="button"
                className="co-link"
                disabled={busy}
                onClick={() => void load(lines)}
              >
                Refresh prices and availability
              </button>
              <p className="co-note">No card details are collected here.</p>
            </aside>
          </div>
          {message ? (
            <p className="co-error" role="alert">
              {message}
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
