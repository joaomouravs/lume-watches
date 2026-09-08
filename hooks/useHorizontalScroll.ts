"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

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
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "x" });
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
