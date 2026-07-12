import { Badge } from "@/components/Badge";
import type { OrderPayment } from "@/features/orders/schema";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type Props = {
  payment: OrderPayment;
};

export function PaymentInfoCard({ payment }: Props) {
  const amountFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: payment.currency,
  });

  const isRefunded = payment.status === "REFUNDED";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border-default bg-background-card p-6 shadow-card">
      <h3 className="text-heading-m text-text-primary">Payment</h3>

      <dl className="flex flex-col gap-3">
        <Field label="Provider">
          <span className="text-body-small text-text-primary">{payment.provider}</span>
        </Field>

        <Field label="Transaction">
          <div className="flex items-center justify-between gap-2">
            <span
              title={payment.transactionId}
              className="min-w-0 truncate text-body-small text-text-primary tabular-nums"
            >
              {payment.transactionId}
            </span>
            {isRefunded ? (
              <Badge kind="CANCELLED_BY_USER" label="Refunded" />
            ) : (
              <Badge kind="PAID" label="Paid" />
            )}
          </div>
        </Field>

        <Field label="Amount">
          <span className="text-body-small-bold text-text-primary tabular-nums">
            {amountFormatter.format(payment.amount)}
          </span>
        </Field>

        <Field label="Processed">
          <span className="text-body-small text-text-primary">
            {dateTimeFormatter.format(new Date(payment.processedAt))}
          </span>
        </Field>

        {isRefunded && payment.refundedAt && (
          <Field label="Refunded">
            <span className="text-body-small text-text-primary">
              {dateTimeFormatter.format(new Date(payment.refundedAt))}
            </span>
          </Field>
        )}
      </dl>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
