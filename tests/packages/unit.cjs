/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict');
const {load}=require('../release-a/load.cjs');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const {PackageDetail}=load('src/components/packages/PackageDetail.tsx');
const P=load('src/lib/packages.ts');const {packageContext}=load('src/lib/packageEnquiry.ts');
let n=0;const ok=(x,s)=>{assert.ok(x,s);n++;console.log('PASS '+s)};
const item={kind:'package',slug:'synthetic-package',version:2,name:'SYNTHETIC <script>x</script>',summary:'Synthetic only',description:'No real offer',solution_types:['residential'],scope:{hardware:'Approved configuration',software_deployment:'Plan through consultation',software_pricing:'consultation',installation:'quoted_separately',installation_note:''},configuration:{custom:true,per_unit_label:'per door'},sizes:[{sku:'SIZE-A',name:'Apartment',pricing:'fixed',price:{amount_kobo:107500,currency:'NGN',vat_inclusive:true,vat_treatment:'standard'},options:{}},{sku:'SIZE-C',name:'Custom',pricing:'consultation',price:null,options:{}}],components:[{name:'SYNTHETIC Lock',option:'Black',model:'M1',brand:'Fixture',kind:'hardware',role:'required',basis:'per_unit',quantity:1,quantities:{'SIZE-A':3},product_slug:null}],availability:'in_stock',images:[],cover:null,price_from_kobo:107500,price_to_kobo:107500};
module.exports={item};
async function main(){
 delete process.env.HARDWARE_PACKAGES_ENABLED;process.env.HARDWARE_CATALOGUE_ENABLED='true';
 ok(!P.packagesEnabled(),'package switch defaults off independently of catalogue');
 ok((await P.listPackages()).state==='not_found' && (await P.getPackage('synthetic-package')).state==='not_found','disabled readers do not call Office');
 ok(P.packageImage('https://evil.test/a')==='' && P.packageImage('media/'+ 'a'.repeat(64)+'.webp').startsWith('/solutions/packages/media/'),'images restricted to bounded content-addressed route');
 ok(!packageContext('../bad','SIZE-A').slug && !packageContext('good','<script>').size,'context identifiers reject injection');
 const html=renderToStaticMarkup(React.createElement(PackageDetail,{item}));
 ok(!html.includes('<script>') && html.includes('&lt;script&gt;'),'customer content escaped');
 ok(html.includes('₦1,075') && html.includes('VAT inclusive') && html.includes('quoted separately'),'approved integer kobo price and installation boundary');
 ok(html.includes('Package size') && html.includes('Custom') && html.includes('3') && html.includes('per door'),'sizes and versioned per-size quantities shown');
 ok(html.includes('/deployments?package=synthetic-package') && html.includes('size=SIZE-A'),'consultation preserves bounded package and size identifiers');
 ok(!/Add to Cart|Pay now|<form/.test(html),'no ordering, payment or booking controls');
 ok(renderToStaticMarkup(React.createElement(PackageDetail,{item:{...item,sizes:[item.sizes[1]]}})).includes('By consultation'),'consultation sizes have no invented price');
 const preview=renderToStaticMarkup(React.createElement(PackageDetail,{item,previewToken:'fixture'}));
 ok(!preview.includes('/deployments?package=') && preview.includes('enquiry actions are disabled'),'preview cannot submit a public package enquiry');
 const {resolvePackageEnquiry}=load('src/lib/packageEnquiryServer.ts');
 process.env.HARDWARE_PACKAGES_ENABLED='true'; process.env.OCHIGA_OFFICE_BASE_URL='http://127.0.0.1:1';process.env.OCHIGA_OFFICE_CATALOGUE_KEY='synthetic';
 const original=global.fetch;let calls=0;global.fetch=async()=>{calls++;return new Response(JSON.stringify({package:item}),{status:200})};
 try{const r=await resolvePackageEnquiry({slug:item.slug,size:'SIZE-A',price:1,name:'FORGED'});ok(r.ok && r.context.version===2 && r.message.includes('Apartment') && !r.message.includes('FORGED'),'server resolves authoritative name, version and size; ignores forged price');ok(!(await resolvePackageEnquiry({slug:item.slug,size:'MISSING'})).ok,'unknown size refused');ok((await resolvePackageEnquiry({slug:item.slug,version:1})).status===409,'changed published version requires customer review');global.fetch=async()=>new Response('{}',{status:404});ok(!(await resolvePackageEnquiry({slug:item.slug})).ok,'withdrawn package refused before CRM');global.fetch=async()=>{throw Error('offline')};ok((await resolvePackageEnquiry({slug:item.slug})).status===503,'Office unavailable fails closed');delete process.env.HARDWARE_PACKAGES_ENABLED;const before=calls;ok(!(await resolvePackageEnquiry({slug:item.slug})).ok && calls===before,'disabled enquiry no Office calls');}finally{global.fetch=original;}
 console.log(JSON.stringify({suite:'packages-unit',passed:n,failed:0}));
}
if(require.main===module) main().catch(e=>{console.error(e);process.exitCode=1});
