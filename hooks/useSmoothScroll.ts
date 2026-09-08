"use client";

import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Smooth scroll com Lenis, dirigido pelo ticker do GSAP.
 *
 * Duas decisões que não são óbvias:
 * 1. O rAF é o do GSAP, não um `requestAnimationFrame` próprio. Com dois loops
 *    concorrentes o ScrollTrigger lê posições de um frame anterior e o parallax
 *    treme; com um só, tudo é resolvido na mesma passada.
 * 2. `lagSmoothing(0)` desliga a compensação de lag do GSAP. Ela existe para
 *    animações baseadas em tempo, mas aqui atrapalha: num frame longo ela dá um
 *    salto no scroll virtual em vez de simplesmente continuar de onde parou.
 *
 * Em `prefers-reduced-motion` o Lenis nem é instanciado — o scroll nativo do
 * navegador é a experiência correta, e `scrollTo` cai no `scrollIntoView`.
 */
export function useSmoothScroll(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      anchors: { offset: -80 }, // altura do header fixo
    });
    lenisRef.current = lenis;
    if (!enabled) lenis.stop();

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000); // GSAP em s, Lenis em ms
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
    // `enabled` só define o estado inicial; o efeito abaixo cuida das mudanças.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (enabled) lenis.start();
    else lenis.stop();
  }, [enabled]);

  /**
   * Rolagem programática para uma âncora. O menu mobile precisa disto porque
   * fecha e navega no mesmo gesto: o clique padrão dispararia com o scroll
   * ainda travado.
   */
  const scrollTo = useCallback((hash: string) => {
    const target = document.querySelector(hash);
    if (!target) return;

    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
    else target.scrollIntoView({ block: "start" });
  }, []);

  return { scrollTo };
}
