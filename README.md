# LUME

Site institucional de página única para **LUME**, uma marca fictícia de relógios
de luxo minimalista. Projeto de portfólio front-end.

> Time, quietly.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS v4 (sem biblioteca de componentes) |
| Animação | GSAP 3 + ScrollTrigger, `@gsap/react` |
| Smooth scroll | Lenis |
| Fontes | `next/font` — Instrument Serif (display) e Geist Sans (corpo) |
| Pipeline de imagem | sharp (script de build, não runtime) |

Nada de shadcn, MUI ou headless kits: todo componente é escrito do zero.

## Setup

```bash
npm install
npm run layers   # gera /public/movimento e /public/og.jpg a partir dos originais
npm run dev      # http://localhost:3000
```

`npm run layers` precisa rodar uma vez antes do primeiro `dev`/`build`, e de novo
sempre que algum arquivo de `/public/Engrenagens` mudar.

```bash
npm run build    # build de produção
npm run start    # serve o build
npm run lint     # ESLint (next/core-web-vitals + typescript)
```

## Estrutura

```
app/
  layout.tsx           fontes, metadata/OG, skip link, shell
  page.tsx             composição das seções
  globals.css          design system, palco do movimento, utilitários
components/
  SiteShell.tsx        contexto "ready" + smooth scroll + loader
  Loader.tsx
  sections/            Hero · Manifesto · Movement · Collection · Detail
                       Lifestyle · Footer
hooks/
  useSmoothScroll.ts   Lenis dirigido pelo ticker do GSAP
  useSplitLines.ts     SplitText manual + reveal linha a linha
  useHorizontalScroll.ts  pin + translate X da coleção
  useParallax.ts
  useReveal.ts
data/
  watches.ts           catálogo dos 3 modelos (sem caminhos de imagem)
lib/
  images.ts            TODOS os caminhos de imagem, em constantes
  movement.ts          geometria e movimento das 17 camadas do calibre
  gsap.ts              plugins, easing "lume", condições de matchMedia
scripts/
  prepare-movement-layers.mjs
```

## Imagens

Nenhum componente monta string de caminho: tudo passa por `lib/images.ts`.

### Originais (entregues, não modificados)

| Pasta | Arquivo | Dimensões | Uso |
|---|---|---|---|
| `/hero` | `hero-desktop.png` | 1672×941 | Hero, desktop |
| `/hero` | `hero-mobile.png` | 941×1672 | Hero, mobile |
| `/vitrini` | `vitrini 3.png` | 1086×1448 | **LUME 01 · Bone** |
| `/vitrini` | `vitrini 2.png` | 1086×1448 | **LUME 02 · Slate** |
| `/vitrini` | `vitrini.png` | 1086×1448 | **LUME 03 · Brass** |
| `/foto-relogio` | `macro.png` | 1672×941 | Detalhe (split screen) |
| `/foto-relogio` | `relogio paisagem.png` | 1536×1024 | não usada |
| `/foto-relogio` | `watch.png` | 1122×1402 | não usada |
| `/lifestyle` | `lifestyle.png` | 1086×1448 | Lifestyle (full-bleed) |
| `/lifestyle` | `lifestyle braço.png` | 1122×1402 | não usada |
| `/Engrenagens` | 17 PNGs | 1254×1254 | origem das camadas do movimento |

> **A vitrine não segue a ordem dos nomes.** Conferido imagem por imagem contra
> a descrição de cada modelo: `vitrini.png` é a Brass (latão + couro cognac),
> `vitrini 2.png` é a Slate (mostrador cinza + bracelete de aço) e
> `vitrini 3.png` é a Bone (mostrador off-white + couro preto). Associar por
> ordem alfabética trocaria a Bone pela Brass.

### Derivados (gerados por `npm run layers`)

| Saída | Origem |
|---|---|
| `/movimento/01-mainplate.png` … `/movimento/17-crystal.png` | `/Engrenagens/*` |
| `/og.jpg` (1200×630) | `/hero/hero-desktop.png` |

## Por que as camadas do movimento são derivadas

Os 17 PNGs de `/Engrenagens` **não têm canal alfa** — foram renderizados sobre
fundo preto (`channels: 3`, cantos em `(0,0,0)`). Empilhados com
`position: absolute; inset: 0`, cada camada seria um quadrado opaco cobrindo
tudo abaixo dela: só o cristal apareceria.

