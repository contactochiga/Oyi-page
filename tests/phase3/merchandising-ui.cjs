/* eslint-disable @typescript-eslint/no-require-imports -- Standalone paired-worktree test runner. */
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const {JSDOM} = require('jsdom');
(async () => {
  assert.ok(process.argv[2], 'Pass the Office worktree directory');
  const {renderMerchandising} = await import(pathToFileURL(path.resolve(process.argv[2], 'public/office/catalogue/merchandising.mjs')));
  const dom = new JSDOM('<main></main>');
  global.document = dom.window.document;
  const host = document.querySelector('main');
  const empty = {slides:[],featured:[],new_arrivals:[],collections:[]};
  const state = {current_version:0,published_version:null,workflow:'draft',row_version:0,versions:[],events:[]};
  let permissions = ['catalogue.write'], mutation;
  const ui = {
    state:{renderToken:1}, hasPermission: p => permissions.includes(p),
    escapeHtml: value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    el: html => {const t=document.createElement('template');t.innerHTML=html;return t.content.firstElementChild;},
    api: async (url, opts) => {
      if(opts){mutation=opts;return {};}
      return url.endsWith('/options') ? {products:[]} : {merchandising:state};
    }
  };
  const button = text => [...host.querySelectorAll('button')].find(b=>b.textContent===text);
  await renderMerchandising(host,1,ui);
  assert.ok(host.textContent.includes('No publicly released products yet.'));
  assert.ok(!button('Approve saved version') && !button('Publish approved campaign'));
  button('Save new draft version').click();
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(mutation.body,{action:'save',expected_row_version:0,content:empty});
  button('Add story').click();
  assert.ok(host.textContent.includes('Story 1'));
  permissions=[];await renderMerchandising(host,1,ui);
  assert.ok(!button('Save new draft version') && button('Add story').disabled);
  state.workflow='in_review';state.current_version=1;permissions=['catalogue.review'];
  await renderMerchandising(host,1,ui);
  assert.ok(button('Approve saved version') && !button('Publish approved campaign'));
  console.log('6 merchandising UI checks passed (DOM harness; no production requests)');
  dom.window.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
