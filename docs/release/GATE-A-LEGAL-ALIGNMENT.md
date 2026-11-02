# Gate A legal alignment — release checkpoint, 2 November 2026

**Engineering: COMPLETE for review. Legal production release: NO-GO pending named approvals and hosting. Public commercial activation: NO-GO.** No release, settings, financial or database operation is included in this change.

## Verified baselines

| Item | Status | Evidence |
|---|---|---|
| GetOyi production | COMPLETE | `main` 91a76ba1465a0fe5dab17f942e0491b555f089e8; www.getoyi.com resolves to READY production dpl_Cwcq9NNdQ8mvyjLWemfBCZmEJMus. |
| PR4 | COMPLETE | Open, main base, codex/store-gate-a at34f0859802e8a0e5d02cd0ab386c95339dc6ccd0. This review branch starts there; PR4 is not silently replaced. |
| PR5 | COMPLETE | Open, codex/store-gate-a base, codex/sp-getoyi-release at38b77cb1f643505942aa69547110f5382e3e9414; accepted source1875fbb retained. |
| Office90 | COMPLETE | MERGED2Nov11:53:58UTC; merge a47551741f2c104acb2646ba5fa07290b21ac864. Render dep-dbk7ovff3r2c738v0a6g LIVE and Office Vercel dpl_D7cbSgRRQs2y1d4xqWwm3Pif11k1 READY at that SHA. Do not rerun its release. |
| Office recovery | COMPLETE / retained evidence | Compatibility c95cc7397e35456ed0bbe8022eb198e7094751f3 and rehearsed deployment dep-dbjnkftg1s2s73894pc0 preserved. Prior database migration/recovery evidence retained, no fresh DB access in this task. |
| Public switches | COMPLETE | Read-only Vercel environment-name inventory contains neither HARDWARE_CATALOGUE_ENABLED nor HARDWARE_PACKAGES_ENABLED; code requires literal true. Production Store200; cart/checkout/packages404. No settings changed. |

The Vercel connector could not list environment variables (403); the CLI's existing authorized identity succeeded. Only names/scopes were inspected/reported, not secrets. Production environment contains the existing intake/catalogue/preview/email bindings. OCHIGA_EMAIL_OFFICE was not read, replaced or changed. GetOyi project prj_xmUU9sadIAim6xDqUwItYE6BWZVj, team team_CmAFzjEZ20rOFUeCsnCg3Izv, Next.js/Node24.x, Git production branch main.

## Change inventory — COMPLETE

- `src/app/privacy/page.tsx`: commercial-website scope, controller and active privacy contact; actual form fields; website/security data; requested inspections/services; purposes/lawful bases; role-limited customer handling; providers, proportionate AI disclosure, transfer requirements, retention principles and rights. Building/resident processing is distinguished from website processing. No internal Office workflow, WhatsApp setting or Core decision-engine description.
- `src/app/terms/page.tsx`: existing page now covers website use, OyiOS deployment/licensing/subscription principles, hardware/VAT/stock/specifications/compatibility, integrated packages and professional services, warranties/returns/refunds/statutory protections. No new licence price, warranty duration, appointment, SLA or purchase capability. Existing `#store` anchor and privacy enquiry anchors retained. No extra legal routes.
- `vercel.json`: this review branch alone has Git auto-deployment disabled. Other branches retain default behaviour. Does not activate commerce or change production settings.
- `docs/release/LEGAL-TEXT-REVIEW.md`: readable copy extracted from the built pages for legal review; TSX remains authoritative. This report is the release checkpoint, not a new architecture programme.

Existing header/footer/design, Store, software pages, forms, APIs, permissions and financial code unchanged. No dependency or lockfile changes.

## Facts and review obligations

