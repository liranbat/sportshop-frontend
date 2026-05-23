import { Notice } from "@/components/Notice";
import { ProductCard, ProductCardPlaceholder } from "@/components/ProductCard";
import type { PageSize } from "@/features/catalog/filters";
import type { Product } from "@/features/catalog/schema";
import type { Category } from "@/features/categories";

type Props = {
  products: readonly Product[];
  categories: readonly Category[];
  pageSize: PageSize;
};

export function CatalogGrid({ products, categories, pageSize }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Notice
          variant="info"
          message="No products match your filters. Try clearing them or come back later."
        />
      </div>
    );
  }

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  // PAGE_SIZE_OPTIONS are perfect squares (4, 9, 16, 25), so N is always an integer
  const n = Math.sqrt(pageSize);
  const placeholderCount = Math.max(0, pageSize - products.length);
  // drives the em-based scaling inside every ProductCard
  const cardFontSize = `${2.4 / n}rem`;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="grid aspect-7/3 max-h-full max-w-full gap-3"
        style={{
          gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
          fontSize: cardFontSize,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            categoryName={
              product.categoryId !== undefined
                ? (categoryNameById.get(product.categoryId) ?? null)
                : null
            }
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <ProductCardPlaceholder key={`placeholder-${i}`} />
        ))}
      </div>
    </div>
  );
}
