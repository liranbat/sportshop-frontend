import { Badge } from "@/components/Badge";
import { ORDER_STATUS_LABEL } from "@/features/orders/labels";
import type { OrderStatus } from "@/features/orders/schema";
import { SalesCard, SalesCardMessage } from "@/features/sales/components/admin/SalesCard";
import { formatCount, formatCurrency } from "@/features/sales/format";
import type { SalesStatusStats } from "@/features/sales/schema";

// the number is display order only, low to high.
const STATUS_RANK: Record<OrderStatus, number> = {
  PAID: 0,
  SHIPPED: 1,
  DELIVERED: 2,
  DONE: 3,
  CANCELLED_BY_USER: 4,
  CANCELLED_BY_ADMIN: 5,
};

const STATUS_ORDER = (Object.keys(STATUS_RANK) as OrderStatus[]).sort(
  (a, b) => STATUS_RANK[a] - STATUS_RANK[b],
);

const HEADER_CLASS =
  "px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase";

type Props = {
  rows: readonly SalesStatusStats[];
  isLoading: boolean;
};

export function SalesStatusBreakdown({ rows, isLoading }: Props) {
  if (isLoading && rows.length === 0) {
    return (
      <SalesCard title="Orders by status">
        <SalesCardMessage message="Loading status breakdown..." />
      </SalesCard>
    );
  }

  const byStatus = new Map(rows.map((row) => [row.status, row]));
  const totalOrders = rows.reduce((sum, row) => sum + row.orderCount, 0);

  return (
    <SalesCard title="Orders by status" subtitle={`${formatCount(totalOrders)} orders`}>
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-background-page">
          <tr>
            <th className={`${HEADER_CLASS} w-[48%]`}>Status</th>
            <th className={`${HEADER_CLASS} w-[22%]`}>Orders</th>
            <th className={`${HEADER_CLASS} w-[30%]`}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {STATUS_ORDER.map((status) => {
            const row = byStatus.get(status);
            return (
              <tr
                key={status}
                className="border-t border-cart-line-divider hover:bg-primary-blue-light/40"
              >
                <td className="px-4 py-3 align-middle">
                  <Badge kind={status} label={ORDER_STATUS_LABEL[status]} />
                </td>
                <td className="px-4 py-3 align-middle text-body-small text-text-primary tabular-nums">
                  {formatCount(row?.orderCount ?? 0)}
                </td>
                <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary tabular-nums">
                  {formatCurrency(row?.revenue ?? 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </SalesCard>
  );
}