`scripts/prepare-movement-layers.mjs` resolve isso em duas etapas.

**1. Alfa derivado da luminância.** O preto do fundo vira transparente e a peça
continua opaca. O RGB é preservado como está — nada de *unpremultiply*: as peças
não são renders com alfa embutido, são imagens onde escuro significa material
escuro, e dividir o RGB pelo alfa clarearia todas as sombras. Efeito colateral
desejável: furos, vazados e os espaços entre os raios também são pretos, e viram
transparentes — exatamente o que uma vista explodida empilhada precisa.

**2. Recentragem no eixo de rotação.** `transform-origin: center center` gira em
torno do centro do arquivo, e em várias peças o eixo não está lá. A imagem é
recolada num canvas maior, centrada no pivô, com três estratégias:

| Estratégia | Peças | Como acha o eixo |
|---|---|---|
| `bbox` | barrilete, 4 engrenagens, roda de escape, balanço | centro da caixa delimitadora (peças redondas) |
| `widest` | as 3 agulhas | a linha mais larga é o anel de fixação (hora y≈915, minuto y≈1020, segundos y≈809) |
| `jewel` | rotor, âncora | centroide dos pixels dourados, que é a bucha/rubi (rotor y≈463, âncora y≈536) |

Sem isso as agulhas orbitariam o centro do mostrador em vez de pivotar nele.

## Design system

```
--ink    #0B0B0C   fundo principal
--bone   #EDE9E3   texto/fundo claro
--steel  #8A8A8F   texto secundário
--brass  #B8A582   acento (uso mínimo: preços e um link)
```

Há um quinto token, `--graphite (#5B5B60)`: sobre `--bone`, o `--steel` puro
fica em 2.8:1 e reprova no AA. O graphite mantém a mesma família em 5.6:1 e é
usado apenas nos eyebrows da seção clara.

- **Display** — Instrument Serif 400, `tracking -0.02em`, escala em `clamp()`.
- **Corpo** — Geist Sans 400.
- **Eyebrow** — Geist Sans 11px, uppercase, `tracking 0.25em`, `--steel`.
- **Grid** — 12 colunas (`.grid-12`), margens `max(1.5rem, 8vw)` (`.gutter`).
- **Transições** — `cubic-bezier(0.16, 1, 0.3, 1)`, 0.8s–1.2s. Sem bounce.
  A curva está registrada no GSAP como o easing `"lume"`, então CSS e JS usam
  exatamente a mesma aceleração.

## A seção Movimento

Desmontagem do calibre controlada pelo scroll: o relógio começa inteiro, se abre
camada por camada, expõe o mecanismo girando e volta a se montar.

**Três divs por peça, uma responsabilidade cada.** `.mv-place` posiciona e
escala (CSS estático), `.mv-boom` afasta no scroll (GSAP: `scale` + `opacity`),
`.mv-spin` gira. Separar é obrigatório: os dois efeitos escrevem `transform`, e
num elemento só um mataria o outro.

**Escalas medidas, não chutadas.** As peças vieram todas no mesmo diâmetro —
cada uma preenche o próprio canvas. Cruas, a engrenagem de 48 dentes fica do
tamanho da caixa. Mediu-se o raio real do conteúdo dentro de cada PNG (bounding
box do alfa) e resolveu-se `scale = raio_desejado / (raio_medido / lado)`, com a
caixa em ~0.43 de raio, o mostrador em ~0.335 e a platina em ~0.325 — as
proporções de um calibre de 38 mm de verdade. Os deslocamentos `x`/`y` tiram o
trem de rodas do eixo central; as distâncias entre centros vizinhos são a soma
dos raios, que é a condição para dois dentes se encaixarem.

**Rotações contínuas em CSS, oscilações em GSAP.** As sete rotações infinitas
(barrilete 240s, 48 dentes 120s ⟲, 24 aço 60s, 12 dentes 30s ⟲, 24 latão 60s,
escape 10s, rotor 8s) são `@keyframes` lineares: compostas na GPU, sem custo de
main thread, e desligam sozinhas em `prefers-reduced-motion`. Balanço (±30°) e
âncora (±8°) ficam no GSAP porque `sine.inOut` num yoyo é o perfil de velocidade
real de um oscilador — rápido no meio do curso, parado nos extremos. Os dois
usam o mesmo período de 0.4s: é o balanço que empurra a âncora.

