import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "danger";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> & {
  children: ReactNode;
  ariaLabel: string;
  tone?: Tone;
  ref?: Ref<HTMLButtonElement>;
};

const baseClasses =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:cursor-not-allowed disabled:opacity-50";

const toneClasses: Record<Tone, string> = {
  default: "text-text-secondary hover:bg-primary-blue-light hover:text-primary-blue",
  danger: "text-error-red hover:bg-error-bg",
};

export function IconButton({
  children,
  ariaLabel,
  tone = "default",
  type = "button",
  className,
  ref,
  ...rest
}: Props) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(baseClasses, toneClasses[tone], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
