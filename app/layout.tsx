import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { SiteShell } from "@/components/SiteShell";
import { OG_IMAGE } from "@/lib/images";
import { StructuredData } from "@/components/StructuredData";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LUME — Time, quietly.",
    template: "%s · LUME",
  },
  description: SITE_DESCRIPTION,
  applicationName: "LUME",
  keywords: [
    "LUME",
    "relógios de luxo",
    "quiet luxury",
    "relógio automático",
    "38mm",
    "alta relojoaria",
  ],
  authors: [{ name: "LUME" }],
  creator: "LUME",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "LUME",
    title: "LUME — Time, quietly.",
    description:
      "Três referências, um calibre, nenhum ruído. Relógios automáticos de 38 mm em aço, latão e couro.",
    images: [
      {
        url: OG_IMAGE.src,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUME — Time, quietly.",
    description:
      "Três referências, um calibre, nenhum ruído. Relógios automáticos de 38 mm.",
    images: [OG_IMAGE.src],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${GeistSans.variable}`}
    >
      <body className="antialiased">
        {/* Sem JS o loader nunca receberia a ordem de sair; esta regra garante
            que o conteúdo apareça de qualquer forma. */}
        <noscript>
          <style>{`#loader{display:none!important}`}</style>
        </noscript>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteShell>{children}</SiteShell>
        <StructuredData />
      </body>
    </html>
  );
}
