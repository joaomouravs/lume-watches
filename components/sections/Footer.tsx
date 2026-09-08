"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const LINKS = [
  { label: "Coleção", href: "#colecao" },
  { label: "Movimento", href: "#movimento" },
  { label: "Contato", href: "mailto:atelier@lume.watch" },
];

function Newsletter() {
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [email, setEmail] = useState("");

  return (
    <form
      className="mt-8 max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("done");
      }}
    >
      <label htmlFor="newsletter" className="eyebrow">
        Cartas do atelier
      </label>

      {/* A régua é um pseudo-elemento escalado no focus-within: o input não
          muda de altura, então nada na coluna se desloca quando ele recebe
          foco. */}
      <div className="group relative mt-4 flex items-center gap-4 border-b border-bone/20 pb-3 focus-within:border-bone/20">
        <input
          id="newsletter"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full bg-transparent text-body text-bone outline-none placeholder:text-steel"
        />
        <button
          type="submit"
          className="eyebrow shrink-0 text-bone transition-[opacity,transform] duration-[800ms] ease-lume hover:-translate-y-px hover:opacity-70"
        >
          Assinar
        </button>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-[900ms] ease-lume group-focus-within:scale-x-100"
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-4 text-body text-steel transition-opacity duration-[800ms] ease-lume"
      >
        {status === "done"
          ? "Obrigado. Escrevemos quatro vezes por ano — nunca mais que isso."
          : "Quatro cartas por ano. Nada além disso."}
      </p>
    </form>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, "[data-footer-item]", { y: 20, stagger: 0.08 });

  return (
    <footer
      id="contato"
      ref={root}
      className="border-t border-bone/10 bg-ink pt-[12svh] pb-12 gutter"
    >
      <div className="grid-12 gap-y-16">
        <div data-footer-item className="col-span-12 lg:col-span-5">
          <p className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-[-0.02em] text-bone">
            LUME
          </p>
          <p className="mt-6 max-w-[28ch] text-body text-steel">
            Time, quietly. Genebra, desde 2019.
          </p>
        </div>

        <nav
          data-footer-item
          aria-label="Navegação do rodapé"
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        >
          <h2 className="eyebrow">Navegar</h2>
          <ul className="mt-6 space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-body text-bone/85 transition-colors duration-[800ms] ease-lume hover:text-brass"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-footer-item className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Newsletter />
        </div>
      </div>

      <div
        data-footer-item
        className="mt-24 flex flex-col gap-3 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="eyebrow">© 2026 LUME · Todos os direitos reservados</p>
        <p className="eyebrow">Projeto fictício · Portfólio front-end</p>
      </div>
    </footer>
  );
}
