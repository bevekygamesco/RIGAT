"use client";

import { useEffect, useRef, useState } from "react";

const MODELS = [
  { id: "plein", label: "Lames pleines", src: "/assets/rigat-product-1254.webp" },
  { id: "microperfore", label: "Lames microperforées", src: "/assets/mobile-models/microperfore.webp" },
  { id: "tubes", label: "Grille à tubes", src: "/assets/mobile-models/tubes.webp" },
  { id: "grille", label: "Grille à mailles", src: "/assets/mobile-models/grille.webp" },
  { id: "sectionnelle", label: "Porte sectionnelle", src: "/assets/mobile-models/sectionnelle.webp" },
];

export function DesktopHeroModels() {
  const [active, setActive] = useState(0), [pending, setPending] = useState<number | null>(null), [error, setError] = useState("");
  const token = useRef(0), alive = useRef(false);
  const cache = useRef(new Map<number, Promise<HTMLImageElement>>());
  useEffect(() => { alive.current = true; return () => { alive.current = false; token.current++; }; }, []);
  function select(index: number) {
    const request = ++token.current;
    setPending(index); setError("");
    let image = cache.current.get(index);
    if (!image) {
      image = new Promise<HTMLImageElement>((resolve, reject) => {
        const asset = new Image(); asset.decoding = "async";
        asset.onload = () => resolve(asset); asset.onerror = () => reject(new Error("image"));
        if(index===0) {
          asset.srcset = "/assets/rigat-product-640.webp 640w, /assets/rigat-product-960.webp 960w, /assets/rigat-product-1254.webp 1254w";
          asset.sizes = "(max-width: 1100px) 55vw, 46vw";
        }
        asset.src = MODELS[index].src;
      });
      cache.current.set(index, image);
      void image.catch(() => cache.current.delete(index));
    }
    void image.then(() => {
      if (alive.current && request === token.current) { setActive(index); setPending(null); }
    }).catch(() => {
      if (alive.current && request === token.current) { setPending(null); setError("Image indisponible. Réessayez."); }
    });
  }
  const model = MODELS[active];
  return <div className="desktop-model-stage">
    {(model.id === "grille" || model.id === "tubes") && <div className="desktop-model-interior" aria-hidden="true" />}
    <picture>
      <source media="(max-width: 760px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
      <img id="heroProduct" src={model.src} srcSet={active===0 ? "/assets/rigat-product-640.webp 640w, /assets/rigat-product-960.webp 960w, /assets/rigat-product-1254.webp 1254w" : undefined} sizes={active===0 ? "(max-width: 1100px) 55vw, 46vw" : undefined} decoding="async" data-model-source={model.src} width="1254" height="1254" fetchPriority="high" alt={`${model.label} RIGAT sur mesure, avec son ombre et son reflet`} />
    </picture>
    <div className="desktop-model-choices" role="group" aria-label="Choisir votre modèle de fermeture" aria-busy={pending !== null}>
      {MODELS.map((item, index) => <button key={item.id} type="button" className={`desktop-model-choice desktop-model-choice-${index}`} aria-label={`Afficher : ${item.label}`} title={item.label} aria-pressed={index === active} data-loading={pending === index} onClick={() => select(index)}>
        <img src={`/assets/mobile-models/${item.id}-thumb.webp`} alt="" width="120" height="120" loading="lazy" />
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </button>)}
    </div>
    <p className="desktop-model-caption" aria-live="polite" aria-atomic="true"><strong>{model.label}</strong><span>{error || (pending !== null ? "Chargement…" : "Choisissez votre modèle")}</span></p>
  </div>;
}
