export default function TermsPage() {
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

          <p className="mt-6 text-white/75 leading-7">
            These Terms govern your use of Oyi (“the Service”). By using Oyi, you agree to these Terms.
            If you do not agree, do not use the Service.
          </p>

          <h2 className="mt-8 text-lg font-semibold">1. The Service</h2>
          <p className="mt-3 text-white/75 leading-7">
            Oyi provides tools for residents and estate operators to manage estate services and workflows.
            Features may include requests, payments, access workflows (e.g., QR/code verification), notifications,
            and integrations enabled per estate deployment.
          </p>

          <h2 className="mt-8 text-lg font-semibold">2. Accounts & access</h2>
          <p className="mt-3 text-white/75 leading-7">
            You are responsible for maintaining the confidentiality of your account credentials and for all actions taken under your account.
            Estate administrators may manage user roles and permissions.
          </p>

          <h2 className="mt-8 text-lg font-semibold">3. Acceptable use</h2>
          <ul className="mt-3 space-y-2 text-white/75 leading-7 list-disc pl-5">
            <li>Do not attempt unauthorized access to estates, devices, or infrastructure workflows.</li>
            <li>Do not misuse the platform to harass, defraud, or disrupt operations.</li>
            <li>Do not upload malicious content or attempt to reverse engineer the Service.</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">4. Payments</h2>
          <p className="mt-3 text-white/75 leading-7">
            Some estates may enable service payments inside Oyi. Payment terms, pricing, and receipts may depend on the estate’s configured services.
          </p>

          <h2 className="mt-8 text-lg font-semibold">5. Integrations & device control</h2>
          <p className="mt-3 text-white/75 leading-7">
            Integrations (such as access systems, IoT device controls, or security workflows) may vary by deployment.
            The estate or deployment owner is responsible for authorizing and configuring integrations.
            Oyi does not guarantee availability of third-party systems.
          </p>

          <h2 className="mt-8 text-lg font-semibold">6. Disclaimers</h2>
          <p className="mt-3 text-white/75 leading-7">
            The Service is provided “as is” and “as available.” We do not warrant uninterrupted operation or that the Service will be error-free.
          </p>

          <h2 className="mt-8 text-lg font-semibold">7. Limitation of liability</h2>
          <p className="mt-3 text-white/75 leading-7">
            To the extent permitted by law, Oyi and its operators will not be liable for indirect, incidental, special, consequential,
            or punitive damages arising from your use of the Service.
          </p>

          <h2 className="mt-8 text-lg font-semibold">8. Contact</h2>
          <p className="mt-3 text-white/75 leading-7">
            Support and legal contact:{" "}
            <a className="underline hover:text-white" href="mailto:contactochiga@gmail.com">
              contactochiga@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Oyi • getoyi.com/terms
        </div>
      </div>
    </main>
  );
}
