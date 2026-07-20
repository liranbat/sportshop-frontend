import { Button } from "@/components/Button";
import { RefreshButton } from "@/components/RefreshButton";

type Props = {
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh?: () => void;
  refreshAriaLabel?: string;
};

export function FilterApplyBar({
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
  onRefresh,
  refreshAriaLabel,
}: Props) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="relative">
        <Button variant="primary" className="h-7 px-3 text-body-small" onClick={onApply}>
          Apply
        </Button>
        {hasPendingEdits && (
          <span
            aria-label="Unapplied filter changes"
            title="Unapplied filter changes"
            className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-error-red ring-2 ring-background-page"
          />
        )}
      </div>
      <Button variant="outlined" className="h-7 px-3 text-body-small" onClick={onClear}>
        Clear
      </Button>
      {onRefresh && (
        <div className="ml-auto">
          <RefreshButton
            onClick={onRefresh}
            isPending={isRefreshing}
            ariaLabel={refreshAriaLabel ?? "Refresh"}
          />
        </div>
      )}
    </div>
  );
}
