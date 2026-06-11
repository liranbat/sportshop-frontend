import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
  containerClassName?: string;
  // when true, always render the caption row so the field has a constant total height
  // regardless of whether an error is showing — prevents form layout shift on validation
  reserveErrorSpace?: boolean;
  ref?: Ref<HTMLInputElement>;
};

export function InputFieldStacked({
  label,
  error,
  hint,
  endAdornment,
  containerClassName,
  className,
  type = "text",
  disabled,
  reserveErrorSpace,
  ref,
  ...inputProps
}: Props) {
  const reactId = useId();
  const inputId = `inputfield-stacked-${reactId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "text-body-small-bold",
          disabled ? "text-text-secondary" : "text-text-primary",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg border px-4 transition-colors",
          disabled
            ? "border-border-default bg-background-page"
            : hasError
              ? "border-error-red bg-background-card focus-within:border-error-red focus-within:ring-2 focus-within:ring-error-red/20"
              : "border-border-default bg-background-card focus-within:border-border-focus focus-within:ring-2 focus-within:ring-primary-blue/20",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-regular placeholder:text-text-placeholder focus:outline-none",
            disabled ? "cursor-not-allowed text-text-secondary" : "text-text-primary",
            className,
          )}
          {...inputProps}
        />
        {endAdornment}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-caption-regular text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-caption-regular text-error-red">
          {error}
        </p>
      )}
      {reserveErrorSpace && !error && !hint && (
        <p aria-hidden="true" className="invisible text-caption-regular">
          {"\u00A0"}
        </p>
      )}
    </div>
  );
}
