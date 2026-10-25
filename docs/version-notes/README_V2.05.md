# MyBizDigital V2.05 — Image consistency correction only

This review patch corrects the **12 mismatched supporting photographs** in the V2.04 industry website demos. Each `detail.webp` now comes from the photographic source of **its own** industry, with a different crop from that demo's hero image. This is an image-consistency fix; it is **not 12 new independent photographs**, and the same subject may be recognizable in two sections of a demo. Restaurant and Coffee Shop already had correct hero/detail photography; they are unchanged. The approved Barber Shop is unchanged.

## Apply this patch to existing V2.04 GitHub files

1. **Do not apply** unless the V2.04 demo files are already in your GitHub repository. This is only the 12-image correction patch, not a full website package.
2. Extract `V205_Images_Only.zip`. Inside you will see the `assets/demos/<industry>/detail.webp` folders.
3. Open GitHub Desktop > Repository > Show in Explorer.
4. **Merge** the ZIP `assets` folder into your repository `assets` folder, replacing the 12 existing `detail.webp` files when prompted. Do **not** delete other files, folders, or assets.
5. Check GitHub Desktop: **exactly 12 modified binary assets**, **no HTML/CSS/JS**, no barber assets.
6. Commit `Correct industry demo images V2.05`, push only after reviewing before/after image proof.

## Exact scope

- Changed: 12 supporting `detail.webp` files (Auto Detail, Bakery, Clinic, Dental, Electronics, Fashion, Fitness, Hotel, Real Estate, Salon, Spa, Tuition).
- Unchanged: All 14 heroes, Restaurant/Coffee detail files, all library-card thumbnails, the approved Barber Shop, HTML, CSS, JS, global nav, footer, product/cart.
- Reason thumbnails unchanged: They are actual hero screenshots, and none of the hero photos changed.
- In the 12 affected pages, both secondary photo sections reference the same `detail.webp` source; updating the image therefore corrects both.

**Review limitation:** Because the only relevant existing licensed/generated photograph per affected industry is already used in the hero, the replacement uses a different focal crop of that photograph. For a more diverse final library, a future separately approved photography-only pass can replace these details with independent, industry-specific images. V2.05 is intended for visual consistency review before any such expansion.

All businesses, imagery and data in demos are fictional illustrative material. No bookings or payments are processed.
