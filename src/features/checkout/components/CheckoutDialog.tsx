import { useState } from "react";
import { Modal } from "@/components/Modal";
import type { CheckoutStep, ShippingForm } from "../schema";
import { PaymentStep } from "./PaymentStep";
import { ShippingStep } from "./ShippingStep";
import { StepIndicator } from "./StepIndicator";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
};

function stepIndicatorIndex(step: CheckoutStep): 1 | 2 | 3 {
  if (step === "shipping") return 1;
  if (step === "payment") return 2;
  return 3;
}

export function CheckoutDialog({ open, onOpenChange, subtotal }: CheckoutDialogProps) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  // shipping persists across the Shipping <-> Payment back-nav; payment data
  // is owned by PaymentStep locally so card fields never live above the form.
  const [shipping, setShipping] = useState<ShippingForm | null>(null);

  // reset on close so reopening the dialog always starts fresh at Shipping
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep("shipping");
      setShipping(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange} ariaLabel="Checkout" width="45rem">
      <div className="flex min-h-184 flex-col p-8">
        <Modal.Title className="text-heading-m text-text-primary">Checkout</Modal.Title>
        <Modal.Description className="sr-only">
          Complete your order in three steps: shipping, payment, and confirmation.
        </Modal.Description>

        <div className="mt-6 flex justify-center">
          <StepIndicator step={stepIndicatorIndex(step)} />
        </div>

        <div className="mt-6 flex flex-1 flex-col">
          {step === "shipping" && (
            <ShippingStep
              initialData={shipping}
              onBackToCart={() => handleOpenChange(false)}
              onComplete={(data) => {
                setShipping(data);
                setStep("payment");
              }}
            />
          )}
          {step === "payment" && (
            <PaymentStep
              subtotal={subtotal}
              onBackToCart={() => handleOpenChange(false)}
              onBack={() => setStep("shipping")}
              onComplete={() => {
                // real submit lands in page 3; for now just advance the state machine
                setStep("processing");
              }}
            />
          )}
          {step !== "shipping" && step !== "payment" && (
            <div className="text-body-regular text-text-secondary">
              step body placeholder: {step}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
