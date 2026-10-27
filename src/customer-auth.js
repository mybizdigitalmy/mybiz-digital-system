/* MyBizDigital — customer authentication. No OAuth secrets in browser files. */
import { signup, login, logout, getUser, oauthLogin, handleAuthCallback,
  requestPasswordRecovery, updateUser, onAuthChange, getSettings } from '@netlify/identity';

const D = document;
const $ = (s, root = D) => root.querySelector(s);
const all = (s, root = D) => [...root.querySelectorAll(s)];
const make = (tag, cls, value) => { const n = D.createElement(tag); if(cls) n.className=cls; if(value!==undefined) n.textContent=value; return n; };
let currentUser=null, dialog, content, status, mode='login', busy=false, googleAllowed=true;
let accountPageUserId=null;
const titles={login:'Log in to MyBizDigital',signup:'Create your account',recover:'Reset your password',reset:'Set a new password',account:'My Account'};
function say(msg='',kind='info'){if(!status)return;status.hidden=!msg;status.textContent=msg;status.dataset.kind=kind;}
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
      await signOut();
    }));
  } else {
    if(which==='login'||which==='signup'){
      const google=action('Continue with Google','mbd-auth-google',()=>{
        if(busy)return;setBusy(true);say();
        // oauthLogin starts a browser navigation. Some environments report an
        // SDK error after the provider redirect has already been initiated.
        // Check for actual navigation before showing a failure to the customer.
        const startingUrl=location.href;
        let navigationStarted=false;
        const markLeaving=()=>{navigationStarted=true;};
        const markHidden=()=>{if(D.visibilityState==='hidden')navigationStarted=true;};
        window.addEventListener('pagehide',markLeaving,{once:true});
        D.addEventListener('visibilitychange',markHidden);
        let startError=null;
        try{oauthLogin('google');}
        catch(error){startError=error;}
        window.setTimeout(()=>{
          window.removeEventListener('pagehide',markLeaving);
          D.removeEventListener('visibilitychange',markHidden);
          // A Google redirect, provider tab, or completed Identity session is
          // evidence that the start was not a failure; do not show a false alert.
          if(navigationStarted||D.visibilityState==='hidden'||location.href!==startingUrl||currentUser)return;
          if(startError){
            // Log only the public error category; never log tokens or OAuth URLs.
            const category=startError?.name==='MissingIdentityError'?'IDENTITY_CONFIG':'SDK_AUTH_ERROR';
            console.warn('[MyBizDigital] Google OAuth could not navigate:',category);
          }
          say(startError?.name==='MissingIdentityError'
            ? 'Google sign-in is temporarily unavailable. Please try again later.'
            : 'Google sign-in did not open. Please try again.','error');
          setBusy(false);
        },1800);
      });
      // Use Google's published G artwork rather than approximating it with custom SVG paths.
      // The click handler and Netlify Identity OAuth flow above remain unchanged.
      const icon=make('img','mbd-auth-google-logo');
      icon.src='https://developers.google.com/static/identity/images/g-logo.png';
      icon.alt='';icon.setAttribute('aria-hidden','true');
      icon.width=20;icon.decoding='async';icon.referrerPolicy='no-referrer';
      google.prepend(icon);
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
function accountName(user){return String(user?.userMetadata?.full_name||user?.name||'Customer').trim()}
// The browser's Chrome avatar is not shared with websites. Identity may supply
// a Google profile picture; only load it from a Google-hosted HTTPS domain.
function googleProfilePhoto(user){
  const raw=user?.pictureUrl||user?.userMetadata?.avatar_url||user?.userMetadata?.picture;
  if(typeof raw!=='string')return '';
  try{
    const url=new URL(raw);
    if(url.protocol==='https:'&&(url.hostname==='googleusercontent.com'||url.hostname.endsWith('.googleusercontent.com')))return url.href;
  }catch{/* No usable picture was supplied by the identity provider. */}
  return '';
}
function renderAccountAvatar(user,root){
  const avatar=$('.mbd-account-avatar',root);if(!avatar)return;
  const name=accountName(user);
  const parts=name.split(/\s+/).filter(Boolean);
  const initials=(parts.length>1?parts[0][0]+parts[parts.length-1][0]:parts[0]?.slice(0,2)||'MB').toUpperCase();
  const picture=googleProfilePhoto(user);
  if(avatar.dataset.photo===picture&&avatar.dataset.initials===initials)return;
  avatar.dataset.photo=picture;avatar.dataset.initials=initials;
  avatar.textContent=initials;
  if(picture){
    const img=make('img','mbd-account-avatar-photo');
    img.alt='';img.src=picture;img.referrerPolicy='no-referrer';img.decoding='async';
    img.addEventListener('error',()=>{if(avatar.contains(img))avatar.textContent=initials;});
    avatar.replaceChildren(img);
  }
}
async function signOut(){
  if(busy)return;busy=true;
  try{
    await logout();currentUser=null;updateHeader();
    if(dialog?.open)dialog.close();
    if($('#mbd-customer-dashboard'))location.assign('index.html');
  }catch(error){
    if(dialog?.open)say('Unable to log out. Please try again.','error');
    else alert('Unable to log out. Please try again.');
  }finally{busy=false}
}
function closeMenus(except=null){
  all('.mbd-auth-account-wrap').forEach(w=>{
    if(w===except)return;
    const m=$('.mbd-auth-dropdown',w),button=$('.mbd-auth-account-nav',w);
    if(m)m.hidden=true;if(button)button.setAttribute('aria-expanded','false');
  });
}
function accountControl(isMobile){
  const wrap=make('div','mbd-auth-account-wrap'+(isMobile?' mbd-auth-account-mobile':''));wrap.hidden=true;
  const b=action('My Account','mbd-auth-account-nav',()=>{
    const menu=$('.mbd-auth-dropdown',wrap);const shouldOpen=menu.hidden;
    closeMenus();menu.hidden=!shouldOpen;b.setAttribute('aria-expanded',String(shouldOpen));
  });
  b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');
  const menu=make('div','mbd-auth-dropdown');menu.hidden=true;
  menu.setAttribute('aria-label','Account menu');
  const profile=make('a','mbd-auth-menu-link','My Profile');profile.href='my-account.html';
  const security=make('a','mbd-auth-menu-link','Account Security');security.href='my-account.html#security';
  const out=action('Log out','mbd-auth-menu-link mbd-auth-menu-logout',()=>{closeMenus();signOut()});
  menu.append(profile,security,out);wrap.append(b,menu);return wrap;
}
function updateHeader(){
  D.body.classList.toggle('mbd-auth-signed-in',!!currentUser);
  all('.mbd-auth-account-wrap').forEach(w=>{w.hidden=!currentUser;if(!currentUser)closeMenus()});
  renderAccountPage();
}
function initHeader(){
  for(const header of all('.site-header')){
    const right=$('.nav-right',header);
    if(right){const signUp=$('.nav-signup',right),control=accountControl(false);
      if(signUp)signUp.after(control);else right.append(control);
    }
    const mobile=$('.mobile-actions',header);
    if(mobile)mobile.append(accountControl(true));
  }
  for(const a of all('a[href="#login"],a[href="#signup"],a[href="index.html#login"],a[href="index.html#signup"]')){
    a.addEventListener('click',event=>{event.preventDefault();open(currentUser?'account':a.hash==='#signup'?'signup':'login');});
  }
  D.addEventListener('click',event=>{if(!event.target.closest('.mbd-auth-account-wrap'))closeMenus();});
  D.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus();});
}
function showPageMessage(message='',isError=false){
  const box=$('#mbd-account-message');if(!box)return;
  box.textContent=message;box.dataset.kind=isError?'error':'success';box.hidden=!message;
}
function renderAccountPage(){
  const root=$('#mbd-customer-dashboard');if(!root)return;
  const guest=$('.mbd-account-guest',root),member=$('.mbd-account-member',root);
  if(guest)guest.hidden=!!currentUser;
  if(member)member.hidden=!currentUser;
  if(!currentUser){accountPageUserId=null;return}
  const name=accountName(currentUser),email=currentUser.email||'';
  const display=$('#mbd-account-display-name',root),label=$('#mbd-account-email',root);
  if(display)display.textContent=name;if(label)label.textContent=email;
  renderAccountAvatar(currentUser,root);
  const fieldEmail=$('#mbd-profile-email',root);if(fieldEmail)fieldEmail.value=email;
  const nameInput=$('#mbd-profile-name',root),phoneInput=$('#mbd-profile-phone',root);
  if(accountPageUserId!==currentUser.id){
    if(nameInput)nameInput.value=accountName(currentUser)==='Customer'?'':name;
    if(phoneInput)phoneInput.value=String(currentUser.userMetadata?.phone||'');
    accountPageUserId=currentUser.id;
  }
}
function initAccountPage(){
  const root=$('#mbd-customer-dashboard');if(!root)return;
  const loginButton=$('#mbd-account-login',root);
  if(loginButton)loginButton.addEventListener('click',()=>open('login'));
  const form=$('#mbd-profile-form',root);
  if(form)form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||!currentUser)return;
    const name=$('#mbd-profile-name',form).value.trim(),phone=$('#mbd-profile-phone',form).value.trim();
    if(!name){showPageMessage('Please enter your full name.',true);return}
    if(name.length>100||phone.length>30){showPageMessage('Please check the name or telephone number.',true);return}
    const save=$('button[type=submit]',form);busy=true;save.disabled=true;showPageMessage();
    try{
      const user=await updateUser({data:{full_name:name,phone}});
      currentUser=user||await getUser();
      accountPageUserId=null;updateHeader();showPageMessage('Your profile has been saved.');
    }catch{showPageMessage('Unable to save your profile. Please try again.',true)}
    finally{save.disabled=false;busy=false}
  });
  const reset=$('#mbd-account-reset-password',root);
  if(reset)reset.addEventListener('click',async()=>{
    if(busy||!currentUser?.email)return;
    busy=true;reset.disabled=true;showPageMessage();
    try{await requestPasswordRecovery(currentUser.email);
      showPageMessage('If your account uses an email password, check your inbox for a secure reset link. Google sign-in passwords are managed by Google.');
    }catch{showPageMessage('Unable to request a password reset right now.',true)}
    finally{busy=false;reset.disabled=false}
  });
  const out=$('#mbd-account-logout',root);if(out)out.addEventListener('click',signOut);
}
async function init(){
  initHeader();initAccountPage();
  let callback=null;
  try{callback=await handleAuthCallback();}
  catch{
    if(/#(?:access_token|confirmation_token|recovery_token|error)=/.test(location.hash))open('login','Authentication could not be completed. Please request a new link.');
  }
  try{currentUser=await getUser();}catch{currentUser=null;}
  updateHeader();
  // Fragment destinations are initially hidden until the Identity session resolves.
  // Align an account section beneath the fixed navbar after revealing it.
  if(currentUser && $('#mbd-customer-dashboard') && (location.hash==='#profile'||location.hash==='#security')){
    const target=$(location.hash);
    if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}));
  }
  onAuthChange((event,user)=>{
    currentUser=user||null;updateHeader();
    if(currentUser&&dialog?.open&&(mode==='login'||mode==='signup')){
      // A completed Google sign-in can arrive while the original popup is open.
      // Close it instead of leaving an obsolete login form or status visible.
      if(busy)setBusy(false);
      say();dialog.close();
    }
    if(event==='logout'&&dialog?.open)dialog.close();
  });
  if(callback?.type==='recovery')open('reset');
  else if(callback?.type==='confirmation')open(currentUser?'account':'login','Email confirmation completed.');
  else if(callback?.type==='invite')open('login','For invitation assistance, contact support@mybizdigital.my.');
  else if(location.hash==='#login'||location.hash==='#signup'){
    open(currentUser?'account':location.hash==='#signup'?'signup':'login');
    history.replaceState(null,'',location.pathname+location.search);
  }
  try{
    const settings=await getSettings();
    if(settings?.providers && !settings.providers.google){
      googleAllowed=false;
      all('.mbd-auth-google').forEach(b=>{b.disabled=true;b.title='Google authentication is unavailable';});
    }
  }catch{/* The registration dialog remains usable without a settings response. */}
}
init();
