import { SegmentedControl } from "@/components/SegmentedControl";

export type OrderListView = "user" | "admin";

const VIEW_OPTIONS = [
  { value: "user" as const, label: "My Orders" },
  { value: "admin" as const, label: "All Orders" },
];

type Props = {
  view: OrderListView;
  onViewChange: (next: OrderListView) => void;
  isAdmin: boolean;
  isRefreshing: boolean;
};

export function OrderHistoryHeaderRow({ view, onViewChange, isAdmin, isRefreshing }: Props) {
  const title = view === "admin" ? "Orders" : "My Orders";

  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-body-large font-semibold text-text-primary">{title}</h1>

      {isAdmin && (
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={view}
          onChange={onViewChange}
          ariaLabel="Order list scope"
          disabled={isRefreshing}
        />
      )}
    </div>
  );
}
