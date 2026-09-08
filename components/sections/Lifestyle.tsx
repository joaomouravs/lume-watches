"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";
import { LIFESTYLE } from "@/lib/images";

export function Lifestyle() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM.motion, () => {
        /* O reveal é por clip-path e não por escala: a imagem não se move,
           quem se move é a janela por onde ela aparece. Os quatro valores do
           `inset()` são escritos por extenso nos dois estados porque o
           navegador só interpola clip-paths com a mesma assinatura. */
        gsap.fromTo(
          media.current,
          { clipPath: "inset(14% 14% 14% 14%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          quote.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "lume",
            scrollTrigger: { trigger: root.current, start: "top 45%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="lifestyle"
      ref={root}
      aria-label="LUME em uso"
      className="relative isolate h-[110svh] overflow-hidden bg-ink"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={media} className="absolute inset-0">
          <Image
            src={LIFESTYLE.src}
            alt={LIFESTYLE.alt}
            fill
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/40"
          />
        </div>

        <div className="relative flex h-full items-end pb-[12svh] gutter">
          <blockquote
            ref={quote}
            className="max-w-[22ch] font-display text-display text-bone"
          >
            Quem sabe as horas não precisa mostrá-las.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
