import { cn } from "@/lib/cn";

type SegmentOption<V extends string> = {
  value: V;
  label: string;
};

type Props<V extends string> = {
  options: ReadonlyArray<SegmentOption<V>>;
  value: V;
  onChange: (next: V) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  disabled = false,
  className,
}: Props<V>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-10 items-center rounded-lg border border-border-default bg-background-card p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => {
              if (!isSelected) onChange(option.value);
            }}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-md px-4 text-body-small-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:cursor-not-allowed",
              isSelected
                ? "bg-primary-blue text-white"
                : "bg-transparent text-text-secondary hover:bg-primary-blue-light hover:text-primary-blue",
              disabled && "opacity-50",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
