import { fetchImage, validAsset } from '@/lib/catalogue';
import { packagesEnabled } from '@/lib/packages';
export async function GET(_request:Request,{params}:{params:Promise<{asset:string}>}) {
  const {asset}=await params;
  if(!packagesEnabled() || !validAsset(asset)) return new Response('Not found',{status:404});
  const image=await fetchImage(`/packages/media/${asset}`);
  if(image.status!==200 || !image.body) return new Response('Not found',{status:image.status===404?404:502});
  return new Response(image.body,{headers:{'content-type':'image/webp','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; sandbox"}});
}
