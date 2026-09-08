"use client";

import { useRef } from "react";
import { useSplitLines } from "@/hooks/useSplitLines";
import { useReveal } from "@/hooks/useReveal";

const TEXT =
  "Um relógio não mede o tempo. Ele o guarda. Cada LUME nasce de trezentas horas de trabalho silencioso — e de tudo aquilo que decidimos não acrescentar.";

/**
 * Único ponto da página em que a paleta inverte: fundo bone, texto ink. A
 * troca funciona como uma respiração entre dois blocos escuros.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useSplitLines(text, { start: "top 78%", stagger: 0.1 });
  useReveal(root, "[data-manifesto-meta]", { y: 16, stagger: 0.12 });

  return (
    <section
      id="manifesto"
      ref={root}
      aria-labelledby="manifesto-title"
      className="bg-bone py-[18svh] text-ink gutter"
    >
      <div className="grid-12">
        <h2
          id="manifesto-title"
          data-manifesto-meta
          className="eyebrow col-span-12 text-graphite lg:col-span-2"
        >
          Manifesto
        </h2>

        <p
          ref={text}
          className="col-span-12 mt-10 font-display text-display text-ink lg:col-span-10 lg:mt-0"
        >
          {TEXT}
        </p>

        <p
          data-manifesto-meta
          className="col-span-12 mt-16 text-body text-graphite lg:col-start-3 lg:col-span-4"
        >
          Atelier LUME · Genebra
        </p>
      </div>
    </section>
  );
}
