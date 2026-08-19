import { RefreshButton } from "@/components/RefreshButton";

type Props = {
  rangeLabel: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function SalesDashboardHeaderRow({ rangeLabel, isRefreshing, onRefresh }: Props) {
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-baseline gap-2">
        <h1 className="text-body-large font-semibold text-text-primary">Sales Dashboard</h1>
        <span className="text-body-small text-text-secondary">{rangeLabel}</span>
      </div>
      <RefreshButton
        onClick={onRefresh}
        isPending={isRefreshing}
        ariaLabel="Refresh sales summary"
      />
    </header>
  );
}
