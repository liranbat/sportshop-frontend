import { useId, useState } from "react";
import { Button } from "@/components/Button";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { MutationErrorBanner, Notice } from "@/components/Notice";
import { StandardModal } from "@/components/StandardModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useAdminProductsQuery } from "@/features/catalog/queries";
import type { Product } from "@/features/catalog/schema";
import { useAddAdminStockSizeMutation } from "@/features/stock/queries";
import { ONE_SIZE_TOKEN } from "@/features/stock/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const RESULT_PAGE_SIZE = 20;

export function AddSizeModal({ open, onOpenChange, onSuccess }: Props) {
  return (
    <AddSizeModalContent
      key={open ? "open" : "closed"}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}

type SelectedProduct = { id: number; name: string; isArchived: boolean };

function AddSizeModalContent({ open, onOpenChange, onSuccess }: Props) {
  const formId = useId();
  const mutation = useAddAdminStockSizeMutation();
  const isPending = mutation.isPending;

  const [query, setQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [threshold, setThreshold] = useState<string>("");

  const trimmedQuery = query.trim();
  const productsQuery = useAdminProductsQuery(
    {
      search: trimmedQuery === "" ? undefined : trimmedQuery,
      isMultiSize: true,
      pageSize: RESULT_PAGE_SIZE,
      page: 0,
    },
    { enabled: open && selectedProduct === null },
  );
  const results = productsQuery.data?.items ?? [];

  const trimmedSize = size.trim();
  const sizeIsReserved = trimmedSize.toUpperCase() === ONE_SIZE_TOKEN;
  const sizeValid = trimmedSize !== "" && !sizeIsReserved;

  const parsedQty = parseNonNegativeInt(quantity);
  const parsedThr =
    threshold.trim() === "" ? { ok: true as const, value: null } : parseNonNegativeInt(threshold);

  const submittable = selectedProduct !== null && sizeValid && parsedQty.ok && parsedThr.ok;

  const handleClose = () => {
    if (isPending) return;
    mutation.reset();
    onOpenChange(false);
  };

  const handleChangeProduct = () => {
    if (isPending) return;
    mutation.reset();
    setSelectedProduct(null);
    setSize("");
    setQuantity("");
    setThreshold("");
  };

  const handleSubmit = () => {
    if (!submittable || isPending || selectedProduct === null) return;
    mutation.mutate(
      {
        productId: selectedProduct.id,
        body: {
          size: trimmedSize,
          quantity: parsedQty.value as number,
          lowStockThreshold: parsedThr.value,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  const sizeError =
    !sizeValid && size !== ""
      ? sizeIsReserved
        ? `"${ONE_SIZE_TOKEN}" is reserved — choose a different size label.`
        : "Size cannot be empty."
      : undefined;

  const inPickerStep = selectedProduct === null;

  return (
    <StandardModal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
      width="32.5rem"
      title="Add size"
      subtitle="Add a new size row for an existing multi-size product."
      errorBanner={<MutationErrorBanner mutation={mutation} />}
      bodyClassName="min-h-96 gap-4"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outlined" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          {!inPickerStep && (
            <Button
              type="submit"
              form={formId}
              isLoading={isPending}
              disabled={!submittable || isPending}
            >
              {isPending ? "Adding…" : "Add size"}
            </Button>
          )}
        </div>
      }
    >
      {inPickerStep ? (
        <ProductPicker
          query={query}
          onQueryChange={setQuery}
          results={results}
          isFetching={productsQuery.isFetching}
          isError={productsQuery.isError}
          errorMessage={productsQuery.error?.message}
          onSelect={(p) => setSelectedProduct({ id: p.id, name: p.name, isArchived: p.isArchived })}
        />
      ) : (
        <SizeForm
          formId={formId}
          selected={selectedProduct}
          onChangeProduct={handleChangeProduct}
          size={size}
          onSizeChange={setSize}
          sizeError={sizeError}
          quantity={quantity}
          onQuantityChange={setQuantity}
          quantityError={
            parsedQty.ok || quantity === "" ? undefined : "Must be a non-negative integer."
          }
          quantityHint={quantity === "" ? "Required." : undefined}
          threshold={threshold}
          onThresholdChange={setThreshold}
          thresholdError={parsedThr.ok ? undefined : "Must be a non-negative integer."}
          isPending={isPending}
          onSubmit={handleSubmit}
        />
      )}
    </StandardModal>
  );
}

function ProductPicker({
  query,
  onQueryChange,
  results,
  isFetching,
  isError,
  errorMessage,
  onSelect,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  results: Product[];
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onSelect: (product: Product) => void;
}) {
  const trimmedQuery = query.trim();
  const hasResults = results.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <FilterSearchBar
        value={query}
        onChange={onQueryChange}
        placeholder="Search by product name…"
        ariaLabel="Search products"
      />

      <div className="h-60 overflow-hidden rounded-lg border border-border-default">
        {isError ? (
          <div className="flex h-full items-center justify-center bg-background-page px-4">
            <Notice
              variant="error"
              message={errorMessage ?? "Could not load products. Please refresh and try again."}
            />
          </div>
        ) : hasResults ? (
          <ul
            role="listbox"
            aria-label="Product search results"
            className="h-full overflow-y-auto bg-background-card"
          >
            {results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => onSelect(p)}
                  className="flex w-full items-center justify-between gap-3 border-b border-border-default px-3 py-2 text-left text-body-small last:border-b-0 hover:bg-primary-blue-light focus-visible:bg-primary-blue-light focus-visible:outline-none"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium text-text-primary">{p.name}</span>
                    {p.isArchived && <StatusBadge state="ARCHIVED" />}
                  </span>
                  <span className="shrink-0 text-caption-regular text-text-secondary">#{p.id}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center bg-background-page px-4 text-body-small text-text-secondary">
            {isFetching
              ? "Searching…"
              : trimmedQuery === ""
                ? "No multi-size products found."
                : "No multi-size products match this name."}
          </div>
        )}
      </div>

      <p className="text-caption-regular text-text-secondary">
        Showing up to {RESULT_PAGE_SIZE} multi-size matches. If you don&apos;t see your product,
        narrow the search with a more specific name.
      </p>
    </div>
  );
}

function SizeForm({
  formId,
  selected,
  onChangeProduct,
  size,
  onSizeChange,
  sizeError,
  quantity,
  onQuantityChange,
  quantityError,
  quantityHint,
  threshold,
  onThresholdChange,
  thresholdError,
  isPending,
  onSubmit,
}: {
  formId: string;
  selected: SelectedProduct;
  onChangeProduct: () => void;
  size: string;
  onSizeChange: (next: string) => void;
  sizeError?: string;
  quantity: string;
  onQuantityChange: (next: string) => void;
  quantityError?: string;
  quantityHint?: string;
  threshold: string;
  onThresholdChange: (next: string) => void;
  thresholdError?: string;
  isPending: boolean;
  onSubmit: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-background-page px-3 py-2">
        <div className="flex min-w-0 flex-col">
          <span className="text-caption-regular text-text-secondary">Adding size to</span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-body-regular font-semibold text-text-primary">
              {selected.name}
            </span>
            {selected.isArchived && <StatusBadge state="ARCHIVED" />}
          </span>
        </div>
        <Button
          type="button"
          variant="outlined"
          onClick={onChangeProduct}
          disabled={isPending}
          className="h-7 shrink-0 px-3 text-body-small"
        >
          Change
        </Button>
      </div>

      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <InputFieldStacked
          label="Size"
          value={size}
          onChange={(e) => onSizeChange(e.target.value)}
          placeholder="e.g. M, L, 42"
          disabled={isPending}
          autoFocus
          reserveErrorSpace
          error={sizeError}
        />

        <InputFieldStacked
          label="Initial quantity"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          disabled={isPending}
          reserveErrorSpace
          error={quantityError}
          hint={quantityHint}
        />

        <InputFieldStacked
          label="Low-stock threshold"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          placeholder="—"
          value={threshold}
          onChange={(e) => onThresholdChange(e.target.value)}
          disabled={isPending}
          reserveErrorSpace
          hint="Optional. Leave empty to skip the alert."
          error={thresholdError}
        />
      </form>
    </>
  );
}

type ParseResult<T> = { ok: true; value: T } | { ok: false };

function parseNonNegativeInt(raw: string): ParseResult<number> {
  const trimmed = raw.trim();
  if (trimmed === "" || !/^\d+$/.test(trimmed)) return { ok: false };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return { ok: false };
  return { ok: true, value: n };
}
