const fs=require('fs'),ts=require('typescript'),Module=require('module'),assert=require('assert/strict');
function load(file){const m=new Module(file,module);m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,file);return m.exports;}
const {recordedStatus}=load('src/components/hardware/CallbackStatus.tsx');
assert.match(recordedStatus({payment_state:'paid'}),/verified by Office/);
assert.match(recordedStatus({payment_state:'failed'}),/not completed/);
assert.match(recordedStatus({payment_state:'pending'}),/pending confirmation/);
assert.match(recordedStatus({payment_state:'not_started',reservation:{state:'expired'}}),/expired/);
assert.match(recordedStatus({payment_state:'refund_required'}),/No fulfilment/);
const {isolatedStatusOnly}=load('src/lib/checkout/server.ts');
assert.equal(isolatedStatusOnly(),false);
Object.assign(process.env,{ISOLATED_SERVICE:'getoyi',HARDWARE_TEST_STATUS_ONLY:'true',GETOYI_CHECKOUT_ORIGIN:'https://localhost:18443',OCHIGA_OFFICE_CHECKOUT_URL:'https://office.hardware.test',HARDWARE_PAYMENTS_ENABLED:'false'});
assert.equal(isolatedStatusOnly(),true);
process.env.HARDWARE_PAYMENTS_ENABLED='true';assert.equal(isolatedStatusOnly(),false);
process.env.HARDWARE_PAYMENTS_ENABLED='false';process.env.OCHIGA_OFFICE_CHECKOUT_URL='https://getoyi.com';assert.equal(isolatedStatusOnly(),false);
console.log('9 callback status/isolation assertions PASS');
