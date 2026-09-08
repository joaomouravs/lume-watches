"use client";

import { type RefObject } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

type Options = {
  /** Deslocamento total, em % da altura do próprio elemento. */
  amount?: number;
  /** Elemento que define o intervalo de scroll. Padrão: o pai do alvo. */
  triggerRef?: RefObject<HTMLElement | null>;
  /**
   * Condição de matchMedia. O padrão só checa movimento reduzido; passe algo
   * mais estrito quando o curso do parallax depender do layout — numa coluna
   * onde a placa preenche o quadro inteiro não há folga para deslizar, e
   * mover a imagem ali abriria uma faixa vazia.
   */
  media?: string;
};

/**
 * Parallax vertical sutil.
 *
 * O alvo desliza dentro da folga vertical do quadro (ver `.parallax-plate` no
 * globals.css). É o quadro que precisa ser mais alto que a placa — e não a
 * imagem que precisa ser ampliada —, então o efeito não custa nem um pixel de
 * corte na foto. `scrub: 1` amortece um frame: sem isso o parallax "gruda" no
 * scroll e denuncia o efeito.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  { amount = 12, triggerRef, media = MM.motion }: Options = {},
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(media, () => {
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
    { dependencies: [amount, media] },
  );
}
