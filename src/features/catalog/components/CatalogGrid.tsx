import { Notice } from "@/components/Notice";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/features/catalog/schema";
import type { Category } from "@/features/categories";

type Props = {
  products: readonly Product[];
  categories: readonly Category[];
};

export function CatalogGrid({ products, categories }: Props) {
  if (products.length === 0) {
    return (
      <Notice
        variant="info"
        message="No products match your filters. Try clearing them or come back later."
      />
    );
  }

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="mx-auto grid w-fit grid-cols-3 items-start gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          categoryName={categoryNameById.get(product.categoryId) ?? null}
          price={product.price}
          imageUrl={product.imageUrl}
          className="w-36"
        />
      ))}
    </div>
  );
}
