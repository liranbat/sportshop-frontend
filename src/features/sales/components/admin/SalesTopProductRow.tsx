import { formatCount, formatCurrency } from "@/features/sales/format";
import type { SalesTopProductStats, TopProductsSortBy } from "@/features/sales/schema";

type Props = {
  rank: number;
  product: SalesTopProductStats;
  sortBy: TopProductsSortBy;
};

export function SalesTopProductRow({ rank, product, sortBy }: Props) {
  const resultLabel =
    sortBy === "revenue" ? formatCurrency(product.result) : `${formatCount(product.result)} sold`;

  return (
    <li className="flex items-center gap-3 border-t border-cart-line-divider px-4 py-3 first:border-t-0">
      <span className="w-5 shrink-0 text-body-small-bold text-text-secondary tabular-nums">
        {rank}
      </span>

      <Thumbnail src={product.productImageUrl ?? null} alt={product.productName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body-small-bold text-text-primary">
          {product.productName}
        </span>
        <span className="text-caption-regular text-text-secondary">ID: {product.productId}</span>
      </div>

      <span className="shrink-0 text-body-small-bold text-text-primary tabular-nums">
        {resultLabel}
      </span>
    </li>
  );
}

function Thumbnail({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-default bg-background-page text-caption-regular text-text-placeholder"
      >
        ?
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-10 w-10 shrink-0 rounded-md border border-border-default bg-background-page object-cover"
      loading="lazy"
    />
  );
}
