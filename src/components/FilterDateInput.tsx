import { cn } from "@/lib/cn";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  ariaLabel: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
};

export function FilterDateInput({
  value,
  onChange,
  ariaLabel,
  disabled = false,
  min,
  max,
  className,
}: Props) {
  return (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? null : raw);
      }}
      aria-label={ariaLabel}
      disabled={disabled}
      min={min}
      max={max}
      className={cn(
        "h-8 w-32 rounded-lg border border-border-default bg-background-card px-2 text-body-small text-text-primary placeholder:text-text-placeholder focus-visible:border-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/30 disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}
