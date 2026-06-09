import { Button } from "@/components/Button";

type Props = {
  onClick: () => void;
  isPending: boolean;
  ariaLabel: string;
};

export function RefreshButton({ onClick, isPending, ariaLabel }: Props) {
  return (
    <Button
      type="button"
      variant="outlined"
      onClick={onClick}
      isLoading={isPending}
      aria-label={ariaLabel}
      className="h-7 w-7 px-0"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    </Button>
  );
}
