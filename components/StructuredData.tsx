import { watches, watchName } from "@/data/watches";
import { WATCH_PHOTOS, OG_IMAGE } from "@/lib/images";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
} from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/nav";

/**
 * JSON-LD com a marca e as três referências.
 *
 * Preços são declarados em BRL a partir da mesma fonte que a página renderiza
 * (`data/watches.ts`), então marcação e conteúdo visível não podem divergir —
 * divergência aqui é o que faz o Google descartar o rich result.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Brand",
        "@id": `${SITE_URL}/#brand`,
        name: SITE_NAME,
        slogan: SITE_TAGLINE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        logo: `${SITE_URL}${OG_IMAGE.src}`,
        email: CONTACT_EMAIL,
        foundingDate: "2019",
        foundingLocation: { "@type": "Place", name: "Genebra, Suíça" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        url: SITE_URL,
        name: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        inLanguage: "pt-BR",
        publisher: { "@id": `${SITE_URL}/#brand` },
      },
      ...watches.map((watch) => ({
        "@type": "Product",
        "@id": `${SITE_URL}/#${watch.id}`,
        name: watchName(watch),
        sku: `LUME-${watch.reference}`,
        description: `${watch.caseSpec}. Mostrador ${watch.dial.toLowerCase()}. ${watch.strap}. Movimento ${watch.movement.toLowerCase()}, ${watch.powerReserve}.`,
        image: `${SITE_URL}${WATCH_PHOTOS[watch.id].src}`,
        brand: { "@id": `${SITE_URL}/#brand` },
        category: "Relógio de pulso automático",
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          // O dado de origem é a string exibida ("R$ 4.890"); aqui vira número.
          price: Number(watch.price.replace(/[^\d]/g, "")),
          availability: "https://schema.org/PreOrder",
          url: `${SITE_URL}/#${watch.id}`,
        },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
