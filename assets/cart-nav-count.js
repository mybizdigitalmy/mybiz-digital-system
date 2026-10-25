/* Read-only cart count for the main site's secondary-page navbar.
   The storefront remains the sole owner of cart data and checkout behavior. */
(() => {
  'use strict';
  const cartLink = document.querySelector('.nav-right .cart-button');
  if (!cartLink || cartLink.querySelector('.mbd-cart-count')) return;

  const badge = document.createElement('span');
  badge.className = 'mbd-cart-count';
  badge.setAttribute('aria-live', 'polite');
  cartLink.appendChild(badge);

  const storageKey = 'mybizdigital_v191_cart';
  const productIds = new Set(['google', 'facebook', 'instagram', 'tiktok', 'food']);

  function updateCount() {
    let entries = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(parsed)) entries = parsed.slice(0, 80);
    } catch (_) { /* Browser storage may be disabled or empty. */ }

    const count = entries.reduce((total, entry) => {
      if (!entry || !productIds.has(entry.productId) || !Array.isArray(entry.urls)) return total;
      const amount = entry.productId === 'food' ? 1 : Math.max(1, Math.min(100, Number(entry.quantity) || 1));
      return total + (Number.isFinite(amount) ? amount : 1);
    }, 0);
    badge.textContent = count > 99 ? '99+' : String(count || '');
    badge.classList.toggle('is-visible', count > 0);
    badge.setAttribute('aria-label', `${count} products or bundles in cart`);
  }

  updateCount();
  window.addEventListener('pageshow', updateCount);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) updateCount();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateCount();
  });
})();
