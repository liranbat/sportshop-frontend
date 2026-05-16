import { cn } from "@/lib/cn";

type Props = {
  message: string;
  className?: string;
};

export function ErrorBanner({ message, className }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border border-error-border bg-error-bg px-4 py-3",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-error-red"
      />
      <p className="text-body-small text-error-text">{message}</p>
    </div>
  );
}
