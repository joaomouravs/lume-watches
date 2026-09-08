"use client";

import Image from "next/image";
import { useRef } from "react";
import { watches, watchName, type Watch } from "@/data/watches";
import { WATCH_PHOTOS } from "@/lib/images";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { gsap, useGSAP, MM } from "@/lib/gsap";

function WatchCard({ watch }: { watch: Watch }) {
  const photo = WATCH_PHOTOS[watch.id];

  return (
    <article
      data-card
      id={watch.id}
      /* A largura sai da altura da viewport: com a imagem em 3:4, o card
         inteiro cabe em 100svh em qualquer tela — condição para o pin
         horizontal nunca cortar o preço no rodapé do card. */
      className="w-full shrink-0 gallery:w-[clamp(15rem,42svh,26rem)]"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-steel/20">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          /* O card chega no máximo a 26rem no desktop; no mobile ocupa a
             largura da viewport menos as margens laterais. */
          sizes="(min-width: 1024px) 26rem, (min-width: 768px) 24rem, calc(100vw - 3rem)"
          quality={80}
          className="object-cover"
        />
      </div>

      <p className="eyebrow mt-6">Referência {watch.reference}</p>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[clamp(1.4rem,2vw,1.9rem)] tracking-[-0.02em] text-bone">
          {watchName(watch)}
        </h3>
        <p className="shrink-0 font-display text-[clamp(1.1rem,1.4vw,1.4rem)] text-brass">
          {watch.price}
        </p>
      </div>

      {/* Duas colunas em vez de uma lista empilhada: corta ~120px de altura do
          card, que é exatamente o que permite aumentar a imagem. */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-bone/10 pt-5">
        <div>
          <dt className="eyebrow">Caixa</dt>
          <dd className="mt-1.5 text-body text-bone/85">{watch.caseSpec}</dd>
        </div>
        <div>
          <dt className="eyebrow">Mostrador</dt>
          <dd className="mt-1.5 text-body text-bone/85">{watch.dial}</dd>
        </div>
        <div className="col-span-2">
          <dt className="eyebrow">Movimento</dt>
          <dd className="mt-1.5 text-body text-bone/85">
            {watch.movement}, {watch.powerReserve}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useHorizontalScroll(root, track);

  // Sem galeria (mobile ou viewport baixa) não há pin: cada card entra sozinho.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.stacked, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
        cards.forEach((card) => {
          gsap.set(card, { opacity: 0, y: 32 });
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "lume",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="colecao"
      ref={root}
      aria-labelledby="colecao-title"
      className="relative bg-ink py-[14svh] gallery:h-[100svh] gallery:overflow-hidden gallery:py-0"
    >
      <div className="gallery:flex gallery:h-full gallery:items-center">
        <div
          ref={track}
          className="flex flex-col gap-24 gutter gallery:w-max gallery:flex-row gallery:items-center gallery:gap-[clamp(3.5rem,7vw,8rem)]"
        >
          {/* Painel de abertura: no desktop ele é o primeiro item do track e
              sai da tela junto com os cards, em vez de ficar como um título
              fixo por cima. */}
          <header className="gallery:w-[clamp(16rem,22vw,22rem)] gallery:shrink-0">
            <p className="eyebrow">Coleção · 2026</p>
            <h2
              id="colecao-title"
              className="mt-8 font-display text-title text-bone"
            >
              Três referências.
            </h2>
            <p className="mt-6 max-w-[34ch] text-body text-steel">
              O mesmo calibre, três leituras de superfície. Escolher é uma
              questão de luz.
            </p>
          </header>

          {watches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}

          {/* Painel de fechamento: dá ao track um fim composto em vez de um
              corte seco, e alonga o percurso horizontal do pin. */}
          <aside className="gallery:w-[clamp(14rem,18vw,18rem)] gallery:shrink-0">
            <p className="eyebrow">Sob encomenda</p>
            <p className="mt-6 font-display text-[clamp(1.5rem,2.2vw,2rem)] tracking-[-0.02em] text-bone">
              Oito semanas entre o pedido e o punho.
            </p>
            <a
              href="mailto:atelier@lume.watch"
              className="eyebrow mt-8 inline-block border-b border-brass/40 pb-1 text-brass transition-colors duration-[800ms] ease-lume hover:border-brass"
            >
              Falar com o atelier
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
