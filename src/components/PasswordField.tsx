import { useState, type ComponentProps, type Ref } from "react";
import { InputField } from "@/components/InputField";

type Props = Omit<ComponentProps<typeof InputField>, "type" | "endAdornment"> & {
  ref?: Ref<HTMLInputElement>;
};

export function PasswordField({ ref, ...inputProps }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <InputField
      ref={ref}
      type={revealed ? "text" : "password"}
      autoComplete={inputProps.autoComplete ?? "current-password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...inputProps}
    />
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
