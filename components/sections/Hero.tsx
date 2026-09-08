import { getImageProps } from "next/image";
import { HeroContent } from "@/components/sections/HeroContent";
import { HERO_DESKTOP, HERO_MOBILE } from "@/lib/images";

/**
 * Art direction de verdade: desktop e mobile são composições diferentes, não
 * dois crops do mesmo arquivo — no desktop, uma pessoa sentada na sala de
 * concreto; no mobile, o relógio sozinho sob um facho de luz.
 *
 * O `next/image` não expõe `<picture>`, então `getImageProps` fornece o srcSet
 * otimizado de cada arquivo e o elemento é montado à mão: continua passando
 * pelo otimizador, pelo AVIF/WebP e pelo cache do Next, mas quem escolhe a
 * fonte é o navegador, antes do layout — nenhum dos dois arquivos é baixado à
 * toa.
 */
function HeroMedia() {
  const common = { quality: 82, sizes: "100vw", priority: true };

  const desktop = getImageProps({
    ...common,
    src: HERO_DESKTOP.src,
    alt: HERO_DESKTOP.alt,
    width: HERO_DESKTOP.width,
    height: HERO_DESKTOP.height,
  });
  const mobile = getImageProps({
    ...common,
    src: HERO_MOBILE.src,
    alt: HERO_MOBILE.alt,
    width: HERO_MOBILE.width,
    height: HERO_MOBILE.height,
  });

  return (
    <picture>
      <source
        media="(min-width: 768px)"
        srcSet={desktop.props.srcSet}
        sizes={desktop.props.sizes}
      />
      <img
        {...mobile.props}
        alt={HERO_MOBILE.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="LUME — Time, quietly."
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      <HeroMedia />
      {/* Véu que garante contraste AA do texto sobre a fotografia. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/45 to-ink/90"
      />
      <HeroContent />
    </section>
  );
}
