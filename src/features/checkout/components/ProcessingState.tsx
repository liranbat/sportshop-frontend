export function ProcessingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <Spinner />
      <h3 className="text-heading-m text-text-primary">Processing your order...</h3>
      <p className="text-body-regular text-text-secondary">
        Please do not close this window. We are confirming stock, taking payment, and creating your
        order.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10 animate-spin">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
        className="text-text-secondary"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-primary-blue"
      />
    </svg>
  );
}
