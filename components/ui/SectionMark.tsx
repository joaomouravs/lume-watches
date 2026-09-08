"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * Cabeçalho de capítulo: número, um fio e o rótulo.
 *
 * Repetir o mesmo dispositivo em todas as seções é o que faz a página ler como
 * um documento e não como componentes empilhados — o usuário reconhece que
 * mudou de capítulo antes de ler o texto.
 *
 * A animação vive aqui, e não nas seções, para que o gesto seja idêntico nas
 * quatro ocorrências sem depender de ninguém lembrar de chamar um hook.
 */
export function SectionMark({
  index,
  label,
  id,
  className = "",
}: {
  index: string;
  label: ReactNode;
  /** Id do rótulo, para o `aria-labelledby` da seção. */
  id?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM.motion, () => {
        const rule = root.current?.querySelector("[data-mark-rule]");
        const text = root.current?.querySelectorAll("[data-mark-text]");
        if (!rule || !text) return;

        gsap.set(rule, { scaleX: 0 });
        gsap.set(text, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });
        tl.to(text, { opacity: 1, duration: 0.7, ease: "lume", stagger: 0.12 })
          .to(rule, { scaleX: 1, duration: 0.9, ease: "lume" }, 0.1);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`flex items-center gap-5 ${className}`}>
      <span data-mark-text className="eyebrow tabular-nums">
        {index}
      </span>
      <span
        aria-hidden="true"
        data-mark-rule
        className="block h-px w-10 origin-left bg-line-strong sm:w-16"
      />
      <h2 data-mark-text id={id} className="eyebrow text-content">
        {label}
      </h2>
    </div>
  );
}
