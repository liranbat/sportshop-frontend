import type { OrderShipping } from "@/features/orders/schema";

type Props = {
  shipping: OrderShipping;
};

export function ShippingCard({ shipping }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border-default bg-background-card p-6 shadow-card">
      <h3 className="text-heading-m text-text-primary">Shipping</h3>
      <dl className="flex flex-col gap-3">
        <Row label="Full name" value={shipping.fullName} />
        <Row label="Email" value={shipping.email} />
        <Row label="Phone" value={shipping.phone} />
        <Row label="Country" value={shipping.country} />
        <Row label="City" value={shipping.city} />
        <Row label="Address" value={shipping.addressLine} />
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
        {label}
      </dt>
      <dd className="text-body-small wrap-break-word text-text-primary">{value}</dd>
    </div>
  );
}
