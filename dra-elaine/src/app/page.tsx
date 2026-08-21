import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Approach from "@/components/Approach";
import Treatments from "@/components/Treatments";
import FirstConsultation from "@/components/FirstConsultation";
import About from "@/components/About";
import AttendanceModes from "@/components/AttendanceModes";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        <Hero />
        <TrustStrip />
        <Approach />
        <Treatments />
        <FirstConsultation />
        <About />
        <AttendanceModes />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Reveal />
    </>
  );
}
