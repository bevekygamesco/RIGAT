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
  let touch: {id:number;x:number;y:number;used:boolean;axis:"x"|"y"|null}|null=null;
  let wheelTotal=0,lastWheel=0,wheelTaken=false;
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
      if(p===1) {const index=animation.chapter; animation=null;finish(index);}
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
  function skipTarget(target: EventTarget|null) {
    return target instanceof Element && !!target.closest("button,a,input,textarea,select,[contenteditable],dialog[open]");
  }
  function select(index: number) {
    // Each new deliberate gesture may reverse or retarget the current segment.
    section.dataset.started="true";warm();play(index);
  }
  function step(direction:number) {
    const destination=animation?.chapter??active;
    select(Math.max(0,Math.min(5,destination+direction)));
  }
  function pointerDown(event:PointerEvent) {
    if(skipTarget(event.target)||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
    touch={id:event.pointerId,x:event.clientX,y:event.clientY,used:false,axis:null};
    // Touch keeps native vertical scrolling; mouse drags can leave the stage.
    if(event.pointerType==='mouse')stage.setPointerCapture(event.pointerId);
  }
  function pointerMove(event:PointerEvent) {
    if(!touch||touch.id!==event.pointerId||touch.used)return;
    const dx=event.clientX-touch.x,dy=event.clientY-touch.y;
    if(!touch.axis&&Math.max(Math.abs(dx),Math.abs(dy))>12)touch.axis=Math.abs(dx)>Math.abs(dy)*1.25?"x":"y";
    if(touch.axis==='x'&&Math.abs(dx)>=44){touch.used=true;step(-Math.sign(dx));}
  }
  function pointerEnd(){touch=null;}
  function wheel(event:WheelEvent) {
    if(event.ctrlKey||event.metaKey||skipTarget(event.target)||Math.abs(event.deltaX)<=Math.abs(event.deltaY)*1.25)return;
    event.preventDefault();
    const now=performance.now();if(now-lastWheel>220){wheelTotal=0;wheelTaken=false;}lastWheel=now;
    if(wheelTaken)return;
    wheelTotal+=event.deltaX;
    if(Math.abs(wheelTotal)>=65){step(Math.sign(wheelTotal));wheelTaken=true;}
  }
  function keyboard(event:KeyboardEvent) {
    if(skipTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
    const direction=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;
    if(direction){event.preventDefault();if(!event.repeat)step(direction);}
  }
  function previewEntrance() {
    if(section.dataset.started!=="false")return;
    const distance=section.getBoundingClientRect().top;
    const progress=ease((innerHeight*.95-distance)/(innerHeight*.45));
    frame=FRAMES[0]*progress;
    section.style.setProperty("--mobile-entrance",String(progress));wake();
  }
  function resize() {
    enhanced=true;
    section.dataset.enhanced="true";section.dataset.stepPlayer="true";onEnhanced(true);
    const width=canvas.clientWidth;
    if(width){const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*2/3*dpr);drawFrame=-1;}
    previewEntrance();wake();
  }
  const scroll=()=>previewEntrance();
  const near=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))warm();},{rootMargin:"300px"});near.observe(section);
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  addEventListener("scroll",scroll,{passive:true});addEventListener("resize",resize,{passive:true});
  stage.addEventListener("pointerdown",pointerDown);stage.addEventListener("pointermove",pointerMove);
  stage.addEventListener("pointerup",pointerEnd);stage.addEventListener("pointercancel",pointerEnd);
  stage.addEventListener("lostpointercapture",pointerEnd);stage.addEventListener("wheel",wheel,{passive:false});
  stage.addEventListener("keydown",keyboard);reduced.addEventListener("change",resize);
  section.dataset.started="false";resize();request(0);
  return {select,status:store.status,stop:()=>{animation=null;wake();},dispose:()=>{
    disposed=true;cancelAnimationFrame(raf);observer.disconnect();near.disconnect();decoded.clear();
    removeEventListener("scroll",scroll);removeEventListener("resize",resize);
    stage.removeEventListener("pointerdown",pointerDown);stage.removeEventListener("pointermove",pointerMove);
    stage.removeEventListener("pointerup",pointerEnd);stage.removeEventListener("pointercancel",pointerEnd);
    stage.removeEventListener("lostpointercapture",pointerEnd);stage.removeEventListener("wheel",wheel);
    stage.removeEventListener("keydown",keyboard);reduced.removeEventListener("change",resize);
  }};
}
