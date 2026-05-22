import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FilterDropdownLabeled({ label, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-caption-regular text-text-secondary">{label}</span>
      {children}
    </div>
  );
}
