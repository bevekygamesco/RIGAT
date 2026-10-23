const changes = new WeakMap<HTMLElement, Animation>();

/** Animate a decoded replacement without moving layout or loading extra assets. */
export function animateModelChange(element: HTMLElement) {
  changes.get(element)?.cancel();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const animation = element.animate([
    { opacity: 0, transform: "translateY(9px) scale(.975)" },
    { opacity: 1, transform: "translateY(0) scale(1)" },
  ], { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" });
  changes.set(element, animation);
  const clear = () => { if (changes.get(element) === animation) changes.delete(element); };
  animation.onfinish = clear;
  animation.oncancel = clear;
  return animation;
}
