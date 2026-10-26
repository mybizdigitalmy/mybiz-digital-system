# MyBizDigital Google OAuth — Legal Pages (REVIEW DRAFT)
Prepared: 26 October 2026  |  Based on GitHub `main` at commit `c9c6e1a6ced255f22533a40f6ff9c115f59556b9`

## What changed
- ADDED `privacy-policy.html`, with full English and Bahasa Malaysia notices in one accessible page.
- ADDED `terms-and-conditions.html`, describing website/services, customer accounts and the explicitly non-operational status of live checkout.
- ADDED `assets/legal-pages.css`, scoped entirely to `.mbd-legal-page`.
- REPLACED exactly two footer `span` placeholders with working `a` links in each of five approved main pages: `index.html`, `about.html`, `contact.html`, `web-development.html`, `business-apps.html`.
- Preserved the original page headers, footer styling, animations, cart, contact form, 16 app demos and all 15 website demos.

## Proposed Google Auth Platform URLs — DO NOT ENTER UNTIL PUBLISHED
- Homepage: https://mybizdigital.my
- Privacy Policy: https://mybizdigital.my/privacy-policy.html
- Terms of Service: https://mybizdigital.my/terms-and-conditions.html
- Authorized domain: mybizdigital.my (no scheme)

## Required founder review before publication
1. Verify all stated data practices and named providers against the actual deployed services. Netlify Identity/Google login and HitPay are PENDING and described conditionally.
2. Confirm privacy-notice accuracy, rights-request procedures, data retention and cross-border processing terms with suitable Malaysian legal/compliance advice, including PDPA 2010 as amended in 2024.
3. Confirm legal registered business name, SSM number in unchanged shared footer, and public business contact details. Private residence, MyKad, bank, DNS and API secrets are deliberately excluded.
4. Before accepting payments, adopt and publish proper Shipping & Delivery, Refunds & Returns, and Warranty terms, verify offer/product pricing, fulfillment and trader information, and have Malaysian consumer-law compliance reviewed.
5. Privacy Notice is bilingual only for statutory compliance. Full website multilingual translation remains DEFERRED.
6. Google Auth Platform branding verification also requires domain ownership confirmation through Google Search Console and separate OAuth client/Netlify configuration. No credentials are included here.

## Official references checked
- https://support.google.com/cloud/answer/15549049?hl=en
- https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification
- https://www.pdp.gov.my/ppdpv1/en/principles-of-personal-data-protection/
- https://www.pdp.gov.my/ppdpv1/en/akta/guidance-on-the-preparation-of-personal-data-protection-notices/
- https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2025/01/A-Quick-Guide-to-PRIVACY-NOTICE.pdf

## Deployment status
This ZIP has NOT been pushed to GitHub or deployed to Netlify. Its legal wording is a proposal, not an already approved legal policy. Avoid submitting the Google brand verification until these pages are reviewed, published and live-accessible.

## Local quality checks (26 October 2026)
- Git blob hashes of all five modified parent pages matched current GitHub `main` before editing.
- Only the two legal footer placeholders changed in each existing HTML file; all other existing markup remains the same.
- Checked Privacy and Terms pages at 1440px desktop, 390px mobile and 320px narrow mobile: no horizontal overflow, original logo present, footer links present, language sections render.
- Checked all five main pages statically for exactly one working Privacy Policy link and one Terms & Conditions link in the footer; three other unpublished legal links remain disabled.
- Browser rendering used locally injected CSS and existing navbar animation scripts because the sandbox blocks direct localhost/file navigation. Full hosted end-to-end browser testing and live Google OAuth verification are **not** complete.
- The pages are provisional founder-review legal drafts; they have not received legal counsel approval.
