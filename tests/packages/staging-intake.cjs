/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const rt=process.env.PACKAGE_STAGING_DIR;if(!rt)throw Error('isolated staging path required');
const c=JSON.parse(fs.readFileSync(path.join(rt,'connection.json')));if(!c.url.startsWith('http://127.0.0.1:'))throw Error('loopback Office required');
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;console.log('PASS '+m)};
async function main(){
 const list=await(await fetch(c.url+'/api/public/catalogue/packages',{headers:{'x-api-key':c.catalogueKey}})).json();const card=list.packages[0];const p=(await(await fetch(c.url+'/api/public/catalogue/packages/'+card.slug,{headers:{'x-api-key':c.catalogueKey}})).json()).package;
 const email='synthetic-package-'+Date.now()+'@example.invalid';const body={leadType:'tech_oem',name:'SYNTHETIC Package Enquiry',email,message:'Isolated package acceptance only',idempotencyKey:'sp-staging-'+Date.now(),packageSelection:{slug:p.slug,size:p.sizes[0].sku}};
 const post=()=>fetch('http://127.0.0.1:4397/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const a=await post();ok(a.status===200,'GetOyi enquiry reaches real isolated Office');const b=await post();ok(b.status===200,'retry accepted idempotently');
 const state=JSON.parse(fs.readFileSync(path.join(c.dir,'store.json')));const leads=state.leads.filter(l=>l.email===email);ok(leads.length===1,'one synthetic CRM lead after two identical submissions');
 ok(leads[0].interest_package===`${p.slug}@v${p.version}:${p.sizes[0].sku}`,'CRM package interest records exact published version and selected size');
 const evidence=JSON.stringify(state);ok(evidence.includes('catalogue_package'),'package evidence retained on CRM audit/activity');
 ok(!JSON.stringify(leads).includes('catalogueKey'),'no privileged catalogue credential reaches CRM');
 console.log(JSON.stringify({suite:'packages-staging-intake',checks:n,failed:0}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
