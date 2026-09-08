"use client";

import { useEffect, useRef, type RefObject } from "react";
import { NAV_ITEMS, CONTACT_EMAIL, CONTACT_HREF } from "@/lib/nav";
import { useSite } from "@/components/SiteShell";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  /** Botão que abriu o menu — o foco volta para ele ao fechar. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileMenu({ open, onClose, onNavigate, triggerRef }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const { setScrollLocked } = useSite();

  useEffect(() => {
    setScrollLocked(open);

    if (open) {
      closeButton.current?.focus();
    } else if (wasOpen.current) {
      /* Só devolve o foco se o menu esteve aberto: sem esta guarda o efeito
         roubaria o foco na primeira montagem, quando ninguém pediu nada. */
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, setScrollLocked, triggerRef]);

  /* Esc fecha; Tab circula dentro do painel. Sem o ciclo, o foco sairia para o
     conteúdo atrás de um overlay que cobre a tela inteira — o usuário de
     teclado ficaria navegando às cegas. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;

      const items = Array.from(
        panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { clipPath: "none", opacity: open ? 1 : 0 });
        return;
      }

      if (open) {
        /* O painel desce como uma cortina e os links sobem por baixo de uma
           máscara. Os dois gestos vão em direções opostas de propósito: é o que
           dá a sensação de duas camadas em vez de um bloco só aparecendo. */
        gsap
          .timeline()
          .fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "lume" },
          )
          .fromTo(
            el.querySelectorAll("[data-menu-item]"),
            { yPercent: 120 },
            { yPercent: 0, duration: 0.8, ease: "lume", stagger: 0.06 },
            0.15,
          )
          .fromTo(
            el.querySelectorAll("[data-menu-meta]"),
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            0.4,
          );
      } else {
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.45,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      id="menu-mobile"
      ref={panel}
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-overlay bg-canvas lg:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ clipPath: "inset(0 0 100% 0)" }}
    >
      <div className="container-lume flex h-16 items-center justify-between md:h-20">
        <span className="font-display text-xl leading-none tracking-[0.22em] text-content">
          LUME
        </span>
        <button
          type="button"
          ref={closeButton}
          onClick={onClose}
          className="-mr-2 flex h-11 w-11 items-center justify-center"
        >
          <span className="sr-only">Fechar menu</span>
          <span aria-hidden="true" className="relative block h-6 w-6">
            <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-content" />
            <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-content" />
          </span>
        </button>
      </div>

      <nav
        aria-label="Menu"
        className="container-lume flex h-[calc(100svh-4rem)] flex-col justify-between pb-10 md:h-[calc(100svh-5rem)]"
      >
        <ul className="mt-[8svh] flex flex-col gap-2">
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href} className="overflow-hidden">
              <a
                data-menu-item
                href={item.href}
                onClick={(event) => onNavigate(event, item.href)}
                className="flex items-baseline gap-5 py-2 font-display text-[clamp(2.5rem,13vw,4rem)] leading-[1.05] tracking-[-0.02em] text-content transition-colors duration-500 ease-lume hover:text-accent"
              >
                <span className="eyebrow shrink-0 translate-y-[-0.55em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div data-menu-meta className="flex flex-col gap-5">
          <span className="h-px w-full bg-line" />
          <a
            href={CONTACT_HREF}
            className="tap-target text-lead text-content transition-colors duration-500 ease-lume hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="eyebrow">Atelier LUME · Genebra</p>
        </div>
      </nav>
    </div>
  );
}
