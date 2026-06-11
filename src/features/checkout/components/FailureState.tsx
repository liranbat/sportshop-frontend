import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { CheckoutFooter } from "./CheckoutFooter";

type FailureStateProps = {
  message: string;
  onClose: () => void;
  onTryAgain: () => void;
};

export function FailureState({ message, onClose, onTryAgain }: FailureStateProps) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-bg">
          <AlertIcon />
        </div>

        <h3 className="mt-4 text-heading-l text-text-primary">Something went wrong</h3>

        <div className="mt-6 w-full">
          <Notice variant="error" message={message} />
        </div>
      </div>

      <CheckoutFooter
        left={
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        }
        right={<Button onClick={onTryAgain}>Try Again</Button>}
      />
    </>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-error-red">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
