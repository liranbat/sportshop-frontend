import { cn } from "@/lib/cn";

type Variant = "default" | "selected" | "outOfStock";

type Props = {
  label: string;
  variant: Variant;
  onClick?: () => void;
  className?: string;
};

const baseClasses =
  "inline-flex h-10 items-center justify-center rounded-lg px-4 text-body-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2";

const VARIANT: Record<Variant, string> = {
  default:
    "border border-border-default bg-background-card text-text-primary hover:bg-primary-blue-light",
  selected: "bg-primary-blue text-white",
  outOfStock:
    "border border-border-default bg-background-page text-text-placeholder line-through opacity-50 cursor-not-allowed",
};

export function SizeButton({ label, variant, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={variant === "outOfStock"}
      aria-pressed={variant === "selected"}
      className={cn(baseClasses, VARIANT[variant], className)}
    >
      {label}
    </button>
  );
}
