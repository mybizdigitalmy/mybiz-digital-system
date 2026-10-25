# MyBizDigital V1.98 — Deployment and Launch Checklist

## Source control

- [ ] Upload all files and the entire `assets/` folder to the GitHub repo root
- [ ] Verify `index.html` exists at repo root and `assets/` is present
- [ ] Keep original V1.96 master offline as backup
- [ ] Enable GitHub 2FA and appropriate repository access

## Netlify preview deployment

- [ ] Connect GitHub repository to Netlify
- [ ] Set build command to blank, publish directory to `.`
- [ ] Check desktop and mobile responsive layout
- [ ] Check all product gallery images and 3 How It Works video demonstrations
- [ ] Check navigation, Add to Cart, cart and checkout preview (test only)
- [ ] Check footer social links

## Before production / taking real payments

- [x] Display registered business identity: MYBIZ DIGITAL SOLUTIONS and SSM registration number in the footer
- [ ] Finish contact / support, privacy, terms, shipping, returns and refund pages
- [ ] Activate HitPay business merchant account and supported payment methods
- [ ] Implement hosted payment checkout and **server-side verified webhook** (Netlify Functions or other suitable backend)
- [ ] Implement accurate order amounts, delivery pricing, tax and shipping confirmation
- [ ] Store orders and issue purchase confirmations appropriately
- [ ] Validate card, e-wallet, refund and failed-payment cases in test mode
- [ ] Publish footer payment logos **only for methods actually activated**
- [ ] Confirm domain and HTTPS certificates are active

**Business bank account:** selection pending. **HitPay:** selected but not connected. **SSM:** approved.

## Public-preview disclosure check

- [ ] Verify the checkout remains clearly marked as a preview; payment button disabled.
- [ ] Review any illustrative customer ratings/testimonials before publishing. Replace or remove claims that are not supported by genuine customer evidence.
- [ ] Do not display payment-method logos before HitPay approves/activates those methods.
