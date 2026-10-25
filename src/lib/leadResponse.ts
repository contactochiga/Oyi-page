// The visitor's answer for a website enquiry (both form routes). CRM delivery and email delivery are reported separately, and the
// visitor is told "received" only when at least one of them is CONFIRMED:
//   Office confirmed (synced / duplicate)            -> 200 ok        (the enquiry is in the CRM, whatever the emails did)
//   not confirmed in Office, staff email sent        -> 200 ok        (staff have it, flagged, with a recovery link)
//   not confirmed in Office, staff email unconfirmed -> 202 not ok    (an earlier email may have arrived; never claimed as success)
//   not confirmed in Office, staff email not sent    -> 502 not ok    (nothing confirmed anywhere: try again)
import { NextResponse } from "next/server";
import type { OyiLeadEmailResult } from "@/lib/email";
import type { OfficeDeliveryStatus, OfficeIntakeResult } from "@/lib/officeIntake";

type LeadResponseInput = {
  office: OfficeIntakeResult;
  officeStatus: OfficeDeliveryStatus;
  email: OyiLeadEmailResult;
  requestId: string;
  reference: string;
  failure: string;
};

export function leadResponse({ office, officeStatus, email, requestId, reference, failure }: LeadResponseInput) {
  const delivery = { office: officeStatus, email: email.staff, acknowledgement: email.acknowledgement };
  if (office.ok || email.staff === "sent") return NextResponse.json({ ok: true, requestId, reference, delivery });
  if (email.staff === "unconfirmed") {
    return NextResponse.json(
      { ok: false, uncertain: true, requestId, reference, delivery, error: `We could not confirm that your enquiry reached us (reference ${reference}). Please wait a few minutes before sending it again.` },
      { status: 202 },
    );
  }
  return NextResponse.json({ ok: false, requestId, reference, delivery, error: failure }, { status: 502 });
}
