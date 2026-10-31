// Only bounded identifiers cross the browser boundary. Office resolves names, version and size again at submission.
import { hardwareEnquiryContext } from './hardwareEnquiry';
export function packageContext(slug: unknown, size: unknown, version?: unknown) {
  const c=hardwareEnquiryContext(slug,size);
  const n = typeof version === "number" ? version : typeof version === "string" && /^[1-9][0-9]{0,9}$/.test(version) ? Number(version) : undefined;
  return {slug:c.product,size:c.sku, ...(Number.isSafeInteger(n) && n! > 0 && n! <= 2147483647 ? {version:n} : {})};
}
