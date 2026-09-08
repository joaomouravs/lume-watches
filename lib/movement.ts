import { MOVEMENT_LAYER_FILES, type MovementLayerId } from "@/lib/images";

/**
 * Geometria e movimento das 17 camadas do calibre.
 *
 * SOBRE OS NÚMEROS
 * ----------------
 * As peças foram entregues todas no mesmo diâmetro — cada uma preenche o
 * próprio canvas quadrado. Empilhadas cruas, a engrenagem de 48 dentes fica do
 * tamanho da caixa e o balanço cobre a platina inteira. `scale` corrige isso.
 *
 * Cada `scale` foi derivada de uma medição, não chutada: mediu-se o raio real
 * do conteúdo dentro de cada PNG (bounding box do canal alfa) e resolveu-se
 *
 *     scale = raio_desejado_no_container / (raio_medido / lado_do_canvas)
 *
 * onde `raio_desejado_no_container` é uma fração do lado do palco. Com a caixa
 * ocupando ~0.43 de raio, o mostrador ~0.335 e a platina ~0.325, as proporções
 * batem com um calibre real de 38 mm.
 *
 * `x`/`y` afastam as peças do centro em fração do palco. Sem isso o trem de
 * rodas ficaria concêntrico — bonito como mandala, errado como movimento. As
 * distâncias entre centros vizinhos são aproximadamente a soma dos raios, que
 * é a condição para dois dentes se encaixarem.
 *
 * `group` define a ordem de desmontagem: 1 sai primeiro (o que está por cima),
 * 3 por último; 0 nunca sai — é o mecanismo que fica exposto.
 */
export type MovementLayer = {
  id: MovementLayerId;
  src: string;
  /** Lado do PNG quadrado. */
  size: number;
  /** Escala base, relativa ao lado do palco. */
  scale: number;
  /** Deslocamento do centro, em fração do lado do palco. */
  x: number;
  y: number;
  /** Rotação fixa em graus — só os ponteiros, travados em 10:10. */
  rotation?: number;
  /** Rotação contínua, linear e infinita. */
  spin?: { seconds: number; clockwise: boolean };
  /** Oscilação yoyo infinita. */
  oscillate?: { degrees: number; seconds: number };
  /** Opacidade base. */
  opacity?: number;
  /** Etapa da desmontagem. 0 = permanece. */
  group: 0 | 1 | 2 | 3;
  /** Nome da peça, para a legenda acessível da seção. */
  label: string;
};

const file = (id: MovementLayerId) => {
  const entry = MOVEMENT_LAYER_FILES.find((f) => f.id === id);
  if (!entry) throw new Error(`Camada desconhecida: ${id}`);
  return entry;
};

export const MOVEMENT_LAYERS: MovementLayer[] = [
  {
    ...file("mainplate"),
    scale: 0.667,
    x: 0,
    y: 0,
    group: 0,
    label: "Platina",
  },
  {
    ...file("barrel"),
    scale: 0.245,
    x: -0.115,
    y: -0.115,
    spin: { seconds: 240, clockwise: true },
    group: 0,
    label: "Barrilete",
  },
  {
    ...file("gear-48"),
    scale: 0.202,
    x: 0.055,
    y: -0.065,
    spin: { seconds: 120, clockwise: false },
    group: 0,
    label: "Roda de centro, 48 dentes",
  },
  {
    ...file("gear-24-steel"),
    scale: 0.129,
    x: 0.19,
    y: 0.015,
    spin: { seconds: 60, clockwise: true },
    group: 0,
    label: "Roda intermediária em aço azulado, 24 dentes",
  },
  {
    ...file("gear-12"),
    scale: 0.094,
    x: 0.235,
    y: 0.1,
    spin: { seconds: 30, clockwise: false },
    group: 0,
    label: "Roda de segundos em ródio, 12 dentes",
  },
  {
    ...file("gear-24-brass"),
    scale: 0.144,
    x: -0.05,
    y: 0.075,
    spin: { seconds: 60, clockwise: true },
    group: 0,
    label: "Roda de minutos em latão, 24 dentes",
  },
  {
    ...file("escape-wheel"),
    scale: 0.133,
    x: 0.175,
    y: 0.155,
    spin: { seconds: 10, clockwise: true },
    group: 0,
    label: "Roda de escape",
  },
  {
    ...file("pallet-fork"),
    scale: 0.201,
    x: 0.075,
    y: 0.205,
    // Mesmo período do balanço: a âncora é empurrada por ele a cada alternância.
    oscillate: { degrees: 8, seconds: 0.4 },
    group: 0,
    label: "Âncora",
  },
  {
    ...file("balance-wheel"),
    scale: 0.324,
    x: -0.1,
    y: 0.185,
    oscillate: { degrees: 30, seconds: 0.4 },
    group: 0,
    label: "Balanço com espiral",
  },
  {
    ...file("bridges"),
    scale: 0.725,
    x: 0,
    y: 0,
    group: 3,
    label: "Pontes",
  },
  {
    ...file("rotor"),
    scale: 0.875,
    x: 0,
    y: 0,
    spin: { seconds: 8, clockwise: true },
    group: 3,
    label: "Rotor",
  },
  {
    ...file("dial"),
    scale: 0.785,
    x: 0,
    y: 0,
    group: 2,
    label: "Mostrador",
  },
  {
    ...file("hand-hour"),
    scale: 0.49,
    x: 0,
    y: 0,
    rotation: 305,
    group: 2,
    label: "Ponteiro das horas",
  },
  {
    ...file("hand-minute"),
    scale: 0.604,
    x: 0,
    y: 0,
    rotation: 60,
    group: 2,
    label: "Ponteiro dos minutos",
  },
  {
    ...file("hand-seconds"),
    scale: 0.65,
    x: 0,
    y: 0,
    rotation: 180,
    group: 2,
    label: "Ponteiro dos segundos",
  },
  {
    ...file("case"),
    scale: 1.044,
    x: 0,
    y: 0,
    group: 1,
    label: "Caixa",
  },
  {
    ...file("crystal"),
    scale: 0.839,
    x: 0,
    y: 0,
    // O cristal é um render escuro de vidro; a 100% ele encardia o mostrador
    // inteiro. A meia opacidade ele lê como reflexo, que é o que é.
    opacity: 0.55,
    group: 1,
    label: "Cristal de safira",
  },
];

/**
 * Etapas da desmontagem, na ordem em que as camadas saem. Cada etapa vira um
 * par de tweens na timeline: uma saída na descida e uma volta na subida.
 */
export const DISASSEMBLY_STEPS = [
  // cristal + caixa
  { group: 1 as const, out: 0.05, outDuration: 0.1, back: 0.9, backDuration: 0.1 },
  // ponteiros + mostrador
  { group: 2 as const, out: 0.15, outDuration: 0.15, back: 0.8, backDuration: 0.1 },
  // rotor + pontes
  { group: 3 as const, out: 0.3, outDuration: 0.15, back: 0.7, backDuration: 0.1 },
];

/** Janela em que o mecanismo fica exposto e o texto aparece. */
export const EXPOSED = { textIn: 0.46, textOut: 0.72 };
