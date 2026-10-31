import { getPackage, packagesEnabled } from './packages';
import { packageContext } from './packageEnquiry';
export async function resolvePackageEnquiry(input: unknown) {
  const raw = input && typeof input==='object' ? input as Record<string,unknown> : {};
  const c=packageContext(raw.slug,raw.size,raw.version);
  if(!packagesEnabled() || !c.slug || (raw.version != null && c.version === undefined) || (raw.size != null && raw.size !== '' && !c.size)) return {ok:false as const,status:400,error:'Invalid package selection.'};
  const r=await getPackage(c.slug);
  if(r.state!=='ok') return {ok:false as const,status:r.state==='unavailable'?503:400,error:'This package cannot be verified right now. Please select it again or contact our team without a package selection.'};
  const p=r.data.package;
  if (c.version !== undefined && c.version !== p.version) return {ok:false as const,status:409,error:"This package changed since you viewed it. Reopen the package to review its current scope."};
  const size=c.size ? p.sizes.find(s=>s.sku===c.size) : undefined;
  if(c.size && !size) return {ok:false as const,status:400,error:'This package size is no longer available.'};
  return {ok:true as const,context:{slug:p.slug,version:p.version,size:size?.sku || ''},message:`Package enquiry: ${p.name} (${p.slug}), published version ${p.version}${size ? `; ${size.name}; SKU ${size.sku}` : ''}. Availability: ${p.availability}. Oyi software deployment by consultation. Installation ${p.scope.installation==='included' ? 'included in the reviewed scope' : 'quoted separately'}. Enquiry only; not an order, payment or booking.`};
}
