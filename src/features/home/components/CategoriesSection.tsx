import { useActiveCategoriesQuery } from "@/features/categories";
import { CategoriesCarousel } from "@/features/home/components/CategoriesCarousel";

export function CategoriesSection() {
  const { data: categories } = useActiveCategoriesQuery();

  return (
    <section className="flex h-full w-full snap-start flex-col items-center justify-center gap-12 bg-section-categories px-16 py-20">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-heading-xl text-text-primary">Browse Categories</h2>
        <p className="text-body-large text-text-secondary">Find the gear that fits your game</p>
      </div>

      {categories && categories.length > 0 ? <CategoriesCarousel categories={categories} /> : null}
    </section>
  );
}
