"use client";

import { useEffect } from "react";
import { initializeIntro } from "@/lib/animation/rigat-intro";
import { initializeComposition } from "@/lib/animation/rigat-composition";
import { initializeHero } from "@/lib/animation/hero";
import { initializeSequence } from "@/lib/animation/app";
import { initializeTheme } from "@/lib/animation/rigat-theme";
import { initializeScroll } from "@/lib/animation/story-scroll";

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
    window.__rigatBoot ??= loadSettings().then(() => {
      if (!document.getElementById("stage")) {
        document.getElementById("brandIntro")?.remove();
        return;
      }
      initializeComposition();
      initializeIntro();
      initializeHero();
      initializeSequence();
      initializeTheme();
      initializeScroll();
    });
  }, []);
  return null;
}
