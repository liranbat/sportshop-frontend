import { Footer } from "@/features/home/components/Footer";
import { ValueCard } from "@/features/home/components/ValueCard";

const VALUES = [
  { word: "Quality", description: "We partner with top brands to bring you the best gear" },
  { word: "Speed", description: "Fast shipping so you never miss a game day" },
  { word: "Trust", description: "Secure checkout and hassle-free returns" },
  { word: "Support", description: "Our team is here to help you every step of the way" },
] as const;

export function AboutSection() {
  return (
    <section className="flex h-full w-full snap-start flex-col bg-section-about">
      {/* min-h-0 keeps the footer visible on short viewports */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-12 px-16 py-12">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-heading-xl text-text-primary">Why SportShop?</h2>
          <p className="text-body-large text-text-secondary">We are more than just a store</p>
        </div>

        <div className="flex gap-8">
          {VALUES.map((value) => (
            <ValueCard key={value.word} word={value.word} description={value.description} />
          ))}
        </div>
      </div>

      <Footer />
    </section>
  );
}
