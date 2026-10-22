/** Mobile-only native navigation and the existing project-summary dialog. */
export function initializeMobileShell() {
 window.RigatScrollPacing?.stop();window.BMNHero?.stopFilm();window.BMNHeroOrbit?.pause();
 const $=id=>document.getElementById(id), controller=new AbortController();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const on=(element,event,handler)=>element.addEventListener(event,handler,{signal:controller.signal});
 const dialog=$('contactDialog');let returnFocus=null;
function openDialog(){if(dialog.open)return;returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('dialog-open');}
on($('closeDialog'),'click',()=>dialog.close());on(dialog,'close',()=>{document.body.classList.remove('dialog-open');returnFocus?.focus();});on(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
on($('projectForm'),'submit',e=>{e.preventDefault();if(!$('projectForm').reportValidity())return;const name=$('name').value.trim(),city=$('city').value.trim(),need=$('need').value.trim();if(!name||!city||!need)return;$('summaryText').textContent=`Projet de rideau métallique\nNom : ${name}\nVille : ${city}\nBesoin : ${need}`;$('summaryBox').classList.add('show');$('copySummary').textContent='COPIER LE RÉCAPITULATIF';$('summaryBox').scrollIntoView({block:'nearest',behavior:reduced?'auto':'smooth'});});
on($('copySummary'),'click',async()=>{const text=$('summaryText').textContent;try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(text);}else{const area=document.createElement('textarea');area.value=text;dialog.append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('copy');}$('copySummary').textContent='RÉCAPITULATIF COPIÉ ✓';}catch{$('copySummary').textContent='SÉLECTIONNEZ LE TEXTE POUR LE COPIER';}});

 const handleClick=event=>{
  if(innerWidth>760)return;
  const element=event.target.closest?.('a,button');if(!element)return;
  const contact=element.matches('[data-contact]');
  const home=element.matches('[data-home],a[href="#top"],a[href="#accueil"]');
  const chapter=element.matches('[data-jump],[data-mechanism]');
  if(!contact&&!home&&!chapter)return;
  event.preventDefault();event.stopImmediatePropagation();
  // Match shared menu behavior because this capture handler owns mobile routing.
  $('mobileNav').hidden=true;$('mobileMenuToggle').setAttribute('aria-expanded','false');
  $('mobileMenuToggle').setAttribute('aria-label','Ouvrir la navigation');
  if(contact){openDialog();return;}
  window.RigatScrollPacing?.stop();window.BMNHero?.stopFilm();
  const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
  if(home){window.scrollTo({top:0,behavior});return;}
  const index=Number(element.dataset.jump||0);
  if(window.RigatMobile?.select)window.RigatMobile.select(index);
  else $('mobile-mechanisme')?.scrollIntoView({behavior,block:'start'});
 };
 document.addEventListener('click',handleClick,{capture:true,signal:controller.signal});
 return ()=>controller.abort();
}
