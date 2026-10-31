import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Privacy</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: October 31, 2026</p>
          <p className="mt-8 leading-7 text-slate-300">Oyi is the operating system for buildings. Occupants and facility operators use Oyi for invite-based access, space context, requests, visitors, devices, community notices, services, and operational workflows.</p>
          <h2 className="mt-8 text-xl font-semibold">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">
            <li>Account and role information needed to connect an occupant or operator to a building.</li>
            <li>Operational records such as requests, visitor activity, device assignments, service events, and audit logs.</li>
            <li>Device and app diagnostics needed for reliability, security, and support.</li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold">How information is used</h2>
          <p className="mt-3 leading-7 text-slate-300">Information is used to provide facility operations, protect access, support occupant services, troubleshoot issues, and maintain auditability. Oyi does not sell personal data.</p>
          {/* Store section: drafted 2026-10-31 for owner/legal review (NDPA 2023) before release */}
          <h2 className="mt-8 text-xl font-semibold" id="store-enquiries">Store browsing and product enquiries</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">
            <li><strong className="text-white">Browsing.</strong> You can browse the Store without an account. The Store sets no tracking or advertising cookies; our hosting and security providers may use strictly necessary cookies to protect the website.</li>
            <li><strong className="text-white">What we collect when you enquire.</strong> Your name, email address, optional phone number and organisation, your message, and the product or option you asked about.</li>
            <li><strong className="text-white">Why.</strong> To answer your enquiry, prepare prices or proposals you ask for, and keep a record of our conversation. We rely on your request and our legitimate interest in responding to it.</li>
            <li><strong className="text-white">Who handles it.</strong> Enquiries are stored in the Oyi team&apos;s internal customer system. A confirmation email may be sent to you and to our team through our email provider. Service providers that host the website and our systems process it only on our behalf. We do not sell it.</li>
            <li><strong className="text-white">How long.</strong> We keep enquiry records for as long as we need them to respond to you and to maintain our business records, then delete or anonymise them.</li>
            <li><strong className="text-white">Your rights.</strong> You can ask to access, correct or delete your information, or object to its use, through the contact page.</li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold">Contact</h2>
          <p className="mt-3 leading-7 text-slate-300">For privacy or support requests, use the contact page so the request can be routed without exposing private information in a public page.</p>
          <Link href="/contact" className="mt-5 inline-flex rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact Oyi</Link>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
