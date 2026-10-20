/* EDIT THESE NUMBERS, SAVE, THEN HARD-REFRESH YOUR BROWSER (Ctrl + F5).
   Keep the commas and decimal points as shown. No other files need editing. */
window.RigatSettings = Object.freeze({
  // MAIN SPEED CONTROL: applies from the banner to the final model view.
  // HIGHER = FASTER and less wheel/swipe effort; LOWER = SLOWER.
  // Try 1.0 (normal), 1.2 (current), or 1.5 (faster).
  scrollSpeed: 1.2,

  // Banner -> "La précision se révèle", in milliseconds at scrollSpeed 1.
  // LOWER = FASTER. Current effective duration: 500 / 1.2 = 417 ms.
  introDurationMs: 500,

  // Scroll share devoted to the FINAL shutter enlargement (your pics 1 -> 2).
  // LOWER = LESS SCROLLING. 0.05 is shorter, 0.07 current, 0.10 longer.
  // Recommended range: 0.03 to 0.17. This is separate from the BLUE close-up.
  finalZoomTravel: 0.07,

  // Minimum pacing time for the final enlargement, in milliseconds.
  // HIGHER = SLOWER / SMOOTHER. Does not require extra scroll distance.
  // Try 900 (quicker), 1200 (current), or 1600 (more cinematic).
  finalZoomDurationMs: 1200,

  // EXTRA travel for the fully zoomed-in blue view.
  // 0 = original timing; 0.02 = shorter; 0.03 = current; 0.06 = longer.
  // Recommended range: 0 to 0.15. The same setting also affects "Voir le film".
  zoomExtraTravel: 0.03,

  // ADVANCED: maximum story pace before the global scrollSpeed multiplier.
  // LOWER = FASTER: try 10. HIGHER = SLOWER: try 16. Current: 12.
  // Effective limit = scrollSeconds / scrollSpeed. Slow input can take longer.
  scrollSeconds: 12,

  // Scroll softness in milliseconds. HIGHER = softer, with more trailing motion.
  // Current: 50 (your preferred direct feel). Try 110 for softer movement.
  // This changes the feel, not the maximum speed above.
  scrollSmoothingMs: 50
});
