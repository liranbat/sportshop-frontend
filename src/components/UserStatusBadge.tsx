import { cn } from "@/lib/cn";

export type UserStatusKind = "ACTIVE" | "DELETED";

type Props = {
  status: UserStatusKind;
  label?: string;
  className?: string;
};

const DEFAULT_LABEL: Record<UserStatusKind, string> = {
  ACTIVE: "Active",
  DELETED: "Deleted",
};

const VARIANT: Record<UserStatusKind, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-success-bg", text: "text-success-text" },
  DELETED: { bg: "bg-error-bg", text: "text-error-text" },
};

export function UserStatusBadge({ status, label, className }: Props) {
  const v = VARIANT[status];
  const text = label ?? DEFAULT_LABEL[status];
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
