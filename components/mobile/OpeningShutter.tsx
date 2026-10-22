"use client";

import { useEffect, useRef, useState } from "react";

type Point = [number, number];
type Model = { id: string; label: string; material: string; corners: [Point, Point, Point, Point] };
// Coordinates refer to the original 1254px artwork, before WebP resizing.
// Bottom corners include the full bottom rail and rubber seal so both lift with the curtain.
const MODELS: Model[] = [
  { id: "plein", label: "Lames pleines", material: "ACIER GALVANISÉ", corners: [[253,329],[1021,237],[253,1092],[1021,1180]] },
  { id: "microperfore", label: "Lames microperforées", material: "MICROPERFORÉ", corners: [[255,350],[1018,260],[255,1110],[1018,1206]] },
  { id: "tubes", label: "Grille à tubes", material: "GRILLE À TUBES", corners: [[255,350],[1018,260],[255,1110],[1018,1206]] },
  { id: "grille", label: "Grille à mailles", material: "GRILLE À MAILLES", corners: [[255,350],[1018,260],[255,1110],[1018,1206]] },
  { id: "sectionnelle", label: "Porte sectionnelle", material: "FINITION BLANCHE", corners: [[249,343],[1007,244],[249,1093],[1007,1138]] },
];
const source = (model: Model, thumb = false) => `/assets/mobile-models/${model.id}${thumb ? "-thumb" : ""}.webp`;

