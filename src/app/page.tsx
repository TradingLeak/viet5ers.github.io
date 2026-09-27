import Navigation from '@/components/Navigation';
import ScrollProgress from '@/components/ScrollProgress';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Programs from '@/components/Programs';
import Missions from '@/components/Missions';
import About from '@/components/About';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-space-950 font-sans text-white">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Stats />
        <Programs />
        <Missions />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
