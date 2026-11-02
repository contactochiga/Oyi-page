import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

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

export default function PrivacyPage() {
  return <>
    <SiteHeader />
    <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Privacy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-400">Last updated: November 2, 2026</p>
        <P>GetOyi is the technology business website of Ochiga Global Concept Investment Limited (&ldquo;Ochiga&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains how we handle personal information when you browse GetOyi or contact us about OyiOS software, hardware, integrated solutions and professional services.</P>
        <Section id="who-we-are" title="Who is responsible">
          <P>Ochiga Global Concept Investment Limited is the controller for the website and commercial enquiry information covered here. Contact <Email /> about privacy.</P>
          <P>OyiOS is one operating system with Facility and Resident experiences. Processing within a deployed building, such as resident accounts, visitor records or device activity, has a different context. The applicable deployment arrangements and privacy notices must explain the building operator’s and Ochiga’s respective responsibilities; this website policy does not replace them.</P>
        </Section>
        <Section id="information" title="Information we collect">
          <List>
            <li><strong className="text-white">Website browsing:</strong> hosting and security information such as IP address, browser information, requested pages and diagnostic logs. You can browse without an account. The current website does not set tracking or advertising cookies; hosting and security providers may use strictly necessary cookies.</li>
            <li id="store-enquiries" className="scroll-mt-24"><strong className="text-white">Product and solution enquiries:</strong> name, email, organisation if supplied, enquiry type, message and the product, variant or package you ask about, where that feature is available.</li>
            <li id="consultations" className="scroll-mt-24"><strong className="text-white">Software deployment and service requests:</strong> contact details, optional phone number, organisation, role, project type, approximate number of homes or units, preferred deployment and project notes. If you ask about inspection, installation or commissioning, we may also need site location, access arrangements and requirements during follow-up.</li>
            <li id="messages" className="scroll-mt-24"><strong className="text-white">Correspondence:</strong> information you send by email or an available messaging channel, including contact identifiers, conversation history and delivery information.</li>
          </List>
          <P>Please provide only information relevant to your request. Do not send passwords, payment-card details, resident lists or unnecessary sensitive personal information through enquiry forms.</P>
        </Section>
        <Section id="use" title="Purposes and lawful bases">
          <List>
            <li>We respond to enquiries, assess requirements and prepare requested quotations or deployment proposals to take steps at your request before a contract, or to perform an agreed contract where applicable.</li>
            <li>We use relevant correspondence and technical records for our legitimate interests in managing customer relationships, preventing abuse, protecting the website and resolving disputes, subject to your rights and interests.</li>
            <li>We retain or disclose information when required by applicable legal obligations.</li>
            <li>Where processing requires consent, we request it for that purpose. You may withdraw it without affecting processing that was lawful before withdrawal. An enquiry is not blanket consent to unrelated marketing.</li>
          </List>
          <P>Enquiries are recorded in our customer-management system for authorised staff to handle. Form submissions are used to send an acknowledgement and notify our team. We do not sell personal data.</P>
        </Section>
        <Section id="ai" title="Automated assistance and human review">
          <P>We use automated checks to prevent abuse and route requests. If you communicate with us through WhatsApp, message content may be processed by OpenAI to help classify messages, including requests to stop communications. We do not use this website enquiry process to make decisions about you with legal or similarly significant effects solely by automated means. Contact <Email /> if you need a person to review how your enquiry was handled.</P>
        </Section>
        <Section id="sharing" title="Who receives information">
          <List>
            <li>Authorised staff who need it to respond or administer the requested service.</li>
            <li>Providers supporting website hosting and security (Vercel and Cloudflare), application and database hosting (Render and Supabase), email delivery (Resend) and our business mailboxes (Zoho).</li>
            <li>When you use WhatsApp, Meta provides the messaging channel and OpenAI supports message classification as described above. Their involvement depends on the channel you use; website enquiry content is not described as automatically sent to every provider.</li>
            <li>Where needed to arrange a requested service, relevant suppliers, installers or integration partners receive the necessary project and contact information. We explain the proposed involvement when arranging the work.</li>
            <li>Public authorities or professional advisers where necessary to comply with law or establish, exercise or defend legal claims.</li>
          </List>
        </Section>
        <Section id="transfers" title="International processing">
          <P>Some providers process information outside Nigeria. Such transfers must have a lawful basis and applicable safeguards under Nigerian data-protection law, such as appropriate contractual protections or another permitted transfer mechanism. You can ask <Email /> for information about the safeguards relevant to your request.</P>
        </Section>
        <Section id="retention" title="Retention">
          <P>We keep information for as long as reasonably needed for the enquiry, requested service, security, applicable record-keeping obligations or a dispute. The purpose, nature of the information and applicable obligations determine the retention period. Information that is no longer needed should be deleted or anonymised, subject to lawful exceptions. This is not a promise of automatic deletion after a fixed period.</P>
        </Section>
        <Section id="rights" title="Your privacy rights">
          <P>Subject to applicable law, you may request access, correction, deletion, restriction, portability or object to processing, and withdraw consent where we rely on it.</P>
          <List>
            <li>Send your request to <Email /> and identify the enquiry or contact address involved. Do not send identity documents unless securely requested.</li>
            <li>We may make proportionate checks to verify identity and protect another person’s information. We respond within applicable legal time limits and explain any lawful restriction on a request.</li>
            <li>You may complain to the <a href="https://ndpc.gov.ng/" className="text-sky-300 underline underline-offset-4">Nigeria Data Protection Commission</a>, including if you are dissatisfied with our handling.</li>
          </List>
        </Section>
        <Section id="security" title="Security and updates">
          <P>We use encrypted connections and restricted staff access to protect information. No website or communication system can guarantee absolute security. This notice will be updated when relevant practices change; the date above identifies this version.</P>
          <P>Online ordering, payments and public appointment booking are not currently available on this website. Before enabling features that introduce additional processing, we will update the applicable notices.</P>
        </Section>
        <Section id="contact" title="Contact">
          <P>For privacy requests or legal questions, email <Email />. For a commercial enquiry, use our contact form.</P>
          <Link href="/contact" className="mt-5 inline-flex rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact Oyi</Link>
        </Section>
      </article>
    </main>
    <SiteFooter />
  </>;
}
