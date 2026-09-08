/**
 * Dados dos três modelos. Sem caminho de imagem: a foto de cada referência
 * vive em WATCH_PHOTOS, em lib/images.ts, associada pelo mesmo `id`.
 */
export type Watch = {
  /** Slug usado como âncora e key de lista. */
  id: string;
  /** Numeral da referência: "01", "02", "03". */
  reference: string;
  /** Nome da variante: "Bone", "Slate", "Brass". */
  variant: string;
  caseSpec: string;
  dial: string;
  strap: string;
  movement: string;
  /** Reserva de marcha, isolada porque aparece sozinha na seção Detalhe. */
  powerReserve: string;
  price: string;
};

export const watches: Watch[] = [
  {
    id: "lume-01-bone",
    reference: "01",
    variant: "Bone",
    caseSpec: "Aço inoxidável escovado, 38 mm",
    dial: "Off-white laqueado",
    strap: "Couro de bezerro preto",
    movement: "Automático",
    powerReserve: "42 h de reserva",
    price: "R$ 4.890",
  },
  {
    id: "lume-02-slate",
    reference: "02",
    variant: "Slate",
    caseSpec: "Aço jateado, 38 mm",
    dial: "Cinza-chumbo sunburst",
    strap: "Bracelete de aço três elos",
    movement: "Automático",
    powerReserve: "42 h de reserva",
    price: "R$ 5.290",
  },
  {
    id: "lume-03-brass",
    reference: "03",
    variant: "Brass",
    caseSpec: "Latão polido, 38 mm",
    dial: "Champanhe texturizado",
    strap: "Couro cognac",
    movement: "Automático",
    powerReserve: "70 h de reserva",
    price: "R$ 7.400",
  },
];

export const watchName = (watch: Watch) =>
  `LUME ${watch.reference} · ${watch.variant}`;
