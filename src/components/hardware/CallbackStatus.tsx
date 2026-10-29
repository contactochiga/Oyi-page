"use client";
import { useState } from "react";
export function recordedStatus(order: {payment_state?: string; reservation?: {state?: string}}) {
  if (order.payment_state === "paid") return "Payment verified by Office.";
  if (order.payment_state === "refund_required") return "Payment requires reconciliation. No fulfilment is authorized.";
  if (order.reservation?.state === "expired") return "Your stock reservation has expired. Contact Sales before attempting payment.";
  if (order.payment_state === "failed") return "Payment was not completed. No payment is confirmed.";
  return "Payment is pending confirmation. Do not start another payment.";
}
export function CallbackStatus() {
 const [message,setMessage]=useState("Isolated test environment. A return link does not confirm payment."),[busy,setBusy]=useState(false);
 async function refresh(){
  setBusy(true);
  try{
   // Query parameters, provider redirects and browser claims are never evidence.
   const id=sessionStorage.getItem("getoyi-last-order");
   if(!id){setMessage("No order is linked to this browser session.");return;}
   const session=await fetch("/api/hardware/checkout/session",{cache:"no-store"});
   if(!session.ok)throw Error();
   const {csrf}=await session.json();
   const response=await fetch("/api/hardware/checkout/status",{method:"POST",headers:{"content-type":"application/json","x-checkout-csrf":csrf},body:JSON.stringify({id}),cache:"no-store"});
   if(!response.ok)throw Error();
   const result=await response.json();if(!result.order)throw Error();
   setMessage(recordedStatus(result.order));
  }catch{setMessage("Order status could not be verified. No payment is confirmed.");}finally{setBusy(false);}
 }
 return <main style={{maxWidth:720,margin:"48px auto",padding:24}}><h1>Hardware order status</h1><p role="status">{message}</p><button disabled={busy} onClick={refresh}>Refresh verified order status</button><p>Test preparation only. Payments and refunds are disabled.</p></main>;
}
