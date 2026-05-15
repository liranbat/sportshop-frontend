import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Category } from "@/features/categories";
import { CategoryCard } from "@/features/home/components/CategoryCard";

const VISIBLE_CARDS = 5;
const CARD_WIDTH_PX = 200;
const SLIDE_SPACING_PX = 24;
const VIEWPORT_WIDTH = VISIBLE_CARDS * CARD_WIDTH_PX + (VISIBLE_CARDS - 1) * SLIDE_SPACING_PX;

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
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points={points} />
      </svg>
    </button>
  );
}

type Props = { categories: readonly Category[] };

// padding-based spacing (not css `gap`) — `gap` doesn't count toward slide width
// so embla's loop wrap leaves no space between last and first slide.
function ScrollableCarousel({ categories }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

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
        <div className="flex touch-pan-y" style={{ marginLeft: -SLIDE_SPACING_PX }}>
          {categories.map((cat) => (
            <div key={cat.id} className="shrink-0" style={{ paddingLeft: SLIDE_SPACING_PX }}>
              <CategoryCard name={cat.name} iconSrc={cat.icon} />
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
    <div style={{ width: VIEWPORT_WIDTH }} className="flex flex-col gap-4">
      {hasOverflow ? (
        <ScrollableCarousel categories={categories} />
      ) : (
        <div className="flex justify-center gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} name={cat.name} iconSrc={cat.icon} />
          ))}
        </div>
      )}
    </div>
  );
}
