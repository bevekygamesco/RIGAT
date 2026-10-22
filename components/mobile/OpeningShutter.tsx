"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];
const TL: Point = [253, 329], TR: Point = [1021, 237];
const BL: Point = [253, 1092], BR: Point = [1021, 1180];
const point = (u: number, v: number): Point => [
  TL[0] * (1-u)*(1-v) + TR[0]*u*(1-v) + BL[0]*(1-u)*v + BR[0]*u*v,
  TL[1] * (1-u)*(1-v) + TR[1]*u*(1-v) + BL[1]*(1-u)*v + BR[1]*u*v,
];

export function OpeningShutter() {
  const canvas=useRef<HTMLCanvasElement>(null);
  const runway=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const media=matchMedia("(max-width: 760px)");
    if(!media.matches||!canvas.current||!runway.current)return;
    const element=canvas.current, root=runway.current, ctx=element.getContext("2d");
    if(!ctx)return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const image=new Image();image.decoding="async";
    let ready=false,disposed=false,raf=0,last=0,current=0,target=0;
    function paint(){
      if(!ready||!ctx)return;
      ctx.setTransform(element.width/1254,0,0,element.height/1254,0,0);
      ctx.clearRect(0,0,1254,1254);ctx.drawImage(image,0,0,1254,1254);
      if(current<.001)return;
      ctx.save();ctx.beginPath();ctx.moveTo(...TL);ctx.lineTo(...TR);ctx.lineTo(...BR);ctx.lineTo(...BL);ctx.closePath();ctx.clip();
      const backing=ctx.createLinearGradient(253,220,1021,1180);
      backing.addColorStop(0,"#14283e");backing.addColorStop(.65,"#34516b");backing.addColorStop(1,"#68839b");
      ctx.fillStyle=backing;ctx.fillRect(250,230,780,960);
      // One perspective-aligned affine lift keeps the original slat spacing.
      const opening=Math.min(.94,current*.94);
      const bottomLeft=point(0,1-opening),bottomRight=point(1,1-opening);
      ctx.save();ctx.beginPath();ctx.moveTo(...TL);ctx.lineTo(...TR);ctx.lineTo(...bottomRight);ctx.lineTo(...bottomLeft);ctx.closePath();ctx.clip();
      const leftTravel=BL[1]-TL[1],rightTravel=BR[1]-TR[1];
      const shear=-opening*(rightTravel-leftTravel)/(TR[0]-TL[0]);
      const offset=-opening*leftTravel-shear*TL[0];
      ctx.transform(1,shear,0,1,0,offset);ctx.drawImage(image,0,0);ctx.restore();
      const left=point(0,1-opening),right=point(1,1-opening);
      ctx.strokeStyle="#253b50";ctx.lineWidth=9;ctx.shadowColor="#00192f66";ctx.shadowBlur=15;ctx.shadowOffsetY=7;
      ctx.beginPath();ctx.moveTo(...left);ctx.lineTo(...right);ctx.stroke();ctx.restore();
    }
    function tick(now: number){
      raf=0;if(disposed)return;
      const dt=Math.min(40,last?now-last:16);last=now;
      current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/100));
      if(Math.abs(current-target)<.001)current=target;
      paint();root.style.setProperty("--shutter-open",String(current));
      const label=root.querySelector("[data-opening-state]");
      if(label)label.textContent=current>.9?"OUVERTURE RÉVÉLÉE":current>.05?"LE MOUVEMENT PREND FORME":"FAITES DÉFILER POUR OUVRIR";
      if(current!==target)raf=requestAnimationFrame(tick);
    }
    function update(){
      const top=root.getBoundingClientRect().top+scrollY;
      const travel=Math.max(1,root.offsetHeight-(root.firstElementChild as HTMLElement).offsetHeight);
      target=Math.max(0,Math.min(1,(scrollY-top+76)/travel));
      if(!raf)raf=requestAnimationFrame(tick);
    }
    function resize(){const width=element.clientWidth;if(!width)return;const size=Math.round(width*Math.min(devicePixelRatio||1,2));element.width=element.height=size;paint();update();}
    image.onload=()=>{if(disposed)return;ready=true;element.dataset.ready="true";resize();};
    image.src="/assets/rigat-banner-product.png";
    const observer=new ResizeObserver(resize);observer.observe(element);
    addEventListener("scroll",update,{passive:true});addEventListener("resize",resize,{passive:true});
    update();
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();removeEventListener("scroll",update);removeEventListener("resize",resize);};
  },[]);
  return <div className="m-opening-runway" ref={runway}><div className="m-opening-sticky">
    <div className="m-hero-product">
      <svg className="m-product-form" viewBox="0 0 400 380" aria-hidden="true"><defs><linearGradient id="mobileAzure" x2="1" y2="1"><stop stopColor="#eaf3ff"/><stop offset="1" stopColor="#92c0ff"/></linearGradient></defs><path d="M42 89C-20 28 63-3 145 29L349 86Q397 101 370 163L305 320Q286 365 236 343L42 260Q9 246 25 206Z" fill="url(#mobileAzure)"/><path d="M53 69C116 14 328 85 374 181M36 90C100 35 312 106 358 202" fill="none" stroke="#8cb5fb" strokeWidth=".8"/></svg>
      <img className="m-opening-fallback" src="/assets/rigat-banner-product.png" width="1254" height="1254" fetchPriority="high" alt="Rideau métallique RIGAT en acier galvanisé"/>
      <canvas ref={canvas} className="m-opening-canvas" role="img" aria-label="Le tablier du rideau métallique se relève progressivement quand vous faites défiler la page"/>
      <span className="m-product-tag"><i/>ACIER GALVANISÉ <b>SUR MESURE</b></span>
    </div>
    <div className="m-opening-cue"><span data-opening-state="">FAITES DÉFILER POUR OUVRIR</span><span>↓</span></div>
  </div></div>;
}
