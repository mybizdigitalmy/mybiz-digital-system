/* V2.00 library navigation and concept browsing. No payments, orders or backend. */
(()=>{
  const header=document.querySelector('.site-header');
  if(header){
    const toggle=header.querySelector('.mobile-toggle');
    const mob=header.querySelector('.mobile-services');
    const mobButton=header.querySelector('.mobile-services-btn');
    const desktop=header.querySelector('.services-wrap');
    const desktopBtn=header.querySelector('.services-trigger');
    const sync=()=>header.classList.toggle('is-scrolled',window.scrollY>8);
    sync();window.addEventListener('scroll',sync,{passive:true});
    toggle?.addEventListener('click',()=>{const on=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(on));if(!on)mob?.classList.remove('is-open')});
    mobButton?.addEventListener('click',()=>{const on=mob.classList.toggle('is-open');mobButton.setAttribute('aria-expanded',String(on))});
    desktopBtn?.addEventListener('click',e=>{e.stopPropagation();const on=desktop.classList.toggle('is-open');desktopBtn.setAttribute('aria-expanded',String(on))});
    document.addEventListener('click',e=>{if(desktop&&!desktop.contains(e.target)){desktop.classList.remove('is-open');desktopBtn?.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){header.classList.remove('menu-open');desktop?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false')}});
    header.querySelectorAll('.mobile-drawer a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false')}));
    const navRoll=(host)=>{if(host.dataset.navRollReady)return;const text=(host.querySelector('.roll-stack > span')?.textContent||host.textContent).trim();host.textContent='';let idx=0;for(const ch of text){if(ch===' '){const sp=document.createElement('span');sp.className='roll-space';sp.setAttribute('aria-hidden','true');host.append(sp);continue}const col=document.createElement('span');col.className='roll-char';col.setAttribute('aria-hidden','true');const inner=document.createElement('span');inner.className='roll-char-inner';inner.style.setProperty('--i',idx++);for(let n=0;n<2;n++){const f=document.createElement('span');f.className='roll-char-face';f.textContent=ch;inner.append(f)}col.append(inner);host.append(col)}host.dataset.navRollReady='true';host.setAttribute('aria-label',text)};
    header.querySelectorAll('.nav-link .roll,.nav-action .roll').forEach(navRoll);
    const login=header.querySelector('.nav-login');if(login&&!login.querySelector('.roll')){const span=document.createElement('span');span.className='roll';span.textContent=login.textContent;login.textContent='';login.append(span);navRoll(span)}
  }
  const node=document.getElementById('library-data');if(!node)return;
  const data=JSON.parse(node.textContent);const items=data.apps,sectors=data.sectors;
  const q=document.getElementById('library-search'),sort=document.getElementById('sort-results');
  const sectorsEl=document.getElementById('sector-filter'),industryEl=document.getElementById('industry-filter'),mobile=document.getElementById('mobile-filter-panel');
  const grid=document.getElementById('concept-grid'),counter=document.getElementById('result-count'),empty=document.getElementById('empty-result');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','>':'&gt;'}[c]));
  const validSector=s=>Object.prototype.hasOwnProperty.call(sectors,s);
  let sector='',industry='',query='';
  const initial=new URLSearchParams(location.search).get('industry');
  for(const [s,inds] of Object.entries(sectors)){if(inds.includes(initial)){industry=initial;sector=s;break}}
  const filter=(x,{checkSector=true,checkIndustry=true}={})=>{
    if(checkSector&&sector&&x.sector!==sector)return false;
    if(checkIndustry&&industry&&x.industry!==industry)return false;
    return !query||[x.title,x.sector,x.industry,x.category,x.kind].join(' ').toLowerCase().includes(query);
  };
  const btn=(name,val,type,n,checked)=>`<button type="button" class="filter-item" data-filter-kind="${type}" data-filter-value="${esc(val)}" aria-pressed="${checked}"><span>${esc(name)}</span><small>${n}</small></button>`;
  function renderFilters(){
    const total=items.filter(x=>filter(x,{checkSector:false,checkIndustry:false})).length;
    const primary=btn('All industries','', 'sector',total,!sector)+Object.keys(sectors).map(s=>btn(s,s,'sector',items.filter(x=>filter(x,{checkSector:false,checkIndustry:false})&&x.sector===s).length,sector===s)).join('');
    const sub=sector?sectors[sector].filter(ind=>items.some(x=>x.industry===ind)).map(ind=>btn(ind,ind,'industry',items.filter(x=>filter(x,{checkIndustry:false})&&x.industry===ind).length,industry===ind)).join(''):'';
    sectorsEl.innerHTML=primary;industryEl.innerHTML=sub;
    mobile.innerHTML=`<div class="sector-filter">${primary}</div><div class="industry-filter">${sub}</div>`;
  }
  function render(){
    renderFilters();let found=items.filter(filter);if(sort.value==='az')found=[...found].sort((a,b)=>a.title.localeCompare(b.title));
    counter.textContent=`${found.length} of ${items.length} interactive application demos`;
    grid.innerHTML=found.map(x=>`<a class="concept-card app-demo-card" href="${esc(x.demoUrl)}" target="_blank" rel="noopener" aria-label="Open interactive ${esc(x.title)} demo"><span class="card-frame"><img class="app-demo-thumb" src="${esc(x.thumbnail)}" loading="lazy" alt="${esc(x.title)} application demo interface"></span><h3 class="card-name">${esc(x.title)}</h3><p class="card-meta">${esc(x.industry)}<span class="dot">·</span>${esc(x.category)}</p><span class="card-badge">Open interactive demo ↗</span></a>`).join('');
    empty.hidden=!!found.length;if(!found.length)empty.innerHTML='<h3>No demos match this filter.</h3><p>Try a different search or industry. You can still discuss custom software with us.</p><a class="solid-button" href="contact.html?enquiry=software" data-mbd-enquiry="software">Discuss Your Project ↗</a>';
  }
  const toggle=document.getElementById('mobile-filters-toggle');
  toggle?.addEventListener('click',()=>{const showing=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(showing));mobile.hidden=!showing});
  document.addEventListener('click',e=>{
    const b=e.target.closest('button[data-filter-kind]');if(!b)return;
    if(b.dataset.filterKind==='sector'){sector=validSector(b.dataset.filterValue)?b.dataset.filterValue:'';industry=''}
    else if(sector&&sectors[sector]?.includes(b.dataset.filterValue)){industry=b.dataset.filterValue}
    render();
  });
  const clearFilters=()=>{sector='';industry='';query='';q.value='';sort.value='featured';render()};
  document.getElementById('reset-filters')?.addEventListener('click',clearFilters);
  document.getElementById('reset-filters-mobile')?.addEventListener('click',clearFilters);
  q.addEventListener('input',()=>{query=q.value.trim().toLowerCase();render()});sort.addEventListener('change',render);
  render();
})();
