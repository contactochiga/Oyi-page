/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert/strict"),
  fs = require("fs"),
  path = require("path"),
  Module = require("module"),
  ts = require("typescript"),
  React = require("react"),
  { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "https://getoyi.com/hardware/checkout?reference=hwo_fake&status=success",
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = window.localStorage;
global.Event = window.Event;
global.IS_REACT_ACT_ENVIRONMENT = true;
const cache = {};
function load(file) {
  file = path.resolve(file);
  if (cache[file]) return cache[file];
  const m = new Module(file, module);
  m.filename = file;
  m.paths = module.paths;
  const normal = m.require.bind(m);
  m.require = (id) =>
    id === "next/link"
      ? function Link(p) {
          return React.createElement("a", p);
        }
      : id.startsWith("@/")
        ? load("src/" + id.slice(2) + ".ts")
        : id === "./AddToCart"
          ? load("src/components/hardware/AddToCart.tsx")
          : normal(id);
  m._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
  return (cache[file] = m.exports);
}

(async () => {
  const { PaymentStatus } = load("src/components/hardware/PaymentStatus.tsx");
  const { createRoot } = require("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  let response = { eligible: false, payment_state: "not_started" },
    calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return { ok: true, status: 200, json: async () => ({ payment: response }) };
  };
  await React.act(async () =>
    root.render(
      React.createElement(PaymentStatus, {
        orderId: "local-order",
        csrf: "synthetic",
      }),
    ),
  );
  assert(!document.body.textContent.includes("Payment verified"));
  async function click() {
    await React.act(async () => {
      document.querySelector("button").click();
      await new Promise((r) => setTimeout(r, 0));
    });
  }
  await click();
  assert(document.body.textContent.includes("needs confirmation"));
  assert(!document.body.textContent.includes("Accept total"));
  response = {
    eligible: true,
    payment_state: "not_started",
    amount_kobo: 125000,
    delivery_kobo: 25000,
    goods_tax_kobo: 6977,
    delivery_tax_kobo: 0,
  };
  await click();
  assert(document.body.textContent.includes("Accept total"));
  assert(document.body.textContent.includes("₦1,250"));
  response = { eligible: false, payment_state: "paid" };
  await click();
  assert(document.body.textContent.includes("Payment verified."));
  assert(!document.body.textContent.includes("Accept total"));
  response = { eligible: false, payment_state: "refund_required" };
  await click();
  assert(document.body.textContent.includes("refund"));
  assert(
    calls.every((c) => c.body.id === "local-order" && !("reference" in c.body)),
  );
  await React.act(async () => root.unmount());
  console.log("9 payment-state/consent/redirect-boundary DOM assertions PASS");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
