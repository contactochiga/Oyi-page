import { notFound, permanentRedirect } from 'next/navigation';
import { SiteHeader, SiteFooter } from '@/components/OyiSite';
import { PackageDetail } from '@/components/packages/PackageDetail';
import { getPackage, packagesEnabled } from '@/lib/packages';
export const dynamic = 'force-dynamic';
export const metadata = {title:'Solutions & packages', robots:{index:false,follow:false}};
export default async function PackagePage({params}: {params:Promise<{slug:string}>}) {
  if (!packagesEnabled()) notFound();
  const {slug}=await params; const result=await getPackage(slug);
  if(result.state==='redirect') permanentRedirect(`/solutions/packages/${result.to}`);
  if(result.state==='not_found') notFound();
  return <><SiteHeader/>{result.state==='ok' ? <PackageDetail item={result.data.package}/> : <main className="sp-section"><h1>Package temporarily unavailable</h1><p>Please try again later or contact our team.</p></main>}<SiteFooter/></>;
}
