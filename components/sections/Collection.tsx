"use client";

import Image from "next/image";
import { useRef } from "react";
import { watches, watchName, type Watch } from "@/data/watches";
import { WATCH_PHOTOS } from "@/lib/images";
import { CONTACT_EMAIL } from "@/lib/nav";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { gsap, useGSAP, MM } from "@/lib/gsap";
import { SectionMark } from "@/components/ui/SectionMark";
import { Button } from "@/components/ui/Button";

function enquiryHref(watch: Watch) {
  const subject = encodeURIComponent(`Consulta · ${watchName(watch)}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}`;
}

function WatchCard({ watch }: { watch: Watch }) {
  const photo = WATCH_PHOTOS[watch.id];

  return (
    <article
      data-card
      id={watch.id}
      /* A largura sai da altura da viewport: com a imagem em 3:4, o card
         inteiro cabe em 100svh em qualquer tela — condição para o pin
         horizontal nunca cortar o preço no rodapé do card. */
      className="group w-full shrink-0 gallery:w-[clamp(15rem,42svh,26rem)]"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-surface">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          /* O card chega no máximo a 26rem no desktop; no mobile ocupa a
             largura da viewport menos as margens laterais. */
          sizes="(min-width: 1024px) 26rem, (min-width: 768px) 24rem, calc(100vw - 3rem)"
          quality={80}
          className="object-cover transition-transform duration-1000 ease-lume group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
        />
      </div>

      <p className="eyebrow mt-6">Referência {watch.reference}</p>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-subtitle text-content">
          {watchName(watch)}
        </h3>
        <p className="shrink-0 font-display text-subtitle text-accent">
          {watch.price}
        </p>
      </div>

      {/* Duas colunas em vez de uma lista empilhada: corta ~120px de altura do
          card, que é exatamente o que permite aumentar a imagem. */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5">
        <div>
          <dt className="eyebrow">Caixa</dt>
          <dd className="mt-1.5 text-body text-subtle">{watch.caseSpec}</dd>
        </div>
        <div>
          <dt className="eyebrow">Mostrador</dt>
          <dd className="mt-1.5 text-body text-subtle">{watch.dial}</dd>
        </div>
        <div className="col-span-2">
          <dt className="eyebrow">Movimento</dt>
          <dd className="mt-1.5 text-body text-subtle">
            {watch.movement}, {watch.powerReserve}
          </dd>
        </div>
      </dl>

      <a
        href={enquiryHref(watch)}
        className="tap-target group/link mt-6 inline-flex items-center gap-3 text-[0.6875rem] uppercase leading-none tracking-[0.25em] text-content transition-colors duration-500 ease-lume hover:text-accent"
      >
        Consultar
        <span className="sr-only">{watchName(watch)}</span>
        <span
          aria-hidden="true"
          className="block h-px w-5 bg-current transition-transform duration-500 ease-lume group-hover/link:translate-x-1"
        />
      </a>
    </article>
  );
}

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useHorizontalScroll(root, track, { progressRef: progress });

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
      aria-labelledby="colecao-label"
      className="section-y relative bg-canvas gallery:h-[100svh] gallery:overflow-hidden gallery:py-0"
    >
      <div className="gallery:flex gallery:h-full gallery:items-center">
        <div
          ref={track}
          className="container-lume flex flex-col gap-24 gallery:mx-0 gallery:w-max gallery:max-w-none gallery:px-[var(--edge)] gallery:flex-row gallery:items-center gallery:gap-[clamp(3.5rem,7vw,8rem)]"
        >
          {/* Painel de abertura: no desktop ele é o primeiro item do track e
              sai da tela junto com os cards, em vez de ficar como um título
              fixo por cima. */}
          <header className="gallery:w-[clamp(16rem,22vw,22rem)] gallery:shrink-0">
            <SectionMark index="03" label="Coleção" id="colecao-label" />
            <p className="mt-8 font-display text-title text-content">
              Três referências.
            </p>
            <p className="mt-6 max-w-[34ch] text-body text-muted">
              O mesmo calibre, três leituras de superfície. Escolher é uma
              questão de luz.
            </p>
          </header>

          {watches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}

          {/* Painel de fechamento: dá ao track um fim composto em vez de um
              corte seco, e alonga o percurso horizontal do pin. */}
          <aside className="gallery:w-[clamp(15rem,20vw,20rem)] gallery:shrink-0">
            <p className="eyebrow">Sob encomenda</p>
            <p className="mt-6 font-display text-subtitle text-content">
              Oito semanas entre o pedido e o punho.
            </p>
            <Button
              href={`mailto:${CONTACT_EMAIL}`}
              variant="ghost"
              className="mt-8 text-accent"
            >
              Falar com o atelier
            </Button>
          </aside>
        </div>
      </div>

      {/* Só existe enquanto a galeria é horizontal: num pin longo o usuário
          precisa saber quanto falta. */}
      <div className="pin-progress hidden gallery:block" aria-hidden="true">
        <span ref={progress} />
      </div>
    </section>
  );
}
