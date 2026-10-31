// Server-only Office reader. No cache: withdrawal and component availability are authoritative on every request.
import { officeJson, validSlug, validAsset, type Availability, type PublicImage, type PublicVariant } from './catalogue';
export const packagesEnabled = () => process.env.HARDWARE_PACKAGES_ENABLED === 'true';
export type PackageSize = { sku: string; name: string; pricing: 'fixed' | 'consultation'; price: PublicVariant['price']; options: Record<string,string> };
export type PublicPackage = {
  kind: 'package'; slug: string; version: number; name: string; summary: string; description: string; solution_types: string[];
  scope: { hardware: string; software_deployment: string; software_pricing: 'consultation'; installation: 'included'|'quoted_separately'; installation_note: string };
  configuration: { custom: boolean; per_unit_label: string };
  sizes: PackageSize[];
  components: { name: string; option: string; model: string; brand: string; kind: string; role: string; basis: string; quantity: number; quantities: Record<string,number>; product_slug: string|null }[];
  availability: Availability; images: PublicImage[]; cover: PublicImage|null; price_from_kobo: number|null; price_to_kobo: number|null;
};
export type PackageCard = Pick<PublicPackage,'slug'|'name'|'summary'|'solution_types'|'availability'|'cover'|'price_from_kobo'|'price_to_kobo'> & { consultation_only: boolean; installation: string };
export function listPackages(solution?: string) {
  if (!packagesEnabled()) return Promise.resolve({state:'not_found' as const});
  return officeJson<{packages: PackageCard[]; total: number}>(`/packages${solution && validSlug(solution) ? '?solution='+solution : ''}`, {cache:'none'});
}
export function getPackage(slug: string) {
  if (!packagesEnabled() || !validSlug(slug)) return Promise.resolve({state:'not_found' as const});
  return officeJson<{package: PublicPackage}>(`/packages/${slug}`, {cache:'none'});
}
export function packageImage(src: string) {
  const asset = src.replace(/^media\//,'');
  return validAsset(asset) ? `/solutions/packages/media/${asset}` : '';
}
