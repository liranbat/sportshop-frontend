import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Category } from "@/features/categories";
import { CategoryCard } from "@/features/home/components/CategoryCard";

// keep in sync with --slides-visible in styles/index.css
const VISIBLE_CARDS = 5;

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
};

function ArrowButton({ direction, onClick, disabled }: ArrowButtonProps) {
  const points = direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6";
  const ariaLabel = direction === "left" ? "Scroll categories left" : "Scroll categories right";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-blue bg-background-card text-primary-blue transition-colors hover:bg-primary-blue-light disabled:cursor-not-allowed disabled:border-text-placeholder disabled:text-text-placeholder disabled:hover:bg-background-card"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <polyline points={points} />
      </svg>
    </button>
  );
}

type Props = { categories: readonly Category[] };

function ScrollableCarousel({ categories }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  // embla's scroll position lives outside react, so when the user drags or clicks
  // an arrow, react doesn't know to re-render. useSyncExternalStore is the bridge:
  // `subscribe` hooks into embla's "select"/"reInit" events to trigger re-renders,
  // and the inline getters re-read canScrollPrev/Next on each render.
  // with `loop: true` both getters always return true, so the buttons are never
  // actually disabled today — this is wired up so flipping to `loop: false` later
  // (boundary arrows greying out) would Just Work without any code changes here.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onChange);
      emblaApi.on("reInit", onChange);
      return () => {
        emblaApi.off("select", onChange);
        emblaApi.off("reInit", onChange);
      };
    },
    [emblaApi],
  );

  const canScrollPrev = useSyncExternalStore(subscribe, () => emblaApi?.canScrollPrev() ?? false);
  const canScrollNext = useSyncExternalStore(subscribe, () => emblaApi?.canScrollNext() ?? false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="categories-carousel-track flex touch-pan-y">
          {categories.map((cat) => (
            <div key={cat.id} className="categories-carousel-slide shrink-0">
              <CategoryCard id={cat.id} name={cat.name} iconSrc={cat.icon} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <ArrowButton direction="left" onClick={scrollPrev} disabled={!canScrollPrev} />
        <ArrowButton direction="right" onClick={scrollNext} disabled={!canScrollNext} />
      </div>
    </>
  );
}

export function CategoriesCarousel({ categories }: Props) {
  const hasOverflow = categories.length > VISIBLE_CARDS;

  return (
    <div className="categories-carousel flex flex-col gap-4">
      {hasOverflow ? (
        <ScrollableCarousel categories={categories} />
      ) : (
        <div className="flex justify-center gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} id={cat.id} name={cat.name} iconSrc={cat.icon} />
          ))}
        </div>
      )}
    </div>
  );
}
