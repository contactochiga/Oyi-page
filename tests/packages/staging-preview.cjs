/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.env.PACKAGE_STAGING_DIR;if(!root)throw Error('isolated fixture directory required');const c=JSON.parse(fs.readFileSync(path.join(root,'connection.json')));assert.ok(c.url.startsWith('http://127.0.0.1:'));
(async()=>{const u=c.users.writerA;const login=await fetch(c.url+'/api/lead-agents/admin/session/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:u.email,password:u.password})});const cookie=login.headers.get('set-cookie').split(';')[0];
 const list=await(await fetch(c.url+'/api/lead-agents/admin/catalogue/products?view=cards&kind=package',{headers:{cookie}})).json();assert.ok(list.products.length);
 const made=await fetch(c.url+'/api/lead-agents/admin/catalogue/products/'+list.products[0].id+'/preview',{method:'POST',headers:{cookie,origin:c.url,'content-type':'application/json'},body:'{}'});assert.equal(made.status,201);const token=(await made.json()).url.split('/').pop();
 const result=await fetch('http://127.0.0.1:4397/hardware/preview/'+token);const html=await result.text();assert.equal(result.status,200);assert.ok(html.includes('data-preview-banner') && html.includes('Deployment scope') && html.includes('Staff preview'));
 assert.ok(!html.includes('/deployments?package='));assert.ok(html.includes('/hardware/preview/'+token+'/media/'));
 const tamper=await(await fetch('http://127.0.0.1:4397/hardware/preview/'+token.slice(0,-1)+(token.endsWith('a')?'b':'a'))).text();assert.ok(tamper.includes('This preview link is not valid'));
 console.log(JSON.stringify({suite:'packages-staging-preview',checks:5,failed:0}));
})().catch(e=>{console.error(e.message);process.exitCode=1});
