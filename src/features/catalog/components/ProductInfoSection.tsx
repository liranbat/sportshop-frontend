import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { QuantityControl } from "@/components/QuantityControl";
import { RefreshButton } from "@/components/RefreshButton";
import { useMeQuery } from "@/features/auth";
import { useAddCartItemMutation } from "@/features/cart/queries";
import { SizeButton } from "@/features/catalog/components/SizeButton";
import type { ProductDetail, ProductSize, StockState } from "@/features/catalog/schema";
import { STOCK_LABEL } from "@/features/stock/badge";
import { paths } from "@/lib/paths";

type Props = {
  product: ProductDetail;
  onRefresh?: () => void;
  isRefreshing?: boolean;
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

export function ProductInfoSection({ product, onRefresh, isRefreshing = false }: Props) {
  const { data: user, isPending: authPending } = useMeQuery();
  const isAuthed = !authPending && user !== null && user !== undefined;
  const addCartItemMutation = useAddCartItemMutation();

  const sizes = useMemo(() => sortSizes(product.sizes ?? []), [product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const firstAvailable = sizes.find((s) => s.state !== "OUT_OF_STOCK");
    return firstAvailable?.size ?? null;
  });
  const [quantity, setQuantity] = useState(1);
  const [prevProductSizes, setPrevProductSizes] = useState(product.sizes);
  const [sizeReplaceSignal, setSizeReplaceSignal] = useState(0);

  // on refetch: if the previously-selected size vanished or became OOS, snap back
  // to the "first available" pick used at mount and reset per-size local state.
  if (prevProductSizes !== product.sizes) {
    setPrevProductSizes(product.sizes);
    const current = selectedSize !== null ? sizes.find((s) => s.size === selectedSize) : undefined;
    if (current === undefined || current.state === "OUT_OF_STOCK") {
      setSelectedSize(sizes.find((s) => s.state !== "OUT_OF_STOCK")?.size ?? null);
      setQuantity(1);
      setSizeReplaceSignal((n) => n + 1);
    }
  }

  useEffect(() => {
    if (sizeReplaceSignal > 0) addCartItemMutation.reset();
  }, [sizeReplaceSignal, addCartItemMutation]);

  const selected = sizes.find((s) => s.size === selectedSize) ?? null;
  const stockState: StockState = selected?.state ?? "OUT_OF_STOCK";
  const maxQuantity = selected?.quantity ?? 0;
  const canPurchase = selected !== null && stockState !== "OUT_OF_STOCK" && maxQuantity > 0;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
    addCartItemMutation.reset();
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addCartItemMutation.mutate(
      { productId: product.id, size: selectedSize, quantity },
      {
        onSuccess: () => {
          setQuantity(1);
        },
      },
    );
  };

  return (
    <div
      className={`flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-2 transition-opacity ${
        isRefreshing ? "opacity-60" : ""
      }`}
      aria-busy={isRefreshing}
    >
      <fieldset disabled={isRefreshing} className="contents">
        <div className="flex items-center justify-between gap-2">
          <BackLink to={paths.catalog()} label="Back to Catalog" />
          {onRefresh && (
            <RefreshButton
              onClick={onRefresh}
              isPending={isRefreshing}
              ariaLabel="Refresh product details"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-l text-text-primary">{product.name}</h1>
          {product.isArchived && <Badge kind="ARCHIVED" label="Archived" />}
        </div>

        {!product.isArchived && (
          <p className="text-heading-m leading-none text-primary-blue">
            {priceFormatter.format(product.price)}
          </p>
        )}

        {product.description !== null && (
          <p className="text-body-small text-text-secondary">{product.description}</p>
        )}

        <div className="h-px w-full bg-border-default" />

        {product.isArchived ? (
          <Notice variant="info" message="This product is no longer available." />
        ) : (
          <>
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

            <Badge kind={stockState} label={STOCK_LABEL[stockState]} className="self-start" />

            {isAuthed && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {canPurchase && (
                    <QuantityControl
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      ariaLabel={`Quantity for ${product.name}`}
                    />
                  )}
                  <Button
                    variant="primary"
                    disabled={!canPurchase}
                    isLoading={addCartItemMutation.isPending}
                    onClick={handleAddToCart}
                  >
                    {canPurchase ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
                {addCartItemMutation.isError && (
                  <Notice variant="error" message={addCartItemMutation.error.message} />
                )}
                {addCartItemMutation.isSuccess && (
                  <Notice variant="success" message="Added to your cart." />
                )}
              </div>
            )}
          </>
        )}
      </fieldset>
    </div>
  );
}
