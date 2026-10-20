/* A bounded, skippable branded entrance; it never waits indefinitely for assets. */
export function initializeIntro() {
 'use strict';
 const intro=document.getElementById('brandIntro');if(!intro)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const started=performance.now(),previousOverflow=document.body.style.overflow;
 const surfaces=[...document.querySelectorAll('main,.site-nav')].map(el=>({el,inert:el.inert}));
 document.body.style.overflow='hidden';surfaces.forEach(({el})=>{el.inert=true;});
 let finished=false,ready=false,raf=0,timer=0;
 function finish(){
  if(finished)return;finished=true;cancelAnimationFrame(raf);clearTimeout(timer);
  intro.style.setProperty('--load','1');intro.classList.add('is-leaving');document.body.classList.add('intro-reveal');
  document.body.style.overflow=previousOverflow;surfaces.forEach(({el,inert})=>{el.inert=inert;});
  const hadFocus=intro.contains(document.activeElement);
  setTimeout(()=>{intro.remove();document.body.classList.remove('intro-reveal');if(hadFocus)document.querySelector('.site-nav a,main a,main button')?.focus({preventScroll:true});},reduced?0:1500);
 }
 function tick(now){
  if(finished)return;const elapsed=now-started;
  intro.style.setProperty('--load',String(Math.min(.9,.06+elapsed/2200*.84)));
  if((ready&&elapsed>=(reduced?0:2100))||elapsed>=3300){finish();return;}
  raf=requestAnimationFrame(tick);
 }
 const image=document.getElementById('heroProduct');
 const imageReady=!image?Promise.resolve():image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});
 Promise.allSettled([document.fonts?.ready||Promise.resolve(),imageReady]).then(()=>{ready=true;});
 document.getElementById('introSkip').addEventListener('click',finish);
 intro.addEventListener('keydown',event=>{if(event.key==='Escape')finish();});
 timer=setTimeout(finish,3500);raf=requestAnimationFrame(tick);
}
