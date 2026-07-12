import { useId, useState } from "react";
import { Button } from "@/components/Button";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { MutationErrorBanner } from "@/components/Notice";
import { SegmentedControl } from "@/components/SegmentedControl";
import { StandardModal } from "@/components/StandardModal";
import { cn } from "@/lib/cn";
import { useAdjustAdminStockMutation, useSetAdminStockMutation } from "@/features/stock/queries";
import type { StockRow } from "@/features/stock/schema";

type EditStockMode = "set" | "adjust";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: StockRow | null;
  onSuccess: () => void;
};

const MODE_OPTIONS = [
  { value: "set" as const, label: "Set absolute" },
  { value: "adjust" as const, label: "Adjust ±" },
];

export function EditStockRowModal({ open, onOpenChange, row, onSuccess }: Props) {
  if (!row) return null;
  return (
    <EditStockRowModalContent
      key={`${row.productId}:${row.size}`}
      open={open}
      onOpenChange={onOpenChange}
      row={row}
      onSuccess={onSuccess}
    />
  );
}

function EditStockRowModalContent({
  open,
  onOpenChange,
  row,
  onSuccess,
}: Required<Omit<Props, "row">> & { row: StockRow }) {
  const formId = useId();
  const [mode, setMode] = useState<EditStockMode>("set");

  const initialQuantity = String(row.quantity);
  const initialThreshold =
    row.lowStockThreshold === null || row.lowStockThreshold === undefined
      ? ""
      : String(row.lowStockThreshold);
  const initialDelta = "";

  const [quantity, setQuantity] = useState<string>(initialQuantity);
  const [threshold, setThreshold] = useState<string>(initialThreshold);
  const [delta, setDelta] = useState<string>(initialDelta);

  const setMutation = useSetAdminStockMutation();
  const adjustMutation = useAdjustAdminStockMutation();
  const activeMutation = mode === "set" ? setMutation : adjustMutation;
  const isPending = activeMutation.isPending;

  const handleModeChange = (next: EditStockMode) => {
    if (next === mode) return;
    setMutation.reset();
    adjustMutation.reset();
    setQuantity(initialQuantity);
    setThreshold(initialThreshold);
    setDelta(initialDelta);
    setMode(next);
  };

  const parsedQty = parseNonNegativeInt(quantity);
  const parsedThr =
    threshold.trim() === "" ? { ok: true as const, value: null } : parseNonNegativeInt(threshold);
  const setValid = parsedQty.ok && parsedThr.ok;
  const setPristine =
    parsedQty.ok &&
    parsedThr.ok &&
    parsedQty.value === row.quantity &&
    parsedThr.value === (row.lowStockThreshold ?? null);
  const setSubmittable = setValid && !setPristine;

  const parsedDelta = parseSignedNonZeroInt(delta);
  const adjustPreview = parsedDelta.ok ? row.quantity + parsedDelta.value : null;
  const adjustPreviewBelowZero = adjustPreview !== null && adjustPreview < 0;
  const adjustSubmittable = parsedDelta.ok && !adjustPreviewBelowZero;

  const handleClose = () => {
    if (isPending) return;
    setMutation.reset();
    adjustMutation.reset();
    onOpenChange(false);
  };

  const handleSetSubmit = () => {
    if (!setSubmittable || isPending) return;
    setMutation.mutate(
      {
        productId: row.productId,
        size: row.size,
        body: { quantity: parsedQty.value as number, lowStockThreshold: parsedThr.value },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  const handleAdjustSubmit = () => {
    if (!adjustSubmittable || isPending) return;
    adjustMutation.mutate(
      { productId: row.productId, size: row.size, body: { delta: parsedDelta.value as number } },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  const primaryLabel = mode === "set" ? "Save" : "Apply";
  const primaryPendingLabel = mode === "set" ? "Saving…" : "Applying…";
  const primaryDisabled = mode === "set" ? !setSubmittable : !adjustSubmittable;

  // empty delta input is "no input yet" not "user typed garbage" — don't shout
  const showDeltaError = delta.trim() !== "" && !parsedDelta.ok;

  return (
    <StandardModal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
      width="32.5rem"
      title="Edit stock"
      subtitle={
        <>
          {row.productName} · size <span className="font-semibold">{row.size}</span>
        </>
      }
      errorBanner={<MutationErrorBanner mutation={activeMutation} />}
      bodyClassName="gap-5"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outlined" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isPending}
            disabled={primaryDisabled || isPending}
          >
            {isPending ? primaryPendingLabel : primaryLabel}
          </Button>
        </div>
      }
    >
      <div className="flex justify-center">
        <SegmentedControl
          options={MODE_OPTIONS}
          value={mode}
          onChange={handleModeChange}
          ariaLabel="Edit mode"
          disabled={isPending}
        />
      </div>

      <CurrentStateRow row={row} />

      {mode === "set" ? (
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            handleSetSubmit();
          }}
          noValidate
          className="flex min-h-56 flex-col gap-4"
        >
          <InputFieldStacked
            label="Quantity"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isPending}
            autoFocus
            reserveErrorSpace
            error={parsedQty.ok ? undefined : "Must be a non-negative integer."}
          />
          <InputFieldStacked
            label="Low-stock threshold"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="—"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={isPending}
            reserveErrorSpace
            hint="Leave empty to clear the alert."
            error={parsedThr.ok ? undefined : "Must be a non-negative integer."}
            endAdornment={
              threshold !== "" && (
                <button
                  type="button"
                  onClick={() => setThreshold("")}
                  disabled={isPending}
                  className="shrink-0 text-body-small font-semibold text-primary-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:opacity-50"
                >
                  Clear
                </button>
              )
            }
          />
        </form>
      ) : (
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            handleAdjustSubmit();
          }}
          noValidate
          className="flex min-h-56 flex-col gap-4"
        >
          <InputFieldStacked
            label="Delta"
            type="number"
            step={1}
            inputMode="numeric"
            placeholder="+50"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            disabled={isPending}
            autoFocus
            reserveErrorSpace
            hint="Non-zero signed integer (e.g. +50 or -3)."
            error={showDeltaError ? "Must be a non-zero integer." : undefined}
          />

          <div
            className={cn(
              "rounded-lg border px-4 py-3 text-body-small",
              parsedDelta.ok && adjustPreviewBelowZero
                ? "border-error-red/40 bg-error-bg text-error-text"
                : "border-border-default bg-background-page text-text-primary",
            )}
          >
            {parsedDelta.ok && adjustPreview !== null ? (
              <>
                <span className="text-text-secondary">After: </span>
                <span className="font-semibold">{row.quantity}</span>
                <span> {parsedDelta.value >= 0 ? "+" : "−"} </span>
                <span className="font-semibold">{Math.abs(parsedDelta.value)}</span>
                <span> = </span>
                <span className="font-semibold">{adjustPreview}</span>
              </>
            ) : (
              <span className="text-text-secondary">
                Enter a delta to preview the resulting quantity.
              </span>
            )}
            <p
              className={cn(
                "mt-1 text-caption-regular",
                adjustPreviewBelowZero ? undefined : "invisible select-none",
              )}
              aria-hidden={!adjustPreviewBelowZero || undefined}
            >
              {adjustPreviewBelowZero
                ? "Quantity can't drop below 0 — adjust will be refused."
                : "\u00A0"}
            </p>
            <p className="mt-2 text-caption-regular text-text-secondary">
              Adjust applies the delta to the current server value at submit. The result may differ
              if another admin updates this row first.
            </p>
          </div>
        </form>
      )}
    </StandardModal>
  );
}

function CurrentStateRow({ row }: { row: StockRow }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border-default bg-background-page px-4 py-3 text-body-small">
      <div className="flex flex-col">
        <span className="text-caption-regular text-text-secondary">Current quantity</span>
        <span className="text-body-regular font-semibold text-text-primary">{row.quantity}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-caption-regular text-text-secondary">Current threshold</span>
        <span className="text-body-regular font-semibold text-text-primary">
          {row.lowStockThreshold === null || row.lowStockThreshold === undefined
            ? "—"
            : `≤${row.lowStockThreshold}`}
        </span>
      </div>
    </div>
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

function parseSignedNonZeroInt(raw: string): ParseResult<number> {
  const trimmed = raw.trim();
  if (trimmed === "" || !/^[+-]?\d+$/.test(trimmed)) return { ok: false };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n === 0 || !Number.isInteger(n)) return { ok: false };
  return { ok: true, value: n };
}
