/* MyBizDigital — customer authentication. No OAuth secrets in browser files. */
import { signup, login, logout, getUser, oauthLogin, handleAuthCallback,
  requestPasswordRecovery, updateUser, onAuthChange, getSettings } from '@netlify/identity';

const D = document;
const $ = (s, root = D) => root.querySelector(s);
const all = (s, root = D) => [...root.querySelectorAll(s)];
const make = (tag, cls, value) => { const n = D.createElement(tag); if(cls) n.className=cls; if(value!==undefined) n.textContent=value; return n; };
let currentUser=null, dialog, content, status, mode='login', busy=false, googleAllowed=true;
const titles={login:'Log in to MyBizDigital',signup:'Create your account',recover:'Reset your password',reset:'Set a new password',account:'My Account'};
function say(msg='',kind='info'){status.hidden=!msg;status.textContent=msg;status.dataset.kind=kind;}
function setBusy(on){busy=on;all('button,input',dialog).forEach(n=>n.disabled=on);}
function action(text,cls,fn){const b=make('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
function field(label,name,type,autocomplete){
  const wrap=make('label','mbd-auth-field');wrap.append(make('span','',label));
  const input=make('input');input.type=type;input.name=name;input.required=true;input.autocomplete=autocomplete;
  if(type==='password') input.minLength=8;
  if(name==='email') input.maxLength=200;
  if(name==='name') input.maxLength=100;
  wrap.append(input);return wrap;
}
function createDialog(){
  dialog=make('dialog','mbd-auth-dialog');dialog.setAttribute('aria-labelledby','mbd-auth-title');
  const box=make('div','mbd-auth-box');
  const close=action('×','mbd-auth-close',()=>dialog.close());close.setAttribute('aria-label','Close account window');
  const kicker=make('p','mbd-auth-kicker','MYBIZDIGITAL ACCOUNT');
  const title=make('h2','');title.id='mbd-auth-title';
  content=make('div','mbd-auth-content');
  status=make('p','mbd-auth-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
  box.append(close,kicker,title,content,status);dialog.append(box);D.body.append(dialog);
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
function open(which,message=''){
  if(!dialog)createDialog();mode=which;busy=false;$('#mbd-auth-title',dialog).textContent=titles[which];
  content.replaceChildren();say(message);
  if(which==='account'){
    content.append(make('p','mbd-auth-profile',currentUser?.name||currentUser?.userMetadata?.full_name||'Customer'),
      make('p','mbd-auth-address',currentUser?.email||''),
      make('p','mbd-auth-note','Order history will be available after secure checkout launches.'));
    content.append(action('Log out','mbd-auth-primary',async()=>{
      if(busy)return;setBusy(true);
      try{await logout();currentUser=null;updateHeader();dialog.close();}
      catch{say('Unable to log out. Please try again.','error');}finally{setBusy(false)}
    }));
  } else {
    if(which==='login'||which==='signup'){
      const google=action('Continue with Google','mbd-auth-google',async()=>{
        if(busy)return;setBusy(true);
        try{await oauthLogin('google');}catch{say('Google sign-in is unavailable. Please try again.','error');setBusy(false)}
      });
      google.prepend(make('span','mbd-auth-g','G'));
      if(!googleAllowed){google.disabled=true;google.title='Google sign-in is not enabled';}
      content.append(google,make('p','mbd-auth-divider','or use your email address'));
    }
    const form=make('form','mbd-auth-form');
    if(which==='signup')form.append(field('Full name','name','text','name'));
    if(which!=='reset')form.append(field('Email address','email','email','email'));
    if(which!=='recover')form.append(field(which==='reset'?'New password':'Password','password','password',which==='login'?'current-password':'new-password'));
    if(which==='signup'||which==='reset')form.append(field('Confirm password','confirm','password','new-password'));
    const labels={login:'Log in',signup:'Create account',recover:'Send reset link',reset:'Save new password'};
    const submit=make('button','mbd-auth-primary',labels[which]);submit.type='submit';form.append(submit);
    form.addEventListener('submit',handleForm);content.append(form);
    const links=make('div','mbd-auth-links');
    if(which==='login'){
      links.append(action('Forgot password?','mbd-auth-text-button',()=>open('recover')),
        action('Create account','mbd-auth-text-button',()=>open('signup')));
    } else if(which!=='reset')links.append(action('Already registered? Log in','mbd-auth-text-button',()=>open('login')));
    content.append(links);
    if(which==='signup'){
      const note=make('p','mbd-auth-note');note.append('By registering, you agree to our ');
      const terms=make('a','','Terms & Conditions');terms.href='terms-and-conditions.html';
      const privacy=make('a','','Privacy Policy');privacy.href='privacy-policy.html';
      note.append(terms,' and acknowledge our ',privacy,'.');content.append(note);
    }
  }
  if(!dialog.open)dialog.showModal();$('input',dialog)?.focus();
}
async function handleForm(event){
  event.preventDefault();if(busy)return;
  const values=new FormData(event.currentTarget),email=String(values.get('email')||'').trim(),password=String(values.get('password')||'');
  if((mode==='signup'||mode==='reset') && password!==String(values.get('confirm')||'')){say('Passwords do not match.','error');return}
  setBusy(true);say();
  const request=mode;
  try{
    if(request==='login'){
      currentUser=await login(email,password);updateHeader();dialog.close();
    }else if(request==='signup'){
      await signup(email,password,{full_name:String(values.get('name')||'').trim()});
      open('login','Check your inbox and confirm your email address before logging in.');
    }else if(request==='recover'){
      await requestPasswordRecovery(email);
      open('login','If this email is registered, a secure password reset link will be sent.');
    }else if(request==='reset'){
      currentUser=await updateUser({password});updateHeader();open('account','Your password was updated.');
    }
  }catch{
    const msg={login:'Unable to sign in. Please check your password and email confirmation.',signup:'Account registration was unsuccessful. Please try again or contact support.',recover:'Unable to send the recovery email. Please try again.',reset:'Unable to update your password. Request a new recovery link.'};
    say(msg[request]||'Something went wrong. Please try again.','error');
  }finally{setBusy(false)}
}
function updateHeader(){
  D.body.classList.toggle('mbd-auth-signed-in',!!currentUser);
  all('.mbd-auth-account-nav').forEach(b=>b.hidden=!currentUser);
}
function initHeader(){
  for(const header of all('.site-header')){
    const right=$('.nav-right',header);
    if(right){
      const button=action('My Account','mbd-auth-account-nav',()=>open('account'));
      button.hidden=true;
      const signUp=$('.nav-signup',right);if(signUp)signUp.after(button);else right.append(button);
    }
    const mobile=$('.mobile-actions',header);
    if(mobile){const button=action('My Account','mbd-auth-account-nav mbd-auth-mobile-account',()=>open('account'));button.hidden=true;mobile.append(button)}
  }
  for(const a of all('a[href="#login"],a[href="#signup"],a[href="index.html#login"],a[href="index.html#signup"]')){
    a.addEventListener('click',event=>{event.preventDefault();open(currentUser?'account':a.hash==='#signup'?'signup':'login');});
  }
}
async function init(){
  initHeader();
  let callback=null;
  try{callback=await handleAuthCallback();}
  catch{
    if(/#(?:access_token|confirmation_token|recovery_token|error)=/.test(location.hash))open('login','Authentication could not be completed. Please request a new link.');
  }
  try{currentUser=await getUser();}catch{currentUser=null;}
  updateHeader();
  onAuthChange((event,user)=>{
    currentUser=user||null;updateHeader();
    if(event==='logout'&&dialog?.open)dialog.close();
  });
  if(callback?.type==='recovery')open('reset');
  else if(callback?.type==='confirmation')open('account','Email confirmation completed.');
  else if(callback?.type==='invite')open('login','For invitation assistance, contact support@mybizdigital.my.');
  else if(location.hash==='#login'||location.hash==='#signup'){
    open(currentUser?'account':location.hash==='#signup'?'signup':'login');
    history.replaceState(null,'',location.pathname+location.search);
  }
  try{
    const settings=await getSettings();
    if(settings?.external && !settings.external.google){
      googleAllowed=false;
      all('.mbd-auth-google').forEach(b=>{b.disabled=true;b.title='Google authentication is unavailable';});
    }
  }catch{/* The registration dialog remains usable without a settings response. */}
}
init();
