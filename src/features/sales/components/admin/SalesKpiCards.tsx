import { formatCount, formatCurrency, formatPercent } from "@/features/sales/format";
import type { SalesPeriodStats } from "@/features/sales/schema";

const NO_VALUE = "—";

type Props = {
  summary: SalesPeriodStats | undefined;
  isLoading: boolean;
};

export function SalesKpiCards({ summary, isLoading }: Props) {
  const cards: ReadonlyArray<{ label: string; value: string }> = [
    { label: "Revenue", value: summary ? formatCurrency(summary.revenue) : NO_VALUE },
    { label: "Orders", value: summary ? formatCount(summary.orderCount) : NO_VALUE },
    {
      label: "Avg order value",
      value: summary ? formatCurrency(summary.averageOrderValue) : NO_VALUE,
    },
    { label: "Items sold", value: summary ? formatCount(summary.itemsSoldAmount) : NO_VALUE },
    { label: "Cancelled", value: summary ? formatCount(summary.cancelledCount) : NO_VALUE },
    { label: "Cancel rate", value: summary ? formatPercent(summary.cancelRate) : NO_VALUE },
  ];

  return (
    <section
      aria-label="Sales KPIs"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
    >
      {cards.map((card) => (
        <KpiCard key={card.label} label={card.label} value={card.value} isLoading={isLoading} />
      ))}
    </section>
  );
}

function KpiCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border-default bg-background-card p-4 shadow-card">
      <span className="text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
        {label}
      </span>
      {isLoading ? (
        <span aria-hidden="true" className="h-7 w-24 animate-pulse rounded-md bg-background-page" />
      ) : (
        <span className="text-heading-m text-text-primary">{value}</span>
      )}
    </div>
  );
}
