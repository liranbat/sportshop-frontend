import { useState } from "react";
import { Link, useParams } from "react-router";
import { Notice } from "@/components/Notice";
import { useMeQuery } from "@/features/auth/queries";
import { EditShippingAddressModal } from "@/features/orders/components/admin/EditShippingAddressModal";
import { UpdateOrderStatusModal } from "@/features/orders/components/admin/UpdateOrderStatusModal";
import { CancelOrderModal } from "@/features/orders/components/CancelOrderModal";
import { OrderHeader } from "@/features/orders/components/OrderHeader";
import { OrderLineItems } from "@/features/orders/components/OrderLineItems";
import { PaymentInfoCard } from "@/features/orders/components/PaymentInfoCard";
import { ShippingCard } from "@/features/orders/components/ShippingCard";
import { useAdminOrderDetailQuery, useOrderDetailQuery } from "@/features/orders/queries";
import { ApiError } from "@/lib/api";

const ORDER_NUMBER_PATTERN = /^ORD-\d{8}-[A-Z0-9]{10}$/;

const ADMIN_NOTICE_MESSAGE = "You are viewing this order in admin mode.";

export function OrderDetailPage() {
  const { orderNumber: raw } = useParams<{ orderNumber: string }>();

  if (!raw || !ORDER_NUMBER_PATTERN.test(raw)) {
    return <OrderNotFound />;
  }

  return <OrderDetailView orderNumber={raw} />;
}

function OrderDetailView({ orderNumber }: { orderNumber: string }) {
  const meQuery = useMeQuery();
  const isAdmin = meQuery.data?.isAdmin === true;

  const userDetailQuery = useOrderDetailQuery(orderNumber, !isAdmin);
  const adminDetailQuery = useAdminOrderDetailQuery(orderNumber, isAdmin);
  const detailQuery = isAdmin ? adminDetailQuery : userDetailQuery;

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isEditShippingOpen, setIsEditShippingOpen] = useState(false);

  if (detailQuery.isPending) {
    return (
      <main className="flex h-full items-center justify-center text-text-secondary">
        Loading order…
      </main>
    );
  }

  if (detailQuery.isError) {
    if (detailQuery.error instanceof ApiError && detailQuery.error.status === 404) {
      return <OrderNotFound />;
    }
    return (
      <main className="flex h-full items-center justify-center px-4">
        <Notice
          variant="error"
          message="Could not load this order. Please refresh and try again."
        />
      </main>
    );
  }

  const order = detailQuery.data;
  const handleRefresh = () => {
    void detailQuery.refetch();
  };
  const isRefreshing = detailQuery.isFetching;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-4 px-6 py-4 lg:px-10 2xl:px-14">
        <BackRow />

        {isAdmin && <Notice variant="info" message={ADMIN_NOTICE_MESSAGE} />}

        <div
          aria-busy={isRefreshing}
          className={`flex min-h-0 flex-1 flex-col gap-4 transition-opacity ${
            isRefreshing ? "opacity-60" : ""
          }`}
        >
          <fieldset disabled={isRefreshing} className="contents">
            <OrderHeader
              order={order}
              view={isAdmin ? "admin" : "user"}
              onCancelClick={() => setIsCancelOpen(true)}
              onUpdateStatusClick={() => setIsUpdateStatusOpen(true)}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
              <div className="min-h-0">
                <OrderLineItems items={order.items} total={order.totalPrice} />
              </div>
              <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
                <ShippingCard
                  status={order.status}
                  shipping={order.shipping}
                  isAdmin={isAdmin}
                  onEditClick={() => setIsEditShippingOpen(true)}
                />
                <PaymentInfoCard payment={order.payment} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <CancelOrderModal
        orderNumber={order.orderNumber}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        variant={isAdmin ? "admin" : "user"}
      />

      {isAdmin && (
        <UpdateOrderStatusModal
          orderNumber={order.orderNumber}
          currentStatus={order.status}
          open={isUpdateStatusOpen}
          onOpenChange={setIsUpdateStatusOpen}
        />
      )}

      {isAdmin && (
        <EditShippingAddressModal
          orderNumber={order.orderNumber}
          currentStatus={order.status}
          currentShipping={order.shipping}
          open={isEditShippingOpen}
          onOpenChange={setIsEditShippingOpen}
        />
      )}
    </main>
  );
}

function BackRow() {
  return (
    <nav aria-label="Breadcrumb">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1 text-caption-regular text-text-secondary hover:text-primary-blue hover:underline focus-visible:text-primary-blue focus-visible:outline-none"
      >
        <ChevronLeft />
        Back to Orders
      </Link>
    </nav>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function OrderNotFound() {
  return (
    <main className="flex h-full items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-heading-l text-text-primary">Order not found</h2>
        <p className="text-body-small text-text-secondary">
          We couldn’t find this order. It may have been removed or you may not have access.
        </p>
        <Link
          to="/orders"
          className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary-blue px-5 text-body-regular font-semibold text-white transition-colors hover:bg-primary-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
        >
          Back to Orders
        </Link>
      </div>
    </main>
  );
}
