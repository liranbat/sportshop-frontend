import { RefreshButton } from "@/components/RefreshButton";
import { SegmentedControl } from "@/components/SegmentedControl";
import { StatusBadge } from "@/components/StatusBadge";

export type AdminProductDetailViewMode = "admin" | "customer";

type Props = {
  isArchived: boolean;
  adminView: AdminProductDetailViewMode;
  onAdminViewChange: (next: AdminProductDetailViewMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

const VIEW_OPTIONS = [
  { value: "admin", label: "Admin view" },
  { value: "customer", label: "Customer view" },
] as const satisfies ReadonlyArray<{ value: AdminProductDetailViewMode; label: string }>;

export function AdminProductDetailHeaderRow({
  isArchived,
  adminView,
  onAdminViewChange,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <section
      aria-label="Admin product detail header"
      className="flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-body-large font-semibold text-text-primary">Product details</h1>
        {isArchived && <StatusBadge state="ARCHIVED" />}
      </div>
      <div className="flex items-center gap-2">
        <SegmentedControl
          ariaLabel="Admin product detail view"
          options={VIEW_OPTIONS}
          value={adminView}
          onChange={onAdminViewChange}
          disabled={isRefreshing}
        />
        <RefreshButton
          onClick={onRefresh}
          isPending={isRefreshing}
          ariaLabel="Refresh product details"
        />
      </div>
    </section>
  );
}
