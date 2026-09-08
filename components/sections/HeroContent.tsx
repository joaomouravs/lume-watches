"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSiteReady } from "@/components/SiteShell";

export function HeroContent() {
  const root = useRef<HTMLDivElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: "lume" } });

      // O wordmark herda o gesto do loader: sai de um tracking mais aberto e
      // fecha até o valor final, como se a tela de abertura tivesse se
      // dissolvido exatamente sobre ele.
      tl.fromTo(
        "[data-hero-mark]",
        { letterSpacing: "0.06em", opacity: 0, y: 32 },
        { letterSpacing: "-0.02em", opacity: 1, y: 0, duration: 1.2 },
      )
        .fromTo(
          "[data-hero-line]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
          0.35,
        )
        .fromTo(
          "[data-hero-scroll]",
          { opacity: 0 },
          { opacity: 1, duration: 0.9 },
          0.9,
        )
        .fromTo(
          "[data-hero-rule]",
          { scaleY: 0 },
          { scaleY: 1, duration: 1.1, transformOrigin: "top center" },
          0.9,
        );
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <div
      ref={root}
      className="relative z-10 flex min-h-[100svh] flex-col justify-between gutter pt-[18svh] pb-10"
    >
      <div className="grid-12">
        <div className="col-span-12 lg:col-span-8">
          <p data-hero-line className="eyebrow">
            Maison LUME · Genebra · Est. 2019
          </p>

          <h1
            data-hero-mark
            className="mt-8 font-display text-wordmark text-bone"
          >
            LUME
          </h1>

          <p
            data-hero-line
            className="mt-6 font-display text-title text-bone/90 lg:mt-8"
          >
            Time, quietly.
          </p>

          <p
            data-hero-line
            className="mt-8 max-w-[42ch] text-body text-steel lg:mt-10"
          >
            Três referências. Um calibre. Trinta e oito milímetros de aço que
            não pedem para ser notados.
          </p>
        </div>
      </div>

      <div
        data-hero-scroll
        className="flex items-end justify-between gap-6"
      >
        <span className="eyebrow">Role para explorar</span>
        <span
          data-hero-rule
          aria-hidden="true"
          className="block h-16 w-px bg-bone/25"
        />
      </div>
    </div>
  );
}
