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
  const dataNode=document.getElementById('library-data');if(!dataNode)return;
  const data=JSON.parse(dataNode.textContent);
  const web=data.kind==='web';const items=web?data.concepts:data.apps;
  const sectors=data.sectors;
  const sectorEl=document.getElementById('sector-filter'),industryEl=document.getElementById('industry-filter'),mobile=document.getElementById('mobile-filter-panel');
  const grid=document.getElementById('concept-grid'),count=document.getElementById('result-count'),empty=document.getElementById('empty-result');
  const search=document.getElementById('library-search'),sort=document.getElementById('sort-results');
  const overlay=document.getElementById('detail-overlay'),panel=overlay.querySelector('.detail-panel'),detail=overlay.querySelector('#detail-content');
  let chosenSector='',chosenIndustry='',query='',previousFocus=null;
  const escapeHtml=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mail=(subject,body)=>'mailto:support@mybizdigital.my?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  const initialIndustry=new URLSearchParams(location.search).get('industry');
  if(initialIndustry){for(const [sec,names] of Object.entries(sectors)){if(names.includes(initialIndustry)){chosenIndustry=initialIndustry;chosenSector=sec;break}}}
  document.getElementById('hero-quote').href=mail(web?'Website Development Enquiry':'Business Application Enquiry','Hello MyBizDigital,\n\nI would like to discuss a '+(web?'business website':'business application')+' for my business.\n\nBusiness name: \nIndustry: \nRequirements: \n');
  const mkBtn=(title,value,kind,selected,amount='')=>`<button class="filter-item" data-kind="${kind}" data-value="${escapeHtml(value)}" aria-pressed="${selected?'true':'false'}"><span>${escapeHtml(title)}</span>${amount!==''?`<small>${amount}</small>`:''}</button>`;
  function filterContent(){
    const content=`${mkBtn('All industries','', 'sector',!chosenSector,'50')}${Object.entries(sectors).map(([sec,inds])=>mkBtn(sec,sec,'sector',chosenSector===sec,inds.length)).join('')}`;
    const subs=chosenSector?sectors[chosenSector].map(ind=>mkBtn(ind,ind,'industry',chosenIndustry===ind)).join(''):'';
    sectorEl.innerHTML=content;industryEl.innerHTML=subs;
    mobile.innerHTML=`<div class="sector-filter">${content}</div><div class="industry-filter">${subs}</div>`;
  }
  function matches(item){
    const selIndustry=chosenIndustry;
    if(web){if(selIndustry&&item.industry!==selIndustry)return false;if(!selIndustry&&chosenSector&&!sectors[chosenSector].includes(item.industry))return false;}
    else if(selIndustry&&!item.industries.includes(selIndustry))return false;
    else if(!selIndustry&&chosenSector&&!item.industries.some(ind=>ind===chosenSector||(sectors[chosenSector]||[]).includes(ind)))return false;
    if(query){const hay=(web?[item.title,item.industry,item.style]:[item.title,item.category,item.description,...item.industries]).join(' ').toLowerCase();if(!hay.includes(query))return false;}
    return true;
  }
  function siteThumb(item){if(item.thumbnail)return `<img class="real-site-thumb" src="${escapeHtml(item.thumbnail)}" alt="Preview of the ${escapeHtml(item.title)} demo website" loading="lazy">`;return `<div class="mock-site" data-theme="${escapeHtml(item.theme)}" style="--mock-bg:${escapeHtml(item.bg)};--mock-accent:${escapeHtml(item.accent)}" aria-hidden="true"><div class="mock-header"><span>${escapeHtml(item.title.toUpperCase().slice(0,25))}</span><span class="mock-nav">MENU &nbsp; ABOUT &nbsp; CONTACT</span></div><div class="mock-content"><p class="mock-kicker">${escapeHtml(item.industry)}</p><p class="mock-heading">${escapeHtml(item.tag)}</p><span class="mock-rule"></span><span class="mock-cta">${escapeHtml(item.cta)} ↗</span></div><span class="mock-art"></span></div>`}
  function appThumb(item){let bars=Array.from({length:item.theme==='calendar'?28:7},(_,i)=>`<i style="--h:${25+(i*23)%65}%"></i>`).join('');return `<div class="app-mock" data-theme="${escapeHtml(item.theme)}" aria-hidden="true"><div class="app-mock-side"><i></i><i></i><i></i><i></i><i></i></div><div class="app-mock-body"><div class="app-mock-head"><span>${escapeHtml(item.title)}</span><i></i></div><div class="app-mock-kpis"><b>Overview</b><b>Activity</b><b>Summary</b></div><div class="app-mock-visual">${bars}</div></div></div>`}
  function render(){
    filterContent();let found=items.filter(matches);if(sort.value==='az')found=[...found].sort((a,b)=>a.title.localeCompare(b.title));
    count.textContent=web?`${found.length} of 15 responsive demo websites · 14 new designs pending approval`:`${found.length} of 5 application concepts`;
    grid.innerHTML=found.map(item=>`<button type="button" class="concept-card" data-id="${escapeHtml(item.id)}" aria-label="View ${escapeHtml(item.title)} concept details"><span class="card-frame">${web?siteThumb(item):appThumb(item)}</span><h3 class="card-name">${escapeHtml(item.title)}</h3><p class="card-meta">${escapeHtml(web?item.industry:item.category)}<span class="dot">·</span>${escapeHtml(web?item.style:'Interface concept')}</p><span class="card-badge">${item.demoUrl?'Live demo · Details ↗':'Concept preview · Details ↗'}</span></button>`).join('');
    empty.hidden=!!found.length;
    if(!found.length){const subject=web?`Website Design Enquiry — ${chosenIndustry||chosenSector||'Industry'}`:'Business Application Enquiry';empty.innerHTML=`<h3>No concept preview matches this selection yet.</h3><p>${chosenIndustry?`We're expanding our ${escapeHtml(chosenIndustry)} examples.`:'Try another category or search term.'} We can still discuss a tailored ${web?'website':'application'} for your business.</p><a class="solid-button" href="${mail(subject,'Hello MyBizDigital,\n\nI am interested in a solution for this industry: '+(chosenIndustry||chosenSector||'')+'\n\nMy business: \nRequirements: ')}">Request a ${web?'Website':'Business App'} ↗</a>`}
  }
  function show(item){previousFocus=document.activeElement;let subject=web?`Website Enquiry — ${item.id} ${item.title}`:`Business App Enquiry — ${item.id} ${item.title}`;let body=`Hello MyBizDigital,\n\nI am interested in ${item.id} — ${item.title}.\n\nMy business name: \nMy industry: \nMy requirements: \n`;
    detail.innerHTML=`<div class="detail-visual">${web?siteThumb(item):appThumb(item)}</div><p class="detail-kicker">${escapeHtml(web?item.industry:item.category)} · ${escapeHtml(item.id)}</p><h2 id="detail-title">${escapeHtml(item.title)}</h2><p class="detail-copy">${escapeHtml(web?(item.demoUrl?`A ${item.style.toLowerCase()} website demonstration for ${item.industry.toLowerCase()}. Explore this responsive design, its industry-specific content and sample enquiry journey.`:`A proposed ${item.style.toLowerCase()} design direction for ${item.industry.toLowerCase()}. The preview illustrates a visual approach, not an existing, working website.`):item.description)}</p><p class="detail-notice">${web?(item.demoUrl?'Responsive website demo. The business brand, services, photographs and enquiry flow are illustrative; no bookings or payments are processed.':'Illustrative website concept. A live, functional demonstration has not been published yet.'):'Illustrative interface concept — not live operational software.'}</p><div class="detail-actions">${item.demoUrl?`<a class="solid-button" href="${escapeHtml(item.demoUrl)}" target="_blank" rel="noopener">View Live Demo ↗</a>`:''}<a class="${item.demoUrl?'outline-button':'solid-button'}" href="${mail(subject,body)}">${web?'Request Similar Website':'Discuss This Application'} ↗</a>${web?`<a class="outline-button" href="business-apps.html?industry=${encodeURIComponent(item.industry)}">Related Business Apps →</a>`:''}<button type="button" class="outline-button" data-close>Close</button></div>`;
    overlay.hidden=false;document.body.classList.add('has-detail');panel.focus();
  }
  function close(){overlay.hidden=true;document.body.classList.remove('has-detail');previousFocus?.focus()}
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-kind]');if(btn){const value=btn.dataset.value;if(btn.dataset.kind==='sector'){chosenSector=value;chosenIndustry=''}else chosenIndustry=value;render();return}
    if(e.target.closest('#reset-filters')){chosenSector='';chosenIndustry='';query='';search.value='';render();return}
    const concept=e.target.closest('[data-id]');if(concept){const item=items.find(x=>x.id===concept.dataset.id);if(item)show(item);return}
    if(e.target.closest('[data-close]'))close();
  });
  overlay.addEventListener('keydown',e=>{if(e.key==='Tab'){const els=[...panel.querySelectorAll('button:not([disabled]),a[href]')];const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
  search.addEventListener('input',()=>{query=search.value.trim().toLowerCase();render()});sort.addEventListener('change',render);
  const mobileToggle=document.getElementById('mobile-filters-toggle');mobileToggle?.addEventListener('click',()=>{const open=mobileToggle.getAttribute('aria-expanded')!=='true';mobileToggle.setAttribute('aria-expanded',String(open));mobile.hidden=!open});
  render();
})();
