import { Link } from "react-router";
import { Button } from "@/components/Button";

type Props = {
  view: "user" | "admin";
};

export function EmptyOrderHistory({ view }: Props) {
  const body =
    view === "admin"
      ? "Orders will appear here as customers place them."
      : "Once you place your first order it will appear here.";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-blue-light text-primary-blue"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="8" y1="9" x2="10" y2="9" />
        </svg>
      </div>
      <h2 className="text-heading-l text-text-primary">No orders yet</h2>
      <p className="max-w-80 text-body-small text-text-secondary">{body}</p>
      {view === "user" && (
        <Link to="/catalog" className="mt-2">
          <Button variant="primary">Browse Products</Button>
        </Link>
      )}
    </div>
  );
}
