/* The Modern Barber — illustrative booking interaction. No network requests. */
(()=>{
  const header=document.querySelector('.site-header');
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.getElementById('main-nav');
  toggle.addEventListener('click',()=>{
    const open=header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');
  }));
  const overlay=document.getElementById('booking-dialog');
  const panel=overlay.querySelector('.booking-panel');
  const form=document.getElementById('booking-form');
  const result=document.getElementById('booking-result');
  const date=document.getElementById('day');
  const today=new Date();
  date.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  let prevFocus=null;
  const open=()=>{
    prevFocus=document.activeElement;overlay.hidden=false;document.body.classList.add('booking-open');
    result.hidden=true;form.hidden=false;panel.focus();
  };
  const close=()=>{
    overlay.hidden=true;document.body.classList.remove('booking-open');
    if(prevFocus?.isConnected)prevFocus.focus();
  };
  document.querySelectorAll('[data-open-booking]').forEach(button=>button.addEventListener('click',open));
  overlay.querySelectorAll('[data-close-booking]').forEach(node=>node.addEventListener('click',close));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!overlay.hidden)close();
    if(event.key!=='Tab'||overlay.hidden)return;
    const controls=[...panel.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(x=>!x.closest('[hidden]'));
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const service=document.getElementById('service').value;
    const time=document.getElementById('time').value;
    const dateLabel=new Date(date.value+'T12:00:00').toLocaleDateString('en-MY',{day:'numeric',month:'long',year:'numeric'});
    const heading=document.createElement('h3');heading.textContent='Your booking preview';
    const info=document.createElement('p');info.textContent=`${service} · ${dateLabel} at ${time}.`;
    const reminder=document.createElement('p');reminder.textContent='Illustrative only — no appointment was reserved and no data was sent.';
    result.replaceChildren(heading,info,reminder);
    result.hidden=false;form.hidden=true;
  });
})();
