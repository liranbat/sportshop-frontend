import { cn } from "@/lib/cn";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import { FilterDateInput } from "@/components/FilterDateInput";

type Props = {
  enabled: boolean;
  from: string | null;
  to: string | null;
  onEnabledChange: (enabled: boolean) => void;
  onFromChange: (value: string | null) => void;
  onToChange: (value: string | null) => void;
  className?: string;
};

export function FilterDateRange({
  enabled,
  from,
  to,
  onEnabledChange,
  onFromChange,
  onToChange,
  className,
}: Props) {
  return (
    <div className={cn("flex w-fit items-center gap-2", className)}>
      <FilterCheckbox
        checked={enabled}
        onChange={onEnabledChange}
        label="Date Range"
        ariaLabel="Enable date range filter"
      />
      <div
        className={cn(
          "flex items-center gap-2 transition-opacity",
          !enabled && "pointer-events-none opacity-40",
        )}
        aria-hidden={!enabled}
      >
        <FilterDateInput
          value={from}
          onChange={onFromChange}
          ariaLabel="From date"
          disabled={!enabled}
          max={to ?? undefined}
        />
        <span className="text-body-small text-text-secondary">-</span>
        <FilterDateInput
          value={to}
          onChange={onToChange}
          ariaLabel="To date"
          disabled={!enabled}
          min={from ?? undefined}
        />
      </div>
    </div>
  );
}
