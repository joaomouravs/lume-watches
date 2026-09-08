"use client";

import { type RefObject } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

type Options = {
  /** Deslocamento total, em % da altura do próprio elemento. */
  amount?: number;
  /** Elemento que define o intervalo de scroll. Padrão: o pai do alvo. */
  triggerRef?: RefObject<HTMLElement | null>;
};

/**
 * Parallax vertical sutil.
 *
 * A imagem é renderizada mais alta que o contêiner (ver `.parallax-media` no
 * globals.css) e desliza dentro dele: assim o movimento nunca revela uma borda
 * vazia, seja qual for a altura da viewport. `scrub: 1` amortece um frame — sem
 * isso o parallax "gruda" no scroll e denuncia o efeito.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  { amount = 12, triggerRef }: Options = {},
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.fromTo(
          el,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: triggerRef?.current ?? el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [amount] },
  );
}
