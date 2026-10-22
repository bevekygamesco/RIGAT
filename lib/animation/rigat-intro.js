import { FRAME_LOADING } from './frame-store';

/* Preserve the existing cinematic design; report real animation download progress. */
export function initializeIntro() {
  const intro = document.getElementById('brandIntro');
  if (!intro) return;
  const mobile = innerWidth <= 760;
  const minMs = mobile ? 900 : FRAME_LOADING.introMinMs;
  const maxMs = mobile ? 1400 : FRAME_LOADING.introMaxMs;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = mobile ? 0 : performance.now();
  const previousOverflow = document.body.style.overflow;
  const surfaces = [...document.querySelectorAll('main,.site-nav')]
    .map(el => ({ el, inert: el.inert }));
  const caption = intro.querySelector('.intro-caption');
  if (caption) {
    caption.setAttribute('aria-live', 'off');
    caption.style.fontVariantNumeric = 'tabular-nums';
  }
  document.body.style.overflow = 'hidden';
  surfaces.forEach(({ el }) => { el.inert = true; });
  let finished = false, ready = false, raf = 0, timer = 0;

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    intro.classList.add('is-leaving');
    document.body.classList.add('intro-reveal');
    document.body.style.overflow = previousOverflow;
    surfaces.forEach(({ el, inert }) => { el.inert = inert; });
    const hadFocus = intro.contains(document.activeElement);
    setTimeout(() => {
      intro.remove();
      document.body.classList.remove('intro-reveal');
      if (hadFocus) document.querySelector('.site-nav a,main a,main button')?.focus({ preventScroll: true });
    }, reduced ? 0 : mobile ? 400 : 1500);
  }

  function tick(now) {
    if (finished) return;
    const elapsed = now - started;
    const status = mobile ? null : window.BMNHero?.getPreloadStatus?.();
    const ratio = mobile ? (ready ? 1 : .15) : status ? status.downloaded / status.total : 0;
    intro.style.setProperty('--load', String(ratio));
    if (caption) {
      const text = !status?.preloading
        ? 'LA PRÉCISION PREND FORME'
        : status.complete
          ? 'VOTRE EXPÉRIENCE EST PRÊTE · 100 %'
          : `PRÉPARATION DE VOTRE EXPÉRIENCE · ${Math.floor(ratio * 100)} %`;
      if (caption.textContent !== text) caption.textContent = text;
    }
    const assetsReady = mobile || (status && (!status.preloading || status.complete));
    if ((ready && (reduced || assetsReady) && elapsed >= (reduced ? 0 : minMs))
      || elapsed >= maxMs) {
      finish();
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  const image = mobile ? document.querySelector('.m-opening-fallback') : document.getElementById('heroProduct');
  const imageReady = !image || image.complete ? Promise.resolve() : new Promise(resolve => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
  Promise.allSettled(mobile ? [imageReady] : [document.fonts?.ready || Promise.resolve(), imageReady])
    .then(() => { ready = true; });
  document.getElementById('introSkip')?.addEventListener('click', finish);
  intro.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); });
  timer = setTimeout(finish, Math.max(0, maxMs - (performance.now() - started)) + 100);
  raf = requestAnimationFrame(tick);
}
