import { cn } from "@/lib/cn";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
};

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  ariaLabel,
  className,
}: Props) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 items-stretch overflow-hidden rounded-lg border border-border-default bg-background-card",
        className,
      )}
    >
      <StepperButton
        ariaLabel="Decrease quantity"
        disabled={!canDecrement}
        onClick={() => onChange(value - 1)}
      >
        -
      </StepperButton>
      <span
        aria-live="polite"
        className="flex w-10 items-center justify-center text-body-small-bold text-text-primary tabular-nums"
      >
        {value}
      </span>
      <StepperButton
        ariaLabel="Increase quantity"
        disabled={!canIncrement}
        onClick={() => onChange(value + 1)}
      >
        +
      </StepperButton>
    </div>
  );
}

function StepperButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center bg-quantity-control-bg text-body-regular text-text-primary transition-opacity",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-blue",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}
