// Release A: which Office the site may talk to. The production Office address is used ONLY by the production deployment
// (VERCEL_ENV=production). Previews and local runs must name an Office explicitly (OCHIGA_OFFICE_BASE_URL); without it they make
// no Office request at all, so a preview can never fall back to the production API.
export const PRODUCTION_OFFICE_BASE_URL = "https://ochiga-lead-agents.onrender.com";

export function officeBaseUrlOrEmpty(): string {
  const explicit = String(process.env.OCHIGA_OFFICE_BASE_URL || "").trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return process.env.VERCEL_ENV === "production" ? PRODUCTION_OFFICE_BASE_URL : "";
}
