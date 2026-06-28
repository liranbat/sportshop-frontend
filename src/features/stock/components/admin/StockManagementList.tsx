import { StockManagementListRow } from "@/features/stock/components/admin/StockManagementListRow";
import type { StockRow } from "@/features/stock/schema";

type Props = {
  rows: readonly StockRow[];
  isLoading: boolean;
  onStartEdit: (row: StockRow) => void;
  onRemove: (row: StockRow) => void;
};

export function StockManagementList({ rows, isLoading, onStartEdit, onRemove }: Props) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background-page">
            <tr>
              <th className="w-[34%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Product
              </th>
              <th className="w-[10%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Size
              </th>
              <th className="w-[12%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Quantity
              </th>
              <th className="w-[12%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Threshold
              </th>
              <th className="w-[14%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Status
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <StockManagementListRow
                key={`${row.productId}:${row.size}`}
                row={row}
                onStartEdit={onStartEdit}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>

        {rows.length === 0 && isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex h-40 items-center justify-center text-body-small text-text-secondary"
          >
            Loading stock...
          </div>
        )}
      </div>
    </div>
  );
}
