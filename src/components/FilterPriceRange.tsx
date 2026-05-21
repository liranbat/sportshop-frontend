import { cn } from "@/lib/cn";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import { FilterNumberInput } from "@/components/FilterNumberInput";

type Props = {
  enabled: boolean;
  min: number | null;
  max: number | null;
  onEnabledChange: (enabled: boolean) => void;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  className?: string;
};

export function FilterPriceRange({
  enabled,
  min,
  max,
  onEnabledChange,
  onMinChange,
  onMaxChange,
  className,
}: Props) {
  return (
    <div className={cn("flex w-fit items-center gap-2", className)}>
      <FilterCheckbox
        checked={enabled}
        onChange={onEnabledChange}
        label="Price Range"
        ariaLabel="Enable price range filter"
      />
      <div
        className={cn(
          "flex items-center gap-2 transition-opacity",
          !enabled && "pointer-events-none opacity-40",
        )}
        aria-hidden={!enabled}
      >
        <FilterNumberInput
          value={min}
          onChange={onMinChange}
          placeholder="Min"
          ariaLabel="Minimum price"
          disabled={!enabled}
        />
        <span className="text-body-small text-text-secondary">-</span>
        <FilterNumberInput
          value={max}
          onChange={onMaxChange}
          placeholder="Max"
          ariaLabel="Maximum price"
          disabled={!enabled}
        />
      </div>
    </div>
  );
}
