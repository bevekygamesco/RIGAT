"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFrameStore } from "@/lib/animation/frame-store";
import { site } from "@/lib/site";
import { OpeningShutter } from "./OpeningShutter";

const CHAPTERS = [
  { frame: 22, kicker: "LA FORCE VIENT DE L’INTÉRIEUR", title: "Une mécanique.", accent: "Un ensemble.", text: "Avant de protéger votre lieu, chaque élément trouve sa place. Découvrez ce qui donne sa force à votre rideau métallique.", details: ["Axe de transmission", "Bobines d’enroulement", "Moteur central"], label: "L’origine" },
  { frame: 66, kicker: "CHAQUE PIÈCE A SON RÔLE", title: "La précision.", accent: "À chaque liaison.", text: "L’axe transmet le mouvement. Les bobines accompagnent l’enroulement. Les flasques maintiennent le mécanisme en place.", details: ["Transmission", "Enroulement", "Maintien"], label: "Les composants" },
  { frame: 118, kicker: "AU CŒUR DU MOUVEMENT", title: "La force vient", accent: "du cœur.", text: "Le moteur central entraîne le rideau. Le choix de la motorisation dépend des dimensions et de la fréquence d’utilisation.", details: ["Moteur central", "Mouvement maîtrisé"], label: "La motorisation" },
  { frame: 164, kicker: "LA TECHNIQUE RENCONTRE LA FORME", title: "Tout trouve", accent: "sa place.", text: "Le mécanisme rejoint le coffre. Un ensemble pensé pour s’intégrer à votre ouverture et à votre façade.", details: ["Coffre intégré", "Coulisses latérales"], label: "L’intégration" },
  { frame: 198, kicker: "LE SAVOIR-FAIRE SE VOIT DE PRÈS", title: "Le détail fait", accent: "la différence.", text: "Des plis nets, des fixations discrètes, des finitions cohérentes. La qualité se lit aussi dans ce que l’on remarque moins.", details: ["Plis du métal", "Fixations", "Finitions"], label: "Les finitions" },
  { frame: 280, kicker: "DU MÉCANISME À VOTRE FERMETURE", title: "Votre protection", accent: "prend forme.", text: "Du premier composant au rideau complet. Une fermeture sur mesure pour votre habitat, votre commerce ou votre activité.", details: ["Acier galvanisé", "Fabrication sur mesure"], label: "Le résultat" },
];
// Each title stays on screen for roughly one normal phone swipe.
const STORY_VH = 570;
const stores = new Map<string, ReturnType<typeof createFrameStore>>();
type MobileAPI = { select: (index: number) => void; getPreloadStatus: () => { total: number; downloaded: number; complete: boolean; preloading: boolean }; stop: () => void };
type MobileWindow = Window & { RigatMobile?: MobileAPI };
const clamp=(v: number)=>Math.max(0,Math.min(1,v));
const ease=(v: number)=>{v=clamp(v);return v*v*(3-2*v);};

function Arrow(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}

