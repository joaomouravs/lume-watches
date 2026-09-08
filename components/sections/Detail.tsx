"use client";

import Image from "next/image";
import { useRef } from "react";
import { useParallax } from "@/hooks/useParallax";
import { useReveal } from "@/hooks/useReveal";
import { DETAIL_MACRO } from "@/lib/images";
import { SectionMark } from "@/components/ui/SectionMark";

const SPECS = [
  ["Diâmetro", "38,0 mm"],
  ["Espessura", "9,4 mm"],
  ["Calibre", "LM-38, automático"],
  ["Frequência", "28.800 A/h"],
  ["Rubis", "29"],
  ["Reserva de marcha", "42 h · 70 h na referência 03"],
  ["Cristal", "Safira dupla, antirreflexo interno"],
  ["Fundo", "Safira transparente"],
  ["Estanqueidade", "50 m"],
  ["Garantia", "5 anos"],
] as const;

export function Detail() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  // O gatilho é a moldura, não a seção: a coluna esquerda é sticky e ficaria
  // com um intervalo de scroll muito maior que o próprio deslocamento.
  //
  // E o parallax só roda no desktop: é lá que o quadro (100svh) é bem mais
  // alto que a placa 16:9, deixando folga para a foto deslizar. No mobile a
  // placa preenche o quadro exatamente — mover não teria para onde ir.
  useParallax(media, {
    amount: 9,
    triggerRef: frame,
    media: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  });
  useReveal(root, "[data-spec]", { y: 20, stagger: 0.06, start: "top 72%" });

  return (
    <section
      id="detalhe"
      ref={root}
      aria-labelledby="detalhe-label"
      className="bg-canvas md:grid md:grid-cols-2 md:items-start"
    >
      {/* No mobile o quadro tem a altura da própria placa. No desktop ele vira
          uma coluna de 100svh e a placa fica centrada nela — o vão de canvas em
          cima e embaixo é o curso do parallax, e é o que permite mostrar o
          macro inteiro em vez de uma tira do meio. */}
      <div
        ref={frame}
        className="parallax-frame flex items-center md:sticky md:top-0 md:h-[100svh]"
      >
        <div
          ref={media}
          className="parallax-plate"
          style={{
            aspectRatio: `${DETAIL_MACRO.width} / ${DETAIL_MACRO.height}`,
          }}
        >
          <Image
            src={DETAIL_MACRO.src}
            alt={DETAIL_MACRO.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={82}
            className="object-cover"
          />
        </div>
      </div>

      <div className="section-y gutter md:pl-[clamp(2.5rem,5vw,5rem)]">
        <div className="max-w-[42rem]">
          <SectionMark index="04" label="Detalhe" id="detalhe-label" />

          <p
            data-spec
            className="mt-8 font-display text-title text-content"
          >
            Tudo que existe tem uma razão para existir.
          </p>

          <dl className="mt-14 border-t border-line">
            {SPECS.map(([label, value]) => (
              <div
                key={label}
                data-spec
                className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <dt className="eyebrow sm:w-48 sm:shrink-0">{label}</dt>
                <dd className="text-body text-subtle">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
