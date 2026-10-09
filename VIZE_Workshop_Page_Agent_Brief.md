# VIZE Workshop Page — Implementation Brief

## Goal

Build the remaining `/workshop` page in the existing VIZE website. The primary purpose is to present and sell resin courses. The secondary purpose is to sell the supplied Resin Notch Trowel Start Up Kit. Include workshop photographs and useful information, following the visual style of the existing pages.

Existing website: https://vize-resin.vercel.app/

The live Workshop route was observed with the shared header and footer but no page content. Inspect the current source before implementation; it may have changed since that review.

## Important content boundaries

- Courses are the main focus; do not turn this into a general tool catalogue.
- Show only the six equipment groups listed below. Do not add mixers, rollers, weighing scales, measuring jugs, moulds or other products to the shop.
- The supplied poster prices the COMPLETE kit at ₹9,500 with courier included. Individual tool prices have not been provided; do not invent them or sell components individually by default.
- Course names in the mockup are proposals: Resin Art, Resin Tabletop Making and Epoxy Flooring. Confirm or replace them with the actual course catalogue before launch.
- Course prices, dates, duration, location, capacity, delivery format, certificates, refunds and inclusions are unconfirmed. Use existing verified data, or show an enquiry action until configured. Never invent these details.
- Workshop photos in the mockup are illustrative. Use supplied real photographs where available. Do not present generated participants as actual customers or instructors.
- Use the original VIZE logo asset from the existing project. The generated mockup's logo and footer text are placeholders, not replacement branding.

## Design direction

Reuse the website's actual design tokens, fonts, components, container widths and spacing. The visual reference uses warm cream backgrounds, pale sage navigation, dark teal text, copper buttons, subtle beige borders and elegant italic typography accents.

Approximate reference colours, only if existing tokens are unavailable:

| Purpose | Colour |
| --- | --- |
| Page background | `#F7F4ED` |
| Dark text / feature band | `#102B30` |
| Copper accent | `#AE6644` |

Use generous spacing, clear hierarchy, restrained rounded corners and large photographs. Avoid oversized empty gaps. Keep section edges aligned to the same container. Preserve existing header, footer, mobile navigation, account and cart behaviour. Do not redesign other pages.

## Page order and layout

### 1. Shared header

Reuse the existing header. Mark Workshop active using the current active-link treatment. Preserve navigation and cart count.

### 2. Hero — courses first

Desktop: two columns, headline and actions on the left, a large rounded workshop photograph on the right. Mobile: copy followed by image.

- Eyebrow: `VIZE WORKSHOPS`
- Heading: `Learn the craft.`
- Italic second line: `Create with confidence.`
- Supporting text: `Explore resin courses, practical techniques and professional application tools.`
- Primary button: `Explore Courses` — scroll to courses.
- Secondary button: `Shop Tool Kit` — scroll to the kit.

Choose a photo of a resin demonstration or learning environment. Hero equipment shown in a learning photograph does not imply additional shop products.

### 3. Course catalogue

Heading: `Find your next resin course.`

Desktop: three equal cards per row. Tablet: two columns. Mobile: one column. Each card contains a photograph, course name, short description and `View Course` action.

Proposed copy, to use only after confirming these courses exist:

| Proposed course | Proposed short description |
| --- | --- |
| Resin Art | Explore creative techniques, colour play and the art of working with resin. |
| Resin Tabletop Making | Learn the process of creating resin tabletops. |
| Epoxy Flooring | Understand surface preparation and resin flooring application methods. |

Course detail should show verified curriculum, learning outcomes, format, duration, fee, date/location if relevant, prerequisites and inclusions. Reuse an existing detail route or modal pattern. Provide `Book Course` or `Add Course to Cart` only when actual course data and checkout support exist. Otherwise use `Enquire About This Course`. Avoid dead buttons.

If courses share the existing cart, distinguish them from physical products: do not apply physical shipping to a course. Collect only booking information required by the configured course. Reuse current checkout and payment integration; do not build an unrelated checkout system.

### 4. Workshop gallery and information

Heading: `Inside the workshop.`

Three photographs in a row on desktop, stacked or a touch-friendly gallery on mobile:

1. Demonstration — `See the techniques`
2. Practical activity — `Practise the process`
3. Finished work — `Explore the finish`

Add concise, confirmed information about the learning experience. Provide descriptive alt text. Use actual workshop images if available. An optional existing lightbox can be reused; do not add a new dependency solely for this section.

### 5. Shop the complete equipment kit

Heading: `Professional tools. One complete kit.`

Use one bordered cream panel with product information at the top and six component cards below. On desktop, place product name and price left, quantity and purchase action right. Stack these on mobile.

- Product: `Resin Notch Trowel Start Up Kit`
- Complete kit price from supplied poster: `₹9,500`
- Delivery text: `Courier included`
- Quantity selector: minimum 1; use existing stock rules if present.
- Action: `Add Kit to Cart`

