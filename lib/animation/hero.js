export function initializeHero() {
'use strict';
const root=document.getElementById('accueil'),banner=document.getElementById('heroBanner'),product=document.getElementById('heroProduct'),visual=document.getElementById('heroVisual');
if(!root||!banner||!product)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=innerWidth<=760;
const story=document.getElementById('mechanisme'),mechanics=document.getElementById('mechanicalLayer');
function handoff(){return reduced&&!story.classList.contains('motion-enabled')?root.offsetHeight:Math.max(1,(typeof innerHeight==='number'?innerHeight:900)*.9);}
window.RigatStory=Object.freeze({handoff,getExit:()=>exit});
const controls=[...document.querySelectorAll('[data-hero-view]')],pause=document.getElementById('heroMotion'),label=document.getElementById('heroViewLabel'),counter=document.getElementById('heroViewCounter'),transition=banner.querySelector('.hero-transition-label');
const fading=[...document.querySelectorAll('[data-hero-fade]')];
const images=new Map(),inFlight=new Map(),dead=new Set(),names=['RIDEAU MÉTALLIQUE','MOTORISATION CENTRALE','LES FINITIONS DU COFFRE'],views=[null,'/assets/stills/motor.webp','/assets/stills/coffre.webp'];
product.draggable=false;root.dataset.view='0';
let drag=null;
let view=0,stopped=reduced,visible=true,raf=0,lastPaint=0,orbitTime=4000,lastAngle=11,epoch=0,px=0,py=0,tx=0,ty=0,exitTarget=0,exit=0,baseUrl='';
const clamp=x=>Math.min(1,Math.max(0,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const url=i=>`/assets/${mobile?'hero-mobile':'hero'}/hero_${String(i).padStart(3,'0')}.webp?v=8`;
function request(i){if(images.has(i)||inFlight.has(i)||dead.has(i)||i<0||i>23)return;const image=new Image();image.decoding='async';inFlight.set(i,image);image.onload=async()=>{try{await image.decode();}catch{}inFlight.delete(i);images.set(i,image);const keys=[...images.keys()].sort((a,b)=>Math.abs(b-lastAngle)-Math.abs(a-lastAngle));while(images.size>10)images.delete(keys.shift());wake();};image.onerror=()=>{inFlight.delete(i);dead.add(i);};image.src=url(i);}
function frame(angle){lastAngle=angle;banner.style.setProperty('--hero-float',((angle/23-.5)*8).toFixed(3)+'px');const next='/assets/rigat-banner-product.png?v=14';if(baseUrl!==next){product.src=next;baseUrl=next;}}
function updatePause(){banner.classList.toggle('hero-motion-paused',stopped);pause.setAttribute('aria-pressed',String(stopped));pause.setAttribute('aria-label',stopped?'Activer le mouvement du produit':'Mettre le mouvement du produit en pause');pause.textContent=stopped?'▷':'Ⅱ';}
function choose(index){index=0;endDrag();view=index;pause.disabled=index!==0;epoch++;const token=epoch;root.dataset.view=String(index);controls.forEach(b=>{const selected=Number(b.dataset.heroView)===index;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});label.textContent=names[index];counter.textContent=String(index+1).padStart(2,'0')+' / 03';if(!index){product.classList.remove('switching');baseUrl='';frame(lastAngle);wake();return;}product.classList.add('switching');const image=new Image();image.decoding='async';image.onload=async()=>{try{await image.decode();}catch{}if(token!==epoch)return;product.src=views[index];baseUrl=views[index];product.classList.remove('switching');};image.onerror=()=>{if(token===epoch)product.classList.remove('switching');};image.src=views[index];}
function applyHandoff(e){
 const m=smooth((e-.60)/.40),gone=e>=.60;
 document.getElementById('stage').classList.toggle('story-active',gone);
 document.getElementById('experienceSurface').style.setProperty('--open',smooth(e).toFixed(4));
 banner.style.setProperty('--hero-exit',e.toFixed(4));story.style.setProperty('--hero-exit',e.toFixed(4));banner.style.setProperty('--hero-cut','0%');
 root.style.opacity=(1-smooth((e-.76)/.16)).toFixed(4);root.style.pointerEvents=gone?'none':'auto';root.inert=gone;root.setAttribute('aria-hidden',String(gone));
 mechanics.style.opacity=m.toFixed(4);mechanics.style.pointerEvents=m>.2?'auto':'none';mechanics.inert=m<.1;mechanics.setAttribute('aria-hidden',String(m<.1));
}
function scroll(){const r=story.getBoundingClientRect(),h=typeof innerHeight==='number'?innerHeight:900,raw=Math.max(0,-r.top);const staticMode=reduced&&!story.classList.contains('motion-enabled');exitTarget=staticMode?0:clamp(raw/handoff());visible=r.bottom>0&&r.top<h&&raw<handoff()+h;
 if(staticMode){root.style.opacity='1';root.inert=false;mechanics.style.opacity='1';mechanics.style.pointerEvents='auto';mechanics.inert=false;mechanics.setAttribute('aria-hidden','false');}else if(!visible){exit=exitTarget;applyHandoff(exit);}wake();}
function tick(now){raf=0;if(!visible)return;const dt=Math.min(40,lastPaint?now-lastPaint:16);lastPaint=now;const k=1-Math.exp(-dt/110);px+=(tx-px)*k;py+=(ty-py)*k;exit+=(exitTarget-exit)*k;if(Math.abs(exit-exitTarget)<.001)exit=exitTarget;banner.style.setProperty('--hero-x',px.toFixed(3));banner.style.setProperty('--hero-y',py.toFixed(3));if(!(reduced&&!story.classList.contains('motion-enabled')))applyHandoff(exit);fading.forEach(el=>{const hide=exit>Number(el.dataset.heroFade);if(el.inert!==hide){el.inert=hide;el.setAttribute('aria-hidden',String(hide));}});if(transition){const t=smooth((exit-.26)/.18)*(1-smooth((exit-.66)/.18));transition.style.opacity=t.toFixed(4);transition.style.transform=`translate3d(0,${(1-t)*22}px,0)`;}
 if(!view&&exit<.60){if(!stopped)orbitTime+=dt;const angle=stopped?lastAngle:(.5-.5*Math.cos(orbitTime/16000*Math.PI*2))*23;frame(angle);}
 if((!stopped&&!view&&exit<.60)||Math.abs(exit-exitTarget)>.001||Math.abs(px-tx)>.002||Math.abs(py-ty)>.002)wake();}
function wake(){if(!raf&&visible)raf=requestAnimationFrame(tick);}
controls.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.heroView)));pause.addEventListener('click',()=>{if(stopped)orbitTime=Math.acos(1-2*lastAngle/23)/(Math.PI*2)*16000;stopped=!stopped;updatePause();wake();});
visual.addEventListener('pointerdown',e=>{if(view||reduced||e.button>0)return;drag={x:e.clientX,y:e.clientY,angle:lastAngle,active:false};});
visual.addEventListener('pointermove',e=>{if(!drag)return;if(e.buttons===0){endDrag();return;}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.active){if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy))return;drag.active=true;stopped=true;updatePause();visual.setPointerCapture?.(e.pointerId);visual.classList.add('dragging');}frame(clamp((drag.angle+dx/Math.max(300,innerWidth)*40)/23)*23);wake();});
function endDrag(){drag=null;visual.classList.remove('dragging');}
visual.addEventListener('pointerleave',()=>{if(drag&&!drag.active)endDrag();});visual.addEventListener('pointerup',endDrag);visual.addEventListener('pointercancel',endDrag);visual.addEventListener('lostpointercapture',endDrag);
if(matchMedia('(pointer:fine)').matches&&!reduced){banner.addEventListener('pointermove',e=>{const r=banner.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;wake();});banner.addEventListener('pointerleave',()=>{tx=ty=0;wake();});}
window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){visible=false;}else{scroll();}});
updatePause();scroll();frame(11);
window.BMNHeroOrbit=Object.freeze({choose,pause:()=>{stopped=true;updatePause();wake();},getStatus:()=>({view,paused:stopped,cached:images.size,failed:dead.size,angle:lastAngle,pointerX:px,pointerY:py})});
}
