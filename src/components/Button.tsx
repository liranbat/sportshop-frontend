import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outlined" | "subtle";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

const baseClasses =
  "inline-flex h-10 items-center justify-center rounded-lg px-5 text-body-regular font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-blue text-white hover:bg-primary-blue-hover disabled:bg-primary-blue-disabled disabled:text-white/70 disabled:hover:bg-primary-blue-disabled",
  outlined:
    "border border-primary-blue bg-transparent text-primary-blue hover:bg-primary-blue-light disabled:border-text-placeholder disabled:text-text-placeholder disabled:hover:bg-transparent",
  subtle:
    "border border-border-default bg-transparent text-text-primary hover:bg-background-page disabled:opacity-50 disabled:hover:bg-transparent",
};

export function Button({
  variant = "primary",
  isLoading = false,
  type = "button",
  disabled,
  className,
  children,
  ref,
  ...rest
}: Props) {
  const effectivelyDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={effectivelyDisabled}
      aria-busy={isLoading || undefined}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