export function OpeningShutter() {
  const canvas = useRef<HTMLCanvasElement>(null), runway = useRef<HTMLDivElement>(null);
  const choose = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0), [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    let cleanup: (() => void) | undefined;
    function activate() {
      cleanup?.(); cleanup = undefined;
      if (!media.matches || !canvas.current || !runway.current) return;
      const element = canvas.current, root = runway.current, ctx = element.getContext("2d");
      if (!ctx) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const cache = new Map<number, Promise<HTMLImageElement>>();
      let image: HTMLImageElement | undefined, model = MODELS[0];
      let disposed = false, raf = 0, last = 0, current = 0, target = 0, requestId = 0;
      function load(index: number) {
        let promise = cache.get(index);
        if (!promise) {
          promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const asset = new Image(); asset.decoding = "async";
            asset.onload = () => resolve(asset); asset.onerror = () => reject(new Error("image"));
            asset.src = source(MODELS[index]);
          });
          cache.set(index, promise);
          void promise.catch(() => { if (cache.get(index) === promise) cache.delete(index); });
        }
        return promise;
      }
      function paint() {
        if (!image || !ctx) return;
        const [tl,tr,bl,br] = model.corners;
        const left = (v: number): Point => [tl[0]+(bl[0]-tl[0])*v, tl[1]+(bl[1]-tl[1])*v];
        const right = (v: number): Point => [tr[0]+(br[0]-tr[0])*v, tr[1]+(br[1]-tr[1])*v];
        ctx.setTransform(element.width/1254,0,0,element.height/1254,0,0);
        ctx.clearRect(0,0,1254,1254); ctx.drawImage(image,0,0,1254,1254);
        // Open grilles reveal the same interior even while completely closed.
        const seeThrough = model.id === "grille" || model.id === "tubes";
        if (current < .001 && !seeThrough) return;
        ctx.save(); ctx.beginPath(); ctx.moveTo(...tl); ctx.lineTo(...tr); ctx.lineTo(...br); ctx.lineTo(...bl); ctx.closePath(); ctx.clip();
        const backing = ctx.createLinearGradient(250,240,1020,1180);
        backing.addColorStop(0,"#14283e"); backing.addColorStop(.65,"#34516b"); backing.addColorStop(1,"#68839b");
        ctx.fillStyle = backing; ctx.fillRect(0,0,1254,1254);
        const opening = Math.min(.94,current*.94), bottomLeft = left(1-opening), bottomRight = right(1-opening);
        ctx.save(); ctx.beginPath(); ctx.moveTo(...tl); ctx.lineTo(...tr); ctx.lineTo(...bottomRight); ctx.lineTo(...bottomLeft); ctx.closePath(); ctx.clip();
        const leftTravel = bl[1]-tl[1], rightTravel = br[1]-tr[1];
        const shear = -opening*(rightTravel-leftTravel)/(tr[0]-tl[0]);
        ctx.transform(1,shear,0,1,0,-opening*leftTravel-shear*tl[0]);
        ctx.drawImage(image,0,0,1254,1254); ctx.restore();
        if (current >= .001) {
          ctx.strokeStyle = "#253b50"; ctx.lineWidth = 8; ctx.shadowColor = "#00192f66"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
          ctx.beginPath(); ctx.moveTo(...bottomLeft); ctx.lineTo(...bottomRight); ctx.stroke();
        }
        ctx.restore();
      }
      function tick(now: number) {
        raf = 0; if (disposed) return;
        const dt = Math.min(40,last ? now-last : 16); last = now;
        current = reduced.matches ? target : current+(target-current)*(1-Math.exp(-dt/100));
        if (Math.abs(current-target)<.001) current = target;
        paint(); root.style.setProperty("--shutter-open",String(current));
        const label = root.querySelector("[data-opening-state]");
        if (label) label.textContent = current>.9 ? "OUVERTURE RÉVÉLÉE" : current>.05 ? "LE MOUVEMENT PREND FORME" : "FAITES DÉFILER POUR OUVRIR";
        if (current!==target) raf = requestAnimationFrame(tick);
      }
      function update() {
        const top = root.getBoundingClientRect().top+scrollY;
        const travel = Math.max(1,root.offsetHeight-(root.firstElementChild as HTMLElement).offsetHeight);
        target = Math.max(0,Math.min(1,(scrollY-top+76)/travel));
        if (!raf) raf = requestAnimationFrame(tick);
      }
      function resize() {
        const width = element.clientWidth; if (!width) return;
        const size = Math.round(width*Math.min(devicePixelRatio||1,2));
        element.width = element.height = size; paint(); update();
      }
      choose.current = (index: number) => {
        const id = ++requestId; setLoading(index); setError("");
        void load(index).then(asset => {
          if (disposed || id!==requestId) return;
          image = asset; model = MODELS[index]; setActive(index); setLoading(null);
          element.dataset.ready = "true"; resize();
        }).catch(() => {
          if (!disposed && id===requestId) { setLoading(null); setError("Image indisponible. Réessayez."); }
        });
      };
      const observer = new ResizeObserver(resize); observer.observe(element);
      addEventListener("scroll",update,{passive:true}); addEventListener("resize",resize,{passive:true});
      choose.current(0); update();
      // Other models load only when selected; keep startup bandwidth for the hero.
      cleanup = () => {
        disposed = true; cancelAnimationFrame(raf); observer.disconnect();
        removeEventListener("scroll",update); removeEventListener("resize",resize); choose.current = () => {};
      };
    }
    activate(); media.addEventListener("change",activate);
    return () => { cleanup?.(); media.removeEventListener("change",activate); };
  },[]);
  return <div className="m-opening-runway" ref={runway}><div className="m-opening-sticky">
    <div className="m-hero-product">
      <svg className="m-product-form" viewBox="0 0 400 380" aria-hidden="true"><defs><linearGradient id="mobileAzure" x2="1" y2="1"><stop stopColor="#eaf3ff"/><stop offset="1" stopColor="#92c0ff"/></linearGradient></defs><path d="M42 89C-20 28 63-3 145 29L349 86Q397 101 370 163L305 320Q286 365 236 343L42 260Q9 246 25 206Z" fill="url(#mobileAzure)"/><path d="M53 69C116 14 328 85 374 181M36 90C100 35 312 106 358 202" fill="none" stroke="#8cb5fb" strokeWidth=".8"/></svg>
      <picture><source media="(min-width: 761px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" /><img className="m-opening-fallback" src="/assets/mobile-models/plein.webp" width="960" height="960" fetchPriority="high" alt="Rideau métallique RIGAT"/></picture>
      <canvas ref={canvas} className="m-opening-canvas" role="img" aria-label={`${MODELS[active].label} : ouverture progressive au défilement`}/>
      <div className="m-model-selectors" role="group" aria-label="Choisir votre modèle" aria-busy={loading!==null}>
        {MODELS.map((item,index)=><button key={item.id} type="button" className={`m-model-circle m-model-circle-${index}`} aria-label={`Afficher : ${item.label}`} aria-pressed={active===index} data-loading={loading===index} title={item.label} onClick={()=>choose.current(index)}><img src={source(item,true)} width="120" height="120" alt="" loading="lazy"/><span className="m-model-number" aria-hidden="true">{String(index+1).padStart(2,"0")}</span></button>)}
      </div>
      <span className="m-product-tag"><i/>{MODELS[active].material}<b>SUR MESURE</b></span>
    </div>
    <div className="m-model-caption" aria-live="polite" aria-atomic="true"><strong>{MODELS[active].label}</strong><span>{error || (loading!==null ? "Chargement du modèle…" : "Touchez un cercle pour changer de modèle")}</span></div>
    <div className="m-opening-cue"><span data-opening-state="">FAITES DÉFILER POUR OUVRIR</span><span>↓</span></div>
  </div></div>;
}
