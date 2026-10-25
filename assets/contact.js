/* MyBizDigital contact form: one static Netlify form on contact.html, reused for the popup. */
(()=>{
  'use strict';
  const ALLOWED = new Set(['nfc','website','software','support','general']);
  const MAX_FILE = 3 * 1024 * 1024;
  const MAX_FILES_COMBINED = 6 * 1024 * 1024;
  const ACCEPTED = {
    logo_file:['jpg','jpeg','png','webp'],
    brief_file:['pdf','docx','jpg','jpeg','png','webp']
  };
  const canUseDialog = typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function';
  let dialogPromise;
  let lastTrigger = null;

  function updateConditions(form){
    const type=form.elements.enquiry_type.value;
    form.querySelectorAll('[data-enquiry-for]').forEach(group=>{
      const enabled=group.dataset.enquiryFor.split(/\s+/).includes(type);
      group.hidden=!enabled;
      group.querySelectorAll('input,select,textarea').forEach(input=>{input.disabled=!enabled});
    });
  }
  function error(form,message){
    const box=form.querySelector('.mbd-contact-error');
    box.textContent=message;
    box.hidden=!message;
    if(message){box.scrollIntoView({block:'nearest',behavior:'instant'});box.focus?.()}
  }
  function validateFiles(form){
    let size=0;
    for(const name of Object.keys(ACCEPTED)){
      const file=form.elements[name]?.files?.[0];
      if(!file)continue;
      size+=file.size;
      const extension=file.name.split('.').pop()?.toLowerCase() || '';
      if(!ACCEPTED[name].includes(extension))return 'Unsupported file type. Please upload PDF, DOCX, JPG, PNG or WebP files as appropriate.';
      if(file.size>MAX_FILE)return 'Each attachment must be 3 MB or smaller.';
    }
    if(size>MAX_FILES_COMBINED)return 'The total attachments must be 6 MB or smaller.';
    return '';
  }
  function createId(){
    if(window.crypto?.randomUUID)return window.crypto.randomUUID();
    return 'mbd-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  }
  function finish(form){
    const confirmation=document.createElement('section');
    confirmation.className='mbd-contact-success';
    confirmation.setAttribute('role','status');
    confirmation.setAttribute('tabindex','-1');
    confirmation.innerHTML='<h3>Successfully Submitted</h3><p>Thank you for choosing MyBizDigital.my.<br>Your enquiry has been received. Our team will review your requirements and respond as soon as possible.<br>An acknowledgement email will be sent separately to the email address provided.</p>';
    form.replaceWith(confirmation);
    confirmation.focus();
  }
  function initForm(form){
    if(form.dataset.mbdReady)return;
    form.dataset.mbdReady='true';
    const input=form.elements.enquiry_type;
    input?.addEventListener('change',()=>updateConditions(form));
    updateConditions(form);
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const issue=validateFiles(form);
      if(issue){error(form,issue);return}
      error(form,'');
      const btn=form.querySelector('[type="submit"]');
      const original=btn.textContent;
      btn.disabled=true;
      btn.textContent='Submitting…';
      try{
        if(!form.elements.client_submission_id.value)form.elements.client_submission_id.value=createId();
        // Multipart FormData is required for Netlify Forms attachments. Browser sets the boundary.
        const response=await fetch('/',{method:'POST',body:new FormData(form),headers:{Accept:'text/html'}});
        if(!response.ok)throw new Error(`Form service returned ${response.status}`);
        finish(form);
      }catch(e){
        error(form,'Your enquiry could not be submitted. Please try again or email support@mybizdigital.my directly.');
        btn.disabled=false;
        btn.textContent=original;
      }
    });
  }
  function chooseType(form,type){
    if(!ALLOWED.has(type))return;
    const input=form.elements.enquiry_type;
    if(input){input.value=type;updateConditions(form)}
  }
  async function getDialog(){
    if(!canUseDialog)throw new Error('Dialog not available');
    if(dialogPromise)return dialogPromise;
    dialogPromise=(async()=>{
      const response=await fetch('contact.html',{headers:{Accept:'text/html'}});
      if(!response.ok)throw new Error('Contact page unavailable');
      const html=await response.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      const original=doc.querySelector('#mbd-contact-form');
      if(!original)throw new Error('Contact form template unavailable');
      const dialog=document.createElement('dialog');
      dialog.className='mbd-contact-dialog';
      dialog.setAttribute('aria-labelledby','mbd-dialog-title');
      const inner=document.createElement('div');
      inner.className='mbd-contact-dialog-inner';
      inner.innerHTML='<div class="mbd-contact-dialog-top"><h2 class="mbd-contact-dialog-heading" id="mbd-dialog-title">Tell us about your project.</h2><button type="button" class="mbd-contact-dialog-close" aria-label="Close enquiry form">×</button></div><p class="mbd-contact-dialog-sub">Share your requirements with MyBizDigital. Fields marked * are required.</p>';
      const form=document.importNode(original,true);
      form.id='mbd-contact-form-modal';
      inner.append(form);
      dialog.append(inner);
      document.body.append(dialog);
      dialog.querySelector('.mbd-contact-dialog-close').addEventListener('click',()=>dialog.close());
      dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
      dialog.addEventListener('close',()=>lastTrigger?.focus());
      initForm(form);
      return dialog;
    })().catch(e=>{dialogPromise=null;throw e});
    return dialogPromise;
  }
  function start(){
    const dedicated=document.querySelector('form[name="mybiz-enquiry"]');
    if(dedicated){
      initForm(dedicated);
      const requested=new URLSearchParams(location.search).get('enquiry');
      chooseType(dedicated,requested);
    }
    document.addEventListener('click',async e=>{
      const anchor=e.target.closest?.('a[data-mbd-enquiry]');
      if(!anchor || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)return;
      if(!canUseDialog)return; // Accessible fallback is the dedicated page.
      e.preventDefault();
      lastTrigger=anchor;
      try{
        const dialog=await getDialog();
        const old=dialog.querySelector('.mbd-contact-success');
        const active=old ? (dialog.remove(),dialogPromise=null,await getDialog()) : dialog;
        chooseType(active.querySelector('form'),anchor.dataset.mbdEnquiry);
        active.showModal();
        active.querySelector('form [name="full_name"]')?.focus();
      }catch(error){location.href=anchor.href}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
