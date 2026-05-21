import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  className?: string;
};

export function DropdownChevron({ open, className }: Props) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={cn(
        "h-3 w-3 shrink-0 text-text-secondary transition-transform",
        open && "rotate-180",
        className,
      )}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4.5L6 8.5L10 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
