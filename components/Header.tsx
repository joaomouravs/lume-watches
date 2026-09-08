"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, SECTION_IDS, CONTACT_HREF } from "@/lib/nav";
import { useSite } from "@/components/SiteShell";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { MobileMenu } from "@/components/MobileMenu";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Header() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Lido dentro do ScrollTrigger sem recriá-lo a cada abertura do menu.
  const openRef = useRef(false);
  const { ready, scrollTo } = useSite();
  const active = useScrollSpy(SECTION_IDS);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      /* Dois estados, um ScrollTrigger só:
         `data-scrolled` liga o fundo assim que a página sai do topo;
         `data-hidden`  recolhe a barra na descida e devolve na subida — em
                        telas baixas isso são 64px de conteúdo de volta, e o
                        gesto de subir é justamente quando o usuário procura
                        navegação.

         O critério é VELOCIDADE, não direção. Com `direction` a barra piscaria
         a cada micro-oscilação do trackpad e, pior, dentro das seções pinadas,
         onde o scrub inverte o sinal o tempo todo. A faixa morta entre -200 e
         +400 px/s absorve isso. */
      const trigger = ScrollTrigger.create({
        start: 80,
        end: "max",
        onUpdate: (self) => {
          el.dataset.scrolled = "true";
          const velocity = self.getVelocity();
          if (velocity > 400 && !openRef.current) el.dataset.hidden = "true";
          else if (velocity < -200 || openRef.current) el.dataset.hidden = "false";
        },
        onLeaveBack: () => {
          el.dataset.scrolled = "false";
          el.dataset.hidden = "false";
        },
      });

      return () => trigger.kill();
    },
    { scope: root },
  );

  /* A barra entra depois do loader, junto com o Hero.
     A animação vai no elemento INTERNO, não no <header>: ao assumir transforms
     o GSAP escreve "translate: none" inline, e isso anularia a regra que
     esconde e devolve a barra — ela anima justamente a propriedade translate. */
  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        inner.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.9, ease: "lume", delay: 0.5 },
      );
    },
    { scope: root, dependencies: [ready] },
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        ref={root}
        data-scrolled="false"
        data-hidden="false"
        className="site-header z-header"
      >
        <div
          ref={inner}
          className="container-lume flex h-16 items-center justify-between gap-6 md:h-20"
        >
          <a
            href="#hero"
            onClick={(event) => go(event, "#hero")}
            aria-label="LUME — início"
            className="font-display text-xl leading-none tracking-[0.22em] text-content transition-colors duration-500 ease-lume hover:text-accent"
          >
            LUME
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => go(event, item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className="tap-target group relative flex items-center text-[0.6875rem] uppercase leading-none tracking-[0.25em] text-muted transition-colors duration-500 ease-lume hover:text-content aria-[current]:text-content"
                    >
                      {item.label}
                      {/* A régua marca a seção corrente e também é o hover:
                          um sinal só, dois usos, sem elemento decorativo extra. */}
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-lume group-hover:scale-x-100 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={CONTACT_HREF}
            className="tap-target hidden items-center gap-3 text-[0.6875rem] uppercase leading-none tracking-[0.25em] text-content transition-colors duration-500 ease-lume hover:text-accent lg:flex"
          >
            Falar com o atelier
            <span
              aria-hidden="true"
              className="block h-px w-5 bg-current transition-transform duration-500 ease-lume hover:translate-x-1"
            />
          </a>

          <button
            type="button"
            ref={menuTrigger}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">Abrir menu</span>
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span className="block h-px w-full bg-content" />
              <span className="block h-px w-full bg-content" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={go}
        triggerRef={menuTrigger}
      />
    </>
  );
}
