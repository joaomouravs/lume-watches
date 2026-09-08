import type { ElementType, ReactNode } from "react";

/**
 * Coluna de conteúdo do site. Margem lateral fluida com teto e centralização
 * acima do máximo — é o que mantém headings, imagens e listas de seções
 * diferentes na mesma linha de alinhamento.
 */
export function Container({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`container-lume ${className}`}>{children}</Tag>;
}
