import { cn } from "@/lib/cn";

type Variant = "warning" | "success" | "error";

type Props = {
  message: string;
  variant: Variant;
  className?: string;
};

const variantClasses: Record<Variant, { container: string; dot: string; text: string }> = {
  warning: {
    container: "border-warning-border bg-warning-bg",
    dot: "bg-warning-amber",
    text: "text-warning-text",
  },
  success: {
    container: "border-success-border bg-success-bg",
    dot: "bg-success-green",
    text: "text-success-text",
  },
  error: {
    container: "border-error-border bg-error-bg",
    dot: "bg-error-red",
    text: "text-error-text",
  },
};

export function Notice({ message, variant, className }: Props) {
  const v = variantClasses[variant];
  const role = variant === "error" ? "alert" : "status";
  return (
    <div
      role={role}
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border px-4 py-3",
        v.container,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", v.dot)} />
      <p className={cn("text-body-small", v.text)}>{message}</p>
    </div>
  );
}
