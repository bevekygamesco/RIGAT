"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > 360);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function returnToTop() {
    const experience = window as Window & {
      RigatScrollPacing?: { stop: () => void };
      BMNHero?: { stopFilm: () => void };
    };
    experience.RigatScrollPacing?.stop();
    experience.BMNHero?.stopFilm();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible}
      aria-label="Retour en haut de la page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title="Retour en haut"
      onClick={returnToTop}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
