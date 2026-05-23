import { cn } from "@/lib/cn";

type StockState = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

type Props = {
  state: StockState;
  label?: string;
  className?: string;
};

const DEFAULT_LABEL: Record<StockState, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const VARIANT: Record<StockState, { bg: string; text: string }> = {
  IN_STOCK: { bg: "bg-success-bg", text: "text-success-text" },
  LOW_STOCK: { bg: "bg-warning-bg", text: "text-warning-text" },
  OUT_OF_STOCK: { bg: "bg-error-bg", text: "text-error-text" },
};

export function StatusBadge({ state, label, className }: Props) {
  const v = VARIANT[state];
  const text = label ?? DEFAULT_LABEL[state];
  return (
    <span
      role="status"
      aria-label={text}
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-full px-2 text-body-small-bold",
        v.bg,
        v.text,
        className,
      )}
    >
      {text}
    </span>
  );
}
