"use client";

import { useEffect } from "react";
import { initializeIntro } from "@/lib/animation/rigat-intro";
import { initializeTheme } from "@/lib/animation/rigat-theme";
import { initializeMobileShell } from "@/lib/animation/mobile-shell";

declare global {
  interface Window {
    __rigatBoot?: Promise<void>;
    RigatSettings?: Readonly<{
      scrollSpeed: number;
      introDurationMs: number;
      finalZoomTravel: number;
      finalZoomDurationMs: number;
      zoomExtraTravel: number;
      scrollSeconds: number;
      scrollSmoothingMs: number;
    }>;
  }
}

const defaults = Object.freeze({
  scrollSpeed: 1.2,
  introDurationMs: 500,
  finalZoomTravel: 0.07,
  finalZoomDurationMs: 1200,
  zoomExtraTravel: 0.03,
  scrollSeconds: 12,
  scrollSmoothingMs: 50,
});

function loadSettings(): Promise<void> {
  return new Promise((resolve) => {
    if (window.RigatSettings) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "/rigat-settings.js?v=26";
    const finish = () => {
      window.RigatSettings ??= defaults;
      resolve();
    };
    script.onload = finish;
    script.onerror = finish;
    document.head.appendChild(script);
    // A stalled request cannot leave the entrance waiting indefinitely.
    window.setTimeout(finish, 1800);
  });
}

/** Root-layout lifetime: start once, including React Strict Mode's effect replay.
 * Section markup stays server-rendered; only the canvas/scroll engine is client-side.
 * No client-side route transitions are needed on this single-page website.
 */
export function ExperienceRuntime() {
  useEffect(() => {
    window.__rigatBoot ??= (async () => {
      if (!document.getElementById("mobile-mechanisme")) {
        document.getElementById("brandIntro")?.remove();
        return;
      }
      // Start the visible UI before a settings request or animation download.
      initializeIntro();
      initializeTheme();
      const mobile = window.matchMedia("(max-width: 760px)");
      let desktopStarted = false;
      let desktopBoot: Promise<void> | undefined;
      let closeMobile: (() => void) | undefined;
      const startDesktop = () => {
        desktopBoot ??= Promise.all([
          loadSettings(),
          import("@/lib/animation/rigat-composition"),
          import("@/lib/animation/hero"),
          import("@/lib/animation/app"),
          import("@/lib/animation/story-scroll"),
        ]).then(([, composition, hero, sequence, scroll]) => {
          if (mobile.matches) { desktopBoot = undefined; return; }
          composition.initializeComposition();
          hero.initializeHero();
          sequence.initializeSequence();
          scroll.initializeScroll();
          desktopStarted = true;
        }).catch(() => {
          desktopBoot = undefined;
          document.getElementById("brandIntro")?.remove();
        });
      };
      const applyViewport = () => {
        closeMobile?.();
        closeMobile = undefined;
        if (mobile.matches) {
          window.dispatchEvent(new Event("rigat:mobile"));
          closeMobile = initializeMobileShell();
        } else if (!desktopStarted) startDesktop();
      };
      applyViewport();
      mobile.addEventListener("change", applyViewport);
    })();
  }, []);
  return null;
}
