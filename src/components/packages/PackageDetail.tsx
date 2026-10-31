'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AVAILABILITY_LABEL, imageUrl, naira } from '@/lib/catalogue';
import { packageImage, type PublicPackage } from '@/lib/packages';
import './packages.css';
export function PackageDetail({item, previewToken}: {item: PublicPackage; previewToken?: string}) {
  const [sku,setSku] = useState(item.sizes[0]?.sku || '');
  const [image,setImage] = useState(0);
  const size = item.sizes.find(s=>s.sku===sku) || item.sizes[0];
  const photos = item.images || [];
  const photo = photos[image] || photos[0];
  const imageSrc = (src: string) => previewToken ? imageUrl(src,previewToken) : packageImage(src);
  const query = new URLSearchParams({package:item.slug, version:String(item.version), ...(size ? {size:size.sku} : {})}).toString();
  return <main className="sp-section"><div className="sp-container">
    <nav aria-label="Breadcrumb"><Link href="/solutions">Solutions</Link> / {item.name}</nav>
    <div className="sp-detail"><section aria-label="Package photographs">
      {photo ? <img className="sp-cover" src={imageSrc(photo.src)} alt={photo.alt} width={photo.width} height={photo.height}/> : null}
      <div className="sp-thumbs">{photos.map((p,i)=><button type="button" key={p.src} aria-label={`View photograph ${i+1}`} aria-pressed={i===image} onClick={()=>setImage(i)}><img src={imageSrc(p.thumb)} alt="" width="80" height="64"/></button>)}</div>
    </section><section><p className="sp-eyebrow">{item.solution_types.join(' · ')}</p><h1>{item.name}</h1><p className="sp-summary">{item.summary}</p><p>{item.description}</p>
      <label className="sp-size">Package size<select value={size?.sku || ''} onChange={e=>setSku(e.target.value)}>{item.sizes.map(s=><option key={s.sku} value={s.sku}>{s.name}</option>)}</select></label>
      <p className="sp-price">{size?.price && size.pricing==='fixed' ? naira(size.price.amount_kobo) : 'By consultation'}</p>
      {size?.price ? <p>Approved hardware price · VAT inclusive. Final scope and availability confirmed by our team.</p> : null}
      <p>{AVAILABILITY_LABEL[item.availability]}</p>
      <p>{item.scope.installation==='included' ? 'Installation included in this reviewed scope.' : 'Installation is quoted separately.'}</p>
      {item.configuration.custom ? <p>Custom configurations available by consultation.</p> : null}
      {!previewToken ? <div className="sp-actions"><Link className="sp-cta" href={`/deployments?${query}`}>Request a consultation</Link><Link href={`/contact?type=general&${query}`}>Enquire about this package →</Link></div> : <p>Staff preview — enquiry actions are disabled.</p>}
    </section></div>
    <div className="sp-detail sp-scope"><section><h2>Included hardware &amp; options</h2><p>Quantities shown for {size?.name || 'this configuration'}. Optional and recommended components require confirmation.</p><ul className="sp-components">{item.components.map((c,i)=><li key={i}><div><strong>{c.name}{c.option ? ` — ${c.option}` : ''}</strong><p>{[c.brand,c.model].filter(Boolean).join(' · ')}</p></div><div>{c.quantities[size?.sku || ''] ?? c.quantity}{c.basis==='per_unit' ? ` ${item.configuration.per_unit_label}` : ' ×'}<br/><span>{c.role}</span></div></li>)}</ul></section>
    <section><h2>Deployment scope</h2><h3>Hardware</h3><p>{item.scope.hardware}</p><h3>Oyi software deployment</h3><p>{item.scope.software_deployment}</p><p>Consultation-led. No software subscription or deployment fee is implied by the hardware price.</p><h3>Installation</h3><p>{item.scope.installation_note || (item.scope.installation==='included' ? 'Included within the approved package scope.' : 'Site requirements and installation charges are assessed separately.')}</p><p>Nationwide delivery subject to serviceability and confirmation. This page does not place an order, take payment or book an appointment.</p></section></div>
  </div></main>;
}