The six cards explain what is included. They are not separate purchasable products. Desktop grid: three columns by two rows. Tablet: two columns. Mobile: one column. Use consistent image ratios and card heights, with tool photos contained rather than cropped.

#### Exact supplied equipment contents

| Tool group | Quantity | Specifications from poster |
| --- | --- | --- |
| Dual-Notch Steel Trowel Set | 4 pcs | 2 mm / 1.5 mm / 1 mm / 0.5 mm notched blades; stainless steel blades for resin and epoxy. |
| Precision Notch Bars | 2 pcs | 0.5 mm / 1 mm / 1.5 mm / 2 mm profiles; ultra-thin bars for fine-detail resin work. |
| Heavy Duty Notch Trowels | 3 pcs | 2 mm / 3 mm / 4 mm; blades for self-levelling and flooring applications. |
| T-Handle Notch Trowel | 1 pc | 1.5 mm notched blade with stainless steel T-handle. |
| Mini Detailing Kit | 3 pcs | Curved scraper plus two mini multi-notch plates; 2 mm / 1.5 mm / 1 mm / 0.5 mm; for corners and details. |
| Steel Spike Shoes | 2 pairs | Poster states 24 stainless screws and two black straps. Confirm whether these counts apply to the entire kit or each pair before publishing detailed accessory counts. |

For spike shoes, the mockup uses the safer concise text `2 pairs · Screws & straps included` while the accessory-count ambiguity remains.

Use the supplied poster photos or exact matching supplied product assets. Preserve the visible shapes: flat notched steel blades, narrow bars, heavier blades, stainless T-handle, curved scraper with two mini plates, and steel shoe plates with screws and straps. Do not replace them with generic plastic spiked shoes or unrelated trowels.

Do not infer tax inclusion, tax exclusion, delivery time or shipping-region coverage from `Courier included`. Use configured store terms.

### 6. Course enquiry callout

Dark teal panel with a subtle resin texture or restrained image:

- Heading: `Ready to learn with VIZE?`
- Text: `Ask about available courses and upcoming workshops.`
- Button: `Enquire About Courses`

Connect to the existing contact flow or configured enquiry form. If using a form, use the existing backend handler and confirmation/error states. Do not invent a phone number, WhatsApp destination or email address.

### 7. Shared footer

Reuse the current site footer and real branding. Use the current year. Do not copy the mockup's placeholder year, tagline or unverified footer links.

## Behaviour and implementation

- Use existing project framework, routes, styling conventions, product schema and cart state.
- Keep course data separate from kit-component descriptions. Components belong to a single kit product.
- Store money consistently with the existing project; ₹9,500 equals 950000 paise if the project stores amounts in paise.
- Add-to-cart must create the correct kit line item, quantity and price, update the shared cart, and use the existing success feedback. Apply existing inventory and price authority rules.
- Do not claim a successful purchase or booking when checkout is unavailable. Use enquiry where necessary.
- Loading, empty, sold-out and error states should follow existing patterns.
- Anchor actions should account for the sticky header and respect reduced-motion preferences.
- Use accessible buttons/links, keyboard focus, labelled quantity controls and sufficient contrast.
- Lazy-load below-fold photos, reserve their dimensions, and use responsive image assets.
- Set a page title such as `Resin Workshops & Tool Kit | VIZE` and a concise description grounded in confirmed offerings.

## Recommended implementation sequence

1. Inspect the existing page shell, routing, design tokens, cart and product/course data once; reuse established patterns.
2. Implement the hero, course section, gallery, kit panel and enquiry callout in the stated order.
3. Connect verified course details, the single kit product and existing contact/cart flows.
4. Check desktop and mobile layout, anchor navigation, course actions, kit quantity and cart persistence using the project's relevant checks.
5. Report files changed and any unconfirmed content or missing integrations. Do not call a visual-only implementation fully functional.

## Completion checklist

- [ ] `/workshop` renders within the shared site shell.
- [ ] Courses are the first main section after the hero.
- [ ] Course titles and purchase terms are verified or clearly withheld pending configuration.
- [ ] Workshop imagery and information are included.
- [ ] Only the six specified equipment groups appear in the shop.
- [ ] The equipment is sold as one ₹9,500 kit, with courier included as supplied.
- [ ] Quantity and cart integration work through the existing flow.
- [ ] No unconfirmed individual tool prices, course fees, dates or claims are added.
- [ ] Original logo, existing footer and navigation are preserved.
- [ ] Layout works on mobile without horizontal overflow.
- [ ] Buttons reach real destinations and handle unavailable data honestly.

## Visual reference

Use the latest generated Workshop mockup supplied in this conversation as a layout reference. Its page structure is the intended direction, but actual project branding, verified content and real assets take precedence over generated lettering or imagery.
