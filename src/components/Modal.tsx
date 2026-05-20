import * as Dialog from "@radix-ui/react-dialog";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
  width?: number | string;
  ariaLabel?: string;
};

// app convention: modals close only via an explicit close button.
// Esc and outside-click are always blocked here.
const blockEvent = (event: Event) => event.preventDefault();

export function Modal({
  open,
  onOpenChange,
  children,
  contentClassName,
  width = "35rem",
  ariaLabel,
}: ModalProps) {
  const widthStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "calc(100vw - 2rem)",
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <Dialog.Content
          aria-label={ariaLabel}
          style={widthStyle}
          onEscapeKeyDown={blockEvent}
          onPointerDownOutside={blockEvent}
          onInteractOutside={blockEvent}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl bg-background-card shadow-card",
            "focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            contentClassName,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;
Modal.Close = Dialog.Close;
