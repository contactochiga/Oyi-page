/* eslint-disable @typescript-eslint/no-require-imports */
// Built-site test with a recording loopback-only Office projection. Synthetic data; no external notifications.
const assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
const {spawn}=require('node:child_process'); const {item}=require('./unit.cjs');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;console.log('PASS '+m)};
const delay=ms=>new Promise(r=>setTimeout(r,ms));let live=true;let records=[];let calls=[];
const server=http.createServer(async(req,res)=>{let text='';for await(const c of req)text+=c; const u=new URL(req.url,'http://fixture');calls.push(u.pathname);const send=(code,data)=>{res.writeHead(code,{'content-type':'application/json'});res.end(JSON.stringify(data))};
 if(u.pathname==='/api/public/catalogue/packages')return send(200,{packages:live?[{...item,consultation_only:false}]:[],total:live?1:0});
 if(u.pathname==='/api/public/catalogue/packages/'+item.slug)return send(live?200:404,live?{package:item}:{});
 if(u.pathname==='/api/public/catalogue/products')return send(200,{products:[],total:0});
 if(u.pathname==='/api/public/catalogue/categories')return send(200,{categories:[]});
 if(u.pathname==='/api/public/catalogue/merchandising')return send(200,{slides:[],featured:[],new_arrivals:[],collections:[]});
 if(u.pathname==='/api/office/intake'){records.push(JSON.parse(text));return send(201,{ok:true,crm_synced:true});}
 return send(404,{});
});
const rt=fs.mkdtempSync(path.join(os.tmpdir(),'packages-http-'));let child;
async function stop(){if(child && child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}}
async function main(){await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:4396';
 for(const [packages,catalogue] of [[false,false],[false,true],[true,false],[true,true]]){
  calls=[];child=spawn(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p','4396'],{env:{PATH:process.env.PATH,HOME:rt,NODE_ENV:'production',NODE_OPTIONS:'--require='+path.resolve('tests/release-a/egress-guard.cjs'),EGRESS_LOG:path.join(rt,'egress.log'),HARDWARE_PACKAGES_ENABLED:String(packages),HARDWARE_CATALOGUE_ENABLED:String(catalogue),OCHIGA_OFFICE_BASE_URL:`http://127.0.0.1:${server.address().port}`,OCHIGA_OFFICE_CATALOGUE_KEY:'synthetic-catalogue',OCHIGA_OFFICE_API_KEY:'synthetic-intake'},stdio:['ignore','pipe','pipe']});
  const logs=[];child.stdout.on('data',d=>logs.push(String(d)));child.stderr.on('data',d=>logs.push(String(d)));
  try{let ready=false;for(let i=0;i<150;i++){if(await fetch(base+'/solutions').then(r=>r.ok).catch(()=>false)){ready=true;break;}if(child.exitCode!==null)throw Error(logs.join('').slice(-1000));await delay(100)}ok(ready,'built service ready');
   const detail=await fetch(base+'/solutions/packages/'+item.slug);const html=await detail.text();
   ok(detail.status===(packages?200:404),`independent switches packages=${packages}, catalogue=${catalogue}`);
   const solutions=await (await fetch(base+'/solutions/residential')).text();
   ok(solutions.includes('Explore package')===packages,'collection follows independent package flag');
   if(!packages){ok(!calls.some(p=>p.includes('/packages')),'disabled packages never read Office');continue;}
   ok(html.includes('Package size') && html.includes('Installation is quoted separately') && html.includes('SYNTHETIC'),'detail presents published configuration and scope');
   ok(!html.includes('synthetic-catalogue') && !html.includes('synthetic-intake'),'server credentials absent from HTML');
   ok(!/Add to Cart|Pay now/.test(html),'package pages have no purchasing controls');
   if(!catalogue){
    const enquiry=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({leadType:'general',name:'SYNTHETIC',email:'fixture@example.invalid',message:'Local test',idempotencyKey:'packages-http-1',packageSelection:{slug:item.slug,size:'SIZE-A',price:1}})});
    ok(enquiry.status===200 && records[0]?.metadata?.package?.version===2 && records[0].payload.message.includes('SKU SIZE-A'),'real enquiry route sends verified package/size/version through existing CRM intake');
    const consultation=await fetch(base+'/api/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'SYNTHETIC',email:'fixture@example.invalid',organization:'Synthetic only',projectType:'Residential estate',deploymentInterest:'Full building deployment',idempotencyKey:'packages-http-2',packageSelection:{slug:item.slug,size:'SIZE-C'}})});
    ok(consultation.status===200 && records[1]?.metadata?.package?.size==='SIZE-C','consultation route retains package size');
    const before=records.length;const bad=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({leadType:'general',name:'SYNTHETIC',email:'fixture@example.invalid',message:'Local test',packageSelection:{slug:item.slug,size:'UNKNOWN'}})});ok(bad.status===400 && records.length===before,'invalid option never reaches CRM');
   }
   live=false;ok((await fetch(base+'/solutions/packages/'+item.slug)).status===404,'withdrawal disappears on next request without redeploy or cached page');live=true;
  }finally{await stop();}
 }
 console.log(JSON.stringify({suite:'packages-http',checks,failed:0}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await stop();server.close();});
