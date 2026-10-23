"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";

declare global { interface Window { initializeRigatConfigurator?: (root: HTMLElement) => void } }

/** Native page content powered by the supplied image-only engine. */
export default function Configurator({ markup }: { markup: string }) {
  const content = useRef<HTMLDivElement>(null);
  function initialize() { if(content.current) window.initializeRigatConfigurator?.(content.current); }
  useEffect(() => {
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
      <div id="rigat-configurator" ref={content} dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/configurator/integrated.js?v=22" strategy="afterInteractive" onReady={initialize} />
      <p className="image-configurator-note">
        Les dimensions renseignées sont ajoutées à votre récapitulatif. Elles
        seront confirmées avec RIGAT avant fabrication.
      </p>
    </section>
  );
}
