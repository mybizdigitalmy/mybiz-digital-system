# MyBizDigital V2.02 — 15 Industry Website Demos + Two-Choice Services Menu

## What changed

- All 15 Website Development library cards now link to actual responsive HTML demo sites (W01–W15). W01 Barber Shop preserved byte-for-byte.
- 14 newly built complete one-page fictional business websites with distinct industry identities, service copy, navigation labels, hero composition, responsive layout, and demo-only enquiries.
- Original local SVG hero artwork and screenshots captured from actual browser renders for the 14 new sites. No placeholder or broken 'Live demo' links.
- Existing Website Development and Business Applications libraries preserved; only the website library demo metadata, linked thumbs, generic notices, and live-demo count updated.
- **Services menu has exactly two links:** `Website Development` and `Business Application`, on both desktop and mobile. Old subchoices (Business Websites, E-Commerce Websites, Landing Pages, Web Applications, Mobile Apps, Business Portals) removed.
- No checkout, cart, payment gateway, About Us, or footer redesigns.

## Deployment

1. Extract the ZIP to a temporary folder.
2. Open GitHub Desktop → Repository → Show in Explorer.
3. Copy `index.html`, `web-development.html`, and `business-apps.html` into the repository root, replacing those 3 files.
4. Merge the ZIP's `assets/` and `demos/` folders into the matching repository folders. **Do not delete existing assets or `about.html`.**
5. In GitHub Desktop, review changes. Commit as `Complete 15 industry demos and simplify Services menu V2.02` and Push origin.
6. Inspect Netlify Deploys → Published. Verify homepage dropdown only shows the two services.
7. Open `/web-development.html`, filter several industries, click a card → View Live Demo, and verify sample action notices.

The package is cumulative: it includes Barber Shop V2.01 and library V2.00 files even if those weren't previously deployed. Files outside this package are intentionally preserved.

## Demo list
- W01: Barber Shops — `demos/barber-01/index.html`
- W02: Restaurants — `demos/restaurant-01/index.html`
- W03: Cafés & Coffee Shops — `demos/coffee-01/index.html`
- W04: Medical Clinics — `demos/clinic-01/index.html`
- W05: Dental Clinics — `demos/dental-01/index.html`
- W06: Hair Salons — `demos/salon-01/index.html`
- W07: Bakeries & Patisseries — `demos/bakery-01/index.html`
- W08: Spas & Massage — `demos/spa-01/index.html`
- W09: Fashion Boutiques — `demos/fashion-01/index.html`
- W10: Electronics & Phone Shops — `demos/electronics-01/index.html`
- W11: Hotels & Resorts — `demos/hotel-01/index.html`
- W12: Car Wash & Detailing — `demos/auto-detail-01/index.html`
- W13: Real Estate Agencies — `demos/real-estate-01/index.html`
- W14: Tuition & Learning Centres — `demos/tuition-01/index.html`
- W15: Gyms & Fitness Studios — `demos/fitness-01/index.html`

## Safe demo behavior / restrictions

- Fictional names, examples, sample services and descriptions only. Demo buttons open an explanatory dialog; there are no real appointment submissions, bookings, payments, patient data or order processing.
- The 14 new demos use locally hosted original graphic illustrations (SVG) and browser-rendered thumbnail screenshots, not licensed third-party photographs. Premium client projects should use approved real client photography when commissioned.
- Business App library continues to show five labelled interface concepts, not operational SaaS.
- All 50 industry categories remain available for filtering and enquiries. Fifteen have responsive demo websites now; others may request a custom design.
- Existing global MyBizDigital customer payments remain disabled as before.

## Verification

- Desktop/mobile widths tested: 1440, 820, 390 and 320 px for the libraries; 1440, 390, and 320 px for each of the 14 new sites.
- All new images loaded locally; no browser JS errors or horizontal overflow detected.
- New demo action dialogs open and close; mobile navigation opens and closes.
- Library has 15 cards and 15 View Live Demo links. Filtering, search and modal open/close tested.
- Existing W01 Barber Shop HTML/CSS/JS and images are byte-identical to approved V2.01.
- After uploading to Netlify, verify navigation and relative asset paths on the live site; automated tests are not a substitute for real-device UAT.
