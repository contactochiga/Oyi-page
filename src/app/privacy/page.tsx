export default function PrivacyPage() {
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

          <p className="mt-6 text-white/75 leading-7">
            Oyi is an estate operations and resident services platform. Residents can manage household actions and requests,
            while estate operators manage infrastructure workflows (access, utilities, security, billing, and maintenance).
            This Privacy Policy explains what we collect, why we collect it, and how we protect it.
          </p>

          <h2 className="mt-8 text-lg font-semibold">Information we collect</h2>
          <ul className="mt-3 space-y-2 text-white/75 leading-7 list-disc pl-5">
            <li>
              <b>Account information:</b> name, phone number/email (if provided), and role (resident, staff, admin).
            </li>
            <li>
              <b>Estate activity:</b> requests, approvals, payments, access events, and operational logs (audit trail).
            </li>
            <li>
              <b>Device & app data:</b> device identifiers, app version, and basic diagnostics for reliability and security.
            </li>
            <li>
              <b>Camera access (QR scanning):</b> if enabled by you, the camera may be used to scan QR codes for access or verification.
              We do not record video by default for QR scanning.
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">How we use information</h2>
          <ul className="mt-3 space-y-2 text-white/75 leading-7 list-disc pl-5">
            <li>To provide core app features (requests, access, payments, alerts, and estate operations).</li>
            <li>To secure the platform (fraud prevention, access control, permissions, audit logs).</li>
            <li>To support deployments and integrations when enabled by an estate (e.g., access systems, utilities, security workflows).</li>
            <li>To troubleshoot issues and improve reliability.</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">Sharing</h2>
          <p className="mt-3 text-white/75 leading-7">
            We do not sell personal data. We may share information with:
            (1) your estate administrators and authorized staff for operations,
            and (2) service providers that help us run the platform (hosting, analytics, security) under appropriate safeguards.
          </p>

          <h2 className="mt-8 text-lg font-semibold">Data retention</h2>
          <p className="mt-3 text-white/75 leading-7">
            We retain operational records and audit logs for security, compliance, and estate operations. Retention periods may vary by estate policy.
          </p>

          <h2 className="mt-8 text-lg font-semibold">Your choices</h2>
          <ul className="mt-3 space-y-2 text-white/75 leading-7 list-disc pl-5">
            <li>You can deny permissions like camera access in device settings (some features may not work without it).</li>
            <li>You may request access or deletion of certain data, subject to estate operational requirements and legal obligations.</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">Contact</h2>
          <p className="mt-3 text-white/75 leading-7">
            For privacy questions, contact:{" "}
            <a className="underline hover:text-white" href="mailto:contactochiga@gmail.com">
              contactochiga@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Oyi • getoyi.com/privacy
        </div>
      </div>
    </main>
  );
}
