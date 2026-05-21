import { cn } from "@/lib/cn";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function FilterNumberInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className,
}: Props) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      step="any"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(null);
          return;
        }
        const parsed = Number(raw);
        onChange(Number.isFinite(parsed) ? parsed : null);
      }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "h-8 w-16 rounded-lg border border-border-default bg-background-card px-2 text-body-small text-text-primary placeholder:text-text-placeholder focus-visible:border-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/30 disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}
