import { createMobileStoryStore } from "./mobile-story-store";

const FRAMES = [22, 66, 118, 164, 198, 280];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { n = clamp(n); return n*n*(3-2*n); };
const stores = new Map<string, ReturnType<typeof createMobileStoryStore>>();

type Options = {
  canvas: HTMLCanvasElement; section: HTMLElement; stage: HTMLElement;
  onChapter: (index: number) => void; onReady: () => void; onEnhanced: (value: boolean) => void;
};
export function startMobileStory({canvas, section, stage, onChapter, onReady, onEnhanced}: Options) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return {select: (_index: number) => {}, status: () => ({total:141,downloaded:0,complete:false,preloading:false}), stop: () => {}, dispose: () => {}};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const key = reduced.matches ? "reduced" : "motion";
  let saved = stores.get(key);
  if (!saved) { saved = createMobileStoryStore({count:141,mobile:true,reduced:reduced.matches}); stores.set(key,saved); }
  const store = saved;
  const decoded = new Map<number, HTMLImageElement>(), pending = new Set<number>(), retry = new Map<number, number>();
  let disposed=false, enhanced=false, warmed=false, active=0, frame=0, raf=0, drawFrame=-1;
  let lastImage: HTMLImageElement | undefined, animation: {from:number;to:number;start:number;duration:number;chapter:number}|null=null;
  let previousY=scrollY, previousTop=0, until=0, wheelTotal=0, lastWheel=0, wheelGestureTaken=false;
  let touch: {x:number;y:number;used:boolean}|null=null;
  let locked=false, lockedY=0, bypassUntil=0;
  let savedBody: {position:string;top:string;left:string;right:string;width:string;overflow:string}|null=null;
  let savedRootOverflow="",savedBehavior="";
  function lockPage() {
    if(locked||!enhanced)return;
    align();lockedY=scrollY;
    const body=document.body,root=document.documentElement;
    savedBody={position:body.style.position,top:body.style.top,left:body.style.left,right:body.style.right,width:body.style.width,overflow:body.style.overflow};
    savedRootOverflow=root.style.overflow;savedBehavior=root.style.scrollBehavior;
    const width=root.clientWidth;
    locked=true;section.dataset.locked="true";
    root.style.scrollBehavior="auto";root.style.overflow="hidden";
    body.style.position="fixed";body.style.top=`${-lockedY}px`;body.style.left="0";body.style.right="auto";body.style.width=`${width}px`;body.style.overflow="hidden";
  }
  function unlockPage(bypass=false) {
    if(!locked)return;
    locked=false;section.dataset.locked="false";
    const root=document.documentElement;
    if(savedBody)Object.assign(document.body.style,savedBody);
    root.style.overflow=savedRootOverflow;
    window.scrollTo({top:lockedY,behavior:"instant"});
    root.style.scrollBehavior=savedBehavior;
    previousY=lockedY;previousTop=top();
    if(bypass)bypassUntil=performance.now()+1200;
  }
  function navigation(event: MouseEvent) {
    if(locked&&event.target instanceof Element&&event.target.closest("a[href]")) {
      animation=null;unlockPage(true);wake();
    }
  }
  const top = () => section.getBoundingClientRect().top+scrollY-76;
  const atPin = () => enhanced && (locked || Math.abs(scrollY-top())<4);
  function wake() { if (!raf && !disposed) raf=requestAnimationFrame(tick); }
  function request(original: number) {
    const index=Math.max(0,Math.min(140,Math.round(original/2)));
    if (decoded.has(index)||pending.has(index)||pending.size>=3||(retry.get(index)||0)>performance.now()||disposed) return;
    pending.add(index);
    void store.get(index,Math.abs(index-frame/2)).then(async(blob: Blob) => {
      const url=URL.createObjectURL(blob);
      try {
        const image=new Image(); image.decoding="async"; image.src=url; await image.decode();
        if (disposed) return;
        decoded.set(index,image);
        const farthest=[...decoded.keys()].sort((a,b)=>Math.abs(b-frame/2)-Math.abs(a-frame/2));
        while(decoded.size>10) decoded.delete(farthest.shift()!);
        onReady();
      } finally { URL.revokeObjectURL(url); }
    }).catch(()=>retry.set(index,performance.now()+5000)).finally(()=>{pending.delete(index);wake();});
  }
  function paint() {
    const wanted=Math.round(frame/2), image=decoded.get(wanted)||lastImage;
    request(frame);
    if (image&&(drawFrame!==wanted||image!==lastImage)) {
      ctx!.clearRect(0,0,canvas.width,canvas.height);
      const crop=ease((frame-230)/50), ratio=image.naturalWidth/960;
      const sx=287*crop*ratio,sy=70*crop*ratio,sw=(960-550*crop)*ratio,sh=(640-132*crop)*ratio;
      const fit=Math.min(canvas.width/sw,canvas.height/sh)*.98,w=sw*fit,h=sh*fit;
      ctx!.drawImage(image,sx,sy,sw,sh,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
      lastImage=image; drawFrame=decoded.has(wanted)?wanted:-1;
    }
    const direction=animation && animation.to<frame ? -1 : 1;
    if(animation) {request(frame+direction*2);request(frame+direction*4);}
    const focus=ease((frame-30)/12)*(1-ease((frame-61)/12));
    stage.dataset.focus=String(focus>.1); stage.dataset.playing=String(!!animation);
    stage.style.setProperty("--mobile-story-progress",String(active/5));
    stage.style.setProperty("--mobile-focus",String(focus));
  }
  function finish(index: number) {active=index;onChapter(index);section.dataset.chapter=String(index);}
  function tick(now: number) {
    raf=0; if(disposed)return;
    if(animation) {
      const p=clamp((now-animation.start)/animation.duration);
      frame=animation.from+(animation.to-animation.from)*ease(p);
      if(p===1) {const index=animation.chapter; animation=null;finish(index);until=now+350;}
    }
    paint(); if(animation)wake();
  }
  function play(index: number) {
    index=Math.max(0,Math.min(5,index));
    if(reduced.matches||!enhanced) {animation=null;frame=FRAMES[index];finish(index);wake();return;}
    animation={from:frame,to:FRAMES[index],start:performance.now(),duration:Math.max(850,Math.min(1500,Math.abs(FRAMES[index]-frame)*20)),chapter:index};
    // The destination text appears when the model finishes its chapter.
    request(FRAMES[index]);wake();
  }
  function warm() {if(!warmed){warmed=true;store.preloadAll();}}
  function align() {if(locked)return;window.scrollTo({top:Math.max(0,top()),behavior:"instant"});previousY=scrollY;}
  function enter(direction: number) {
    section.dataset.started="true";
    warm();lockPage();
    if(direction>0) {finish(0);play(0);} else {animation=null;frame=280;finish(5);wake();until=performance.now()+250;}
  }
  function canConsume(direction: number) {
    if(!atPin())return false;
    // Release at either boundary so visitors can leave the sequence in both directions.
    if(!animation&&performance.now()>=until&&((direction>0&&active===5)||(direction<0&&active===0))) {
      if(direction<0)section.dataset.started="false";
      unlockPage(true);return false;
    }
    return true;
  }
  function step(direction: number) {
    if(animation||performance.now()<until)return;
    if(direction>0&&active<5)play(active+1);
    if(direction<0&&active>0)play(active-1);
  }
  function skipTarget(target: EventTarget|null) {
    return target instanceof Element && !!target.closest("button,a,input,textarea,select,[contenteditable],dialog[open]");
  }
  function wheel(event: WheelEvent) {
    if(!enhanced||event.ctrlKey||event.metaKey||skipTarget(event.target)||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1),dir=Math.sign(delta);
    if(!dir)return;
    if(!locked&&performance.now()>=bypassUntil&&scrollY<top()&&scrollY+delta>=top()) {
      event.preventDefault();enter(1);lastWheel=performance.now();wheelGestureTaken=true;return;
    }
    const now=performance.now(),idle=now-lastWheel;lastWheel=now;
    if(idle>220){wheelTotal=0;wheelGestureTaken=false;}
    if(wheelGestureTaken&&atPin()){event.preventDefault();return;}
    if(!canConsume(dir))return;
    event.preventDefault();
    // Momentum belongs to the same gesture, even if a trackpad keeps emitting events.
    if(animation||now<until){wheelTotal=0;wheelGestureTaken=true;return;}
    wheelTotal+=delta;
    if(Math.abs(wheelTotal)>=42){step(Math.sign(wheelTotal));wheelTotal=0;wheelGestureTaken=true;until=now+1700;}
  }
  function touchStart(event: TouchEvent) {
    if(event.touches.length!==1||skipTarget(event.target)){touch=null;return;}
    touch={x:event.touches[0].clientX,y:event.touches[0].clientY,used:false};
  }
  function touchMove(event: TouchEvent) {
    if(!touch||event.touches.length!==1||!enhanced)return;
    const dy=touch.y-event.touches[0].clientY,dx=touch.x-event.touches[0].clientX;
    if(Math.abs(dx)>Math.abs(dy)||Math.abs(dy)<8)return;
    const dir=Math.sign(dy);
    if(touch.used&&atPin()){event.preventDefault();return;}
    const wasLocked=locked;
    if(!canConsume(dir)) {
      if(wasLocked&&!locked){event.preventDefault();window.scrollBy({top:dir*Math.max(60,Math.abs(dy)),behavior:"instant"});touch.used=true;}
      return;
    }
    event.preventDefault();
    if(Math.abs(dy)>40&&!touch.used){touch.used=true;step(dir);}
  }
  function touchEnd(){touch=null;}
  function keyboard(event: KeyboardEvent) {
    if(!atPin()||skipTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
    const dir=["ArrowDown","PageDown"," "].includes(event.key)?(event.shiftKey?-1:1):["ArrowUp","PageUp"].includes(event.key)?-1:0;
    if(dir&&canConsume(dir)){event.preventDefault();if(!event.repeat)step(dir);}
  }
  function previewEntrance() {
    if(!enhanced||locked||section.dataset.started!=="false")return;
    const distance=section.getBoundingClientRect().top;
    if(distance<76)return;
    // Reveal the original opening frames while the section enters the viewport.
    // Keep normal page scrolling until the existing chapter pin is reached.
    const progress=ease((innerHeight*.95-distance)/(innerHeight*.45));
    frame=FRAMES[0]*progress;
    section.style.setProperty("--mobile-entrance",String(progress));
    wake();
  }
  function scroll() {
    if(locked)return;
    const y=scrollY,t=top();
    previewEntrance();
    if(performance.now()<bypassUntil){previousY=y;return;}
    if(enhanced && !animation) {
      // Capture only a nearby crossing, so navigation/scrollbar jumps can bypass the story.
      if(previousY<t-3&&y>=t&&y<t+innerHeight*.55)enter(1);
      else if(previousY>t+3&&y<=t&&y>t-innerHeight*.55)enter(-1);
    }

    previousY=scrollY;previousTop=t;
    if(!enhanced&&section.getBoundingClientRect().top<innerHeight+500)warm();
  }
  function resize() {
    const pinned=locked||(enhanced&&Math.abs(scrollY-previousTop)<5);
    enhanced=innerHeight>=600&&!reduced.matches;
    section.dataset.enhanced=String(enhanced);section.dataset.stepPlayer="true";onEnhanced(enhanced);
    const width=canvas.clientWidth;
    if(width){const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*2/3*dpr);drawFrame=-1;}
    if(!enhanced)unlockPage(true);
    if(locked){const drift=section.getBoundingClientRect().top-76;lockedY+=drift;document.body.style.top=`${-lockedY}px`;}
    else if(pinned&&enhanced)align();
    previousTop=locked?lockedY:top();previousY=locked?lockedY:scrollY;previewEntrance();wake();
  }
  function select(index: number) {
    index=Math.max(0,Math.min(5,index));section.dataset.started="true";warm();
    if(enhanced){lockPage();play(index);}else{frame=FRAMES[index];finish(index);wake();section.scrollIntoView({behavior:reduced.matches?"instant":"smooth"});}
  }
  const near=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))warm();},{rootMargin:"300px"});near.observe(section);
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  addEventListener("scroll",scroll,{passive:true});addEventListener("resize",resize,{passive:true});
  addEventListener("wheel",wheel,{passive:false});addEventListener("touchstart",touchStart,{passive:true});
  addEventListener("touchmove",touchMove,{passive:false});addEventListener("touchend",touchEnd,{passive:true});addEventListener("touchcancel",touchEnd,{passive:true});
  addEventListener("click",navigation,true);
  addEventListener("keydown",keyboard);reduced.addEventListener("change",resize);
  section.dataset.started="false";resize();request(0);
  return {select,status:store.status,stop:()=>{animation=null;unlockPage(true);wake();},dispose:()=>{
    unlockPage(true);
    disposed=true;cancelAnimationFrame(raf);observer.disconnect();near.disconnect();decoded.clear();
    removeEventListener("scroll",scroll);removeEventListener("resize",resize);removeEventListener("wheel",wheel);
    removeEventListener("touchstart",touchStart);removeEventListener("touchmove",touchMove);removeEventListener("touchend",touchEnd);removeEventListener("touchcancel",touchEnd);
    removeEventListener("click",navigation,true);
    removeEventListener("keydown",keyboard);reduced.removeEventListener("change",resize);
  }};
}
