import { Link } from "react-router";
import sportshopStory from "@/assets/sportshop-logos/sportshop-story.png";
import { paths } from "@/lib/paths";

export function HeroSection() {
  return (
    <section className="flex h-full w-full snap-start bg-section-hero">
      <div className="flex flex-1 flex-col items-start justify-center gap-6 px-16 py-10">
        <h1 className="text-heading-xl text-text-primary">Gear Up for Greatness</h1>
        <p className="text-body-large text-text-secondary">
          Discover top-quality sports gear from the brands you love. Everything you need to perform
          your best.
        </p>
        <Link
          to={paths.catalog()}
          className="inline-flex h-13 w-50 items-center justify-center rounded-lg bg-primary-blue text-body-regular text-white transition-colors hover:bg-primary-blue-hover"
        >
          Shop Now
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center bg-primary-blue-light">
        <img src={sportshopStory} alt="" className="h-full w-full object-cover" />
      </div>
    </section>
  );
}
