"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite, useSiteReady } from "@/components/SiteShell";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Segunda camada de informação, no canto oposto ao texto. */
const FACTS = [
  ["Caixa", "38 mm"],
  ["Calibre", "LM-38"],
  ["Reserva", "42 h"],
] as const;

export function HeroShell({ media }: { media: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const ready = useSiteReady();
  const { scrollTo } = useSite();

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "lume" } })
        /* O wordmark herda o gesto do loader: sai de um tracking mais aberto e
           fecha até o valor final, como se a tela de abertura tivesse se
           dissolvido exatamente sobre ele. */
        .fromTo(
          "[data-hero-mark]",
          { letterSpacing: "0.08em", opacity: 0, y: 28 },
          { letterSpacing: "-0.02em", opacity: 1, y: 0, duration: 1.2 },
        )
        .fromTo(
          "[data-hero-line]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          0.3,
        )
        .fromTo(
          "[data-hero-foot]",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          0.9,
        );
    },
    { scope: root, dependencies: [ready] },
  );

  useGSAP(
    () => {
      const el = plate.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      /* Parallax de cursor. Só 12px de curso: o suficiente para a fotografia
         responder à presença do usuário sem virar truque. `quickTo` reaproveita
         um tween só — nada é alocado por movimento do mouse. */
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const moveX = gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" });
        const moveY = gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          moveX((event.clientX / window.innerWidth - 0.5) * -24);
          moveY((event.clientY / window.innerHeight - 0.5) * -16);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          gsap.set(el, { x: 0, y: 0 });
        };
      });

      /* A fotografia sobe mais devagar que o texto na saída do Hero: separa as
         duas camadas em profundidade sem custar nada além de um transform. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to("[data-hero-copy]", {
          yPercent: -14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="hero"
      ref={root}
      aria-label="LUME — Time, quietly."
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-canvas"
    >
      {/* A escala de 1.06 dá ao parallax de cursor uma folga para deslizar sem
          revelar a borda da imagem. */}
      <div ref={plate} className="absolute inset-0 scale-[1.06]">
        {media}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-canvas/90 via-canvas/45 to-canvas/95"
      />

      <div className="relative z-content flex min-h-[100svh] flex-col justify-between pt-[max(7rem,20svh)] pb-10">
        <div data-hero-copy className="container-lume">
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-8">
              <Eyebrow data-hero-line>
                Maison LUME · Genebra · Est. 2019
              </Eyebrow>

              {/* O nome acessível é a concatenação dos dois spans; sem o
                  aria-label o leitor de tela anunciaria "LUMETime, quietly.". */}
              <h1 aria-label="LUME — Time, quietly." className="mt-8 text-content">
                <span
                  data-hero-mark
                  className="block font-display text-mark"
                >
                  LUME
                </span>
                <span
                  data-hero-line
                  className="mt-4 block font-display text-title text-content/90 lg:mt-6"
                >
                  Time, quietly.
                </span>
              </h1>

              <p
                data-hero-line
                className="mt-8 max-w-[46ch] text-lead text-muted lg:mt-10"
              >
                Três referências. Um calibre. Trinta e oito milímetros de aço
                que não pedem para ser notados.
              </p>

              <div
                data-hero-line
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-12"
              >
                <Button
                  href="#colecao"
                  variant="outline"
                  magnetic
                  onClick={(event) => {
                    event.preventDefault();
                    scrollTo("#colecao");
                  }}
                >
                  Ver a coleção
                </Button>
                <Button href="#movimento" variant="ghost">
                  Como funciona
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-foot className="container-lume">
          <div className="flex items-end justify-between gap-8">
            <div className="flex items-center gap-3">
              <Eyebrow as="span">Role</Eyebrow>
              {/* Trilho fixo com um traço que desce em loop: uma affordance de
                  scroll, não um enfeite. Some com movimento reduzido. */}
              <span
                aria-hidden="true"
                className="relative block h-10 w-px overflow-hidden bg-line"
              >
                <span className="motion-ok:animate-[lume-scroll-hint_2.4s_var(--ease-lume)_infinite] absolute inset-x-0 top-0 block h-4 bg-accent" />
              </span>
            </div>

            <dl className="hidden gap-10 sm:flex">
              {FACTS.map(([label, value]) => (
                <div key={label} className="text-right">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-2 font-display text-subtitle text-content">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
