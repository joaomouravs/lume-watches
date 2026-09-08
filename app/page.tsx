import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Movement } from "@/components/sections/Movement";
import { Collection } from "@/components/sections/Collection";
import { Detail } from "@/components/sections/Detail";
import { Lifestyle } from "@/components/sections/Lifestyle";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Movement />
        <Collection />
        <Detail />
        <Lifestyle />
      </main>
      <Footer />
    </>
  );
}