**Timeline com duração 1.** As posições são lidas diretamente como progresso do
scroll — 0.30 na timeline é 30% do trecho pinado (300vh no desktop, 200vh no
mobile).

| Progresso | O que acontece |
|---|---|
| 0% | relógio completo |
| 5–15% | cristal e caixa afastam (`scale` 1 → 1.15, `opacity` → 0) |
| 15–30% | ponteiros e mostrador afastam |
| 30–45% | rotor e pontes afastam |
| 46–72% | mecanismo exposto girando, texto à esquerda |
| 70–100% | camadas voltam na ordem inversa |

**`sizes` derivado da escala da camada.** Todas as camadas ocupam o palco
inteiro no layout — o que as encolhe é um `transform`, que o navegador ignora ao
escolher a imagem do srcset. Sem corrigir, a roda de 12 dentes renderizada com
60px baixaria um arquivo de 700px, dezessete vezes. Com a correção ela pede
128px: **3 KB em AVIF em vez de 21 KB**.

## Outras decisões de animação

- **Hero com art direction real.** Desktop e mobile são arquivos diferentes, não
  crops. Como `next/image` não emite `<picture>`, o `getImageProps` fornece o
  `srcSet` otimizado de cada um e o `<picture>` é montado à mão: o navegador
  escolhe a fonte antes do layout, e nenhum dos dois arquivos é baixado à toa.
- **Loader → Hero.** O loader publica `ready` por contexto; o Hero só toca a
  entrada depois disso, e o wordmark continua de um tracking mais aberto — como
  se a tela de abertura tivesse se dissolvido sobre ele.
- **SplitText manual.** O plugin oficial é pago. O texto fica no HTML como texto
  corrente (SEO, leitores de tela, no-JS) e o split acontece após a montagem: o
  agrupamento em linhas vem do `offsetTop` medido pelo navegador, e um
  `ResizeObserver` refaz tudo quando a largura muda. O efeito acompanha
  `clamp()` e qualquer viewport sem uma única media query.
- **Lenis no ticker do GSAP.** Um único rAF para os dois: com dois loops o
  ScrollTrigger lê posições de um frame anterior e o parallax treme.
  `lagSmoothing(0)` porque a compensação de lag do GSAP dá saltos no scroll.
- **Coleção.** A largura do card é derivada da altura da viewport (`42svh` →
  imagem 3:4), garantindo que o card inteiro caiba em `100svh` — condição para o
  pin horizontal não cortar o rodapé. A galeria só existe sob a variante
  `gallery` (≥768px de largura, ≥640px de altura e movimento permitido); o CSS e
  o `matchMedia` do GSAP usam literalmente a mesma condição, senão o CSS
  recortaria a seção sem o pin existir e dois modelos ficariam inalcançáveis.
- **Lifestyle.** O reveal é por `clip-path`, não por escala: a imagem não se
  move, quem se move é a janela por onde ela aparece.

## Acessibilidade e performance

- `prefers-reduced-motion: reduce` desliga GSAP, Lenis, o pin do movimento e
  todas as rotações; a página fica estática e completa, com o relógio montado.
- Nenhum estado inicial de animação vive numa classe do HTML — tudo é aplicado
  por `gsap.set` dentro do efeito. Se o JS falhar, o conteúdo aparece em vez de
  ficar preso em `opacity: 0`. O loader tem uma regra `<noscript>` pelo mesmo
  motivo.
- HTML semântico (`section` + `aria-labelledby`, `dl` para especificações), skip
  link, foco visível em `--brass`, contraste AA em todas as combinações. O palco
  do movimento é um `role="img"` com descrição, e as 17 peças aparecem como
  lista `sr-only`.
- GSAP só dentro de `useGSAP` — nada roda no SSR, zero erros de hidratação.
- `next/image` em tudo, AVIF antes de WebP; hero com `priority`, o resto lazy.

## Licença

Projeto fictício, criado para portfólio. LUME não é uma marca real.
