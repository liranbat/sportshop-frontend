import { useState } from "react";
import { Modal } from "@/components/Modal";
import type { ApiError } from "@/lib/api";
import {
  toCheckoutRequest,
  type CheckoutResult,
  type CheckoutStep,
  type ShippingForm,
} from "../schema";
import { useCheckoutMutation } from "../queries";
import { FailureState } from "./FailureState";
import { PaymentStep } from "./PaymentStep";
import { ProcessingState } from "./ProcessingState";
import { ShippingStep } from "./ShippingStep";
import { StepIndicator } from "./StepIndicator";
import { SuccessState } from "./SuccessState";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
};

// Only the conflict (409) and bad-gateway (502) responses carry server-authored,
// user-ready copy. Network drops / 500s / unmapped errors get the generic line
// so we never leak raw axios strings like "Request failed with status code 500".
const GENERIC_FAILURE_MESSAGE =
  "Something went wrong while processing your order. Please try again.";

function deriveFailureMessage(error: ApiError): string {
  if (error.status === 409 || error.status === 502) {
    return error.message || GENERIC_FAILURE_MESSAGE;
  }
  return GENERIC_FAILURE_MESSAGE;
}

function stepIndicatorIndex(step: CheckoutStep): 1 | 2 | 3 {
  if (step === "shipping") return 1;
  if (step === "payment") return 2;
  return 3;
}

export function CheckoutDialog({ open, onOpenChange, subtotal }: CheckoutDialogProps) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  // we keep shipping up here so the user doesn't lose what they typed when
  // they click Back from Payment. card fields are NOT kept here -- PaymentStep
  // owns its own form, so "Try Again" after a failure shows empty card fields.
  const [shipping, setShipping] = useState<ShippingForm | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [failureMessage, setFailureMessage] = useState<string>(GENERIC_FAILURE_MESSAGE);

  const mutation = useCheckoutMutation();

  // reset on close so reopening the dialog always starts fresh at Shipping
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep("shipping");
      setShipping(null);
      setResult(null);
      setFailureMessage(GENERIC_FAILURE_MESSAGE);
      mutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const handlePaymentComplete = (paymentForm: Parameters<typeof toCheckoutRequest>[1]) => {
    if (!shipping) return;
    setStep("processing");
    mutation.mutate(toCheckoutRequest(shipping, paymentForm), {
      onSuccess: (data) => {
        setResult(data);
        setStep("success");
      },
      onError: (error) => {
        setFailureMessage(deriveFailureMessage(error));
        setStep("failure");
      },
    });
  };

  // Try Again: clear the stale mutation state and go back to Payment.
  // PaymentStep re-mounts with empty card fields; shipping stays in dialog state.
  const handleTryAgain = () => {
    mutation.reset();
    setStep("payment");
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
              onComplete={handlePaymentComplete}
            />
          )}
          {step === "processing" && <ProcessingState />}
          {step === "success" && result && (
            <SuccessState result={result} onClose={() => handleOpenChange(false)} />
          )}
          {step === "failure" && (
            <FailureState
              message={failureMessage}
              onClose={() => handleOpenChange(false)}
              onTryAgain={handleTryAgain}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
