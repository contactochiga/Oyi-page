import Link from 'next/link';
import { listPackages, packagesEnabled, packageImage } from '@/lib/packages';
import { AVAILABILITY_LABEL, naira } from '@/lib/catalogue';
import './packages.css';

export async function PackageCollection({solution}: {solution?: string}) {
  if (!packagesEnabled()) return null;
  const result = await listPackages(solution);
  return <section className="sp-section" aria-label="Solutions packages"><div className="sp-container">
    <div className="sp-heading"><div><p className="sp-eyebrow">Designed around your building</p><h2>Solutions &amp; packages</h2></div><Link href="/deployments">Request a consultation →</Link></div>
    <p>Explore Office-approved hardware configurations. Oyi deployment is planned through a consultation.</p>
    {result.state !== 'ok' ? <p role="status">Packages are temporarily unavailable. Please contact our team.</p> : result.data.packages.length === 0 ? <p>No packages are currently published for this collection.</p> : <div className="sp-grid">{result.data.packages.map(p => <article className="sp-card" key={p.slug}>
      <Link href={`/solutions/packages/${p.slug}`}>{p.cover && packageImage(p.cover.src) ? <img src={packageImage(p.cover.src)} alt={p.cover.alt} width={p.cover.width} height={p.cover.height} loading="lazy"/> : null}<div className="sp-card-body"><p className="sp-eyebrow">{p.solution_types.join(' · ')}</p><h3>{p.name}</h3><p>{p.summary}</p><p className="sp-price">{p.consultation_only || p.price_from_kobo == null ? 'By consultation' : `${p.price_from_kobo !== p.price_to_kobo ? 'From ' : ''}${naira(p.price_from_kobo)}`}</p><p>{AVAILABILITY_LABEL[p.availability]}</p><span>Explore package →</span></div></Link>
    </article>)}</div>}
  </div></section>;
}
