"use client";

import { type RefObject } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

type Options = {
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
};

/**
 * Reveal em cascata dos elementos que casam com `selector` dentro de `scopeRef`.
 *
 * O estado inicial é aplicado por `gsap.set` dentro do efeito, nunca por uma
 * classe no HTML: se o JS não carregar (ou se o usuário pedir menos movimento),
 * o conteúdo simplesmente já está visível, em vez de ficar preso em opacity 0.
 */
export function useReveal(
  scopeRef: RefObject<HTMLElement | null>,
  selector: string,
  { y = 28, stagger = 0.08, duration = 1, start = "top 78%" }: Options = {},
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, scopeRef.current);
        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          ease: "lume",
          stagger,
          scrollTrigger: { trigger: scopeRef.current, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: scopeRef, dependencies: [selector] },
  );
}
