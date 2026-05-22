import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export function FilterSearchBar({
  value,
  onChange,
  placeholder = "Search products...",
  ariaLabel = "Search products",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg border border-border-default bg-background-card px-2.5 focus-within:border-primary-blue",
        className,
      )}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4 shrink-0 text-text-placeholder"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        spellCheck={false}
        autoComplete="off"
        className="flex-1 bg-transparent text-body-small text-text-primary placeholder:text-text-placeholder focus-visible:outline-none"
      />
    </div>
  );
}
