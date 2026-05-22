import { useRef, useState } from "react";
import { DropdownChevron } from "@/components/DropdownChevron";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import type { DropdownOption } from "@/components/FilterDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

type Props = {
  options: readonly DropdownOption[];
  values: readonly string[];
  onChange: (values: readonly string[]) => void;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function FilterMultiDropdown({
  options,
  values,
  onChange,
  placeholder = "Select...",
  ariaLabel,
  disabled = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const summary = summarize(options, values, placeholder);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((next) => !next)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-card px-2.5 text-body-small text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:cursor-not-allowed"
      >
        <span className={cn("truncate", values.length === 0 && "text-text-placeholder")}>
          {summary}
        </span>
        <DropdownChevron open={open} />
      </button>
      {open && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 flex flex-col rounded-lg border border-border-default bg-background-card shadow-card">
          {values.length > 0 && (
            <div className="flex items-center justify-end border-b border-border-default px-2 py-1">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-body-small text-primary-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
              >
                Clear all
              </button>
            </div>
          )}
          <ul
            role="listbox"
            aria-label={ariaLabel}
            aria-multiselectable="true"
            className="flex max-h-60 flex-col gap-1 overflow-y-auto p-2"
          >
            {options.map((option) => {
              const checked = values.includes(option.value);
              return (
                <li key={option.value} role="option" aria-selected={checked}>
                  <FilterCheckbox
                    checked={checked}
                    onChange={() => toggle(option.value)}
                    label={option.label}
                    className="w-full rounded-md px-2 py-1.5 hover:bg-primary-blue-light"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function summarize(
  options: readonly DropdownOption[],
  values: readonly string[],
  placeholder: string,
): string {
  if (values.length === 0) return placeholder;
  const labels = values
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter((label): label is string => label !== undefined);
  if (labels.length === 0) return placeholder;
  if (labels.length === 1) return labels[0] ?? placeholder;
  return `${labels.length} selected`;
}
