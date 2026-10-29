/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process"),
  assert = require("assert/strict"),
  path = require("path");
const base = "http://127.0.0.1:4325";
const p = spawn(
  process.execPath,
  [
    path.resolve("node_modules/next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "4325",
  ],
  {
    stdio: "ignore",
    env: {
      PATH: process.env.PATH,
      NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
      HARDWARE_CATALOGUE_ENABLED: "false",
      HARDWARE_CHECKOUT_ENABLED: "false",
    },
  },
);
(async () => {
  try {
    for (let i = 0; i < 100; i++) {
      if (p.exitCode !== null) throw Error("local server failed");
      if (
        await fetch(base + "/hardware")
          .then((r) => r.ok)
          .catch(() => false)
      )
        break;
      await new Promise((r) => setTimeout(r, 100));
    }
    for (const route of [
      "/hardware/cart",
      "/hardware/checkout",
      "/api/hardware/checkout/session",
    ])
      assert.equal((await fetch(base + route)).status, 404);
    assert.equal(
      (
        await fetch(base + "/api/hardware/checkout/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        })
      ).status,
      404,
    );
    for (const route of ["/hardware", "/contact", "/deployments"])
      assert.equal((await fetch(base + route)).status, 200);
    console.log("7 default-OFF / existing page HTTP checks PASS");
  } finally {
    p.kill("SIGTERM");
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
