> Reference for the included update. It is already applied in this full project; do not apply a patch again.

# RIGAT back-to-top button and refresh reset

Copy `app` and `components` into your Next.js project root. Allow replacing `app/layout.tsx`.
The layout supplied here matches your original RIGAT Next.js project and adds only the button import, the button instance, and a small refresh-reset script in <head>.
If you customized layout.tsx, merge those three additions instead of replacing it.

New files:
- components/experience/BackToTop.tsx
- components/experience/BackToTop.module.css

The blue button appears after 360 pixels of scrolling and stays fixed at bottom-right. It stops the story scroll controller and film before smoothly returning to the top. Reduced motion returns immediately. Mobile positioning accounts for the safe area.

A refresh resets scroll position immediately and again on pageshow, preventing browser scroll restoration from reopening the model story. Ordinary anchor links, new visits, and back/forward navigation are not deliberately reset.

To adjust when the button appears, change `window.scrollY > 360` in BackToTop.tsx.
To adjust its size, position, and colors, edit BackToTop.module.css.

Restart `npm run dev` if needed. For production: `npm run build`, then redeploy.
No dependencies. Compatible with the previous loading/cache patch; its files stay unchanged.

Validation: TypeScript check and simulated refresh/navigation/history tests passed. Browser visuals have not been tested.
