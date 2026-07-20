import { type ReactNode } from "react";
import { FilterApplyBar } from "@/components/FilterApplyBar";

type Props = {
  ariaLabel: string;
  title?: ReactNode;
  headerActions?: ReactNode;
  isRefreshing: boolean;
  hasPendingEdits: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh?: () => void;
  refreshAriaLabel?: string;
  children: ReactNode;
};

export function ListFilterToolbar({
  ariaLabel,
  title,
  headerActions,
  isRefreshing,
  hasPendingEdits,
  onApply,
  onClear,
  onRefresh,
  refreshAriaLabel,
  children,
}: Props) {
  const hasHeader = title !== undefined || headerActions !== undefined;

  return (
    <section
      aria-label={ariaLabel}
      aria-busy={isRefreshing}
      className={`relative z-20 flex flex-col gap-1 transition-opacity ${
        isRefreshing ? "opacity-60" : ""
      }`}
    >
      <fieldset disabled={isRefreshing} className="contents">
        {hasHeader && (
          <div className="flex items-center justify-between gap-2">
            {title !== undefined && (
              <h1 className="text-body-large font-semibold text-text-primary">{title}</h1>
            )}
            {headerActions}
          </div>
        )}
        {children}
        <FilterApplyBar
          hasPendingEdits={hasPendingEdits}
          isRefreshing={isRefreshing}
          onApply={onApply}
          onClear={onClear}
          onRefresh={onRefresh}
          refreshAriaLabel={refreshAriaLabel}
        />
      </fieldset>
    </section>
  );
}
