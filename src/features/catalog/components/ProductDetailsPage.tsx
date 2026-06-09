import { Link, useParams } from "react-router";
import { Notice } from "@/components/Notice";
import { ProductImageSection } from "@/features/catalog/components/ProductImageSection";
import { ProductInfoSection } from "@/features/catalog/components/ProductInfoSection";
import { useProductQuery } from "@/features/catalog/queries";
import { ApiError } from "@/lib/api";

function parseProductId(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function ProductDetailsPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const productId = parseProductId(rawId);

  if (productId === null) {
    return <ProductNotFound />;
  }

  return <ProductDetailsView productId={productId} />;
}

function ProductDetailsView({ productId }: { productId: number }) {
  const { data: product, isPending, isError, error } = useProductQuery(productId);

  if (isPending) {
    return (
      <main className="flex h-full items-center justify-center text-text-secondary">
        Loading product…
      </main>
    );
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return <ProductNotFound />;
    }
    return (
      <main className="flex h-full items-center justify-center px-4">
        <Notice
          variant="error"
          message="Could not load this product. Please refresh and try again."
        />
      </main>
    );
  }

  return (
    <main className="h-full overflow-hidden">
      <div className="grid h-full grid-cols-1 gap-8 px-6 py-6 lg:grid-cols-2 lg:px-10 lg:py-8 2xl:px-14">
        <ProductImageSection name={product.name} imageUrl={product.imageUrl} />
        <ProductInfoSection product={product} />
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <main className="flex h-full items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-heading-l text-text-primary">Product not found</h2>
        <p className="text-body-small text-text-secondary">
          We couldn’t find this product. It may have been removed.
        </p>
        <Link
          to="/catalog"
          className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary-blue px-5 text-body-regular font-semibold text-white transition-colors hover:bg-primary-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
        >
          Back to Catalog
        </Link>
      </div>
    </main>
  );
}
