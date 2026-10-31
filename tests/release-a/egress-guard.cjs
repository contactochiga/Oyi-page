/* eslint-disable @typescript-eslint/no-require-imports -- test preload */
// Test-only preload: records every outbound fetch URL and refuses anything that is not 127.0.0.1, so a test can prove which hosts the
// site tried to reach (including attempts to the production Office) without any request ever leaving this machine.
const fs = require("fs");
const LOG = process.env.EGRESS_LOG;
const orig = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  try { fs.appendFileSync(LOG, url + "\n"); } catch {}
  const host = new URL(url).hostname;
  if (host !== "127.0.0.1") throw new TypeError("egress blocked by test guard: " + host);
  return orig(input, init);
};
