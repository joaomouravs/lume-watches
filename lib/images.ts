/**
 * Todos os caminhos de imagem do site, em um lugar só.
 *
 * Nenhum componente monta string de caminho: importa daqui. Trocar um arquivo
 * é editar uma linha deste módulo.
 *
 * Os arquivos das pastas fornecidas (/hero, /vitrini, /foto-relogio,
 * /lifestyle) são referenciados EXATAMENTE como estão no disco — incluindo
 * espaços e cedilha. As camadas do movimento apontam para /movimento, que é
 * gerado por `npm run layers` a partir de /Engrenagens (ver
 * scripts/prepare-movement-layers.mjs para o porquê).
 */

export type ImageAsset = {
  src: string;
  /** Dimensões intrínsecas do arquivo, medidas com sharp. */
  width: number;
  height: number;
  alt: string;
};

/* ------------------------------------------------------------------- hero */

export const HERO_DESKTOP: ImageAsset = {
  src: "/hero/hero-desktop.png",
  width: 1672,
  height: 941,
  alt: "Pessoa sentada em uma sala de concreto sob luz rasante, com um relógio LUME no pulso.",
};

export const HERO_MOBILE: ImageAsset = {
  src: "/hero/hero-mobile.png",
  width: 941,
  height: 1672,
  alt: "Relógio LUME sobre superfície escura, iluminado por um facho estreito de luz.",
};

/* --------------------------------------------------------------- vitrine */

/**
 * As fotos da vitrine NÃO seguem a ordem dos nomes de arquivo. Conferindo cada
 * imagem contra a descrição do modelo em data/watches.ts:
 *
 *   vitrini.png    latão polido, mostrador champanhe, couro cognac  → LUME 03
 *   vitrini 2.png  aço jateado, mostrador cinza, bracelete de aço   → LUME 02
 *   vitrini 3.png  aço escovado, mostrador off-white, couro preto   → LUME 01
 *
 * Associar por ordem alfabética trocaria a Bone pela Brass.
 */
export const WATCH_PHOTOS: Record<string, ImageAsset> = {
  "lume-01-bone": {
    src: "/vitrini/vitrini 3.png",
    width: 1086,
    height: 1448,
    alt: "LUME 01 Bone: caixa de aço escovado, mostrador off-white laqueado e pulseira de couro preto.",
  },
  "lume-02-slate": {
    src: "/vitrini/vitrini 2.png",
    width: 1086,
    height: 1448,
    alt: "LUME 02 Slate: caixa de aço jateado, mostrador cinza-chumbo sunburst e bracelete de aço de três elos.",
  },
  "lume-03-brass": {
    src: "/vitrini/vitrini.png",
    width: 1086,
    height: 1448,
    alt: "LUME 03 Brass: caixa de latão polido, mostrador champanhe texturizado e pulseira de couro cognac.",
  },
};

/* -------------------------------------------------------------- detalhe */

export const DETAIL_MACRO: ImageAsset = {
  src: "/foto-relogio/macro.png",
  width: 1672,
  height: 941,
  alt: "Macro do mostrador LUME: índices aplicados, textura do laqueado e as pontas dos ponteiros.",
};

/** Não usada no layout atual — alternativas disponíveis em /foto-relogio. */
export const DETAIL_ALTERNATES: ImageAsset[] = [
  {
    src: "/foto-relogio/relogio paisagem.png",
    width: 1536,
    height: 1024,
    alt: "Relógio LUME apoiado sobre um bloco de pedra, sob luz quente de fim de tarde.",
  },
  {
    src: "/foto-relogio/watch.png",
    width: 1122,
    height: 1402,
    alt: "Relógio LUME fotografado de três quartos sobre fundo bone.",
  },
];

/* ------------------------------------------------------------ lifestyle */

export const LIFESTYLE: ImageAsset = {
  src: "/lifestyle/lifestyle.png",
  width: 1086,
  height: 1448,
  alt: "Mulher de camisa branca com a mão junto ao rosto, usando um relógio LUME no pulso.",
};

/** Não usada no layout atual — alternativa disponível em /lifestyle. */
export const LIFESTYLE_ALTERNATE: ImageAsset = {
  src: "/lifestyle/lifestyle braço.png",
  width: 1122,
  height: 1402,
  alt: "Punho apoiado sobre a manga de um casaco de lã, com um relógio LUME de bracelete de aço.",
};

/* ------------------------------------------------------ Open Graph / SEO */

export const OG_IMAGE: ImageAsset = {
  src: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "LUME — relógios automáticos de 38 mm.",
};

/* -------------------------------------------------- camadas do movimento */

/**
 * Ordem de z-index, da base para o topo. `size` é o lado do PNG quadrado
 * gerado — ele varia porque as camadas cujo eixo de rotação não coincidia com
 * o centro do arquivo foram recoladas num canvas maior, centradas no pivô.
 */
export const MOVEMENT_LAYER_FILES = [
  { id: "mainplate", src: "/movimento/01-mainplate.png", size: 1254 },
  { id: "barrel", src: "/movimento/02-barrel.png", size: 1284 },
  { id: "gear-48", src: "/movimento/03-gear-48.png", size: 1284 },
  { id: "gear-24-steel", src: "/movimento/04-gear-24-steel.png", size: 1282 },
  { id: "gear-12", src: "/movimento/05-gear-12.png", size: 1280 },
  { id: "gear-24-brass", src: "/movimento/06-gear-24-brass.png", size: 1276 },
  { id: "escape-wheel", src: "/movimento/07-escape-wheel.png", size: 1258 },
  { id: "pallet-fork", src: "/movimento/08-pallet-fork.png", size: 1438 },
  { id: "balance-wheel", src: "/movimento/09-balance-wheel.png", size: 1310 },
  { id: "bridges", src: "/movimento/10-bridges.png", size: 1254 },
  { id: "rotor", src: "/movimento/11-rotor.png", size: 1584 },
  { id: "dial", src: "/movimento/12-dial.png", size: 1254 },
  { id: "hand-hour", src: "/movimento/13-hand-hour.png", size: 1830 },
  { id: "hand-minute", src: "/movimento/14-hand-minute.png", size: 2040 },
  { id: "hand-seconds", src: "/movimento/15-hand-seconds.png", size: 1618 },
  { id: "case", src: "/movimento/16-case.png", size: 1254 },
  { id: "crystal", src: "/movimento/17-crystal.png", size: 1254 },
] as const;

export type MovementLayerId = (typeof MOVEMENT_LAYER_FILES)[number]["id"];
