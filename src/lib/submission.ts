// One key per form submission ATTEMPT, created in the browser and kept across retries until the submission succeeds, so a
// double-click, a network retry or a "try again" after an error is recognised by Office (and by the email provider) as the same
// submission instead of a new one. The per-request requestId stays the reference shown to the visitor.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function submissionKey(value: unknown, form: string, fallback: string): string {
  const candidate = typeof value === "string" ? value.trim() : "";
  // pages loaded before this change send no key: fall back to the old per-request behaviour rather than rejecting them
  return UUID.test(candidate) ? `${form}:${candidate.toLowerCase()}` : fallback;
}

export function newSubmissionKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // very old browsers: RFC 4122 v4 from getRandomValues
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type SubmissionAttempt = { key: string; content: string } | null;

// The key is reused only while the form content is unchanged: a plain retry is the same submission, an edited form is a new one (Office
// refuses a key re-used for different content rather than silently merging the two).
export function keyForAttempt(ref: { current: SubmissionAttempt }, content: unknown): string {
  const fingerprint = JSON.stringify(content);
  if (!ref.current || ref.current.content !== fingerprint) ref.current = { key: newSubmissionKey(), content: fingerprint };
  return ref.current.key;
}
