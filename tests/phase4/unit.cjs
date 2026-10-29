/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs"),
  ts = require("typescript"),
  Module = require("module"),
  assert = require("assert/strict");
function load(file) {
  const m = new Module(file, module);
  m.filename = file;
  m.paths = module.paths;
  m._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    file,
  );
  return m.exports;
}
const cart = load("src/lib/checkout/cart.ts"),
  server = load("src/lib/checkout/server.ts");
let checks = 0;
const ok = (b) => {
  assert.ok(b);
  checks++;
};
const line = { product: "test-order", sku: "TEST-ORDER-1", quantity: 2 };
ok(cart.validCart([line]));
for (const quantity of [0, -1, 1.5, 1001, "2", null])
  ok(!cart.validCart([{ ...line, quantity }]));
for (const bad of [
  [line, line],
  [{ ...line, price: 1 }],
  [{ ...line, product: "../private" }],
  Array(51).fill(line),
  null,
  {},
  [{ ...line, sku: "A&select=*" }],
])
  ok(!cart.validCart(bad));
process.env.HARDWARE_CHECKOUT_SESSION_SECRET = "synthetic-test-secret-".repeat(
  3,
);
const token = server.newGuest();
ok(server.verify(token).kind === "guest");
ok(!server.verify(token + "x"));
ok(!server.verify(server.sign({ kind: "guest", exp: Date.now() - 1 })));
ok(!server.verify("bad"));
ok(server.verify(server.csrf("guest")).id === "guest");
process.env.HARDWARE_CATALOGUE_ENABLED = "false";
process.env.HARDWARE_CHECKOUT_ENABLED = "true";
ok(!server.enabled());
process.env.HARDWARE_CATALOGUE_ENABLED = "true";
ok(server.enabled());
ok(cart.STATES.length === 37);
ok(cart.money(107500).includes("1,075.00"));
console.log(`${checks} cart/token/flag assertions PASS`);
