/* eslint-disable @typescript-eslint/no-require-imports -- Isolated HTTP regression runner. */
const assert = require("node:assert/strict"),
  crypto = require("node:crypto"),
  fs = require("node:fs");
const base = process.argv[2],
  evidence = process.argv[3];
assert.ok(
  base && new URL(base).hostname === "127.0.0.1",
  "Only loopback tests are permitted",
);
(async () => {
  const body = {
    leadType: "tech_oem",
    name: "LOCAL TEST refinement",
    email: `refinement-${crypto.randomUUID()}@example.invalid`,
    organization: "LOCAL TEST company",
    message: "Please quote delivery for this option.",
    hardware: { product: "test-smart-locks-1", sku: "TEST-UNAVAILABLE" },
    idempotencyKey: crypto.randomUUID(),
  };
  const post = async (value) => {
    const r = await fetch(base + "/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    return { status: r.status, body: await r.json() };
  };
  assert.equal(
    (await post({ ...body, hardware: { ...body.hardware, sku: "<script>" } }))
      .status,
    400,
  );
  assert.equal(
    (
      await post({
        ...body,
        hardware: { ...body.hardware, sku: "NOT-A-REAL-SKU" },
      })
    ).status,
    400,
  );
  const first = await post(body);
  assert.equal(first.status, 200);
  assert.equal(first.body.delivery.office, "synced");
  const duplicate = await post(body);
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.body.delivery.office, "duplicate");
  const results = fs
    .readFileSync(evidence + "/crm-results.jsonl", "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  const filed = results.find(
    (x) => x.outcome === "filed" && x.crm?.contact?.email === body.email,
  );
  assert.ok(filed, "actual isolated Office CRM records must exist");
  assert.equal(filed.crm.contact.name, body.name);
  assert.equal(filed.crm.organization.name, body.organization);
  assert.equal(filed.crm.opportunity.business_unit, "technology");
  assert.equal(filed.crm.activity.opportunity_id, filed.crm.opportunity.id);
  assert.ok(filed.crm.activity.body.includes("SKU TEST-UNAVAILABLE"));
  assert.ok(filed.crm.activity.body.includes("Currently unavailable"));
  assert.ok(filed.crm.activity.body.includes(body.message));
  assert.ok(
    filed.timelineEvent.metadata.source_page.includes("sku=TEST-UNAVAILABLE"),
  );
  assert.equal(
    results.filter(
      (x) => x.outcome === "filed" && x.crm?.contact?.email === body.email,
    ).length,
    1,
  );
  console.log(
    "16 HTTP/CRM assertions passed: invalid SKU rejection, canonical variant/customer context, CRM contact/organization/opportunity/activity/timeline and duplicate suppression. No external email.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
