"use client";

import { useRef, FormEvent, useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";
import { keyForAttempt, type SubmissionAttempt } from "@/lib/submission";

type FormState = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  projectType: string;
  homes: string;
  deploymentInterest: string;
  notes: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  projectType: "",
  homes: "",
  deploymentInterest: "",
  notes: "",
  website: "",
};

const projectTypes = ["Residential estate", "Hospitality property", "Commercial / office building", "Mixed-use development", "Healthcare facility", "Developer portfolio"];
const interests = ["Invite-first onboarding", "Rooms, devices, and controls", "Visitors and security", "Maintenance and community", "Full building deployment"];

export default function DeploymentsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");

  const complete = useMemo(() => [form.name, form.email, form.organization, form.projectType, form.deploymentInterest].filter(Boolean).length, [form]);

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // one key per submission attempt: reused on every retry of the same request, replaced after it is accepted or when the request changes
  const submissionKeyRef = useRef<SubmissionAttempt>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setRequestId("");

    try {
      const response = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, idempotencyKey: keyForAttempt(submissionKeyRef, form) }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; requestId?: string; reference?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "We could not submit the request right now.");
      submissionKeyRef.current = null;
      setStatus("success");
      setRequestId(data.reference || data.requestId || "");
      setMessage("Your deployment request has been received. Our product team will review the building context and respond if there is a deployment fit.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not submit the request right now. Please review your details and try again.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <section className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Deployment intake</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Bring Oyi to your building.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Tell us about your building, property, or operations environment. Oyi deployments are reviewed for fit before setup begins.</p>
        </section>
        <section className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-semibold">What happens next</h2>
            <div className="mt-6 grid gap-4 text-sm text-slate-300">
              {[["1", "Review building context"], ["2", "Confirm deployment fit"], ["3", "Plan spaces, occupants, devices, and operations"], ["4", "Launch controlled onboarding"]].map(([step, text]) => (
                <div key={step} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-400 text-sm font-semibold text-slate-950">{step}</span>
                  <span className="pt-1">{text}</span>
                </div>
              ))}
            </div>
          </aside>
          <form onSubmit={submit} className="rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(14,165,233,0.16)] md:p-8">
            <div className="mb-8">
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${Math.min(100, (complete / 5) * 100)}%` }} /></div>
              <p className="mt-3 text-sm text-slate-400">Required fields completed: {complete}/5</p>
            </div>
            <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} aria-hidden="true" />
            <Fieldset title="Contact">
              <Input label="Full name" required value={form.name} onChange={(value) => update("name", value)} />
              <Input label="Email" type="email" required value={form.email} onChange={(value) => update("email", value)} />
              <Input label="Phone" value={form.phone} onChange={(value) => update("phone", value)} />
              <Input label="Organization / building" required value={form.organization} onChange={(value) => update("organization", value)} />
            </Fieldset>
            <Fieldset title="Project environment">
              <Select label="Your role" value={form.role} onChange={(value) => update("role", value)} options={["Property owner", "Developer", "Facility manager", "Facility operator", "Technology partner"]} />
              <Select label="Project type" required value={form.projectType} onChange={(value) => update("projectType", value)} options={projectTypes} />
              <Input label="Number of units / spaces" value={form.homes} onChange={(value) => update("homes", value)} />
            </Fieldset>
            <Fieldset title="Deployment goals">
              <Select label="Deployment interest" required value={form.deploymentInterest} onChange={(value) => update("deploymentInterest", value)} options={interests} />
              <Textarea label="Project context or operational problem" value={form.notes} onChange={(value) => update("notes", value)} />
            </Fieldset>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Review & submit</h2>
              <p className="mt-2 text-sm text-slate-400">Submit only sanitized project information. Do not include access codes, private occupant data, passwords, or confidential documents.</p>
              {message && <p className={`mt-4 rounded-2xl p-4 text-sm ${status === "success" ? "bg-emerald-400/10 text-emerald-100" : "bg-rose-400/10 text-rose-100"}`}>{message}{requestId ? ` Reference: ${requestId}` : ""}</p>}
              <button type="submit" disabled={status === "submitting"} className="mt-5 w-full rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60">
                {status === "submitting" ? "Submitting request..." : status === "error" ? "Retry request" : "Submit deployment request"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="mt-8 first:mt-0"><legend className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{title}</legend><div className="grid gap-4 md:grid-cols-2">{children}</div></fieldset>;
}

function Input({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="grid gap-2 text-sm text-slate-300"><span>{label}{required ? " *" : ""}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" /></label>;
}

function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean }) {
  return <label className="grid gap-2 text-sm text-slate-300"><span>{label}{required ? " *" : ""}</span><select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-slate-900 px-4 text-white outline-none transition focus:border-sky-300/60"><option value="">Select</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-sky-300/60 focus:bg-white/[0.09]" /></label>;
}
