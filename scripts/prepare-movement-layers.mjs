/**
 * Prepara as camadas do movimento a partir de /public/Engrenagens.
 *
 * POR QUE ESTE SCRIPT EXISTE
 * --------------------------
 * Os 17 PNGs originais foram renderizados SOBRE FUNDO PRETO, não com
 * transparência: `sharp` reporta `channels: 3, hasAlpha: false` em todos, e os
 * pixels de canto são (0,0,0)/(1,1,1). Empilhados com `position: absolute;
 * inset: 0`, cada camada seria um quadrado opaco cobrindo tudo abaixo dela —
 * só o cristal (topo da pilha) apareceria.
 *
 * A solução é derivar o canal alfa da própria luminância: o fundo preto vira
 * transparente e a peça continua opaca. Repare que o RGB é preservado como
 * está — nada de "unpremultiply". As peças não são renders com alfa embutido,
 * são imagens onde escuro significa material escuro; dividir o RGB pelo alfa
 * clarearia todas as sombras e achataria o volume das peças.
 *
 * Efeito colateral desejável: furos, vazados e os espaços entre os raios das
 * engrenagens também são pretos — e viram transparentes, que é exatamente o
 * comportamento correto numa vista explodida empilhada.
 *
 * Os originais nunca são tocados. A saída vai para /public/movimento.
 *
 * Uso: npm run layers
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public", "Engrenagens");
const OUT = path.join(ROOT, "public", "movimento");

/**
 * Mapa arquivo-de-origem → slug de saída, na ordem de z-index (base → topo).
 * Os nomes de origem estão exatamente como estão no disco, incluindo espaços,
 * acentos, travessões e o separador "·".
 */
const LAYERS = [
  ["mainplate.png", "01-mainplate", null],
  ["barrel.png", "02-barrel", "bbox"],
  ["Engrenagem 1 — grande, latão, raios · 48 dentes.png", "03-gear-48", "bbox"],
  [
    "Engrenagem 2 — média, aço azulado, disco perfurado · 24 dentes.png",
    "04-gear-24-steel",
    "bbox",
  ],
  ["Engrenagem 3 — pequena, ródio, raios · 12 dentes.png", "05-gear-12", "bbox"],
  [
    "Engrenagem 4 — média, latão, disco perfurado · 24 dentes.png",
    "06-gear-24-brass",
    "bbox",
  ],
  ["escape-wheel.png", "07-escape-wheel", "bbox"],
  ["pallet-fork.png", "08-pallet-fork", "jewel"],
  ["balance-wheel.png", "09-balance-wheel", "bbox"],
  ["bridges.png", "10-bridges", null],
  ["rotor.png", "11-rotor", "jewel"],
  ["dial.png", "12-dial", null],
  ["hand-hour.png", "13-hand-hour", "widest"],
  ["hand-minute.png", "14-hand-minute", "widest"],
  ["hand-seconds.png", "15-hand-seconds", "widest"],
  ["case.png", "16-case", null],
  ["crystal.png", "17-crystal", null],
];

/* Rampa do alfa, em luminância normalizada.
   Abaixo de LO o pixel é fundo (o preto do render oscila entre 0 e ~2/255).
   Acima de HI é peça. Entre os dois, uma transição suave que preserva as
   bordas antialiased sem deixar halo. */
const LO = 0.012;
const HI = 0.085;

const smoothstep = (x) => {
  const t = Math.min(1, Math.max(0, (x - LO) / (HI - LO)));
  return t * t * (3 - 2 * t);
};

/* Tabela de 256 entradas: a rampa é calculada uma vez, não por pixel. */
const ALPHA = new Uint8Array(256);
for (let v = 0; v < 256; v++) ALPHA[v] = Math.round(smoothstep(v / 255) * 255);

