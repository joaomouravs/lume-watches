"use client";

import { useId, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { NAV_ITEMS, CONTACT_EMAIL, CONTACT_HREF } from "@/lib/nav";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Status = "idle" | "error" | "done";

function Newsletter() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const message =
    status === "done"
      ? "Obrigado. Escrevemos quatro vezes por ano — nunca mais que isso."
      : status === "error"
        ? "Confira o endereço: falta o @ ou o domínio."
        : "Quatro cartas por ano. Nada além disso.";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        /* Validação própria em vez da nativa: a bolha do navegador não segue a
           tipografia da página e some sozinha. Aqui a mensagem vive num
           `aria-live`, então leitor de tela e olho recebem a mesma coisa. */
        setStatus(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "done" : "error");
      }}
    >
      <label htmlFor={id} className="eyebrow">
        Cartas do atelier
      </label>

      <div className="group relative mt-5 flex items-center gap-4 border-b border-line pb-3">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          aria-describedby={`${id}-status`}
          aria-invalid={status === "error"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="h-11 w-full bg-transparent text-body text-content outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="tap-target shrink-0 text-[0.6875rem] uppercase leading-none tracking-[0.25em] text-content transition-colors duration-500 ease-lume hover:text-accent"
        >
          Assinar
        </button>
        {/* A régua é um elemento escalado no focus-within: o input não muda de
            altura, então nada na coluna se desloca quando ele recebe foco. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-lume group-focus-within:scale-x-100"
        />
      </div>

      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        className={`mt-4 text-body ${status === "error" ? "text-accent" : "text-muted"}`}
      >
        {message}
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
      className="section-pt border-t border-line bg-canvas pb-12"
    >
      <Container>
        <div className="grid-12 gap-y-16">
          <div data-footer-item className="col-span-12 lg:col-span-5">
            {/* O wordmark grande fecha a página no mesmo tamanho em que ela
                abriu — é a rima que faz o scroll parecer um percurso e não uma
                lista. */}
            <p className="font-display text-mark-sm text-content">
              LUME
            </p>
            <p className="mt-8 max-w-[30ch] text-lead text-muted">
              Time, quietly. Genebra, desde 2019.
            </p>
            <a
              href={CONTACT_HREF}
              className="tap-target group mt-8 inline-flex items-center gap-3 text-lead text-content transition-colors duration-500 ease-lume hover:text-accent"
            >
              {CONTACT_EMAIL}
              <span
                aria-hidden="true"
                className="block h-px w-6 bg-current transition-transform duration-500 ease-lume group-hover:translate-x-1"
              />
            </a>
          </div>

          <nav
            data-footer-item
            aria-label="Rodapé"
            className="col-span-12 sm:col-span-6 lg:col-span-2 lg:col-start-7"
          >
            <Eyebrow as="h2">Navegar</Eyebrow>
            <ul className="mt-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="tap-target group flex items-center justify-between gap-4 border-b border-line py-3 text-body text-subtle transition-colors duration-500 ease-lume hover:text-content"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="block h-px w-4 bg-current opacity-0 transition-all duration-500 ease-lume group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            data-footer-item
            className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-9"
          >
            <Newsletter />
          </div>
        </div>

        <div
          data-footer-item
          className="mt-24 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <Eyebrow>© 2026 LUME · Todos os direitos reservados</Eyebrow>
          <Eyebrow>Projeto fictício · Portfólio front-end</Eyebrow>
        </div>
      </Container>
    </footer>
  );
}
