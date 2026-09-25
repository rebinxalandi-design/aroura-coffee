import Navbar from "@/components/Navbar";
import CoffeeHero from "@/components/CoffeeHero";
import StorySection from "@/components/StorySection";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Navbar />
      <CoffeeHero />
      <StorySection />
      <MenuSection />
      <Footer />
    </div>
  );
}
