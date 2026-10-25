# MyBizDigital.my — Consolidated V2.06 website migration package

Assembled: 25 October 2026 from preserved previous website ZIP artifacts.

**This is a reconstructed migration package, NOT an original single published V2.06 full-site release and NOT proof of what is live on GitHub/Netlify.** Existing files were copied byte-for-byte (no code rewrites or design changes); only documentation was added/relocated.

## Build provenance
1. V1.98 GitHub Ready complete website archive: full homepage media assets, original `ASSET_MANIFEST.json`, Netlify config.
2. V1.99 approved About Us / index update (replaces only `index.html`, introduces `about.html`).
3. V2.02 cumulative package: `index.html` two-option Services nav, website/app libraries, 15 demo pages including approved Barber.
4. V2.06 *design-library* cumulative package: V2.04 premium rebuilds for the 14 non-Barber demos, V2.05 corrected supporting photographs, and V2.06 website-development library changes. This source is an **incremental package** and by itself does not contain the home page or original media assets.
5. V2.05 `IMAGE_CHANGE_MANIFEST.json` and release notes retained separately.

## Website structure
- `index.html` main site (from V2.02 cumulative release; later updates explicitly left homepage unchanged)
- `about.html` approved About Us
- `web-development.html` V2.06 Website Development library
- `business-apps.html` Business Apps library (V2.02)
- `demos/` 15 individual demo sites (Barber V2.01/02, other 14 V2.06)
- `assets/` homepage media, shared libraries, demonstration photos/styles/scripts
- `ASSET_MANIFEST.json` original website media manifest
- `IMAGE_CHANGE_MANIFEST.json` V2.05 supporting-image change log
- `netlify.toml` original static deployment configuration
- `docs/` historical original release notes and build provenance

## Transfer to ChatGPT personal Plus
Upload this whole ZIP to a **private** `MyBizDigital HQ` project chat and request an **audit before changes**. The rest of the historical conversation and media masters are not contained in this ZIP.

## Deployment workflow
1. Extract ZIP locally; compare to the existing GitHub repository before touching `main`.
2. Preview through a local web server (e.g. `python -m http.server 8000`) and check all 15 demo routes, Home/About, both library pages, nav, media and checkout/cart.
3. For Netlify historical static settings, keep build command blank, publish directory `.`. Verify actual Netlify configuration before publishing.
4. Publish only after browser validation and owner approval. No deployed site was accessed or changed by this assembly.

## Status and limitations
- No HitPay live checkout, shipping, email or order backend is established by these source files.
- Blog editorial master note (24 Oct) is **not approved as live blog**; do not include the exploratory blog patch by default.
- No promises of SEO ranking, AI recommendation placement, or real client demos. Industry demo brands/content are illustrative.
- Final page interactions, complete web browser rendering and GitHub/Netlify deployment still require integration testing; file integrity and path validation are documented in `docs/VALIDATION_REPORT.json`.
- Archive contents are reconstructed from verified archives rather than the user's current local GitHub working tree. Compare against any newer commits before applying.
