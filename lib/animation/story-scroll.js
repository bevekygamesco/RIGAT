/* Intro cue, then continuous smooth scrolling through the product story. */
export function initializeScroll() {
 'use strict';
 const story=document.getElementById('mechanisme'),stage=document.getElementById('stage');
 if(!story||!stage)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),clock=()=>performance.now();
 const speedFactor=()=>Math.max(.1,Number(window.RigatSettings?.scrollSpeed)||1);
 let raf=0,animation=null,flow=null,lastWritten=scrollY,lastWheel=-Infinity,unlockAt=0,touch=null,writing=false,warmBand=-1;
 function geometry(){
  const top=story.getBoundingClientRect().top+scrollY,stickyTop=parseFloat(getComputedStyle(stage).top)||0;
  const start=Math.max(0,top-stickyTop),handoff=window.RigatStory?.handoff()||innerHeight*.9;
  const distance=Math.max(1,story.offsetHeight-stage.offsetHeight-handoff);
  const gate=top+handoff*.50,end=top+handoff+distance;
  const seconds=Math.max(1,Number(window.RigatSettings?.scrollSeconds)||20);
  const normalSpeed=Math.max(1,(end-gate)/seconds*speedFactor());
  // Ease into a local speed limit BEFORE the compressed final enlargement.
  // Keep its short scroll distance while allowing its intermediate poses to read.
  const hold=clamp(Number(window.RigatSettings?.zoomExtraTravel??.04)||0,0,.25);
  const tail=distance*(1-hold)*clamp(Number(window.RigatSettings?.finalZoomTravel)||.07,.02,.25);
  const duration=Math.max(300,Number(window.RigatSettings?.finalZoomDurationMs)||1200);
  const finalSpeed=Math.min(normalSpeed,tail/(duration/1000));
  const lead=Math.max(1,innerHeight*.4),t=clamp((scrollY-(end-tail-lead))/lead,0,1),blend=t*t*(3-2*t);
  return {start,gate,end,speed:normalSpeed+(finalSpeed-normalSpeed)*blend};
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;animation=flow=null;lastWritten=scrollY;unlockAt=clock()+180;}
 function nativeSurface(element,delta){
  if(!element?.closest)return false;
  if(element.closest('dialog,input,textarea,select,[contenteditable="true"],.mobile-nav,[data-native-scroll]'))return true;
  const scene=element.closest('.scene');
  return !!(scene&&scene.scrollHeight>scene.clientHeight+1&&(delta>0?scene.scrollTop+scene.clientHeight<scene.scrollHeight-1:scene.scrollTop>0));
 }
 function write(top){writing=true;try{window.scrollTo({top,behavior:'instant'});lastWritten=scrollY;}finally{writing=false;}}
 function wake(){if(!raf)raf=requestAnimationFrame(frame);}
 function warmAhead(direction){
  const p=window.BMNHero?.getStatus?.().progress||0,band=Math.floor(p*10),key=band*2+(direction>0?1:0);
  if(key===warmBand)return;warmBand=key;
  const to=clamp(p+direction*.18,0,1);window.BMNHero?.preloadRange?.(p,to).catch(()=>{});
 }
 function frame(now){
  raf=0;const g=geometry();
  if(animation){
   const dt=animation.last===null?0:clamp(now-animation.last,0,40);animation.last=now;animation.elapsed+=dt;
   const duration=Math.max(100,Number(window.RigatSettings?.introDurationMs)||700)/speedFactor();
   const t=clamp(animation.elapsed/duration,0,1),ease=t*t*(3-2*t),destination=animation.toGate?g.gate:g.start;
   write(animation.from+(destination-animation.from)*ease);
   if(t<1)wake();else{animation=null;unlockAt=now+200;}
  }else if(flow){
   const dt=flow.last===null?16.67:clamp(now-flow.last,0,34);flow.last=now;
   flow.target=clamp(flow.target,g.gate,g.end);
   const softness=Math.max(16,Number(window.RigatSettings?.scrollSmoothingMs)||110);
   const gap=flow.target-flow.position,step=clamp(gap*(1-Math.exp(-dt/softness)),-g.speed*dt/1000,g.speed*dt/1000);
   flow.position=clamp(flow.position+step,g.gate,g.end);
   if(Math.abs(flow.target-flow.position)<.3)flow.position=flow.target;
   write(flow.position);
   if(Math.abs(flow.target-flow.position)>.1)wake();else flow=null;
  }
 }
 function playIntro(toGate){
  flow=null;animation={from:scrollY,toGate,elapsed:0,last:null};
  window.BMNHero?.preloadRange?.(0,.18).catch(()=>{});wake();
 }
 function addFlow(delta,g){
  delta*=speedFactor();
  const sign=Math.sign(delta);
  if(!flow||flow.direction!==sign)flow={position:scrollY,target:scrollY,direction:sign,last:null};
  const buffer=Math.min(g.speed*.55,innerHeight*.6);
  flow.target=clamp(clamp(flow.target+delta,flow.position-buffer,flow.position+buffer),g.gate,g.end);
  warmAhead(sign);wake();
 }
 function consume(delta,event,fresh=true){
  if(!Number.isFinite(delta)||!delta||!event.cancelable||preference.matches||nativeSurface(event.target,delta))return false;
  const g=geometry(),y=scrollY;
  if(y<g.start-1||y>g.end+1)return false;
  if(!animation&&delta>0&&y>=g.end-1)return false;
  if(!animation&&delta<0&&y<=g.start+1)return false;
  event.preventDefault();
  if(animation)return true;
  // Beyond the title screen, gestures continuously move the page, with no stops
  // at chapters. Input is eased and excess speed is bounded in this region only.
  if(y>g.gate+1||(flow&&y>=g.gate-1)) {addFlow(delta,g);return true;}
  if(!fresh||clock()<unlockAt)return true;
  if(y<g.gate-1)playIntro(delta>0);
  else if(delta>0)addFlow(delta,g);
  else playIntro(false);
  return true;
 }
 addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  const now=clock(),fresh=now-lastWheel>240;lastWheel=now;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  consume(delta,event,fresh);
 },{passive:false});
 addEventListener('touchstart',event=>{touch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY,mode:null}:null;},{passive:true});
 addEventListener('touchmove',event=>{
  if(!touch||event.touches.length!==1)return;
  const point=event.touches[0],dx=touch.x-point.clientX,dy=touch.y-point.clientY;
  if(Math.abs(dy)<Math.abs(dx))return;
  if(touch.mode==='intro'){consume(dy||1,event,false);return;}
  if(!touch.mode&&Math.abs(dy)<22)return;
  const used=consume(dy,event,touch.mode!=='flow');
  if(used){touch.mode=animation?'intro':'flow';touch.x=point.clientX;touch.y=point.clientY;}
 },{passive:false});
 addEventListener('touchend',()=>{touch=null;},{passive:true});addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.target?.closest?.('a,button,input,textarea,select,summary,[contenteditable="true"]'))return;
  let delta=0;
  if(event.key==='ArrowDown')delta=90;else if(event.key==='ArrowUp')delta=-90;
  else if(event.key==='PageDown'||event.key===' ')delta=innerHeight*.8*(event.shiftKey?-1:1);else if(event.key==='PageUp')delta=-innerHeight*.8;
  else if(event.key==='Home'||event.key==='End'||event.key==='Escape'){stop();return;}
  if(delta)consume(delta,event,!event.repeat);
 });
 document.addEventListener('click',event=>{if(event.target?.closest?.('a,button,summary'))stop();},true);
 addEventListener('scroll',()=>{if(!writing&&(animation||flow)&&Math.abs(scrollY-lastWritten)>2)stop();},{passive:true});
 addEventListener('resize',stop,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(animation)animation.last=null;if(flow)flow.last=null;});
 preference.addEventListener?.('change',stop);
 window.RigatScrollPacing=Object.freeze({stop,isAnimating:()=>!!(animation||flow),getStatus:()=>{
  const g=geometry();return {...g,mode:scrollY<g.gate-1?'intro':'continuous',active:!!(animation||flow),queuedPixels:flow?flow.target-flow.position:0};
 }});
}
