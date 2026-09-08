/** Navegação da página. Fonte única para o header, o menu mobile e o rodapé. */
export type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Movimento", href: "#movimento" },
  { label: "Coleção", href: "#colecao" },
  { label: "Detalhe", href: "#detalhe" },
];

/** Ids observados pelo scroll spy, na ordem em que aparecem na página. */
export const SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

export const CONTACT_EMAIL = "atelier@lume.watch";
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;
