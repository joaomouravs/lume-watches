"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

type Options = {
  /** Elemento cujo `scaleX` acompanha o progresso do pin. */
  progressRef?: RefObject<HTMLElement | null>;
};

/**
 * Prende a seção na viewport e traduz o track no eixo X enquanto o usuário
 * rola no eixo Y.
 *
 * `end` e a distância são funções, e não números: com `invalidateOnRefresh` o
 * ScrollTrigger as reavalia a cada resize, então trocar de retrato para
 * paisagem não deixa o track terminando fora da tela. E a distância vertical do
 * pin é igual à horizontal percorrida, o que mantém a velocidade do gesto igual
 * à de qualquer outra seção da página.
 *
 * O `matchMedia` cuida do mobile e do prefers-reduced-motion de uma vez só:
 * fora dessa condição nada é criado e o track continua sendo o que já é no
 * HTML — uma pilha vertical.
 */
export function useHorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  { progressRef }: Options = {},
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM.gallery, () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef?.current) {
                gsap.set(progressRef.current, { scaleX: self.progress });
              }
            },
          },
        });

        /* Acessibilidade do pin: o track é TRANSLADADO, não rolado, então o
           navegador não consegue trazer para a tela um card que recebeu foco
           por Tab — o usuário de teclado ficaria digitando no escuro. Como o
           deslocamento horizontal é 1:1 com o scroll vertical do pin, basta
           somar a mesma quantidade de pixels ao scroll da página. */
        const onFocusIn = (event: FocusEvent) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;

          const trigger = tween.scrollTrigger;
          if (!trigger) return;

          const margin = 64;
          const box = target.getBoundingClientRect();
          let delta = 0;
          if (box.right > window.innerWidth - margin) {
            delta = box.right - (window.innerWidth - margin);
          } else if (box.left < margin) {
            delta = box.left - margin;
          }
          if (!delta) return;

          window.scrollTo({ top: trigger.scroll() + delta });
        };

        track.addEventListener("focusin", onFocusIn);

        return () => {
          track.removeEventListener("focusin", onFocusIn);
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "x" });
          if (progressRef?.current) {
            gsap.set(progressRef.current, { clearProps: "scaleX" });
          }
        };
      });

      // As imagens dos cards entram depois do pin ser calculado; sem o refresh
      // o `end` fica preso ao scrollWidth de antes do layout final.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: sectionRef },
  );
}
