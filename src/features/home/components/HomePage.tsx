import { AboutSection } from "@/features/home/components/AboutSection";
import { CategoriesSection } from "@/features/home/components/CategoriesSection";
import { HeroSection } from "@/features/home/components/HeroSection";

// snap-scroll lives here (not App.tsx) so it only applies to the home page
export function HomePage() {
  return (
    <main className="h-full snap-y snap-mandatory overflow-y-auto">
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
    </main>
  );
}
