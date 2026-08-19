import { SalesCard, SalesCardMessage } from "@/features/sales/components/admin/SalesCard";
import { SalesTopProductRow } from "@/features/sales/components/admin/SalesTopProductRow";
import type { SalesTopProductStats, TopProductsSortBy } from "@/features/sales/schema";

const TITLE = "Top products";

type Props = {
  products: readonly SalesTopProductStats[];
  sortBy: TopProductsSortBy;
  isLoading: boolean;
};

export function SalesTopProducts({ products, sortBy, isLoading }: Props) {
  const subtitle = sortBy === "revenue" ? "By revenue" : "By quantity sold";

  if (isLoading && products.length === 0) {
    return (
      <SalesCard title={TITLE} subtitle={subtitle}>
        <SalesCardMessage message="Loading top products..." />
      </SalesCard>
    );
  }

  if (products.length === 0) {
    return (
      <SalesCard title={TITLE} subtitle={subtitle}>
        <SalesCardMessage message="No products sold in this range." />
      </SalesCard>
    );
  }

  return (
    <SalesCard title={TITLE} subtitle={subtitle}>
      <ol className="flex flex-col">
        {products.map((product, index) => (
          <SalesTopProductRow
            key={product.productId}
            rank={index + 1}
            product={product}
            sortBy={sortBy}
          />
        ))}
      </ol>
    </SalesCard>
  );
}
