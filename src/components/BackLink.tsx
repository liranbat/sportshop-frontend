import { Link } from "react-router";

type Props = {
  to: string;
  label: string;
};

export function BackLink({ to, label }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-caption-regular text-text-secondary hover:text-primary-blue hover:underline focus-visible:text-primary-blue focus-visible:outline-none"
      >
        <ChevronLeft />
        {label}
      </Link>
    </nav>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
