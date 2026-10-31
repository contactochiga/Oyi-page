# GetOyi commercial experience: audit and design plan (2026-10-31)

Base: production `07876db` (Release A, catalogue OFF). Branch: `codex/commercial-experience`.

## 1. Audit of the live site
| # | Finding | Evidence |
|---|---|---|
| A1 | Navigation does not match the approved six parts | Header showed Solutions, Technology, Hardware, Partners, Developers, Support. Oyi and Experiences were missing; Hardware was not called Store |
| A2 | **No navigation on phones** | Below 768 px the header showed only the logo and "Deploy Oyi" on every page (Playwright, iPhone 13 emulation). Visitors could reach other pages only through in-page links or the footer |
| A3 | Positioning split into three products | Facility, Experience and Core were presented as three pillars, not one operating system with two experiences and intelligence inside |
| A4 | The Hardware page contradicted the Store model | It described an in-development compute unit and display, not Office-approved hardware or Ochiga packages |
| A5 | The CTA implied self-serve | "Deploy Oyi" everywhere, while deployments are consultation-led |
| A6 | Weak detail | Feature cards showed empty glowing squares; the "Automation" link pointed to a non-existent anchor; no Store or consultation story on the home page |

## 2. Design plan (implemented on this branch)
**Information architecture: the approved six-part navigation.**
- **Oyi** → `/oyi` (new): one intelligent operating system. Dropdown: What is Oyi, Oyi Core.
- **Experiences** → `/experiences` (new hub). Dropdown: Facility Experience (`/facility`), Resident Experience (`/experience`).
- **Solutions** → `/solutions` (existing; residential, hospitality, commercial, mixed-use, healthcare).
- **Store** → `/hardware`. The label changes; the route stays, because the Office catalogue integration publishes to `/hardware/<slug>`. `/store` redirects (307) to `/hardware`.
- **Partners** → `/partners` (existing).
- **Technology** → `/technology` (existing hub, now Oyi Core, Digital Twin, Edge, Watch, Developers).
- **Primary CTA:** "Request a consultation" → `/deployments` (existing intake form, unchanged behaviour; "Request", not "Book", because no booking function exists).

**Positioning**
- Oyi is one system. The Facility Experience is for the teams who run the building. The Resident Experience is for residents, guests and occupants. Oyi Core is the intelligence across both (assistance and supervised automation; no autonomy claims).
- Software is consultation-led: a shared four-step "How deployment works" section (Consultation → Fit and design → Deployment → Operation) on Home, Oyi, Experiences and Store.
- The Store sells only Office-approved hardware, with integrated Ochiga packages "coming later". Approved products may later be sold at a fixed price (direct checkout stays disabled); custom solutions and Oyi deployments stay consultation-led. "Online ordering is not open yet." No product, price or availability is shown while the catalogue is off.

**Components (reused design language: dark navy, sky accent, rounded panels)**
- `SiteHeader`: desktop dropdowns (hover and keyboard focus, no JS). New `MobileMenu`: native `<details>`, which works without JS and closes after navigation.
- `SystemDiagram`: two experiences, Core across both, and capability links, using real labels only.
- `StoreIntro`, `ConsultationSteps`: shared sections.
- `ProductPage`: gains a secondary CTA and an optional extra section; numbered point markers replace the empty squares.
- Footer: Oyi / Experiences / Store and partners / Company.

**Unchanged on purpose**
- The catalogue code path (`HARDWARE_CATALOGUE_ENABLED` absent → static Store page), product and preview routes, `/api/leads`, `/api/deployments`, the revalidation hook, and Office integration.
- No new commerce surface: no cart, checkout, payments, ordering or booking.

## 3. Verification (local, catalogue off, no Office settings)
- TypeScript and ESLint clean.
- Release A suites: unit 28/28, HTTP 33/33. The suites include "Office never contacted", no commerce routes or APIs, no other host, and preview fail-closed. The one changed assertion is the new Store heading.
- `tests/phase3/carousel.cjs` 19/19. `merchandising-ui` and `enquiry-http` need an Office harness argument; their precondition stop is identical on production `07876db`.
- Routes: `/`, `/oyi`, `/experiences`, `/hardware`, `/facility`, `/experience`, `/technology`, `/solutions`, `/partners`, `/deployments`, `/core` and `/contact` return 200; `/store` → 307 `/hardware`.
- Playwright desktop 1440 and iPhone 13: no horizontal overflow. The mobile menu opens, navigates and closes.
- Screenshots: `~/getoyi-commerce/commercial-experience/shots/{before,after}`.

## 4. Release gating
Protected Vercel preview only. Production requires separate owner approval of the preview and a merge to `main`. Catalogue activation, product import, commerce and billing are out of scope.
