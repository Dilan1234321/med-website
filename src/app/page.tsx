import { Chapters } from "@/components/Chapters";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { History } from "@/components/History";
import { Join } from "@/components/Join";
import { Mission } from "@/components/Mission";
import { Pillars } from "@/components/Pillars";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Mission />
        <Pillars />
        <History />
        <Chapters />
        <Join />
      </main>
      <Footer />
    </>
  );
}
