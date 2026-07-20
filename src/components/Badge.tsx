import { cn } from "@/lib/cn";

export type BadgeKind =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ARCHIVED"
  | "DELETED"
  | "ACTIVE"
  | "PAID"
  | "CANCELLED_BY_USER"
  | "CANCELLED_BY_ADMIN"
  | "SHIPPED"
  | "DELIVERED"
  | "DONE"
  | "ROLE_ADMIN"
  | "ROLE_USER";

export type BadgeSize = "sm" | "md";

type Props = {
  kind: BadgeKind;
  label: string;
  size?: BadgeSize;
  className?: string;
};

type Tone = { bg: string; text: string };

const TONE: Record<BadgeKind, Tone> = {
  IN_STOCK: { bg: "bg-success-bg", text: "text-success-text" },
  LOW_STOCK: { bg: "bg-warning-bg", text: "text-warning-text" },
  OUT_OF_STOCK: { bg: "bg-error-bg", text: "text-error-text" },
  ARCHIVED: { bg: "bg-background-page", text: "text-text-secondary" },
  DELETED: { bg: "bg-error-bg", text: "text-error-text" },
  ACTIVE: { bg: "bg-success-bg", text: "text-success-text" },
  PAID: { bg: "bg-success-bg", text: "text-success-text" },
  CANCELLED_BY_USER: { bg: "bg-quantity-control-bg", text: "text-text-secondary" },
  CANCELLED_BY_ADMIN: { bg: "bg-error-bg", text: "text-error-text" },
  SHIPPED: { bg: "bg-status-shipped-bg", text: "text-status-shipped-text" },
  DELIVERED: { bg: "bg-status-delivered-bg", text: "text-status-delivered-text" },
  DONE: { bg: "bg-status-done-bg", text: "text-status-done-text" },
  ROLE_ADMIN: { bg: "bg-primary-blue", text: "text-white" },
  ROLE_USER: { bg: "bg-primary-blue-light", text: "text-primary-blue" },
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  md: "h-6 text-body-small-bold",
  sm: "h-5 text-caption-regular font-semibold",
};

function isRoleKind(kind: BadgeKind): boolean {
  return kind === "ROLE_ADMIN" || kind === "ROLE_USER";
}

export function Badge({ kind, label, size = "md", className }: Props) {
  const isRole = isRoleKind(kind);
  const tone = TONE[kind];
  return (
    <span
      role={isRole ? undefined : "status"}
      aria-label={isRole ? `Role: ${label}` : label}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2",
        SIZE_CLASS[size],
        tone.bg,
        tone.text,
        className,
      )}
    >
      {label}
    </span>
  );
}
