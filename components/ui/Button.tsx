"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type Variant = "solid" | "outline" | "ghost";

type Common = {
  variant?: Variant;
  /** Atração ao cursor. Só age em ponteiro fino e sem movimento reduzido. */
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

type AnchorProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type Props = AnchorProps | ButtonProps;

/* min-h-11 = 44px, o alvo de toque mínimo. A caixa é retangular de propósito:
   a marca é toda de arestas vivas, e um pill aqui denunciaria template. */
const base =
  "group relative isolate inline-flex min-h-11 items-center justify-center gap-3 " +
  "overflow-hidden font-sans text-[0.6875rem] uppercase leading-none " +
  "tracking-[0.25em] transition-colors duration-500 ease-lume";

const variants: Record<Variant, string> = {
  solid: "bg-content px-6 text-canvas",
  outline: "border border-line-strong px-6 text-content hover:text-canvas",
  ghost: "text-content hover:text-accent",
};

/**
 * O preenchimento sobe de baixo em vez de aparecer por opacidade: `scaleY` é
 * composto na GPU, e o gesto de subir dá direção ao hover — o botão responde
 * ao cursor que vem de fora em vez de piscar.
 */
function Fill({ variant }: { variant: Variant }) {
  if (variant === "solid") return null;

  if (variant === "ghost") {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-lume group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-content transition-transform duration-700 ease-lume group-hover:scale-y-100 group-focus-visible:scale-y-100"
    />
  );
}

export function Button({
  variant = "outline",
  magnetic = false,
  className = "",
  children,
  href,
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>({
    enabled: magnetic,
  });
  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      <Fill variant={variant} />
      <span className="relative">{children}</span>
      <span
        aria-hidden="true"
        className="relative block h-px w-4 bg-current transition-transform duration-500 ease-lume group-hover:translate-x-1"
      />
    </>
  );

  if (href !== undefined) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