| Item | Classification | Evidence / required action |
|---|---|---|
| Controller, business scope, one OS/two experiences | COMPLETE | Owner's explicit architecture; current navigation and source. GetOyi represents software, hardware and services; Office remains the system of record. |
| Public address office@ochiga.com.ng | COMPLETE | Updated every customer-facing legal occurrence/mailto. Owner previously confirmed active mailbox and accepted six Office notices plus code delivery/login. No redundant send performed; MX alone is not receipt evidence. |
| Actual form data, acknowledgement and staff notice | COMPLETE | Contact/deployment forms, API handlers, officeIntake.ts and email.ts inspected; accepted CRM/mail evidence retained. Optional phone belongs to deployment form; package context is conditional on feature availability. |
| No tracker, checkout or booking | COMPLETE for this revision | No tracking/storage code added; existing assistant is a local navigation widget, not an AI conversation. Routes/build and HTTP tests preserve enquiry-only behaviour. Hosting/security logs and necessary cookies remain disclosed. |
| AI/provider disclosure | COMPLETE draft; NEEDS OWNER CONFIRMATION of final processing inventory | Prior reviewed Backend replyClassifier.ts and current source support OpenAI-assisted WhatsApp classification. Keep disclosure relevant to that channel; remove the brittle 'automated replies OFF' setting. Vercel/Cloudflare/Render/Supabase/Resend/Zoho/Meta/OpenAI retained as applicable, not a claim every enquiry reaches all providers. No production credential inspection. |
| Retention and rights | NEEDS OWNER CONFIRMATION | Approve principle-only wording, name the mailbox owner and request-handling/deletion/escalation process. No invented fixed retention period or automatic deletion. Legal reviewer must assess NDPA registration/audit obligations, response deadlines and lawful exceptions. |
| International transfers | NEEDS OWNER CONFIRMATION + qualified legal review | Establish actual provider locations, contractual transfer mechanism and safeguards for each relevant service. Text states legal requirements without asserting unverified countries or blanket adequacy. |
| Installation/partners/customer obligations | NEEDS OWNER CONFIRMATION | Confirm the promised explanation before partner involvement and the written scope/acceptance/change process. No fee or service level invented. Installation separately assessed unless explicitly included; nationwide delivery subject to confirmation. |
| Customer rights/software/hardware wording | NEEDS OWNER CONFIRMATION + qualified legal review | Review lawful bases, contract formation, VAT presentation, warranties/returns/refunds, licensing principles and Nigerian-law wording. Supplier-specific warranties and software SLAs must be agreed separately. No blanket liability or refund exclusion. |
| OyiOS deployment notices | NEEDS OWNER CONFIRMATION before actual deployments | Website notice deliberately does not purport to cover resident/visitor operational processing; appropriate controller/processor agreements and notices remain deployment-specific prerequisites. |

Qualified legal reviewer: **not appointed/recorded here**. Reviewer name/firm, date, exact final commit, decision and required changes: **OPEN**. Named owner approval of retention, factual/process obligations and final desktop/mobile presentation: **OPEN**. Text is drafted for review, not certified legally compliant.

