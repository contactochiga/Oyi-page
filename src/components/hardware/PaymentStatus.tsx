"use client";
import { useState } from "react";
import { money } from "@/lib/checkout/cart";
type Payment = {
  eligible: boolean;
  amount_kobo: number;
  delivery_kobo: number;
  goods_tax_kobo: number;
  delivery_tax_kobo: number;
  payment_state: string;
  refund_state?: string | null;
};
export function PaymentStatus({
  orderId,
  csrf,
  onConfirmed,
}: {
  orderId: string;
  csrf: string;
  onConfirmed?: () => void;
}) {
  const [payment, setPayment] = useState<Payment | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function request(start = false) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch(
        "/api/hardware/checkout/" + (start ? "payment-start" : "payment-quote"),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-checkout-csrf": csrf,
          },
          body: JSON.stringify({
            id: orderId,
            ...(start ? { accepted_total_kobo: payment?.amount_kobo } : {}),
          }),
        },
      );
      if (r.status === 404) {
        setMessage(
          "Online payment is not available. Contact Sales for confirmation.",
        );
        return;
      }
      const b = await r.json();
      if (!r.ok)
        throw Error(
          "Payment details need confirmation. Refresh the payment status or contact Sales.",
        );
      if (!start) {
        setPayment(b.payment);
        if (["paid", "refund_required"].includes(b.payment.payment_state))
          onConfirmed?.();
        return;
      }
      if (b.payment.checkout_url) {
        const u = new URL(b.payment.checkout_url);
        if (
          u.protocol !== "https:" ||
          u.hostname !== "checkout.paystack.com" ||
          u.username ||
          u.password ||
          u.port
        )
          throw Error("Payment could not be opened.");
        window.location.assign(u.href);
      } else
        setMessage(
          "Payment is processing. Refresh its status; do not start another payment.",
        );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Payment is unavailable.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Payment status">
      <button disabled={busy} onClick={() => request()}>
        Refresh payment status
      </button>
      {payment && (
        <>
          <p>
            {payment.payment_state === "paid"
              ? "Payment verified."
              : payment.payment_state === "refund_required"
                ? "Payment received; Sales must arrange reconciliation or a refund."
                : "Payment has not been confirmed."}
          </p>
          {payment.refund_state && (
            <p role="status">
              {payment.refund_state === "refund_processed"
                ? "Paystack has processed the refund. Bank arrival is not yet confirmed."
                : payment.refund_state === "refund_pending"
                  ? "Your refund is processing with Paystack."
                  : "Your refund needs review by Sales. Funds have not been confirmed returned."}
            </p>
          )}
          {payment.eligible && (
            <>
              <p>
                Total: {money(payment.amount_kobo)}. Delivery:{" "}
                {money(payment.delivery_kobo)}. Included tax:{" "}
                {money(payment.goods_tax_kobo + payment.delivery_tax_kobo)}.
              </p>
              <button disabled={busy} onClick={() => request(true)}>
                Accept total and continue to Paystack
              </button>
              <p>
                Installation is assessed separately. Card details are collected
                by Paystack.
              </p>
            </>
          )}
          {!payment.eligible && payment.payment_state === "not_started" && (
            <p>
              Delivery, availability or the reservation still needs
              confirmation.
            </p>
          )}
        </>
      )}
      <p role="status">{message}</p>
    </section>
  );
}
