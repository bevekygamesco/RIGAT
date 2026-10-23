"use client";
import { useEffect, useRef, useState } from "react";

/** The supplied configurator runs unchanged as a same-origin image-only document. */
export default function Configurator() {
  const frame = useRef<HTMLIFrameElement>(null),
    [height, setHeight] = useState(1020);
  useEffect(() => {
    function receive(e: MessageEvent) {
      if (
        e.origin !== window.location.origin ||
        e.source !== frame.current?.contentWindow
      )
        return;
      if (
        e.data?.type === "rigat-configurator-height" &&
        Number.isFinite(e.data.height)
      )
        setHeight(Math.max(350, Math.min(10000, Math.ceil(e.data.height))));
      if (e.data?.type === "rigat-configurator-step")
        frame.current?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches
            ? "instant"
            : "smooth",
        });
    }
    window.addEventListener("message", receive);
    frame.current?.contentWindow?.postMessage(
      { type: "rigat-configurator-ready" },
      window.location.origin,
    );
    const toggle = document.getElementById("mobileMenuToggle"),
      menu = document.getElementById("mobileNav");
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest("a,button");
      if (!target) return;
      if (target === toggle) {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
          "aria-label",
          open ? "Fermer la navigation" : "Ouvrir la navigation",
        );
        if (menu) menu.hidden = !open;
      } else if (target.matches("[data-contact]")) {
        event.preventDefault();
        window.location.assign("/#contact");
      } else if (
        target instanceof HTMLAnchorElement &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        event.preventDefault();
        window.location.assign("/" + target.getAttribute("href"));
      }
    }
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("click", click, true);
    };
  }, []);
  return (
    <section
      className="image-configurator"
      aria-labelledby="configurator-title"
    >
      <div className="image-configurator-heading">
        <a href="/">
          Accueil <span>/</span> Configurateur
        </a>
        <p>RIGAT · FABRICANT DEPUIS 1956</p>
        <h1 id="configurator-title">
          Votre fermeture.
          <br className="config-mobile-break" /> <em>À votre mesure.</em>
        </h1>
        <div>
          Personnalisez votre rideau métallique, jusque dans les détails.
        </div>
      </div>
      <iframe
        ref={frame}
        src="/configurator/index.html"
        onLoad={() =>
          frame.current?.contentWindow?.postMessage(
            { type: "rigat-configurator-ready" },
            window.location.origin,
          )
        }
        title="Configurateur RIGAT : modèle, mesures, finitions et récapitulatif"
        style={{ height }}
        className="image-configurator-frame"
      />
      <p className="image-configurator-note">
        Les dimensions renseignées sont ajoutées à votre récapitulatif. Elles
        seront confirmées avec RIGAT avant fabrication.
      </p>
    </section>
  );
}
