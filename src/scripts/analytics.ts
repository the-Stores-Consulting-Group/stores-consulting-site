// Josh confirmed the existing Stores Consulting property on 2026-09-09.
export const measurementId = 'G-73E0EDSM19';
export function startAnalytics(win: Window, doc: Document) {
 const hosts=['storesconsulting.com','www.storesconsulting.com','stores-consulting-site-dusky.vercel.app'];
 if(win.self!==win.top || !hosts.includes(win.location.hostname) || /^\/(admin|styleguide)(\/|$)/.test(win.location.pathname))return;
 const w=win as Window & {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void};
 if(w.gtag)return;
 w.dataLayer=w.dataLayer||[];
 w.gtag=function(){w.dataLayer!.push(arguments);};
 const pageLocation=win.location.origin+win.location.pathname;
 const referrer=doc.referrer ? new URL(doc.referrer).origin+new URL(doc.referrer).pathname : '';
 w.gtag('js',new Date());
 w.gtag('config',measurementId,{send_page_view:false,page_location:pageLocation,page_referrer:referrer,allow_google_signals:false,allow_ad_personalization_signals:false});
 w.gtag('event','page_view',{page_location:pageLocation,page_title:doc.title,page_referrer:referrer});
 const tag=doc.createElement('script');tag.async=true;tag.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;doc.head.append(tag);
 const track=(name:string,detail:Record<string,string>={})=>w.gtag!('event',name,{page_location:pageLocation,...detail});
 doc.addEventListener('click',event=>{
  const link=event.target instanceof Element?event.target.closest('a'):null;if(!link)return;
  const href=link.getAttribute('href')||'';
  if(href.startsWith('mailto:'))track('contact_click',{contact_method:'email'});
  else if(href.startsWith('tel:'))track('contact_click',{contact_method:'phone'});
  else {const url=new URL(href,win.location.href);if(url.pathname.endsWith('.pdf'))track('report_download',{file_name:url.pathname.split('/').pop()||'report.pdf'});else if(url.origin===win.location.origin&&url.pathname==='/contact-us/')track('contact_click',{contact_method:'form'});}
 });
 doc.addEventListener('stores:inquiry-success',()=>track('generate_lead',{form_name:'contact'}));
}
if(typeof window!=='undefined')startAnalytics(window,document);
