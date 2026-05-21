import { useRef, useState } from "react";
import { DropdownChevron } from "@/components/DropdownChevron";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

export type DropdownOption = {
  value: string;
  label: string;
};

type Props = {
  options: readonly DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  ariaLabel,
  disabled = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((next) => !next)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-card px-2.5 text-body-small text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:cursor-not-allowed",
        )}
      >
        <span className={cn("truncate", !selected && "text-text-placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
        <DropdownChevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border-default bg-background-card shadow-card"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-left text-body-small text-text-primary hover:bg-primary-blue-light",
                  option.value === value && "bg-primary-blue-light font-semibold",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
