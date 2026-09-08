"use client";

import { useEffect, useState } from "react";

/**
 * Devolve o id da seção que o usuário está lendo.
 *
 * O `rootMargin` recorta a viewport numa faixa estreita logo abaixo do header:
 * a seção "corrente" é a que cruza essa linha, e não a que ocupa mais pixels.
 * Com seções de alturas muito diferentes — o Movimento tem 300vh de pin, o
 * Manifesto tem uma tela — o critério de área elegeria o Movimento quase o
 * tempo todo.
 */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
