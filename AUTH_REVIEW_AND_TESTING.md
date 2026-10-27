# MyBizDigital authentication — REVIEW PATCH (not production-approved)

Baseline: GitHub main `8a268d9ea887a70cbf7ce493670edb4cae537598`.

Contents: Four HTML page references (index, contact, web-development, business-apps), `assets/customer-auth.css`, `src/customer-auth.js`, `package.json` and `netlify.toml`. **About Us and demo pages are unchanged.** Existing cart state, support form, Google artwork, legal pages, manifests, footer and all other assets remain untouched.

**Production bundle is generated at Netlify build time** by the pinned `@netlify/identity` 2.0.0 and `esbuild` 0.25.12 dependencies. All four pages reference `assets/customer-auth.bundle.js`; this is intentionally not checked in as hand-written source. Your Netlify project must successfully install dependencies and execute the build. Existing `publish = "."` is retained.

## Approval and testing sequence

1. Preserve a rollback commit. **Use a GitHub feature branch** for these changes, not `main` yet.
2. Upload replacement files preserving paths. Allow Netlify Deploy Preview to build, ensuring `customer-auth.bundle.js` is generated.
3. On the preview, check browser console for errors and verify navbar Log in, Sign up, Google login, required confirmation link, forgot password, password reset, My Account, logout and reload/session persistence.
4. Google is still in **Testing**; only two approved Google test accounts may log in. Never publish Google OAuth until branding verification is ready.
5. Test at desktop/mobile widths; verify existing cart quantity is preserved. The current cart remains local and is not tied to a Netlify user record.
6. Confirm email/password accounts cannot authenticate until verified. Check email links resolve to the expected site and are processed by `handleAuthCallback()`.
7. **Do not enable checkout.** Backend payment/order endpoints must verify the Netlify Identity session server-side before accepting any orders or HitPay payments; UI controls are not a security boundary.
8. Only after end-to-end verification and user approval, merge to `main` and permit Netlify production deployment.

## Limitations

- Local browser tests can check the interface with a stubbed Identity SDK, not live Google OAuth or confirmation emails.
- The build dependencies could not be downloaded locally because this runtime has no npm registry connectivity. **Netlify build and live Identity integration have not been verified** and must be tested via Deploy Preview before production.
- Netlify Identity API, callback tokens, and Google OAuth credentials never belong in GitHub source. Custom Google credentials are already in your Netlify Identity dashboard.
- New site policy URLs are public and provided by existing HTML files; they were not changed here.

## Checks actually performed in this session

- Git blob SHAs of the four original HTML files matched the current GitHub `main` baseline.
- Verified each changed HTML file is byte-for-byte identical except two isolated resource references (CSS and module script).
- `node --check` JavaScript syntax passed. `package.json` and `netlify.toml` parsed. ZIP archive validated.
- **Browser UI automated tests did not run:** the local Chromium environment blocked both `file://` and `http://127.0.0.1` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`.
- The npm registry was not reachable from this sandbox, so SDK installation and Netlify build were not tested.
- Do not interpret this patch as tested or approved production authentication.
