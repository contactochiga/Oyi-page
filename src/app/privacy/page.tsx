import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
};

// Owner/legal review (Gate A, 2026-10-31): controller and privacy contact confirmed by the owner. Every factual statement is checked against
// the website, Ochiga Office and Oyi Backend (getoyi-commerce/gate-a/LEGAL-REVIEW-STORE.md); keep it in step with them when they change.
const CONTROLLER = "Ochiga Global Concept Investment Limited";
const PRIVACY_EMAIL = "info@ochiga.com.ng";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mt-10 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">{children}</ul>;
}

function PrivacyEmail() {
  return <a href={`mailto:${PRIVACY_EMAIL}`} className="text-sky-300 underline underline-offset-4">{PRIVACY_EMAIL}</a>;
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Privacy</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: October 31, 2026</p>
          <p className="mt-8 leading-7 text-slate-300">Oyi is the operating system for buildings. Occupants and facility operators use Oyi for invite-based access, space context, requests, visitors, devices, community notices, services, and operational workflows. This policy explains how we handle personal information when you use Oyi, visit this website and the Oyi Store, or contact us.</p>

          <Section id="who-we-are" title="Who we are">
            <p className="mt-3 leading-7 text-slate-300">{CONTROLLER} (&ldquo;Ochiga&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for the personal information described in this policy. You can contact us about privacy at <PrivacyEmail />.</p>
          </Section>

          <Section id="information" title="Information we collect">
            <h3 className="mt-5 font-semibold text-white">When you use Oyi</h3>
            <List>
              <li>Account and role information needed to connect an occupant or operator to a building.</li>
              <li>Operational records such as requests, visitor activity, device assignments, service events, and audit logs.</li>
              <li>Device and app diagnostics needed for reliability, security, and support.</li>
            </List>
            <h3 className="mt-5 font-semibold text-white">When you visit this website or the Oyi Store</h3>
            <List>
              <li>You can browse without an account. This website sets no tracking or advertising cookies. Our hosting and security providers may use strictly necessary cookies and process technical information, such as your IP address, to deliver and protect the website.</li>
            </List>
            <h3 id="store-enquiries" className="mt-5 scroll-mt-24 font-semibold text-white">When you send an enquiry, including a Store enquiry</h3>
            <List>
              <li>Your name, email address, your organisation if you give one, the type of enquiry, your message, and, for a Store enquiry, the product or option you asked about.</li>
            </List>
            <h3 id="consultations" className="mt-5 scroll-mt-24 font-semibold text-white">When you request a consultation</h3>
            <List>
              <li>Your name, email address, phone number if you give one, organisation, role, project type, approximate number of homes or units, the deployment you are interested in, and any project notes.</li>
            </List>
            <h3 id="messages" className="mt-5 scroll-mt-24 font-semibold text-white">When you message us on WhatsApp or by email</h3>
            <List>
              <li>Your phone number or email address, the name shown by the messaging service, the messages you send us, and delivery and read status.</li>
            </List>
          </Section>

          <Section id="use" title="How information is used">
            <p className="mt-3 leading-7 text-slate-300">Information is used to provide facility operations, protect access, support occupant services, troubleshoot issues, and maintain auditability. Oyi does not sell personal data.</p>
            <p className="mt-3 leading-7 text-slate-300">Enquiries, consultation requests and messages are recorded in our customer system, Ochiga Office, so our team can respond, prepare the information or proposals you ask for, and keep a record of the conversation. When you submit a form, we email you an acknowledgement and notify our team by email.</p>
            <p className="mt-3 leading-7 text-slate-300">We rely on: your request, or steps you ask us to take before entering into a contract; the performance of our contracts with building operators and occupants; our legitimate interests in answering enquiries, keeping business records and securing our services; and our legal obligations.</p>
          </Section>

          <Section id="ai" title="AI-assisted processing">
            <p className="mt-3 leading-7 text-slate-300">Messages you send us on WhatsApp may be analysed by an AI service (OpenAI) to classify the reply, for example to recognise a request to stop messages so that we can honour it. Automated WhatsApp replies are currently switched off, so replies come from our team. We do not make decisions with legal or similarly significant effects about you solely by automated means.</p>
          </Section>

          <Section id="sharing" title="Who handles information">
            <List>
              <li>Our team, with access limited by role in Ochiga Office.</li>
              <li>Service providers that process information on our behalf: website hosting and security (Vercel, Cloudflare); application and database hosting (Render, Supabase); email delivery (Resend) and our business mailbox provider; WhatsApp messaging (Meta); and AI classification of WhatsApp messages (OpenAI).</li>
              <li>For Oyi users, the facility operator of your building, as part of the deployment.</li>
              <li>Public authorities, where the law requires it.</li>
            </List>
          </Section>

          <Section id="transfers" title="International transfers">
            <p className="mt-3 leading-7 text-slate-300">Some of these providers process information outside Nigeria, including in the United Kingdom, the European Union and the United States. We use providers that apply contractual and technical safeguards to protect it.</p>
          </Section>

          <Section id="retention" title="How long we keep information">
            <p className="mt-3 leading-7 text-slate-300">We keep enquiries, consultation requests and messages only for as long as we need them to respond to you and to keep proper business records. We keep Oyi records for as long as the deployment needs them or the law requires. You can ask us to delete your information at any time.</p>
          </Section>

          <Section id="rights" title="Your rights and how to make a request">
            <p className="mt-3 leading-7 text-slate-300">Subject to the law, you can ask to access, correct or delete your personal information, to restrict or object to its use, to receive a copy of information you gave us, and to withdraw consent where we rely on it.</p>
            <List>
              <li>Email <PrivacyEmail /> with your request and the email address or phone number you used with us.</li>
              <li>A member of our team handles each request. We may ask you to confirm your identity before acting on it, and we reply within the time the law requires.</li>
              <li>If you are not satisfied with our response, you can complain to the Nigeria Data Protection Commission.</li>
            </List>
          </Section>

          <Section id="security" title="Security">
            <p className="mt-3 leading-7 text-slate-300">Information travels over encrypted connections. Access to our customer and operational systems is restricted to authorised staff and recorded in audit logs.</p>
          </Section>

          <Section id="changes" title="Changes to this policy">
            <p className="mt-3 leading-7 text-slate-300">We update this page when our practices change and show the date of the latest version above.</p>
          </Section>

          <Section id="contact" title="Contact">
            <p className="mt-3 leading-7 text-slate-300">For privacy requests or questions, email <PrivacyEmail />. For other support requests, use the contact page so the request can be routed without exposing private information in a public page.</p>
            <Link href="/contact" className="mt-5 inline-flex rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact Oyi</Link>
          </Section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