Official reference points checked: [NDPC Act resources](https://ndpc.gov.ng/ndp-act-2023/), [FCCPC consumer rights](https://fccpc.gov.ng/consumers/consumer-rights-responsibilities/), [FCCPC complaint guidance](https://fccpc.gov.ng/about-us/faqs/). NDPC direct resource fetch returned403; do not represent this automated review as complete statutory interpretation. Qualified review of the actual law remains mandatory.

## Verification — COMPLETE

- Existing Release A unit31/31; isolated built HTTP33/33, including product enquiries against a fake Office, default-off catalogue, scoped GET-only catalogue access, no commerce routes and denied external egress. No real enquiries sent.
- Final lint and TypeScript PASS; optimized build PASS on Node24.22.2 matching production24.x. Earlier JSX quote lint errors corrected; not counted as passing until rerun.
- Production dependencies audit:0critical/high/moderate/low (npm audit --omit=dev). No upgrade introduced.
- Focused built-page checks26/26: HTTP200, titles/headings, unique anchors, old address absent, corrected mailto links, local links, no Set-Cookie, no cart/checkout/booking/package endpoints or Office/provider fetch.
- Browser checks: Terms and Privacy at1440desktop,768tablet,390mobile have scroll width equal viewport; working Services anchor, correct emails, no console errors/warnings. Navy/dark existing legal design and global navigation preserved. Screenshots retained in getoyi-commerce/gate-a/legal-alignment-evidence. This is engineering visual verification, not owner acceptance.
- Read-only production HTTP: /hardware,/privacy,/terms200; /hardware/cart,/hardware/checkout,/solutions/packages404. Existing intake/privacy approvals preserved; no duplicate payment/mail/lifecycle tests.

## Hosting — BLOCKED independently of legal approval

Authenticated Vercel CLI reports this team **Hobby / active**. Hobby permits personal, non-commercial use, so this business website requires a commercial arrangement even while enquiry-only. Staying under usage limits or keeping checkout OFF does not resolve that restriction.

Smallest change: owner approves **Vercel Pro for the existing team/project** and its billing/spend policy. Published base: **US$20/month**, one deploying seat and$20usage credit; additional deploying seats$20/month each, taxes, metered excess and optional add-ons extra. This is not an exact first-invoice quote; review team seats/projects, spend alerts/limits and applicable taxes in Billing before purchase. Existing domains and code need no migration. Sources: [Hobby](https://vercel.com/docs/plans/hobby), [Pro pricing](https://vercel.com/docs/plans/pro-plan).

Alternative: separately approve a commercially permitted host for this Next.js application. Cost is unquoted; migration would require new build/runtime, domains/TLS, API/preview secrets, caching, email and rollback verification. It is more engineering work than Pro and not authorised here. No assertion that a static free host supports the existing server routes. Render Free availability/cold-start acceptance remains an independent operational decision for catalogue reads, not a reason to silently upgrade.

## Exact release order and stop conditions

1. Review this branch/PR into **codex/store-gate-a**, not main. Obtain qualified legal + named/dated owner decisions for the final text; approve commercial hosting separately. No merge now. Vercel review-branch deploy suppression is intentional; local pages are available at http://127.0.0.1:18724/privacy and /terms.
2. On explicit integration authorization, merge the legal change into PR4's branch (this may create a Gate A preview). Record the new PR4 SHA/tree and final approval against that revision. Refresh only affected checks if content changes. Do not release old34f0859 legal copy by mistake.
3. Bring PR5 forward onto the approved Gate A branch. Its existing `vercel.json` addition and this branch's addition may conflict: preserve the **union of both false entries**, codex/sp-getoyi-release and codex/gate-a-legal-alignment, plus its schema key. Never resolve by enabling either branch or overwriting legal text. Package code does not modify the two legal pages. Verify merge tree and existing default-off package tests for the integrated revision before release. No PR5 merge performed here.
4. With separate production authorization and compliant hosting, merge revised PR4 to main; main is the production Git branch, so this is a deployment action. Record actual Vercel commit/id/alias. Both public switches remain absent/false. Verify legal pages/links, navigation, contact/deployment form controls and unchanged enquiry-only Store without submitting a real enquiry.
5. Only after PR4 is healthy, retarget reviewed PR5 to main and separately authorize its merge/deployment. Recheck Office dependency at its actual live revision and package route default-off behaviour. Do not redeploy Office90 or repeat its migration.
6. Stop on wrong commit/alias, build failure, secret exposure, form regression, unexpected public listing/checkout/payment/booking, or a switch becoming true. Public content approval, independent release/withdrawal, Live payment/refund/operations and activation remain later gates. No implied commercial activation from legal approval.

## Rollback

Before PR4 capture and retain production **dpl_Cwcq9NNdQ8mvyjLWemfBCZmEJMus /91a76ba** and its configuration. On an authorised rollback, restore that known healthy GetOyi artifact, keep public switches OFF, prevent queued forward deploys from superseding recovery and verify alias/health/CRM routes. It contains older legal text; treat it as temporary recovery requiring a corrected forward release. After PR5, the preferred rollback is the captured healthy revised-PR4 deployment, not a guessed historical ID. Recheck eligibility immediately before release; rollback retention is not indefinite. No database rollback is needed for this legal change. Office c95cc73 is an Office compatibility fallback only, never a GetOyi rollback or reason to undo the accepted Office release.

**NOT IN SCOPE:** production merges/deployments/migrations, real products, public switch activation, cart/checkout/booking, payments/refunds, new billing, Office/Backend edits. **Next owner decision:** appoint/record legal review and approve the final factual/retention copy; authorize commercially compliant hosting before requesting the separate staged release.
