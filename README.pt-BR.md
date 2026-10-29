# LUME

[English](README.md) · **Português**

Site institucional de página única para **LUME**, uma marca fictícia de relógios
de luxo minimalista. Projeto de portfólio front-end.

> Time, quietly.

**No ar:** https://lume-psi-three.vercel.app

![Hero do site LUME](public/og.jpg)

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

Requisito: Node.js 20.9 ou mais novo (exigência do sharp).

```bash
npm install
npm run dev      # http://localhost:3000
```

Os derivados (`/public/movimento` e `/public/og.jpg`) estão versionados, então o
build na Vercel não depende do script. Só rode `npm run layers` de novo quando
algum arquivo de `/public/Engrenagens` ou o hero mudar.

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
  globals.css          design system completo
  robots.ts · sitemap.ts
components/
  SiteShell.tsx        contexto (ready, trava de scroll, scrollTo) + loader + header
  Header.tsx           barra fixa, scroll spy, estados de scroll
  MobileMenu.tsx       menu fullscreen com foco preso e trava de scroll
  Loader.tsx
  StructuredData.tsx   JSON-LD: Brand, WebSite e os 3 Product
  ui/                  Container · Eyebrow · Button · SectionMark
  sections/            Hero (+ HeroShell) · Manifesto · Movement · Collection
                       Detail · Lifestyle · Footer
hooks/
  useSmoothScroll.ts   Lenis no ticker do GSAP + scrollTo programático
  useScrollSpy.ts      seção corrente para o aria-current do header
  useSplitLines.ts     SplitText manual + reveal linha a linha
  useHorizontalScroll.ts  pin + translate X + progresso + foco por teclado
  useParallax.ts · useReveal.ts · useMagnetic.ts
data/
  watches.ts           catálogo dos 3 modelos (sem caminhos de imagem)
lib/
  images.ts            TODOS os caminhos de imagem, em constantes
  movement.ts          geometria e movimento das 17 camadas do calibre
  nav.ts               navegação e contato: fonte única de header, menu e rodapé
  site.ts              url, nome e descrição: fonte única de metadata e JSON-LD
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

### Cor — tokens semânticos, não literais

A paleta tem cinco cores, mas nenhum componente usa `bg-ink` ou `text-bone/85`.
Todos usam a camada semântica:

```
--color-canvas         fundo da seção
--color-surface        superfície elevada (fundo de imagem carregando)
--color-content        texto principal
--color-muted          texto secundário
--color-subtle         texto terciário
--color-line           divisórias
--color-line-strong    divisórias com peso
--color-accent         latão: preços, foco, estados ativos
```

O Manifesto é a única seção clara, e é só `data-theme="light"` no `<section>`:
os mesmos tokens são redefinidos para os filhos, e o `text-muted` que dava
5.7:1 sobre ink passa a dar 5.6:1 sobre bone sem que componente nenhum saiba
disso. Antes o mesmo problema era resolvido com um token especial
(`--graphite`) aplicado à mão em cada elemento da seção.

### Tipografia — oito degraus, e quase nada fora deles

`mark` · `mark-sm` · `display` · `title` · `subtitle` · `lead` · `body` ·
`caption`, todos em `clamp()`. Os cinco `text-[clamp(…)]` avulsos que existiam
nos cards e no rodapé viraram `subtitle` e `mark-sm`. Sobram dois, ambos
deliberados e de uso único: o wordmark do loader e os links do menu mobile,
que escalam com a viewport por decisão de composição.

### Layout — container com teto

```
--gutter       clamp(1.5rem, 7vw, 8rem)
--content-max  88rem
--edge         max(gutter, (100% − content-max) / 2)
```

`.container-lume` trava a coluna de conteúdo: sem o teto, um monitor de 2560px
abria uma linha de texto de 2150px. `--edge` é a mesma distância da borda,
exposta para as seções full-bleed (a galeria horizontal, o palco do movimento)
encostarem na linha vertical do resto da página em vez de na margem bruta. É
`%` e não `vw` porque `vw` inclui a barra de rolagem.

Ritmo vertical: `section-y` e `section-y-lg`. Sem `py-[18svh]` avulso.

### z-index nomeado

`z-content` (10) · `z-sticky` (20) · `z-header` (50) · `z-overlay` (80) ·
`z-loader` (90) · skip link (100). Ninguém precisa adivinhar se 40 fica acima
de 50.

### Movimento

`cubic-bezier(0.16, 1, 0.3, 1)` registrada no GSAP como o easing `"lume"`,
então CSS e JS produzem exatamente a mesma aceleração. Durações na escala do
Tailwind (500/700/1000ms) — sem `duration-[830ms]`.

### Primitivas

`Container` · `Eyebrow` · `Button` (solid/outline/ghost, magnético opcional,
44px de alvo) · `SectionMark`. Nada de abstração por abstração: são os quatro
padrões que realmente se repetem.

O `SectionMark` — número, fio e rótulo — aparece nas quatro seções internas e é
o que faz a página ler como um documento em vez de componentes empilhados. A
animação vive dentro dele, não nas seções, para que o gesto seja idêntico nas
quatro ocorrências sem depender de ninguém lembrar de chamar um hook.

## Header e menu mobile

Antes não existia navegação nenhuma acima do rodapé.

**Barra fixa com dois estados.** `data-scrolled` liga fundo e borda ao sair do
topo; `data-hidden` recolhe a barra na descida e devolve na subida. O critério
é **velocidade**, não direção: com `direction` a barra piscaria a cada
micro-oscilação do trackpad e, pior, dentro das seções pinadas, onde o scrub
inverte o sinal o tempo todo.

