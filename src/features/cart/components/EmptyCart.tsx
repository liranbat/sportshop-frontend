import { Link } from "react-router";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { paths } from "@/lib/paths";

export function EmptyCart() {
  return (
    <EmptyState
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      }
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet."
      action={
        <Link to={paths.catalog()} className="mt-2">
          <Button variant="primary">Browse Products</Button>
        </Link>
      }
    />
  );
}
