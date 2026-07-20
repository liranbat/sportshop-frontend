import { Link } from "react-router";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/cn";
import { paths } from "@/lib/paths";

export type ProductCardView = "user" | "admin";

type Props = {
  id: number;
  name: string;
  categoryName: string | null;
  price: number;
  imageUrl: string | null;
  view: ProductCardView;
  isArchived: boolean;
  updatedAt: string | null;
  className?: string;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({
  id,
  name,
  categoryName,
  price,
  imageUrl,
  view,
  isArchived,
  updatedAt,
  className,
}: Props) {
  const isAdmin = view === "admin";
  const ariaParts = [name, categoryName, priceFormatter.format(price)].filter(
    (part): part is string => part !== null,
  );
  if (isAdmin && isArchived) ariaParts.push("Archived");

  return (
    <Link
      to={paths.products.detail(id)}
      aria-label={ariaParts.join(", ")}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-[0.6em] bg-background-card shadow-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-primary-blue-light">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="aspect-square h-full max-w-full object-cover" />
        ) : (
          <span className="text-[0.85em] text-text-placeholder">Product Image</span>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-[0.15em] px-[0.6em] py-[0.4em]">
        <span
          title={name}
          className="line-clamp-1 text-[1em] font-semibold leading-tight text-text-primary"
        >
          {name}
        </span>
        {categoryName !== null && (
          <span
            title={categoryName}
            className="truncate text-[0.85em] leading-tight text-text-secondary"
          >
            {categoryName}
          </span>
        )}
        <div className="flex items-center justify-between gap-[0.5em]">
          <span className="text-[1em] font-semibold leading-tight text-primary-blue">
            {priceFormatter.format(price)}
          </span>
          {isAdmin && isArchived && <Badge kind="ARCHIVED" label="Archived" />}
        </div>
        {isAdmin && (
          <div className="mt-[0.2em] flex items-center justify-between gap-[0.5em] text-[0.7em] text-text-secondary">
            <span>ID: {id}</span>
            {updatedAt && (
              <span title={updatedAt} className="truncate">
                Updated at {formatEditedAt(updatedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function formatEditedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

// invisible spacer — fills unused N x N cells on partial last page
export function ProductCardPlaceholder() {
  return <div aria-hidden="true" />;
}