Os dois estados são atributos numa classe `.site-header`, não utilitários — e
isso foi uma descoberta de depuração: ao assumir transforms, o GSAP escreve
`translate: none` inline, o que anulava o `-translate-y-full` da barra. A
animação de entrada foi movida para o elemento interno e o `<header>` ficou com
a propriedade `translate` só para si.

**Scroll spy** por `IntersectionObserver` numa faixa estreita logo abaixo do
header — e não por área visível. Com o Movimento ocupando 300vh de pin, o
critério de área o elegeria como seção corrente quase o tempo todo.

**Menu mobile** em tela cheia: cortina em `clip-path`, links subindo por baixo
de uma máscara (direções opostas, para ler como duas camadas), foco preso com
Tab circular, Esc para fechar, foco devolvido ao botão que abriu, e trava de
scroll que funciona também para quem tem movimento reduzido — nesse caso o
Lenis nem é instanciado, então a trava vai num atributo no `<html>`.

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
  se a tela de abertura tivesse se dissolvido sobre ele. O fim do loader também
  é o que solta o Lenis, então ele tem uma rede de segurança em `setTimeout`
  (2s): o GSAP anda no `requestAnimationFrame`, que o navegador congela em aba
  de fundo — sem a rede, quem abrisse o site num tab que não está à frente
  encontraria o loader parado e o scroll travado.
- **Detalhe: a placa manda na moldura, não o contrário.** A foto tem proporção
  nativa e ocupa toda a largura da coluna; a coluna é que é mais alta que ela, e
  a folga vertical de ink que sobra é o curso do parallax. O caminho comum
  (imagem em `cover` numa coluna de 100svh) faz o oposto — escala a foto pela
  altura e, de um arquivo 16:9, mostra só a tira do meio, ampliada. Aqui não há
  corte lateral nem upscale.
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
- **Coleção acessível por teclado.** O track é *transladado*, não rolado, então
  o navegador não consegue trazer para a tela um card que recebeu foco por Tab —
  o usuário de teclado ficaria digitando no escuro. Como o deslocamento
  horizontal é 1:1 com o scroll vertical do pin, um listener de `focusin` soma a
  mesma quantidade de pixels ao scroll da página. Cada card também ganhou um
  destino real (`Consultar`, com assunto pré-preenchido) e estados de hover e
  foco — antes eram blocos decorativos sem ação.
- **Progresso nos pins.** Um fio de 1px no rodapé das duas seções pinadas
  acompanha `self.progress`. Num pin de 300vh o usuário não tem como saber
  quanto falta, e sem esse sinal a seção parece travada em vez de longa.
- **Lifestyle.** O reveal é por `clip-path`, não por escala: a imagem não se
  move, quem se move é a janela por onde ela aparece.
- **Parallax de cursor no Hero.** 24px de curso na fotografia, via `quickTo`
  (um tween reaproveitado, nada alocado por movimento do mouse), só em
  `pointer: fine`. E o botão magnético escuta `pointermove` no documento, não
  `mouseenter` no elemento: a atração começa antes do cursor tocar o botão, que
  é o que dá sensação de ímã em vez de um salto no hover.
- **Classes de componente em `@layer components`.** CSS sem camada vence
  *qualquer* utilitário do Tailwind, independente de especificidade. Enquanto
  `.parallax-frame` esteve fora de layer, o `position: relative` dela anulava o
  `md:sticky` da coluna do Detalhe em silêncio — a coluna nunca grudava. Dentro
  da camada, a ordem volta a ser a esperada: utilitário ganha da classe.

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
- Alvos de toque de 44px em todo link e botão, via um utilitário `tap-target`
  que cresce a área por pseudo-elemento — o texto mantém o line-height do
  design, e nada no layout se move.
- GSAP só dentro de `useGSAP` — nada roda no SSR, zero erros de hidratação.
- `next/image` em tudo, AVIF antes de WebP; hero com `priority`, o resto lazy.
- `will-change` das 34 camadas do calibre é ligado e desligado pelo próprio
  ScrollTrigger (`onToggle`). Fixo, seriam 34 camadas de composição retidas
  durante a página inteira.
- **Sem `overflow-x: hidden` global.** Ele existia e mascarava estouro
  horizontal em vez de corrigi-lo. Foi removido, e a página foi medida em 15
  larguras — de 320px a 2560px — com zero overflow em todas.

## SEO

`title`, `description`, canonical, Open Graph e Twitter card em `app/layout.tsx`,
todos alimentados por `lib/site.ts`. Somam-se agora `robots.ts`, `sitemap.ts` e
JSON-LD (`Brand`, `WebSite` e um `Product` por referência) — os preços do
structured data vêm do mesmo `data/watches.ts` que a página renderiza, então
marcação e conteúdo visível não podem divergir.

## Licença

O código está sob a licença [MIT](LICENSE). As imagens em `/public` e a marca
LUME não estão incluídas: o projeto é fictício, criado para portfólio, e LUME
não é uma marca real.

## Dependências

`npm audit --omit=dev` ainda aponta o `postcss` 8.4.31 que vem embutido no
Next 15. Ele só processa o CSS do próprio projeto durante o build, nunca
entrada de terceiros, então os vetores descritos (source maps e CSS controlado
por quem ataca) não se aplicam. A correção é o Next 16.
