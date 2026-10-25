"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";
import { keyForAttempt, type SubmissionAttempt } from "@/lib/submission";

const enquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "developer", label: "Developer / building enquiry" },
  { value: "integrator", label: "Integrator enquiry" },
  { value: "tech_oem", label: "Technology / OEM integration enquiry" },
  { value: "partner", label: "Partner enquiry" },
  { value: "certification", label: "Certification interest" },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const defaultType = enquiryTypes.some((item) => item.value === requestedType) ? (requestedType as string) : "general";

  const [leadType, setLeadType] = useState(defaultType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const productSlug = searchParams.get("product") || "";
  const productContext = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productSlug) && productSlug.length <= 80 ? productSlug : "";
  const [message, setMessage] = useState(productContext ? `Please send me a quotation for ${productContext}.` : "");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  // one key per submission attempt: reused on every retry of the same message, replaced after it is accepted or when the message changes
  const submissionKeyRef = useRef<SubmissionAttempt>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadType, name, email, organization, message, website, pageUrl: productContext ? `/contact?product=${encodeURIComponent(productContext)}` : "/contact", idempotencyKey: keyForAttempt(submissionKeyRef, { leadType, name, email, organization, message }) }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; requestId?: string; reference?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "We could not submit your message right now.");
      submissionKeyRef.current = null;
      setStatus("success");
      const reference = data.reference || data.requestId;
      setFeedback(`Message received. We'll be in touch.${reference ? ` Reference: ${reference}` : ""}`);
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "We could not submit your message right now.");
    }
  }

  return (
    <main className="min-h-screen bg-[#050b14] px-5 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Contact</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Talk to Oyi.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          For a full deployment request, use{" "}
          <a href="/deployments" className="text-sky-300 underline underline-offset-4">
            Deploy Oyi
          </a>{" "}
          instead — it collects the building context our team needs. Everything else, a short message is enough.
        </p>
      </section>
      <section className="mx-auto mt-10 max-w-3xl">
        <form onSubmit={submit} className="rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(14,165,233,0.16)] md:p-8">
          <input className="hidden" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} aria-hidden="true" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              <span>What&apos;s this about?</span>
              <select value={leadType} onChange={(event) => setLeadType(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-slate-900 px-4 text-white outline-none transition focus:border-sky-300/60">
                {enquiryTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              <span>Full name *</span>
              <input required value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              <span>Email *</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              <span>Organization</span>
              <input value={organization} onChange={(event) => setOrganization(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              <span>Message *</span>
              <textarea required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" />
            </label>
          </div>
          {feedback && <p className={`mt-5 rounded-2xl p-4 text-sm ${status === "success" ? "bg-emerald-400/10 text-emerald-100" : "bg-rose-400/10 text-rose-100"}`}>{feedback}</p>}
          <button type="submit" disabled={status === "submitting"} className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60">
            {status === "submitting" ? "Sending..." : status === "error" ? "Retry" : "Send message"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<main className="min-h-screen bg-[#050b14]" />}>
        <ContactForm />
      </Suspense>
      <SiteFooter />
    </>
  );
}
