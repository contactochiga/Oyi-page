/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert/strict"),
  fs = require("fs"),
  path = require("path"),
  Module = require("module"),
  ts = require("typescript"),
  React = require("react"),
  { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
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
  const { ProductShowcase } = load(
      "src/components/hardware/ProductShowcase.tsx",
    ),
    { CART_KEY, readCart } = load("src/lib/checkout/cart.ts");
  const { createRoot } = require("react-dom/client"),
    root = createRoot(document.getElementById("root"));
  const variants = [
    {
      sku: "TEST-A",
      name: "Black",
      options: { colour: "Black" },
      price: "₦1,000",
      availability: "In stock",
      availabilityTone: "ok",
      leadTime: "",
    },
    {
      sku: "TEST-B",
      name: "White",
      options: { colour: "White" },
      price: "₦2,000",
      availability: "In stock",
      availabilityTone: "ok",
      leadTime: "",
    },
    {
      sku: "TEST-Q",
      name: "Quote only",
      options: {},
      price: "",
      availability: "On request",
      availabilityTone: "wait",
      leadTime: "",
    },
  ];
  const render = (enabled) =>
    React.act(() =>
      root.render(
        React.createElement(ProductShowcase, {
          name: "LOCAL TEST",
          productSlug: "local-test",
          images: [],
          variants,
          checkoutEnabled: enabled,
        }),
      ),
    );
  let checks = 0;
  const ok = (v) => {
    assert.ok(v);
    checks++;
  };
  await render(true);
  await React.act(() =>
    [...document.querySelectorAll("[role=radio]")]
      .find((e) => e.textContent === "White")
      .click(),
  );
  await React.act(() =>
    [...document.querySelectorAll("button")]
      .find((e) => e.textContent === "Add to Cart")
      .click(),
  );
  ok(readCart()[0].sku === "TEST-B");
  ok(
    Object.keys(JSON.parse(localStorage.getItem(CART_KEY))[0])
      .sort()
      .join(",") === "product,quantity,sku",
  );
  await React.act(() =>
    [...document.querySelectorAll("[role=radio]")]
      .find((e) => e.textContent === "Quote only")
      .click(),
  );
  ok(
    ![...document.querySelectorAll("button")].some(
      (e) => e.textContent === "Add to Cart",
    ),
  );
  await render(false);
  ok(
    ![...document.querySelectorAll("button")].some(
      (e) => e.textContent === "Add to Cart",
    ),
  );
  localStorage.setItem(CART_KEY, '{"price":1,"email":"not-stored"}');
  ok(readCart().length === 0);
  await React.act(() => root.unmount());
  console.log(`${checks} variant/cart/privacy DOM checks PASS`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
