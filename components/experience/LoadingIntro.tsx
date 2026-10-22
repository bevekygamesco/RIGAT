import type { CSSProperties } from "react";

export function LoadingIntro() {
  return (
    <>
      <div
        className="brand-intro"
        id="brandIntro"
        role="status"
        aria-label="Bienvenue chez RIGAT"
      >
        <div className="intro-environment" aria-hidden="true"></div>
        <div className="intro-floor" aria-hidden="true"></div>
        <div className="intro-camera" aria-hidden="true">
          <div className="intro-gateway">
            <div className="intro-gate-slats">
              <i style={{ "--i": "0" } as CSSProperties}></i>
              <i style={{ "--i": "1" } as CSSProperties}></i>
              <i style={{ "--i": "2" } as CSSProperties}></i>
              <i style={{ "--i": "3" } as CSSProperties}></i>
              <i style={{ "--i": "4" } as CSSProperties}></i>
              <i style={{ "--i": "5" } as CSSProperties}></i>
              <i style={{ "--i": "6" } as CSSProperties}></i>
              <i style={{ "--i": "7" } as CSSProperties}></i>
              <i style={{ "--i": "8" } as CSSProperties}></i>
              <i style={{ "--i": "9" } as CSSProperties}></i>
              <i style={{ "--i": "10" } as CSSProperties}></i>
              <i style={{ "--i": "11" } as CSSProperties}></i>
              <i style={{ "--i": "12" } as CSSProperties}></i>
              <i style={{ "--i": "13" } as CSSProperties}></i>
            </div>
            <div className="intro-rail intro-rail-left"></div>
            <div className="intro-rail intro-rail-right"></div>
            <div className="intro-lintel"></div>
            <div className="intro-light-sweep"></div>
          </div>
        </div>
        <div className="intro-brand">
          <span className="intro-eyebrow">MARSEILLE · DEPUIS 1956</span>
          <div className="intro-logo-stack">
            <img
              className="intro-logo-depth"
              style={{ "--depth": "7" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "6" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "5" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "4" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "3" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "2" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-depth"
              style={{ "--depth": "1" } as CSSProperties}
              src="/assets/rigat-logo.svg?v=16"
              alt=""
              aria-hidden="true"
            />
            <img
              className="intro-logo-front"
              src="/assets/rigat-logo.svg?v=16"
              width="300"
              height="110"
              alt="RIGAT"
              fetchPriority="high"
            />
          </div>
          <p>
            Le métal, <em>autrement.</em>
          </p>
          <div className="intro-track" aria-hidden="true">
            <i></i>
          </div>
          <span className="intro-caption">LA PRÉCISION PREND FORME</span>
        </div>
        <span className="intro-corner" aria-hidden="true">
          CONCEVOIR. FABRIQUER. PROTÉGER.
        </span>
        <button className="intro-skip" id="introSkip" type="button">
          Entrer <span aria-hidden="true">↗</span>
        </button>
      </div>
    </>
  );
}
