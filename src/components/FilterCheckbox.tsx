import { cn } from "@/lib/cn";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function FilterCheckbox({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  className,
}: Props) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 select-none",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          checked
            ? "border-primary-blue bg-primary-blue"
            : "border-border-default bg-background-card",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2 6.5L5 9.5L10 3.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        className="sr-only"
      />
      {label !== undefined && <span className="text-body-small text-text-primary">{label}</span>}
    </label>
  );
}
