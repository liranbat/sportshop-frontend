import { cn } from "@/lib/cn";

type BadgeKind = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DELETED";

type Props = {
  state: BadgeKind;
  label?: string;
  className?: string;
};

const DEFAULT_LABEL: Record<BadgeKind, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
  DELETED: "Deleted",
};

const VARIANT: Record<BadgeKind, { bg: string; text: string }> = {
  IN_STOCK: { bg: "bg-success-bg", text: "text-success-text" },
  LOW_STOCK: { bg: "bg-warning-bg", text: "text-warning-text" },
  OUT_OF_STOCK: { bg: "bg-error-bg", text: "text-error-text" },
  DELETED: { bg: "bg-error-bg", text: "text-error-text" },
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
