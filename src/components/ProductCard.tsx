import { Link } from "react-router";
import { cn } from "@/lib/cn";

type Props = {
  id: number;
  name: string;
  categoryName: string | null;
  price: number;
  imageUrl: string | null;
  className?: string;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({ id, name, categoryName, price, imageUrl, className }: Props) {
  const ariaParts = [name, categoryName, priceFormatter.format(price)].filter(
    (part): part is string => part !== null,
  );
  return (
    <Link
      to={`/products/${id}`}
      aria-label={ariaParts.join(", ")}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl bg-background-card shadow-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue",
        className,
      )}
    >
      <div className="flex aspect-square w-full items-center justify-center bg-primary-blue-light">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-caption-regular text-text-placeholder">Product Image</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        <span className="line-clamp-2 text-caption-regular font-semibold text-text-primary">
          {name}
        </span>
        {categoryName !== null && (
          <span className="text-caption-regular text-text-secondary">{categoryName}</span>
        )}
        <span className="text-body-small font-semibold text-primary-blue">
          {priceFormatter.format(price)}
        </span>
      </div>
    </Link>
  );
}
