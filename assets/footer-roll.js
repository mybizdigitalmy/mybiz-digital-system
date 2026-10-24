
(() => {
  const nav = document.querySelector('#mbd-site-footer .mbd-f-nav');
  if (!nav) return;
  document.querySelectorAll('#mbd-site-footer .mbd-f-nav a').forEach((link) => {
    if (link.dataset.footerRollReady === 'true') return;
    const label = link.textContent.trim();
    link.textContent = '';
    const host = document.createElement('span');
    host.className = 'roll';
    host.setAttribute('aria-label', label);
    let index = 0;
    const count = [...label].filter(ch => ch !== ' ').length;
    for (const ch of label) {
      if (ch === ' ') {
        const space = document.createElement('span');
        space.className = 'roll-space';
        space.setAttribute('aria-hidden','true');
        host.appendChild(space);
      } else {
        const col = document.createElement('span');
        col.className = 'roll-char';
        col.setAttribute('aria-hidden','true');
        const inner = document.createElement('span');
        inner.className = 'roll-char-inner';
        inner.style.setProperty('--i',String(index));
        inner.style.setProperty('--ri',String(Math.max(0,count - 1 - index)));
        for (let j=0;j<2;j++) {
          const face = document.createElement('span');
          face.className = 'roll-char-face';
          face.textContent = ch;
          inner.appendChild(face);
        }
        col.appendChild(inner);
        host.appendChild(col);
        index++;
      }
    }
    link.appendChild(host);
    link.setAttribute('aria-label',label);
    link.dataset.footerRollReady = 'true';
  });
})();
