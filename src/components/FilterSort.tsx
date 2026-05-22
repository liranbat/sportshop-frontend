import { cn } from "@/lib/cn";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterSortToggle } from "@/components/FilterSortToggle";

type Direction = "asc" | "desc";

type Props = {
  options: readonly DropdownOption[];
  field: string;
  direction: Direction;
  enabled: boolean;
  onFieldChange: (value: string) => void;
  onDirectionToggle: () => void;
  onEnabledChange: (enabled: boolean) => void;
  className?: string;
};

export function FilterSort({
  options,
  field,
  direction,
  enabled,
  onFieldChange,
  onDirectionToggle,
  onEnabledChange,
  className,
}: Props) {
  return (
    <div className={cn("grid w-fit grid-cols-[auto_auto] items-center gap-x-2 gap-y-1", className)}>
      <span aria-hidden="true" />
      <span
        className={cn(
          "text-caption-regular text-text-secondary transition-opacity",
          !enabled && "opacity-40",
        )}
      >
        Sort by
      </span>
      <FilterCheckbox checked={enabled} onChange={onEnabledChange} ariaLabel="Enable sorting" />
      <div className="flex items-center gap-2">
        <FilterDropdown
          options={options}
          value={field}
          onChange={onFieldChange}
          ariaLabel="Sort field"
          disabled={!enabled}
          className={cn("w-36 transition-opacity", !enabled && "opacity-40")}
        />
        <div className={cn("transition-opacity", !enabled && "opacity-40")}>
          <FilterSortToggle
            direction={direction}
            onToggle={onDirectionToggle}
            disabled={!enabled}
          />
        </div>
      </div>
    </div>
  );
}
