import { Link } from "react-router";
import { useCartCountQuery } from "@/features/cart/queries";
import { paths } from "@/lib/paths";

export function NavCartButton() {
  const { data } = useCartCountQuery();
  const count = data?.itemCount ?? 0;
  const showBadge = count > 0;
  const displayCount = count > 99 ? "99+" : String(count);

  return (
    <Link
      to={paths.cart()}
      aria-label={showBadge ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-primary-blue px-3 text-body-small text-primary-blue transition-colors hover:bg-primary-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
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
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span>Cart</span>
      {showBadge && (
        <span
          aria-hidden="true"
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-blue px-1 text-[0.625rem] font-bold text-white"
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}
