import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Terms</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Terms of Service</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: October 31, 2026</p>
          <p className="mt-8 leading-7 text-slate-300">These terms govern use of Oyi. Features may vary by building deployment, permissions, configured services, connected systems, and supported devices.</p>
          <h2 className="mt-8 text-xl font-semibold">Access and accounts</h2>
          <p className="mt-3 leading-7 text-slate-300">Occupants and operators are responsible for using their accounts securely. Facility administrators may manage roles, permissions, occupant access, invitations, and space assignments.</p>
          <h2 className="mt-8 text-xl font-semibold">Integrations</h2>
          <p className="mt-3 leading-7 text-slate-300">Device, camera, visitor, utility, and service integrations depend on each deployment. Oyi does not guarantee availability of third-party systems.</p>
          {/* Store section (Gate A, 2026-10-31): owner/legal review before release; checked against the enquiry-only Store */}
          <h2 className="mt-8 text-xl font-semibold" id="store">Oyi Store</h2>
          <p className="mt-3 leading-7 text-slate-300">The Oyi Store is operated by Ochiga Global Concept Investment Limited. How we handle information you send with an enquiry is described in our <Link href="/privacy#store-enquiries" className="text-sky-300 underline underline-offset-4">Privacy Policy</Link>.</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">
            <li><strong className="text-white">Listings are not offers.</strong> Store pages describe hardware the Oyi team can supply. A listing invites you to enquire; it is not an offer to sell. No contract exists until the Oyi team confirms the sale to you in writing and you accept it.</li>
            <li><strong className="text-white">Prices.</strong> Prices are in Nigerian naira and include VAT where applicable. Where a product shows a fixed price, that is the approved price at the time shown and may change until a sale is confirmed. &ldquo;Price on request&rdquo; means the price is confirmed with you directly. Delivery, installation and other services are priced separately.</li>
            <li><strong className="text-white">Availability.</strong> &ldquo;In stock&rdquo;, &ldquo;Available to order&rdquo; and lead times are indications and are confirmed with you before any sale.</li>
            <li><strong className="text-white">Product information.</strong> Specifications come from manufacturers and suppliers, and images may show a representative unit. Confirm requirements that matter to you, such as power, mounting and compatibility, with the Oyi team.</li>
            <li><strong className="text-white">Compatibility.</strong> &ldquo;Works with&rdquo; labels describe intended use with Oyi. Integration with a specific building is confirmed during a consultation.</li>
            <li><strong className="text-white">Custom solutions and deployments.</strong> Custom hardware solutions, installation and Oyi software deployments are agreed through a consultation and a separate written agreement.</li>
            <li><strong className="text-white">Trademarks.</strong> Manufacturer names, logos and product names belong to their owners and are used only to identify products.</li>
            <li><strong className="text-white">No online ordering yet.</strong> The website does not currently take orders or payments.</li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold">Support</h2>
          <p className="mt-3 leading-7 text-slate-300">For deployment or support questions, use the contact and support pages.</p>
          <div className="mt-5 flex gap-3">
            <Link href="/contact" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact</Link>
            <Link href="/support" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">Support</Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
