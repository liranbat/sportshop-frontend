import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function WarningTile({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full bg-error-bg",
        className,
      )}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-error-red"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  );
}
