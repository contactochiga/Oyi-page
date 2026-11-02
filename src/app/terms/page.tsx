import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = { title: "Website & Commercial Terms", alternates: { canonical: "/terms" } };

// Gate A review draft: release requires named, dated legal and owner approval.
const CONTACT = "office@ochiga.com.ng";
function Email() {
  return <a href={`mailto:${CONTACT}`} className="break-words text-sky-300 underline underline-offset-4">{CONTACT}</a>;
}
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24"><h2 className="mt-10 text-xl font-semibold">{title}</h2>{children}</section>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-7 text-slate-300">{children}</p>;
}
function List({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">{children}</ul>;
}

export default function TermsPage() {
  return <>
    <SiteHeader />
    <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Terms</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Website & Commercial Terms</h1>
        <p className="mt-4 text-sm text-slate-400">Last updated: November 2, 2026</p>
        <P>GetOyi is the public technology business platform of Ochiga Global Concept Investment Limited (&ldquo;Ochiga&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). These terms cover this website and enquiries about OyiOS software, hardware and integrated solutions and services. They do not themselves grant a software licence or replace an agreed supply or deployment contract.</P>
        <nav aria-label="Terms sections" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-sky-300 underline underline-offset-4">
          <a href="#website">Website use</a><a href="#software">OyiOS deployments</a><a href="#store">Hardware</a><a href="#services">Services</a><a href="#rights">Customer rights</a>
        </nav>
        <Section id="website" title="Website use and enquiries">
          <P>Use the website lawfully. Do not interfere with its security, misuse enquiry forms, impersonate another person or submit information you are not entitled to share. Website and third-party intellectual property remain with their respective owners; browsing does not grant rights to copy or commercially exploit them.</P>
          <P>Information describes our business and available or proposed capabilities. Features depend on the offering and deployment. A listing, illustration, demonstration or enquiry acknowledgement is not a confirmed order, reservation, appointment or commitment to supply. The scope and commercial terms of a proposed engagement must be confirmed and accepted before work or supply begins.</P>
          <P><strong className="text-white">Enquiry-only website:</strong> online ordering, shopping-cart checkout, payments and public appointment booking are not currently available. Future capabilities are not a promise of present availability.</P>
          <P>How we use enquiry information is explained in our <Link href="/privacy" className="text-sky-300 underline underline-offset-4">Privacy Policy</Link>.</P>
        </Section>
        <Section id="software" title="OyiOS software and deployment terms">
          <P>OyiOS is one operating system with Facility and Resident experiences and shared Core intelligence. Software deployments, enterprise integrations and custom configurations are consultation-led. Demonstrations and website descriptions are not a licence or a guarantee that every capability is available in every building.</P>
          <List>
            <li><strong className="text-white">Commercial arrangements:</strong> the applicable written agreement must identify the licensed capabilities, permitted users or sites, any subscription or licence fees, term, renewal and termination arrangements. No universal fee, free entitlement or licence duration is offered by these website terms.</li>
            <li><strong className="text-white">Dependencies:</strong> supported devices, integrations, connectivity, power and third-party services must be assessed for the particular deployment. Any third-party licences, fees, limitations and responsibilities must be identified in the agreed scope.</li>
            <li><strong className="text-white">Responsibilities:</strong> the customer or building operator must have authority for the deployment and agree responsibilities for site access, account administration, security, lawful use and personal-data processing. Ochiga’s implementation and service obligations must be stated in the agreement.</li>
            <li><strong className="text-white">Support:</strong> support channels, maintenance, updates, service levels and any response commitments are those expressly agreed for the deployment. This website does not promise a particular uptime, response time or uninterrupted third-party service.</li>
          </List>
        </Section>
        <Section id="store" title="Hardware commercial terms">
          <P>The Store presents hardware and product information when listings are available. Only the confirmed product, variant and agreed commercial terms determine a supply arrangement. An enquiry does not hold stock.</P>
          <List>
            <li><strong className="text-white">Prices and VAT:</strong> displayed hardware prices are in Nigerian naira and include VAT where applicable. A displayed fixed price is the approved published price at that time; confirm the applicable price before accepting a quotation. “Price on request” requires a quotation. No undisclosed charge or change to an accepted price is authorised by these terms.</li>
            <li><strong className="text-white">Delivery:</strong> nationwide supply is subject to confirmation of serviceability, stock, delivery charge and timing for the destination. Delivery charges must be confirmed before any payment is requested. A request does not guarantee a delivery date.</li>
            <li><strong className="text-white">Availability:</strong> stock labels, sourcing status and lead times are indications subject to confirmation. Supplier-sourced, unavailable or quotation-only items are not promises of immediately available stock.</li>
            <li><strong className="text-white">Specifications and images:</strong> information may come from manufacturers or suppliers and images may be representative. Confirm the exact model, revision, included accessories, power and installation requirements. We must not substitute a different product or material specification without agreement.</li>
            <li><strong className="text-white">Compatibility:</strong> a manufacturer, protocol or “works with” label is not blanket certification for every OyiOS deployment or third-party device. Compatibility must be supported for the particular model, revision, integration and site requirements.</li>
            <li><strong className="text-white">Brands:</strong> manufacturer names and marks identify the relevant products; their use does not by itself represent an endorsement or partnership.</li>
          </List>
        </Section>
        <Section id="services" title="Solutions, installation and professional services">
          <P>Integrated packages may combine hardware, software deployment and services. A fixed published package price applies only to the identified size and included scope; optional components, custom or per-unit configurations and software deployment may require a separate consultation and quotation. A package image does not establish what is included.</P>
          <P>Site inspections, installation, configuration and commissioning require confirmation of location, site readiness, access, safety conditions, responsibilities, scope, charges and timing. Installation is optional and separately assessed and quoted unless expressly included in an accepted written scope. Requesting a consultation or inspection does not book a visit.</P>
          <P>The agreed scope should identify included equipment and work, exclusions, third-party responsibilities, commissioning or acceptance criteria, handover and any follow-up support. Changes and additional work require agreement before proceeding. No appointment, installation price or service commitment is created by these website terms.</P>
        </Section>
        <Section id="rights" title="Warranties, returns, refunds and complaints">
          <P>Nothing in these terms excludes or limits rights or remedies that cannot lawfully be excluded under applicable Nigerian law, including the Federal Competition and Consumer Protection Act. Product and service information must not be misleading.</P>
          <P>Any additional manufacturer or supplier warranty, including its duration, coverage and claims process, must be identified for the relevant product before purchase; no blanket warranty duration is promised here. Such warranties do not replace statutory rights.</P>
          <P>Applicable cancellation, return and refund arrangements, including any lawful conditions for custom goods or services already performed, must be provided before a commercial agreement. Where goods are faulty, misdescribed or services fail applicable standards, contact us for the remedy required by law and the relevant agreement. These terms do not impose a blanket “no refunds” rule or promise that a payment has been returned before it is verified.</P>
          <P>Send concerns to <Email /> with the relevant enquiry or transaction reference, without payment-card details. You may also seek redress from the <a href="https://fccpc.gov.ng/" className="text-sky-300 underline underline-offset-4">Federal Competition and Consumer Protection Commission</a> or another competent authority. We do not restrict mandatory consumer remedies.</P>
        </Section>
        <Section id="contact" title="Applicable terms and contact">
          <P>These website terms are subject to Nigerian law and mandatory customer protections. Any specific supply, software or services agreement must state its own applicable scope and terms consistently with those protections. Later website changes do not retrospectively change an accepted contract.</P>
          <P>For legal or commercial questions contact <Email />. For deployment assistance, use the existing contact or support page.</P>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact</Link>
            <Link href="/support" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">Support</Link>
          </div>
        </Section>
      </article>
    </main>
    <SiteFooter />
  </>;
}
