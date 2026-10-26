/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert/strict"),
  crypto = require("crypto");
const base = process.argv[2];
assert.equal(new URL(base).hostname, "127.0.0.1");
let checks = 0;
const ok = (v) => {
  assert.ok(v);
  checks++;
};
(async () => {
  const session = await fetch(base + "/api/hardware/checkout/session");
  const { csrf } = await session.json(),
    cookie = session.headers.getSetCookie()[0].split(";")[0];
  ok(
    session.status === 200 &&
      session.headers.get("set-cookie").includes("HttpOnly") &&
      session.headers.get("set-cookie").includes("SameSite=strict"),
  );
  const post = async (action, b, headers = {}) => {
    const r = await fetch(base + "/api/hardware/checkout/" + action, {
      method: "POST",
      headers: {
        cookie,
        origin: base,
        "x-checkout-csrf": csrf,
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(b),
    });
    return { status: r.status, data: await r.json() };
  };
  const lines = [{ product: "test-order", sku: "TEST-ORDER-1", quantity: 2 }];
  ok(
    (await post("quote", { lines }, { origin: "https://foreign.invalid" }))
      .status === 403,
  );
  ok(
    (await post("quote", { lines }, { "x-checkout-csrf": "tampered" }))
      .status === 403,
  );
  ok((await post("quote", { lines }, { cookie: "" })).status === 403);
  ok(
    (await post("quote", { lines: [{ ...lines[0], quantity: 0 }] })).status ===
      400,
  );
  ok((await post("quote", { lines, price: 1 })).status === 400);
  const q = await post("quote", { lines });
  ok(
    q.status === 200 &&
      q.data.quote.payment_eligible === false &&
      q.data.quote.payable_total_kobo === null,
  );
  const body = {
    lines,
    quote_token: q.data.quote_token,
    idempotency_key: crypto.randomUUID(),
    customer: {
      name: "LOCAL TEST browser guest",
      email: "local-browser@example.invalid",
      phone: "+2348000000000",
    },
    delivery: {
      country: "NG",
      state: "FCT",
      city: "Abuja",
      address: "LOCAL TEST address",
      postcode: "",
    },
    installation_requested: true,
  };
  ok(
    (await post("submit", { ...body, quote_token: body.quote_token + "x" }))
      .status === 409,
  );
  const pair = await Promise.all([post("submit", body), post("submit", body)]);
  ok(
    pair
      .map((x) => x.status)
      .sort()
      .join(",") === "200,201" &&
      pair[0].data.order.id === pair[1].data.order.id,
  );
  const id = pair[0].data.order.id;
  const r = await post("status", { id });
  ok(r.status === 200 && !JSON.stringify(r).includes("example.invalid"));
  ok(
    (await post("status", { idempotency_key: body.idempotency_key })).data.order
      .id === id,
  );
  const other = await fetch(base + "/api/hardware/checkout/session");
  const otherCookie = other.headers.getSetCookie()[0].split(";")[0],
    otherCsrf = (await other.json()).csrf;
  ok(
    (
      await post(
        "status",
        { id },
        { cookie: otherCookie, "x-checkout-csrf": otherCsrf },
      )
    ).status === 404,
  );
  ok(
    (
      await post("submit", body, {
        cookie: otherCookie,
        "x-checkout-csrf": otherCsrf,
      })
    ).status === 409,
  );
  for (const page of ["/hardware/cart", "/hardware/checkout"]) {
    const r = await fetch(base + page);
    ok(r.status === 200);
  }
  console.log(`${checks} real GetOyi → Office → Postgres HTTP checks PASS`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
