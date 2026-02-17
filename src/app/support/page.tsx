export default function SupportPage() {
  const mailto =
    "mailto:contactochiga@gmail.com?subject=Oyi%20Support%20Request&body=Hi%20Oyi%20Support,%0A%0AApp%20Version:%0ADevice:%0AEstate%20Name:%0AIssue%20Summary:%0ASteps%20to%20Reproduce:%0A%0AThanks.";

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(16,185,129,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.20] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" style={{ backgroundSize: "64px 64px" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 py-10">
        <a href="/" className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline">
          ← Back to getoyi.com
        </a>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Support</h1>
          <p className="mt-3 text-white/75 leading-7">
            Need help with Oyi? Contact support and include your estate name and what you were trying to do.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm font-semibold">Email support</div>
              <p className="mt-2 text-sm text-white/70">
                <a className="underline hover:text-white" href="mailto:contactochiga@gmail.com">
                  contactochiga@gmail.com
                </a>
              </p>
              <a
                href={mailto}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              >
                Open support email
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm font-semibold">Common review checks</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc pl-5">
                <li>Camera permission is required only for QR scanning flows.</li>
                <li>Access workflows and estate data depend on your estate’s deployment.</li>
                <li>If login fails, confirm the account is linked to an estate and role.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm font-semibold">Response time</div>
              <p className="mt-2 text-sm text-white/70">
                We aim to respond within 24–72 hours depending on deployment priority.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Oyi • getoyi.com/support
        </div>
      </div>
    </main>
  );
}
