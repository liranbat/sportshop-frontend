import type { ReactNode } from "react";
import { Modal } from "@/components/Modal";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  errorBanner?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  bodyClassName?: string;
};

export function StandardModal({
  open,
  onOpenChange,
  title,
  subtitle,
  icon,
  errorBanner,
  children,
  footer,
  width = "35rem",
  bodyClassName,
}: Props) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} width={width}>
      <div className="flex flex-col gap-6 p-8">
        {icon && <div className="flex justify-center">{icon}</div>}

        <div className="flex flex-col items-center gap-2 text-center">
          <Modal.Title className="text-heading-l text-text-primary">{title}</Modal.Title>
          {subtitle && (
            <Modal.Description className="text-body-small text-text-secondary">
              {subtitle}
            </Modal.Description>
          )}
        </div>

        {errorBanner}

        {children && <div className={cn("flex flex-col gap-4", bodyClassName)}>{children}</div>}

        {footer}
      </div>
    </Modal>
  );
}
