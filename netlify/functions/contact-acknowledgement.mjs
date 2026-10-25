/* Event handler runs only for Netlify-verified form submissions. The key stays server-side. */
const FROM = 'MyBizDigital <notifications@notify.mybizdigital.my>';
const REPLY_TO = 'support@mybizdigital.my';
const SUBJECT = "We've Received Your Enquiry | MyBizDigital";
function clean(value,max=200){return typeof value === 'string' ? value.trim().slice(0,max) : ''}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function validEmail(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)&&s.length<=254}
export default {
  async formSubmitted(event){
    const d = event?.data || {};
    if(d.source_context !== 'mybizdigital_contact_v1')return;
    const email = clean(d.email,254);
    const name = clean(d.full_name,100);
    if(!name || !validEmail(email))return;
    const apiKey = Netlify.env.get('RESEND_API_KEY');
    if(!apiKey){console.error('Contact acknowledgement: RESEND_API_KEY missing');return}
    const message = `Hello ${name},\n\nThank you for choosing MyBizDigital.my.\n\nWe have successfully received your enquiry. Our team will review your requirements and get back to you as soon as possible.\n\nIf you have additional information or questions, reply to this email or contact us at ${REPLY_TO}.\n\nWe look forward to assisting you.\n\nBest regards,\nMYBIZ DIGITAL SOLUTIONS\nMyBizDigital.my\n${REPLY_TO}\n\nThis automatic acknowledgement is not an order confirmation or quotation.`;
    const html = `<div style="font:15px/1.7 Inter,Arial,sans-serif;color:#171717;max-width:620px;margin:auto"><p>Hello ${escapeHTML(name)},</p><p>Thank you for choosing <strong>MyBizDigital.my</strong>.</p><p>We have successfully received your enquiry. Our team will review your requirements and get back to you as soon as possible.</p><p>If you have additional information or questions, please reply to this email or contact <a href="mailto:${REPLY_TO}">${REPLY_TO}</a>.</p><p>We look forward to assisting you.</p><p>Best regards,<br><strong>MYBIZ DIGITAL SOLUTIONS</strong><br>MyBizDigital.my</p><p style="color:#777;font-size:12px">This is an automatic acknowledgement, not an order confirmation or quotation.</p></div>`;
    const headers = {'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'};
    const id = clean(d.client_submission_id,150);
    if(/^[A-Za-z0-9._-]{10,150}$/.test(id))headers['Idempotency-Key']='mbd-contact-'+id;
    const response = await fetch('https://api.resend.com/emails',{
      method:'POST',headers,
      body:JSON.stringify({from:FROM,to:[email],reply_to:[REPLY_TO],subject:SUBJECT,text:message,html})
    });
    if(!response.ok){
      console.error('Contact acknowledgement: Resend rejected request; HTTP '+response.status);
      throw new Error('Resend acknowledgement failed');
    }
    console.info('Contact acknowledgement accepted by Resend');
  }
};
