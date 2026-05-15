import { useEffect, useRef, useState } from "react";
import soccerBallIcon from "@/assets/category-icons/Soccer-Ball--Streamline-Emojitwo-Black.svg";
import { CategoryCard } from "@/features/home/components/CategoryCard";

// TODO: replace with backend data (WHERE is_deleted = FALSE) + per-category icons
const CATEGORIES = [
  { name: "Soccer", iconSrc: soccerBallIcon },
  { name: "Basketball", iconSrc: soccerBallIcon },
  { name: "Tennis", iconSrc: soccerBallIcon },
  { name: "Volleyball", iconSrc: soccerBallIcon },
  { name: "Football", iconSrc: soccerBallIcon },
  { name: "Swimming", iconSrc: soccerBallIcon },
  { name: "Cycling", iconSrc: soccerBallIcon },
  { name: "Fitness", iconSrc: soccerBallIcon },
] as const;

const CARD_WIDTH = 200;
const CARD_GAP = 24;
const VISIBLE_CARDS = 5;
// fixed viewport so exactly 5 cards fit and nothing is half-cut at the edges
const VIEWPORT_WIDTH = VISIBLE_CARDS * CARD_WIDTH + (VISIBLE_CARDS - 1) * CARD_GAP;
const SCROLL_BY = CARD_WIDTH + CARD_GAP;

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

export function CategoriesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -SCROLL_BY, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: SCROLL_BY, behavior: "smooth" });
  };

  return (
    <section className="flex h-full w-full snap-start flex-col items-center justify-center gap-12 bg-section-categories px-16 py-20">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-heading-xl text-text-primary">Browse Categories</h2>
        <p className="text-body-large text-text-secondary">Find the gear that fits your game</p>
      </div>

      <div style={{ width: VIEWPORT_WIDTH }} className="flex flex-col gap-4">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth scrollbar-none"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.name} name={cat.name} iconSrc={cat.iconSrc} />
          ))}
        </div>

        <div className="flex justify-between">
          <ArrowButton direction="left" onClick={scrollLeft} disabled={!canScrollLeft} />
          <ArrowButton direction="right" onClick={scrollRight} disabled={!canScrollRight} />
        </div>
      </div>
    </section>
  );
}
