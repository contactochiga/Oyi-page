/* eslint-disable @typescript-eslint/no-require-imports */
// Real Office HTTP projection -> built GetOyi -> Chrome; isolated synthetic fixtures only.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');const {spawn}=require('node:child_process');
const rt=process.env.PACKAGE_STAGING_DIR;if(!rt)throw Error('PACKAGE_STAGING_DIR required');
const c=JSON.parse(fs.readFileSync(path.join(rt,'connection.json')));if(!c.url.startsWith('http://127.0.0.1:'))throw Error('isolated Office required');
const out=path.resolve(rt,'../evidence/screenshots');fs.mkdirSync(out,{recursive:true});const site='http://127.0.0.1:4397';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let count=0;const ok=(x,m)=>{assert.ok(x,m);count++;console.log('PASS '+m)};
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=9417','--user-data-dir='+fs.mkdtempSync(path.join(os.tmpdir(),'sp-browser-')),'--no-first-run','--disable-gpu','--disable-features=BackForwardCache','about:blank'],{stdio:'ignore'});let ws;
async function main(){let targets;for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:9417/json')).json();break;}catch{await sleep(100)}}assert.ok(targets);ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let seq=0;const pending=new Map();ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pending.has(d.id)){pending.get(d.id)(d);pending.delete(d.id)}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;const t=setTimeout(()=>reject(Error(method+' timed out')),20000);pending.set(id,d=>{clearTimeout(t);d.error?reject(Error(d.error.message)):resolve(d.result)});ws.send(JSON.stringify({id,method,params}))});
 const js=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
 const wait=async exp=>{for(let i=0;i<100;i++){if(await js(exp))return;await sleep(100)}throw Error('UI timeout '+exp+' :: '+await js('document.body.innerText.slice(0,1600)'))};
 const shot=async name=>{const d=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(d.data,'base64'))};
 await send('Page.enable');await send('Runtime.enable');
 const r=await fetch(c.url+'/api/public/catalogue/packages',{headers:{'x-api-key':c.catalogueKey}});const list=(await r.json()).packages;ok(list.length===2,'two independently reviewed synthetic packages available from real Office');
 const pkg=list.find(p=>!p.consultation_only);const projection=await(await fetch(c.url+'/api/public/catalogue/packages/'+pkg.slug,{headers:{'x-api-key':c.catalogueKey}})).json();ok(projection.package.version>=1 && projection.package.components.length>0,'real versioned package projection');
 for(const [label,width,height] of (process.env.OFFICE_ONLY ? [] : [['desktop',1440,1000],['tablet',820,1100],['mobile',390,844]])){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<640});await send('Page.navigate',{url:site+'/solutions/packages/'+pkg.slug});await wait('!!document.querySelector(".sp-size select")');await sleep(250);
  ok(await js('document.documentElement.scrollWidth<=innerWidth+1'),'package '+label+' has no horizontal overflow');
  ok(await js('[...document.images].filter(i=>i.closest(".sp-section")).every(i=>i.complete&&i.naturalWidth>0)'),'package '+label+' renders actual Office media');await shot('package-'+label);
  await send('Page.navigate',{url:site+'/solutions'});await wait('!!document.querySelector(".sp-card")');await shot('solutions-'+label);
 }
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 // Real staff login with generated fixture identity, never the owner's session.
 const user=c.users.writerA;const login=await fetch(c.url+'/api/lead-agents/admin/session/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:user.email,password:user.password})});const cookie=login.headers.get('set-cookie').split(';')[0];const at=cookie.indexOf('=');await send('Network.setCookie',{name:cookie.slice(0,at),value:cookie.slice(at+1),url:c.url});
 await send('Page.navigate',{url:c.url+'/office/#/catalogue/packages'});await wait('!!document.querySelector("[data-package-row]")');await js('document.querySelector("[data-package-row]").click()');await wait('!!document.querySelector("[data-action=save]")');await shot('office-packages-desktop');
 ok(await js('document.body.textContent.includes("Solutions and scope")'),'real Office package builder loads');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(300);ok(await js('document.documentElement.scrollWidth<=innerWidth+1'),'Office package builder mobile no horizontal overflow');await shot('office-packages-mobile');
 console.log(JSON.stringify({suite:'packages-staging-browser',checks:count,failed:0,site,office:c.url+'/office/#/catalogue/packages'}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{ws?.close();chrome.kill('SIGTERM')});
