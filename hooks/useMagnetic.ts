"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Options = {
  /** Desliga o efeito sem mudar a ordem dos hooks. */
  enabled?: boolean;
  /** Fração do deslocamento do cursor que o elemento acompanha. */
  strength?: number;
  /** Margem, em px, além da caixa do elemento onde o efeito já começa. */
  padding?: number;
};

/**
 * Botão magnético: o elemento acompanha o cursor dentro de um raio e volta ao
 * lugar quando ele sai.
 *
 * O listener é de `pointermove` no documento, não de `mouseenter` no elemento:
 * assim a atração começa ANTES do cursor tocar o botão, que é o que dá a
 * sensação de ímã em vez de um salto no hover.
 *
 * `quickTo` em vez de `gsap.to` por frame — ele reaproveita o mesmo tween e
 * não aloca um objeto novo a cada movimento do mouse.
 */
export function useMagnetic<T extends HTMLElement>({
  enabled = true,
  strength = 0.32,
  padding = 28,
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!canHover.matches) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const inside =
        event.clientX >= box.left - padding &&
        event.clientX <= box.right + padding &&
        event.clientY >= box.top - padding &&
        event.clientY <= box.bottom + padding;

      if (inside) {
        moveX((event.clientX - cx) * strength);
        moveY((event.clientY - cy) * strength);
      } else {
        moveX(0);
        moveY(0);
      }
    };

    // O reset no scroll evita o botão ficar deslocado depois que a página
    // rolou por baixo de um cursor parado.
    const reset = () => {
      moveX(0);
      moveY(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [enabled, strength, padding]);

  return ref;
}
