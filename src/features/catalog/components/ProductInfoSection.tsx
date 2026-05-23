import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/Button";
import { QuantityControl } from "@/components/QuantityControl";
import { StatusBadge } from "@/components/StatusBadge";
import { useMeQuery } from "@/features/auth";
import { SizeButton } from "@/features/catalog/components/SizeButton";
import type { ProductDetail, ProductSize, StockState } from "@/features/catalog/schema";

type Props = {
  product: ProductDetail;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const SHIRT_ORDER = ["S", "M", "L", "XL", "XXL", "XXXL"];

function sortSizes(sizes: readonly ProductSize[]): ProductSize[] {
  return [...sizes].sort((a, b) => {
    const aNum = Number(a.size);
    const bNum = Number(b.size);
    const aIsNum = !Number.isNaN(aNum);
    const bIsNum = !Number.isNaN(bNum);
    if (aIsNum && bIsNum) return aNum - bNum;
    const aShirt = SHIRT_ORDER.indexOf(a.size);
    const bShirt = SHIRT_ORDER.indexOf(b.size);
    if (aShirt !== -1 && bShirt !== -1) return aShirt - bShirt;
    return a.size.localeCompare(b.size);
  });
}

export function ProductInfoSection({ product }: Props) {
  const { data: user, isPending: authPending } = useMeQuery();
  const isAuthed = !authPending && user !== null && user !== undefined;

  const sizes = useMemo(() => sortSizes(product.sizes ?? []), [product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const firstAvailable = sizes.find((s) => s.state !== "OUT_OF_STOCK");
    return firstAvailable?.size ?? null;
  });
  const [quantity, setQuantity] = useState(1);

  const selected = sizes.find((s) => s.size === selectedSize) ?? null;
  const stockState: StockState = selected?.state ?? "OUT_OF_STOCK";
  const maxQuantity = selected?.quantity ?? 0;
  const canPurchase = selected !== null && stockState !== "OUT_OF_STOCK" && maxQuantity > 0;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-2">
      <nav aria-label="Breadcrumb" className="text-caption-regular text-text-secondary">
        <Link to="/catalog" className="hover:text-primary-blue hover:underline">
          Catalog
        </Link>
        <span> {">"} </span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <h1 className="text-heading-l text-text-primary">{product.name}</h1>

      <p className="text-heading-m leading-none text-primary-blue">
        {priceFormatter.format(product.price)}
      </p>

      {product.description !== null && (
        <p className="text-body-small text-text-secondary">{product.description}</p>
      )}

      <div className="h-px w-full bg-border-default" />

      {product.isMultiSize && sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-body-small-bold text-text-primary">Select Size</p>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((s) => (
              <SizeButton
                key={s.size}
                label={s.size}
                variant={
                  s.state === "OUT_OF_STOCK"
                    ? "outOfStock"
                    : s.size === selectedSize
                      ? "selected"
                      : "default"
                }
                onClick={() => handleSelectSize(s.size)}
              />
            ))}
          </div>
        </div>
      )}

      <StatusBadge state={stockState} className="self-start" />

      {isAuthed && (
        <div className="flex items-center gap-3">
          {canPurchase && (
            <QuantityControl
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={maxQuantity}
              ariaLabel={`Quantity for ${product.name}`}
            />
          )}
          <Button
            variant="primary"
            disabled={!canPurchase}
            onClick={() => {
              // No-op for the MVP; real cart wiring lands with the Cart feature.
            }}
          >
            {canPurchase ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      )}
    </div>
  );
}
