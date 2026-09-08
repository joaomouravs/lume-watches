"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

type SiteContextValue = {
  /** true quando o loader termina. O Hero espera por isto para entrar. */
  ready: boolean;
  setScrollLocked: (locked: boolean) => void;
  scrollTo: (hash: string) => void;
};

const SiteContext = createContext<SiteContextValue>({
  ready: false,
  setScrollLocked: () => {},
  scrollTo: () => {},
});

export const useSite = () => useContext(SiteContext);
export const useSiteReady = () => useContext(SiteContext).ready;

export function SiteShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);

  // O scroll fica travado enquanto o loader está na tela e enquanto o menu
  // mobile está aberto.
  const { scrollTo } = useSmoothScroll(ready && !locked);

  /* O Lenis marca `.lenis-stopped` no <html>, mas em prefers-reduced-motion ele
     nem é instanciado — sem este atributo o menu abriria com a página rolando
     por baixo justamente para quem mais precisa de estabilidade. */
  useEffect(() => {
    document.documentElement.dataset.scrollLocked = String(locked);
    return () => {
      delete document.documentElement.dataset.scrollLocked;
    };
  }, [locked]);

  const setScrollLocked = useCallback((value: boolean) => setLocked(value), []);

  const value = useMemo(
    () => ({ ready, setScrollLocked, scrollTo }),
    [ready, setScrollLocked, scrollTo],
  );

  return (
    <SiteContext.Provider value={value}>
      <Loader onComplete={() => setReady(true)} />
      <Header />
      {children}
    </SiteContext.Provider>
  );
}
