"use client";

import { useRef } from "react";
import { useSplitLines } from "@/hooks/useSplitLines";
import { useReveal } from "@/hooks/useReveal";
import { Container } from "@/components/ui/Container";
import { SectionMark } from "@/components/ui/SectionMark";

const TEXT =
  "Um relógio não mede o tempo. Ele o guarda. Cada LUME nasce de trezentas horas de trabalho silencioso — e de tudo aquilo que decidimos não acrescentar.";

/**
 * Único ponto da página em que a paleta inverte. `data-theme="light"`
 * redefine os tokens semânticos para os filhos, então nenhum elemento aqui
 * precisa de cor explícita — `text-muted` já resolve para o tom que passa no
 * AA sobre bone.
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
      data-theme="light"
      aria-labelledby="manifesto-label"
      className="section-y-lg bg-canvas text-content"
    >
      <Container>
        <div className="grid-12 gap-y-12">
          <SectionMark
            index="01"
            label="Manifesto"
            id="manifesto-label"
            className="col-span-12 lg:col-span-3"
          />

          <p
            ref={text}
            className="col-span-12 font-display text-display lg:col-span-9"
          >
            {TEXT}
          </p>

          <div className="col-span-12 flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-line pt-8 lg:col-start-4 lg:col-span-9">
            <p data-manifesto-meta className="eyebrow">
              Atelier LUME · Genebra
            </p>
            <p data-manifesto-meta className="text-body text-muted">
              Trezentas horas por peça. Doze pares de mãos.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
