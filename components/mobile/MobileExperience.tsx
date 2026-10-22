"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { startMobileStory } from "@/lib/animation/mobile-story-player";
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
const STORY_VH = 100;
type MobileAPI = { select: (index: number) => void; getPreloadStatus: () => { total: number; downloaded: number; complete: boolean; preloading: boolean }; stop: () => void };
type MobileWindow = Window & { RigatMobile?: MobileAPI };
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
      setReady(false);
      const player=startMobileStory({canvas:canvas.current,section:story.current,stage:stage.current,onChapter:setActive,onReady:()=>setReady(true),onEnhanced:setEnhanced});
      select.current=player.select;
      const browser=window as MobileWindow;
      const api={select:player.select,getPreloadStatus:player.status,stop:player.stop};
      browser.RigatMobile=api;
      dispose=()=>{player.dispose();if(browser.RigatMobile===api)delete browser.RigatMobile;};
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

    <section className="m-scroll-story" id="mobile-mechanisme" ref={story} data-started="false" data-enhanced={enhanced} style={{"--mobile-story-vh":`${STORY_VH}svh`} as CSSProperties} aria-label="Du mécanisme à votre rideau métallique">
      <div className="m-story-stage" ref={stage}>
        <div className="m-story-heading"><span><i/>À L’INTÉRIEUR DU SAVOIR-FAIRE</span><span>{String(active+1).padStart(2,"0")} / 06</span></div>
        <div className="m-story-visual">
          <div className="m-story-image">
            {!ready&&<img className="m-story-poster" src="/assets/stills/opening-mobile.webp" width="960" height="640" alt="Mécanisme du rideau métallique RIGAT" loading="lazy" decoding="async"/>}
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
            {index===5&&<div className="m-story-final-actions"><button type="button" className="m-story-quote" data-contact="">Parlons de votre projet <Arrow/></button><a className="story-configurator" href="/configurateur-3d/">Configurateur 3D <Arrow/></a></div>}
          </article>)}
        </div>
        <a className="m-story-skip" href="#savoir-faire">Continuer la page ↓</a>
        <div className="m-story-navigation"><div className="m-story-dots" aria-label={`Étape ${active+1} sur 6`}>{CHAPTERS.map((item,index)=><span key={item.label} data-active={active===index}/>)}</div>
          {active<5?<button type="button" onClick={()=>select.current(active+1)}>Étape suivante <span>↓</span></button>:<a href="#savoir-faire">Notre savoir-faire <span>↓</span></a>}
        </div>
      </div>
    </section>
  </div>;
}
