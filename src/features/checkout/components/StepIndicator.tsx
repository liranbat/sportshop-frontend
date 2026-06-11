import { cn } from "@/lib/cn";

type StepNumber = 1 | 2 | 3;
type StepStatus = "active" | "completed" | "inactive";

type StepIndicatorProps = {
  step: StepNumber;
};

function statusFor(current: StepNumber, index: StepNumber): StepStatus {
  if (current === index) return "active";
  if (current > index) return "completed";
  return "inactive";
}

function StepDot({ index, status }: { index: StepNumber; status: StepStatus }) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full",
        "text-body-small-bold leading-none",
        status === "active" && "bg-primary-blue text-background-card",
        status === "completed" &&
          "bg-primary-blue-light text-primary-blue ring-2 ring-inset ring-primary-blue",
        status === "inactive" && "text-text-secondary ring-2 ring-inset ring-step-inactive",
      )}
    >
      {index}
    </div>
  );
}

function StepGroup({
  index,
  label,
  status,
}: {
  index: StepNumber;
  label: string;
  status: StepStatus;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2"
      aria-current={status === "active" ? "step" : undefined}
    >
      <StepDot index={index} status={status} />
      <span
        className={cn(
          "text-body-small-bold",
          status === "active" ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Connector({ completed }: { completed: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-7 items-center">
      <span
        className={cn("block h-0.5 w-16", completed ? "bg-primary-blue" : "bg-step-inactive")}
      />
    </span>
  );
}

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <nav aria-label="Checkout progress" className="flex items-start gap-3">
      <StepGroup index={1} label="Shipping" status={statusFor(step, 1)} />
      <Connector completed={step > 1} />
      <StepGroup index={2} label="Payment" status={statusFor(step, 2)} />
      <Connector completed={step > 2} />
      <StepGroup index={3} label="Result" status={statusFor(step, 3)} />
    </nav>
  );
}
