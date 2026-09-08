"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Loader: o wordmark abre de 0.5em para 0.25em de tracking e a tela sai.
 * Orçamento total de 1.5s — a barra é fixa, não espera nenhum recurso.
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      let finished = false;

      /* Idempotente: quem chegar primeiro (timeline ou rede de segurança)
         encerra, o segundo não faz nada. */
      const finish = () => {
        if (finished) return;
        finished = true;
        gsap.set(root.current, { autoAlpha: 0, display: "none" });
        onComplete();
      };

      if (prefersReducedMotion()) {
        finish();
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      tl.fromTo(
        mark.current,
        { letterSpacing: "0.5em", opacity: 0 },
        { letterSpacing: "0.25em", opacity: 1, duration: 1, ease: "lume" },
      )
        // O wordmark sai antes do painel para o fundo não "descolar" do texto.
        .to(mark.current, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.95)
        .to(root.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 1);

      /* Rede de segurança. O GSAP anda no requestAnimationFrame, e o navegador
         congela o rAF em aba de fundo — quem abre o site num tab que não está
         à frente encontraria o loader parado e, pior, o scroll travado, porque
         é o fim do loader que solta o Lenis. `setTimeout` continua disparando
         em aba oculta (com throttle), então ele fecha esse buraco.

         2s: a timeline dura 1.5s; a margem cobre um frame lento sem que a
         rede corte a animação de quem está com a aba visível. */
      const safety = window.setTimeout(finish, 2000);

      return () => {
        window.clearTimeout(safety);
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      id="loader"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
    >
      {/* O tracking anima a partir do centro; o padding-left compensa o espaço
          que a última letra carrega à direita e mantém o bloco óptico centrado. */}
      <span
        ref={mark}
        className="pl-[0.5em] font-display text-[clamp(2rem,7vw,4.5rem)] text-bone opacity-0"
        style={{ letterSpacing: "0.5em" }}
      >
        LUME
      </span>
    </div>
  );
}
