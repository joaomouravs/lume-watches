"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Loader } from "@/components/Loader";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * `ready` vira true quando o loader termina. O Hero espera por ele para tocar
 * a própria entrada — encadear as duas animações por contexto evita que a
 * página se mexa por baixo de uma tela que ainda está cobrindo tudo.
 */
const ReadyContext = createContext(false);
export const useSiteReady = () => useContext(ReadyContext);

export function SiteShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  // O scroll fica travado enquanto o loader está na tela.
  useSmoothScroll(ready);

  return (
    <ReadyContext.Provider value={ready}>
      <Loader onComplete={() => setReady(true)} />
      {children}
    </ReadyContext.Provider>
  );
}