export function MobileExperience(){
  const canvas=useRef<HTMLCanvasElement>(null), story=useRef<HTMLElement>(null), stage=useRef<HTMLDivElement>(null);
  const select=useRef<(index: number)=>void>(()=>{});
  const [active,setActive]=useState(0),[ready,setReady]=useState(false),[enhanced,setEnhanced]=useState(false);
  useEffect(()=>{
    const media=matchMedia("(max-width: 760px)");
    let dispose: (()=>void)|undefined;
    function activate(){
      dispose?.();dispose=undefined;
      if(!media.matches||!canvas.current||!story.current||!stage.current)return;
      const element=canvas.current,section=story.current,pinned=stage.current,ctx=element.getContext("2d");
      if(!ctx)return;
      const motion=matchMedia("(prefers-reduced-motion: reduce)");
      const key=motion.matches?"reduced":"motion";
      let store=stores.get(key);
      if(!store){store=createFrameStore({count:281,mobile:true,reduced:motion.matches});stores.set(key,store);}
      const frameStore=store,decoded=new Map<number,HTMLImageElement>(),pending=new Set<number>(),failedUntil=new Map<number,number>();
      let disposed=false,raf=0,current=0,target=0,last=0,chapter=-1,lastImage:HTMLImageElement|undefined,lastDrawn=-1;
      setEnhanced(true);setReady(false);
      section.dataset.enhanced="true";
      const frameAt=(progress: number)=>{
        const position=clamp(progress)*6,index=Math.min(5,Math.floor(position)),local=position-index;
        return CHAPTERS[index].frame+((CHAPTERS[index+1]?.frame??280)-CHAPTERS[index].frame)*ease((local-.38)/.62);
      };
      function request(index: number){
        index=Math.max(0,Math.min(280,Math.round(index)));
        if(disposed||decoded.has(index)||pending.has(index)||pending.size>=3||(failedUntil.get(index)||0)>performance.now())return;
        pending.add(index);
        void frameStore.get(index,Math.abs(index-frameAt(current))).then(async(blob: Blob)=>{
          const url=URL.createObjectURL(blob);
          try{
            const image=new Image();image.decoding="async";image.src=url;await image.decode();if(disposed)return;
            decoded.set(index,image);const focus=frameAt(current);
            const keys=[...decoded.keys()].sort((a,b)=>Math.abs(b-focus)-Math.abs(a-focus));
            while(decoded.size>16)decoded.delete(keys.shift()!);
            setReady(true);
          }finally{URL.revokeObjectURL(url);}
        }).catch(()=>{failedUntil.set(index,performance.now()+5000);}).finally(()=>{pending.delete(index);if(!disposed)wake();});
      }
      function paint(){
        const wanted=Math.round(frameAt(current));request(wanted);
        const image=decoded.get(wanted)||lastImage;
        if(image&&(lastDrawn!==wanted||lastImage!==image)){
          ctx!.clearRect(0,0,element.width,element.height);ctx!.imageSmoothingEnabled=true;ctx!.imageSmoothingQuality="high";
          // Reframe the final shutter so its transparent margins do not make
          // the actual product too small on a narrow phone.
          const crop=ease((wanted-230)/50), sx=287*crop, sy=70*crop;
          const sw=960+(410-960)*crop,sh=640+(508-640)*crop;
          const fit=Math.min(element.width/sw,element.height/sh)*.98,w=sw*fit,h=sh*fit;
          ctx!.drawImage(image,sx,sy,sw,sh,(element.width-w)/2,(element.height-h)/2,w,h);
          lastImage=image;lastDrawn=decoded.has(wanted)?wanted:-1;
        }
        const direction=target>=current?1:-1;
        request(wanted+direction);request(wanted+direction*3);
        const index=Math.min(5,Math.floor(clamp(current)*6));
        if(index!==chapter){chapter=index;setActive(index);}
        const focus=ease((wanted-30)/12)*(1-ease((wanted-61)/12));
        pinned.style.setProperty("--mobile-focus",String(focus));
        pinned.dataset.focus=focus>.1?"true":"false";
        pinned.style.setProperty("--mobile-story-progress",String(current));
      }
      function tick(now: number){
        raf=0;if(disposed)return;
        const dt=Math.min(40,last?now-last:16);last=now;
        current=motion.matches?target:current+(target-current)*(1-Math.exp(-dt/90));
        if(Math.abs(current-target)<.00005)current=target;
        paint();if(current!==target)wake();
      }
      function wake(){if(!raf)raf=requestAnimationFrame(tick);}
      function geometry(){return{top:section.getBoundingClientRect().top+scrollY-76,distance:Math.max(1,section.offsetHeight-pinned.offsetHeight)};}
      function update(){const g=geometry();target=clamp((scrollY-g.top)/g.distance);wake();}
      function resize(){const pin=innerHeight>=560;section.dataset.enhanced=String(pin);setEnhanced(pin);const w=element.clientWidth;if(w){const dpr=Math.min(devicePixelRatio||1,2);element.width=Math.round(w*dpr);element.height=Math.round(w*2/3*dpr);lastDrawn=-1;}update();}
      function jump(index: number){const g=geometry();index=Math.max(0,Math.min(5,index));window.scrollTo({top:g.top+g.distance*(index/6+.007),behavior:motion.matches?"instant":"smooth"});}
      select.current=jump;
      const browser=window as MobileWindow,api={select:jump,getPreloadStatus:frameStore.status,stop:()=>{}};
      browser.RigatMobile=api;
      const observer=new ResizeObserver(resize);observer.observe(element);observer.observe(pinned);
      addEventListener("scroll",update,{passive:true});addEventListener("resize",resize,{passive:true});
      resize();request(22);frameStore.preloadAll();
      dispose=()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();removeEventListener("scroll",update);removeEventListener("resize",resize);if(browser.RigatMobile===api)delete browser.RigatMobile;};
    }
    activate();media.addEventListener("change",activate);
    return()=>{dispose?.();media.removeEventListener("change",activate);};
  },[]);

  return <div className="rigat-mobile">
    <section className="m-hero m-hero-scroll" aria-labelledby="mobileHeroTitle">
      <p className="m-eyebrow"><span/>MARSEILLE · DEPUIS 1956</p>
      <h1 id="mobileHeroTitle">Votre fermeture.<br/><em>Notre savoir-faire.</em></h1>
      <p className="m-introduction">Fabricant de rideaux métalliques sur mesure à Marseille. Pour votre commerce, votre habitat et votre activité.</p>
      <OpeningShutter/>
      <div className="m-hero-actions"><button type="button" data-contact="">Parlons de votre projet <Arrow/></button><a href={site.phoneHref} aria-label={`Appeler RIGAT au ${site.phone}`}>↗ <span>Appeler</span></a></div>
      <div className="m-trust"><span>Depuis <strong>1956</strong></span><span>Fabrication <strong>française</strong></span><span>Votre projet <strong>sur mesure</strong></span></div>
      <a className="m-discover" href="#mobile-mechanisme">Du produit à son mécanisme <span>↓</span></a>
    </section>

    <section className="m-scroll-story" id="mobile-mechanisme" ref={story} data-enhanced={enhanced} style={{"--mobile-story-vh":`${STORY_VH}svh`} as CSSProperties} aria-label="Du mécanisme à votre rideau métallique">
      <div className="m-story-stage" ref={stage}>
        <div className="m-story-heading"><span><i/>À L’INTÉRIEUR DU SAVOIR-FAIRE</span><span>{String(active+1).padStart(2,"0")} / 06</span></div>
        <div className="m-story-visual">
          <div className="m-story-image">
            {!ready&&<img className="m-story-poster" src="/assets/stills/opening.webp" width="960" height="640" alt="Mécanisme du rideau métallique RIGAT"/>}
            <canvas ref={canvas} role="img" aria-label={`Vue du mécanisme : ${CHAPTERS[active].label}`}/>
          </div>
          <div className="m-story-part-labels" aria-hidden="true"><span>01 · BOBINES</span><span>02 · AXE</span><span>03 · MOTEUR</span></div>
        </div>
        <div className="m-story-copy">
          {CHAPTERS.map((item,index)=><article key={item.label} data-active={active===index} aria-hidden={enhanced&&active!==index}>
            <p className="m-story-kicker">{item.kicker}</p>
            <h2>{item.title}<br/><em>{item.accent}</em></h2>
            <p className="m-story-description">{item.text}</p>
            <ul>{item.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
            {index===5&&<button type="button" className="m-story-quote" data-contact="">Parlons de votre projet <Arrow/></button>}
          </article>)}
        </div>
        <div className="m-story-navigation"><div className="m-story-dots" aria-label={`Étape ${active+1} sur 6`}>{CHAPTERS.map((item,index)=><span key={item.label} data-active={active===index}/>)}</div>
          {active<5?<button type="button" onClick={()=>select.current(active+1)}>Étape suivante <span>↓</span></button>:<a href="#savoir-faire">Notre savoir-faire <span>↓</span></a>}
        </div>
      </div>
    </section>
  </div>;
}
