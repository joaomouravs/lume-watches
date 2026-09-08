"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* O registro precisa acontecer no cliente. Todos os módulos que importam este
   arquivo são "use client", mas o guard evita qualquer surpresa caso o bundler
   avalie o módulo durante o SSR. */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Duração e easing padrão do projeto — 0.8s–1.2s, sem bounce. */
export const EASE = "power3.out";
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * A curva do design system (0.16, 1, 0.3, 1) registrada como easing nomeado,
 * para que GSAP e CSS produzam exatamente a mesma aceleração.
 */
gsap.registerEase("lume", (p) => {
  // CustomEase é plugin pago; a aproximação abaixo é a mesma cúbica de Bézier
  // resolvida por Newton-Raphson.
  const x1 = 0.16,
    y1 = 1,
    x2 = 0.3,
    y2 = 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  let t = p;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * t + bx) * t + cx) * t - p;
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(dx) < 1e-6) break;
    t -= x / dx;
  }
  return ((ay * t + by) * t + cy) * t;
});

/** Leitura pontual da preferência do usuário, feita sempre dentro de efeitos. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Condições compartilhadas por todas as animações de scroll. */
export const MM = {
  gallery:
    "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
  stacked:
    "(max-width: 767px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
