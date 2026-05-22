import { cn } from "@/lib/cn";

type Direction = "asc" | "desc";

type Props = {
  direction: Direction;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
};

export function FilterSortToggle({ direction, onToggle, disabled = false, className }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={`Sort direction: ${direction === "asc" ? "ascending" : "descending"}`}
      aria-pressed={direction === "desc"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border border-border-default bg-background-card text-text-primary transition-colors hover:bg-primary-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:cursor-not-allowed",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className={cn("h-4 w-4 transition-transform", direction === "desc" && "rotate-180")}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 3L8 13M8 3L4 7M8 3L12 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
