# MyBizDigital — Legal Pages Revised for E-commerce Readiness
Prepared: 27 October 2026 | **PROPOSED / FOUNDER & LEGAL REVIEW REQUIRED**
Source: GitHub `main` commit `8a268d9ea887a70cbf7ce493670edb4cae537598` (Netlify deployed 26 October 2026).

## Exact change scope
Only two files are different: `privacy-policy.html` and `terms-and-conditions.html`.
These files retain the existing site header, footer, scripts, font loading, links and `assets/legal-pages.css`. No replacement needed for `index.html`, existing CSS, products, checkout, contact, or demo pages. Both main legal articles are revised; the Terms page now has a complete Bahasa Malaysia counterpart.

## What is improved
- Permanent document headings and dated revisions, not a temporary legal-page redesign.
- Explicit current vs planned status for Netlify Identity / Google Sign-In and HitPay checkout, while keeping the approved mandatory verified-account / no-guest-checkout approach.
- Clear basic Google data categories and use; no Gmail/Drive/Contacts permissions claimed for sign-in.
- Bilingual full Personal Data Notice (English/Bahasa Malaysia), with purposes, data categories, required data, service providers, cross-border processing, retention, rights, safeguards and contact method.
- Bilingual full Terms (English/Bahasa Malaysia), covering NFC product bundles, pricing, staged checkout, payments, fulfilment, consumer rights, demonstrations, custom software/website agreements and external platforms.
- No invented payment completion, shipping rates, fixed refund days, warranty durations or shipping promises.

## Checks / decisions BEFORE founder approves publication
1. **Validate actual data flows** for the Contact form, Netlify Identity, Google, Resend and Zoho against the real deployment. Netlify deploy metadata currently reports Forms not enabled. Do not imply that enquiry delivery or customer authentication was tested when it was not.
2. **Legal review strongly recommended.** Confirm Personal Data Protection Act 2010 as amended, any DPO/notification obligations applicable to business size, international transfers, consumer protection laws, and the scope of the 2024 Electronic Trade Transaction Regulations to this direct-selling website. The full Bahasa Malaysia wording should be professionally checked.
3. **Verify business disclosure details** (business registration number already in unchanged footer, actual customer-contact telephone and physical business/trading address if legally required). No private owner residential address is disclosed here without approval.
4. **Before enabling purchases:** Approve and publish accurate Shipping & Delivery, Returns & Refunds, and Warranty policies or the equivalent documented customer disclosures; establish operational checkout review/correction flow, stock, taxes, lead times, total delivery cost, acknowledgement, payment verification and order storage.
5. **Validate PDPA request handling:** verify who receives privacy requests and actual access, correction, deletion and retention processes. Enquiry page should link conspicuously to Privacy Policy near forms; login/signup dialog should also link it once implemented.
6. Terms expressly describe email verified accounts and disable guest checkout, but this is **approved FUTURE design** and must not be presented as implemented security until Netlify Identity integration is tested.
7. Review date 27 October 2026 is the revision preparation date. Update date before publication if publication is later.

## Google Cloud links (ONLY AFTER UPDATED SITE IS LIVE AND PUBLIC)
Application homepage: https://mybizdigital.my
Privacy Policy: https://mybizdigital.my/privacy-policy.html
Terms of Service: https://mybizdigital.my/terms-and-conditions.html
Authorized domain: mybizdigital.my (without https://)

Google Cloud > Google Auth Platform > Branding > App domain: paste the exact two HTTPS URLs above after founder approval and verified successful public responses. Confirm same homepage, no login wall, English notice plus Bahasa Malaysia, and no 404 errors, and verify ownership with Google Search Console before submitting brand verification.

## Google / Malaysian legal references (official)
- https://support.google.com/cloud/answer/13464321?hl=en
- https://support.google.com/cloud/answer/15549049?hl=en
- https://developers.google.com/identity/verification/authentication-policy-compliance
- https://www.pdp.gov.my/ppdpv1/en/akta/guidance-on-the-preparation-of-personal-data-protection-notices/
- https://www.pdp.gov.my/ppdpv1/en/principles-of-personal-data-protection/
- https://repositori.kpdn.gov.my/bitstream/123456789/5299/1/PERATURAN%20URUSNIAGA%20PERDAGANGAN%20DALAM%20ELEKTRONIK%202024.pdf

No GitHub push or Netlify deployment was made by the assistant. A clean rollout is: founder reviews > legal/compliance review > replace these two root HTML files in GitHub > check Netlify Ready deploy > test both public URLs (private/incognito window) > paste into Google Auth Branding > save > arrange Google Search Console domain verification / brand verification.