/**
 * Nem toda peça está centrada no seu eixo de rotação dentro do arquivo, e
 * `transform-origin: center center` gira em torno do centro do canvas. Onde os
 * dois não coincidem, a peça orbita em vez de pivotar.
 *
 * Em vez de dar um `transform-origin` diferente para cada camada no CSS, o eixo
 * é trazido para o centro aqui — a imagem é recolada num canvas maior, centrada
 * no pivô. Assim as 17 camadas seguem exatamente a mesma regra: `inset: 0` e
 * origem no centro.
 *
 * Três estratégias, porque o eixo se manifesta de forma diferente em cada tipo
 * de peça:
 *
 *   "bbox"    peças redondas (barrilete, as quatro engrenagens, roda de escape,
 *             balanço). O eixo é o centro geométrico, então o centro da caixa
 *             delimitadora resolve. Corrige desvios de 15–28px que apareceriam
 *             como uma oscilação lenta na rotação.
 *
 *   "widest"  as agulhas. São desenhadas apontando para cima com o anel de
 *             fixação bem abaixo do centro (hora y≈915, minuto y≈1020, segundos
 *             y≈809 num canvas de 1254). O anel é o ponto mais largo da peça —
 *             a lâmina é sempre mais estreita —, então a linha de largura
 *             máxima o identifica.
 *
 *   "jewel"   rotor e âncora. Ambos pivotam numa bucha/rubi dourado que não
 *             fica no centro do arquivo (rotor y≈463, âncora y≈523). O ouro é a
 *             única cor com R alto, G médio e B baixo nas duas peças — os rubis
 *             da âncora são vermelhos (G baixo demais) e não confundem o
 *             centroide.
 */
function findPivot(data, width, height, strategy) {
  if (strategy === "jewel") {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (data[i + 3] > 150 && r > 140 && g > 90 && g < r - 25 && b < g - 25) {
        sx += p % width;
        sy += Math.floor(p / width);
        n++;
      }
    }
    if (n > 0) return { x: sx / n, y: sy / n };
  }

  let x0 = Infinity;
  let x1 = -1;
  let y0 = Infinity;
  let y1 = -1;
  let bestWidth = -1;
  let widest = null;

  for (let y = 0; y < height; y++) {
    let min = Infinity;
    let max = -1;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 80) {
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
    if (max < 0) continue;
    if (y < y0) y0 = y;
    y1 = y;
    if (min < x0) x0 = min;
    if (max > x1) x1 = max;
    if (max - min > bestWidth) {
      bestWidth = max - min;
      widest = { x: (min + max) / 2, y };
    }
  }

  if (strategy === "widest" && widest) return widest;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
}

async function recenterOnPivot(rgba, width, height, strategy) {
  const pivot = findPivot(rgba, width, height, strategy);
  // O canvas cresce o suficiente para nada ser cortado depois do deslocamento.
  const size =
    2 *
    Math.ceil(
      Math.max(pivot.x, width - pivot.x, pivot.y, height - pivot.y),
    );

  const canvas = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: rgba,
        raw: { width, height, channels: 4 },
        left: Math.round(size / 2 - pivot.x),
        top: Math.round(size / 2 - pivot.y),
      },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  return { canvas, size, pivot };
}

async function buildLayer(source, slug, pivotStrategy) {
  const { data, info } = await sharp(path.join(SRC, source))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    // max(r,g,b) e não luma: o aço azulado e os rubis são cores saturadas de
    // luma baixo — por luma eles ficariam semitransparentes.
    out[o + 3] = ALPHA[r > g ? (r > b ? r : b) : g > b ? g : b];
  }

  const file = path.join(OUT, `${slug}.png`);
  let size = width;
  let note = "";

  if (pivotStrategy) {
    const recentered = await recenterOnPivot(out, width, height, pivotStrategy);
    await sharp(recentered.canvas).toFile(file);
    size = recentered.size;
    note = `${pivotStrategy} → pivô (${Math.round(
      recentered.pivot.x,
    )}, ${Math.round(recentered.pivot.y)})`;
  } else {
    await sharp(out, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 9, effort: 10, palette: false })
      .toFile(file);
  }

  return { slug, size, note, kb: Math.round(statSync(file).size / 1024) };
}

await mkdir(OUT, { recursive: true });

const found = new Set(await readdir(SRC));
const missing = LAYERS.filter(([source]) => !found.has(source)).map(([s]) => s);
if (missing.length) {
  console.error("FALTANDO em /public/Engrenagens:\n  " + missing.join("\n  "));
  process.exit(1);
}

let total = 0;
for (const [source, slug, pivotStrategy] of LAYERS) {
  const r = await buildLayer(source, slug, pivotStrategy);
  total += r.kb;
  console.log(
    `✓ ${r.slug.padEnd(18)} ${`${r.size}×${r.size}`.padEnd(11)} ${`${r.kb} KB`.padEnd(9)} ${r.note}`,
  );
}
console.log(`\n${LAYERS.length} camadas · ${(total / 1024).toFixed(1)} MB de origem`);

/* Open Graph derivado do hero: 1200×630 é praticamente o mesmo 16:9 do
   arquivo original, então o corte é mínimo. */
await sharp(path.join(ROOT, "public", "hero", "hero-desktop.png"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public", "og.jpg"));
console.log("✓ og.jpg 1200×630 (derivado de hero/hero-desktop.png)");
