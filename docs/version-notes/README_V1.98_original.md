# MyBizDigital website — V1.98 (footer copyright consolidation)

**Source:** `V1.96_MYBIZDIGITAL_HORIZONX_FOOTER_REFINEMENT.html`  
**Build:** 23 October 2026  
**Scope:** Footer copyright line consolidated to the exact approved wording and the separate location/SSM line removed. No layout, navigation, cart, pricing or interaction changes. The 46 inline Base64 image/video references from the source were replaced with local paths into `/assets/`, and identical media blobs were deduplicated. All original media bytes were preserved.

## Repository structure

- `index.html` — entire website's HTML, styles and JavaScript (self-contained except for local media and Google Fonts)
- `assets/` — local product images, icons and demonstration videos used by `index.html`
- `netlify.toml` — Netlify static-site publish directory
- `.nojekyll` — disables Jekyll processing if using GitHub Pages
- `.gitignore` — ignores operating-system and local development artifacts
- `DEPLOYMENT_CHECKLIST.md` — publish steps and currently unfinished items
- `ASSET_MANIFEST.json` — original-reference mapping and checksums of extracted media

## Run locally

Opening `index.html` in a browser often works, but serve the folder locally to match production URLs:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`. No npm, Vite, frameworks or build scripts are required.

## Upload to GitHub

1. Create a new, **private** GitHub repository for the business (or use your existing website repository).
2. **Extract this ZIP locally.** Upload the **contents** of this folder, not the ZIP itself. `index.html`, `assets/` and `netlify.toml` must appear at the repository root.
3. For larger folders, GitHub Desktop is the most reliable method: File > Add local repository (or create one in this directory), Commit, then Publish repository.
4. Confirm that `index.html` and all `assets/*` files are committed.

## Netlify

1. Add new project → Import existing project → GitHub → select the repository.
2. Leave build command blank; publish directory `.` (also defined in `netlify.toml`).
3. Deploy, then verify product images, videos, shopping cart and mobile nav.
4. Attach `mybizdigital.my` in Netlify domain management after DNS is ready.

## Current limitations — NOT production checkout-ready

- The cart and checkout are front-end previews. **No HitPay payment gateway, webhooks, live shipping prices, order database, or email receipts are integrated.**
- International checkout remains an enquiry/manual-quotation flow.
- Some navigation actions and footer/legal/newsletter functions are intentionally not implemented or unavailable.
- The footer copyright line shows the approved SSM name and registration number; payment-method logos are still deferred until activation.
- Google Fonts (Inter) is loaded from Google over the network; system fonts fall back when offline.
- Review legal pages, privacy/data processing, refund and shipping policies, and merchant activation **before accepting live orders**.

The original V1.96 source file was left untouched; this is a directory-layout conversion to make the site GitHub/Netlify-ready.

## Production-preview safety text update

This production-preview package makes **only two on-page copy corrections** relative to the GitHub-ready V1.96 HTML: the checkout privacy notice and outdated Billplz/V1.91 message. The disabled payment button and all checkout logic remain unchanged. No backend, HitPay credentials, or payment submission was added.
