import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type WheelEvent } from "react";
import { cn } from "@/lib/cn";

const ERROR_LEFT_PADDING = "pl-39";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
};

export function InputField({
  label,
  error,
  endAdornment,
  containerClassName,
  className,
  ref,
  type = "text",
  onWheel,
  ...inputProps
}: Props) {
  const reactId = useId();
  const inputId = `inputfield-${reactId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hasError = Boolean(error);

  // chrome silently mutates focused <input type="number"> on wheel — blur on scroll so the
  // page scrolls instead of decrementing/incrementing the value
  const wheelHandler =
    type === "number"
      ? (e: WheelEvent<HTMLInputElement>) => {
          e.currentTarget.blur();
          onWheel?.(e);
        }
      : onWheel;

  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <div className="flex w-full items-center gap-4">
        <label htmlFor={inputId} className="w-35 shrink-0 text-body-small-bold text-text-primary">
          {label}
        </label>
        <div
          className={cn(
            "flex h-10 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-lg border bg-background-card px-4 transition-colors",
            hasError
              ? "border-error-red focus-within:border-error-red focus-within:ring-2 focus-within:ring-error-red/20"
              : "border-border-default focus-within:border-border-focus focus-within:ring-2 focus-within:ring-primary-blue/20",
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={hasError || undefined}
            aria-describedby={errorId}
            onWheel={wheelHandler}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-body-regular text-text-primary placeholder:text-text-placeholder focus:outline-none",
              className,
            )}
            {...inputProps}
          />
          {endAdornment}
        </div>
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className={cn("text-caption-regular text-error-red", ERROR_LEFT_PADDING)}
        >
          {error}
        </p>
      )}
    </div>
  );
}
