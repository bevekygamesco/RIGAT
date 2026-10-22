"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

/** Replace this placeholder component with the supplied configurator when ready. */
export default function Configurator() {
  useEffect(() => {
    // This standalone page does not start the home-page animation runtime.
    const toggle=document.getElementById("mobileMenuToggle"),menu=document.getElementById("mobileNav");
    function click(event: MouseEvent) {
      if(!(event.target instanceof Element))return;
      const target=event.target.closest("a,button");
      if(!target)return;
      if(target===toggle) {
        const open=toggle.getAttribute("aria-expanded")!=="true";
        toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Fermer la navigation":"Ouvrir la navigation");
        if(menu)menu.hidden=!open;
      } else if(target.matches("[data-contact]")) {
        event.preventDefault();window.location.assign("/#contact");
      } else if(target instanceof HTMLAnchorElement&&target.getAttribute("href")?.startsWith("#")) {
        event.preventDefault();window.location.assign("/"+target.getAttribute("href"));
      }
    }
    document.addEventListener("click",click,true);
    return()=>document.removeEventListener("click",click,true);
  },[]);
  return <section className="configurator-coming-soon" aria-labelledby="configurator-title">
    <div><p className="kicker">RIGAT · CONFIGURATEUR 3D</p>
      <h1 id="configurator-title">Votre fermeture,<br/><em>à votre mesure.</em></h1>
      <p>Notre configurateur 3D sera bientôt disponible. En attendant, parlons de votre projet sur mesure.</p>
      <div className="configurator-page-actions"><a className="story-configurator" href={site.phoneHref}>Appeler RIGAT <span aria-hidden="true">↗</span></a><a href="/">Retour à l’accueil</a></div>
    </div>
    <img src="/assets/rigat-product-1254.webp" srcSet="/assets/rigat-product-640.webp 640w, /assets/rigat-product-960.webp 960w, /assets/rigat-product-1254.webp 1254w" sizes="(max-width: 760px) 85vw, 40vw" width="1254" height="1254" alt="Rideau métallique RIGAT sur mesure" />
  </section>;
}
