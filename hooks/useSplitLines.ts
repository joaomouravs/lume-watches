"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Options = {
  /** Início do ScrollTrigger. */
  start?: string;
  /** Intervalo entre linhas, em segundos. */
  stagger?: number;
  delay?: number;
};

const WORD = "lume-word";
const LINE = "lume-line";
const INNER = "lume-line-inner";

/**
 * SplitText manual (o plugin oficial é pago) + reveal linha a linha.
 *
 * O texto continua no HTML como texto corrente — bom para SEO, para leitores de
 * tela e para o caso de o JS falhar. O split acontece só depois da montagem:
 *
 *   1. cada palavra vira um `<span>` e o layout roda normalmente;
 *   2. as palavras são agrupadas pelo `offsetTop` — é o próprio navegador que
 *      nos diz onde cada linha quebrou, então o efeito acompanha qualquer
 *      largura, `clamp()` e troca de fonte sem uma única media query;
 *   3. cada grupo é reembalado em um wrapper com `overflow: hidden` e um filho
 *      que sobe de baixo. A máscara é o wrapper, e não um `opacity`, porque é
 *      isso que dá a sensação de o texto "entrar" na página.
 *
 * O `ResizeObserver` refaz o agrupamento quando a largura muda: as quebras são
 * outras, e reaproveitar as antigas produziria linhas cortadas no meio.
 */
export function useSplitLines(
  ref: RefObject<HTMLElement | null>,
  { start = "top 80%", stagger = 0.09, delay = 0 }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const source = el.textContent ?? "";
    let trigger: ScrollTrigger | null = null;
    let lastWidth = 0;

    const build = () => {
      trigger?.kill();

      // Passo 1 — uma palavra por span, para poder medir as quebras.
      el.textContent = "";
      const words = source.split(/\s+/).filter(Boolean);
      const spans = words.map((word) => {
        const span = document.createElement("span");
        span.className = WORD;
        span.textContent = word;
        el.append(span, document.createTextNode(" "));
        return span;
      });

      // Passo 2 — agrupar por linha visual.
      const lines: string[][] = [];
      let top: number | null = null;
      for (const span of spans) {
        const y = Math.round(span.offsetTop);
        if (top === null || Math.abs(y - top) > 2) {
          lines.push([]);
          top = y;
        }
        lines[lines.length - 1].push(span.textContent ?? "");
      }

      // Passo 3 — reembalar em wrapper + filho animável.
      el.textContent = "";
      const inners: HTMLElement[] = [];
      for (const line of lines) {
        const wrapper = document.createElement("span");
        wrapper.className = LINE;
        const inner = document.createElement("span");
        inner.className = INNER;
        inner.textContent = line.join(" ");
        wrapper.append(inner);
        el.append(wrapper);
        inners.push(inner);
      }

      gsap.set(inners, { yPercent: 110 });
      trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () =>
          gsap.to(inners, {
            yPercent: 0,
            duration: 1.2,
            delay,
            ease: "lume",
            stagger,
          }),
      });
    };

    build();
    lastWidth = el.offsetWidth;

    const observer = new ResizeObserver(() => {
      // Só a largura muda as quebras; a altura muda por causa do próprio split.
      if (Math.abs(el.offsetWidth - lastWidth) < 2) return;
      lastWidth = el.offsetWidth;
      build();
      ScrollTrigger.refresh();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      trigger?.kill();
      el.textContent = source;
    };
  }, [ref, start, stagger, delay]);
}
