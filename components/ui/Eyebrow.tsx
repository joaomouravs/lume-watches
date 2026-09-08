import type { ElementType, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

/** Rótulo de seção: 11px, caixa alta, tracking 0.25em, cor `muted`. */
export function Eyebrow({ as: Tag = "p", className = "", ...rest }: Props) {
  return <Tag className={`eyebrow ${className}`} {...rest} />;
}
