import { Notice } from "@/components/Notice";
import { OrderRow } from "@/features/orders/components/OrderRow";
import type { OrderSummary } from "@/features/orders/schema";

type Props = {
  orders: readonly OrderSummary[];
  isLoading: boolean;
};

export function OrderHistoryList({ orders, isLoading }: Props) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background-page">
            <tr>
              <th className="w-[28%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Order #
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Date
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Items
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Total
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.orderNumber} order={order} />
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !isLoading && (
          <div className="flex items-center justify-center p-8">
            <Notice
              variant="info"
              message="No orders match your filters. Try clearing them or adjusting the criteria."
            />
          </div>
        )}
      </div>
    </div>
  );
}
