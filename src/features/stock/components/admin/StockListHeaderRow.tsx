import { Button } from "@/components/Button";
import { RefreshButton } from "@/components/RefreshButton";

type Props = {
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddSize: () => void;
};

export function StockListHeaderRow({ isRefreshing, onRefresh, onAddSize }: Props) {
  return (
    <header className="flex items-center justify-between gap-2">
      <h1 className="text-body-large font-semibold text-text-primary">Stock Management</h1>
      <div className="flex items-center gap-2">
        <Button variant="outlined" className="h-7 px-3 text-body-small" onClick={onAddSize}>
          + Add Size
        </Button>
        <RefreshButton
          onClick={onRefresh}
          isPending={isRefreshing}
          ariaLabel="Refresh stock list"
        />
      </div>
    </header>
  );
}
