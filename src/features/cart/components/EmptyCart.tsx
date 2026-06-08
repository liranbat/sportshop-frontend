import { Link } from "react-router";
import { Button } from "@/components/Button";

export function EmptyCart() {
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
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <h2 className="text-heading-l text-text-primary">Your cart is empty</h2>
      <p className="max-w-80 text-body-small text-text-secondary">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <Link to="/catalog" className="mt-2">
        <Button variant="primary">Browse Products</Button>
      </Link>
    </div>
  );
}
