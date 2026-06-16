import { Notice } from "@/components/Notice";
import { OrderRow } from "@/features/orders/components/OrderRow";
import type { OrderSummary } from "@/features/orders/schema";

type Props = {
  orders: readonly OrderSummary[];
  isLoading: boolean;
  view: "user" | "admin";
};

const HEADER_CLASS =
  "px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase";

export function OrderHistoryList({ orders, isLoading, view }: Props) {
  const isAdminView = view === "admin";

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background-page">
            <tr>
              <th className={`${HEADER_CLASS} ${isAdminView ? "w-[22%]" : "w-[28%]"}`}>Order #</th>
              {isAdminView && <th className={`${HEADER_CLASS} w-[22%]`}>Customer</th>}
              <th className={`${HEADER_CLASS} ${isAdminView ? "w-[14%]" : "w-[18%]"}`}>Date</th>
              <th className={`${HEADER_CLASS} ${isAdminView ? "w-[12%]" : "w-[18%]"}`}>Items</th>
              <th className={`${HEADER_CLASS} ${isAdminView ? "w-[14%]" : "w-[18%]"}`}>Total</th>
              <th className={`${HEADER_CLASS} ${isAdminView ? "w-[16%]" : "w-[18%]"}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.orderNumber} order={order} view={view} />
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
