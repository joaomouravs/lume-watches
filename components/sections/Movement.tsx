"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  DISASSEMBLY_STEPS,
  EXPOSED,
  MOVEMENT_LAYERS,
  type MovementLayer,
} from "@/lib/movement";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { SectionMark } from "@/components/ui/SectionMark";

/**
 * `sizes` derivado da escala da própria camada.
 *
 * Todas as camadas ocupam o palco inteiro no layout — o que as encolhe é um
 * `transform: scale()`, que o navegador não considera ao escolher a imagem do
 * srcset. Sem isto, a roda de 12 dentes renderizada com 60px baixaria um arquivo
 * de 700px, dezessete vezes. Com isto, cada peça pede aproximadamente o tamanho
 * em que realmente aparece.
 */
function layerSizes(scale: number) {
  const lg = Math.max(4, Math.round(scale * 72));
  const md = Math.max(5, Math.round(scale * 64));
  const sm = Math.max(8, Math.round(scale * 84));
  return `(min-width: 1024px) ${lg}svh, (min-width: 768px) ${md}svh, ${sm}vw`;
}

function Layer({ layer }: { layer: MovementLayer }) {
  const spin = layer.spin;

  return (
    <div
      className="mv-place"
      style={
        {
          "--mv-x": layer.x,
          "--mv-y": layer.y,
          "--mv-s": layer.scale,
          opacity: layer.opacity ?? 1,
        } as React.CSSProperties
      }
    >
      <div className="mv-boom" data-layer={layer.id} data-group={layer.group}>
        <div
          className="mv-spin"
          data-spin={spin ? "" : undefined}
          data-oscillate={layer.oscillate ? layer.id : undefined}
          style={
            {
              "--mv-duration": spin ? `${spin.seconds}s` : undefined,
              "--mv-direction": spin && !spin.clockwise ? "reverse" : undefined,
              // Ponteiros: rotação fixa, aplicada no CSS e não pelo GSAP, para
              // que 10:10 seja o estado de repouso mesmo sem JavaScript.
              transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
            } as React.CSSProperties
          }
        >
          <Image
            src={layer.src}
            alt=""
            fill
            sizes={layerSizes(layer.scale)}
            quality={72}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function Movement() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduced } = context.conditions as {
            isDesktop: boolean;
            reduced: boolean;
          };

          // Movimento reduzido: relógio montado e parado. Sem pin, sem
          // timeline, sem oscilação — e o CSS já desligou as rotações.
          if (reduced) return;

          /* Oscilação do balanço e da âncora. Ficam no GSAP (e não no CSS como
             as rotações contínuas) porque `sine.inOut` num yoyo é o perfil de
             velocidade real de um oscilador: rápido no meio do curso, parado
             nos extremos. A âncora usa o mesmo período porque é o balanço que
             a empurra — os dois batem juntos ou o escapamento não faz sentido. */
          for (const layer of MOVEMENT_LAYERS) {
            if (!layer.oscillate) continue;
            const el = stage.current?.querySelector(
              `[data-oscillate="${layer.id}"]`,
            );
            if (!el) continue;

            gsap.fromTo(
              el,
              { rotation: -layer.oscillate.degrees },
              {
                rotation: layer.oscillate.degrees,
                duration: layer.oscillate.seconds,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              },
            );
          }

          /* Timeline da desmontagem. Duração total 1 para que as posições
             sejam lidas diretamente como progresso do scroll — 0.30 na
             timeline é 30% do trecho pinado. */
          const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${window.innerHeight * (isDesktop ? 3 : 2)}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              /* `will-change` custa uma camada de composição por elemento.
                 São 34 aqui — mantê-las durante a página inteira desperdiça
                 memória de GPU, então o atributo só liga enquanto a seção
                 está em cena. */
              onToggle: (self) => {
                stage.current?.setAttribute(
                  "data-stage-active",
                  String(self.isActive),
                );
              },
              onUpdate: (self) => {
                if (progress.current) {
                  gsap.set(progress.current, { scaleX: self.progress });
                }
              },
            },
          });

          const layersOf = (group: number) =>
            MOVEMENT_LAYERS.filter((l) => l.group === group).map(
              (l) => `[data-layer="${l.id}"]`,
            );

          for (const step of DISASSEMBLY_STEPS) {
            // Na saída, de cima para baixo: o cristal descola antes da caixa,
            // o ponteiro dos segundos antes do mostrador. Na volta, o inverso.
            const top = layersOf(step.group).reverse();
            const bottom = [...top].reverse();

            timeline
              .to(
                top,
                {
                  scale: 1.15,
                  opacity: 0,
                  duration: step.outDuration,
                  stagger: step.outDuration * 0.18,
                },
                step.out,
              )
              .to(
                bottom,
                {
                  scale: 1,
                  opacity: 1,
                  duration: step.backDuration,
                  stagger: step.backDuration * 0.18,
                },
                step.back,
              );
          }

          timeline
            .fromTo(
              copy.current,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.08 },
              EXPOSED.textIn,
            )
            .to(copy.current, { opacity: 0, y: -16, duration: 0.06 }, EXPOSED.textOut);

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="movimento"
      ref={root}
      aria-labelledby="movimento-label"
      className="relative isolate min-h-[100svh] overflow-hidden bg-canvas"
    >
      <div className="relative flex min-h-[100svh] items-center justify-center lg:justify-end lg:pr-[var(--edge)]">
        <div
          ref={stage}
          className="movement-stage"
          data-stage-active="false"
          role="img"
          aria-label="Vista explodida do calibre LUME LM-38: o relógio se abre camada por camada, do cristal à platina, e volta a se montar."
        >
          {MOVEMENT_LAYERS.map((layer) => (
            <Layer key={layer.id} layer={layer} />
          ))}
        </div>

        <div
          ref={copy}
          className="pointer-events-none absolute inset-0 flex items-start pt-[max(6rem,12svh)] lg:items-center lg:pt-0"
        >
          {/* No lg o palco é empurrado para a direita e esta coluna ocupa a
              faixa que sobra à esquerda — 34rem é a largura máxima que não
              encosta na caixa do relógio. */}
          <Container>
            <div className="max-w-[42ch] lg:max-w-[34rem]">
              <SectionMark index="02" label="Movimento" id="movimento-label" />
              <p className="mt-8 font-display text-title text-content">
                Vinte e nove rubis. Quarenta e duas horas. Nenhum ruído.
              </p>
              <p className="mt-6 text-body text-muted">
                Dezessete peças, montadas e reguladas à mão em cinco posições.
                Você nunca vai ver o calibre funcionando — e é exatamente esse
                o ponto.
              </p>
            </div>
          </Container>
        </div>
      </div>

      <div className="pin-progress" aria-hidden="true">
        <span ref={progress} />
      </div>

      {/* As camadas são decorativas para a AT (o palco já tem `role="img"` com
          a descrição). Esta lista dá a quem usa leitor de tela o conteúdo real
          da vista explodida. */}
      <ul className="sr-only">
        {MOVEMENT_LAYERS.map((layer) => (
          <li key={layer.id}>{layer.label}</li>
        ))}
      </ul>
    </section>
  );
}
