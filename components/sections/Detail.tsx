"use client";

import Image from "next/image";
import { useRef } from "react";
import { useParallax } from "@/hooks/useParallax";
import { useReveal } from "@/hooks/useReveal";
import { DETAIL_MACRO } from "@/lib/images";

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
  useParallax(media, { amount: 10, triggerRef: frame });
  useReveal(root, "[data-spec]", { y: 20, stagger: 0.06, start: "top 72%" });

  return (
    <section
      id="detalhe"
      ref={root}
      aria-labelledby="detalhe-title"
      className="bg-ink md:grid md:grid-cols-2 md:items-start"
    >
      <div
        ref={frame}
        className="parallax-frame h-[62svh] md:sticky md:top-0 md:h-[100svh]"
      >
        <div ref={media} className="parallax-media">
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

      <div className="px-[max(1.5rem,8vw)] py-[14svh] md:pl-[clamp(2.5rem,5vw,5rem)] md:pr-[max(1.5rem,8vw)]">
        <p data-spec className="eyebrow">
          Ficha técnica
        </p>
        <h2
          id="detalhe-title"
          data-spec
          className="mt-8 font-display text-title text-bone"
        >
          Tudo que existe tem uma razão para existir.
        </h2>

        <dl className="mt-14 border-t border-bone/10">
          {SPECS.map(([label, value]) => (
            <div
              key={label}
              data-spec
              className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <dt className="eyebrow sm:w-48 sm:shrink-0">{label}</dt>
              <dd className="text-body text-bone/85">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
