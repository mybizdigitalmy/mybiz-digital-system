/* Shared main-site opening typography. Keeps the approved homepage hero script intact. */
(()=>{
  'use strict';
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  function prepare(element, start = 180, step = 14){
    if(!element || element.dataset.mbdRiseReady || element.children.length) return null;
    const text = (element.textContent || '').trim();
    if(!text) return null;
    element.dataset.mbdRiseReady = 'true';
    element.setAttribute('aria-label', text);
    const fragment = document.createDocumentFragment();
    let count = 0;
    const words = text.split(/\s+/);
    words.forEach((word,index)=>{
      const wordSpan=document.createElement('span');
      wordSpan.className='mbd-entrance-word';
      wordSpan.setAttribute('aria-hidden','true');
      for(const char of word){
        const wrap=document.createElement('span');
        wrap.className='mbd-entrance-wrap';
        const face=document.createElement('span');
        face.className='mbd-entrance-char';
        face.style.transitionDelay = `${start + Math.min(count*step, 840)}ms`;
        face.textContent=char;
        wrap.appendChild(face);
        wordSpan.appendChild(wrap);
        count++;
      }
      fragment.appendChild(wordSpan);
      if(index<words.length-1){
        const space=document.createElement('span');
        space.className='mbd-entrance-space';
        space.setAttribute('aria-hidden','true');
        space.textContent='\u00a0';
        fragment.appendChild(space);
      }
    });
    element.replaceChildren(fragment);
    element.classList.add('mbd-page-entrance','mbd-rise-ready');
    return element;
  }
  const intro = [
    ['.library-hero h1',200,20],
    ['.library-hero .hero-desc',520,6],
    ['.about-hero h1',200,20],
    ['.about-hero-copy',520,6],
    ['.mbd-contact-main > .mbd-contact-container > h1',200,20],
    ['.mbd-contact-main > .mbd-contact-container > .mbd-contact-lead',520,6],
  ];
  const introEls = intro.map(([selector,delay,step])=>prepare(document.querySelector(selector),delay,step)).filter(Boolean);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    introEls.forEach(el=>el.classList.add('mbd-rise-visible'));
  }));

  /* Apply to footer text when the footer enters the viewport, not to its
     static black background, its existing character-roll links or buttons. */
  const footer=document.getElementById('mbd-site-footer');
  if(!footer) return;
  const selectors = [
    ['.mbd-f-title',80,17],
    ['.mbd-f-subtitle',240,6],
    ['.mbd-f-col-title',220,17],
    ['.mbd-f-contact-label',200,15],
  ];
  let footerEls=[];
  selectors.forEach(([selector,delay,step])=>{
    footer.querySelectorAll(selector).forEach(el=>{
      const result=prepare(el,delay,step);
      if(result)footerEls.push(result);
    });
  });
  const revealFooter=()=>{
    requestAnimationFrame(()=>footerEls.forEach(el=>el.classList.add('mbd-rise-visible')));
  };
  if(typeof IntersectionObserver==='undefined'){
    revealFooter();
  }else{
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){
        revealFooter();observer.disconnect();
      }
    },{threshold:0.05,rootMargin:'0px 0px -30px 0px'});
    observer.observe(footer);
  }
})();
