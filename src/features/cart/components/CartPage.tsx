import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api";

// QA-only stub: hits the temporary GET /api/cart so the 401 -> refresh -> retry
// interceptor can be exercised from a real authed route. Replace with the real
// cart UI (separate api.ts/queries.ts under features/cart) when that feature lands.
const CartResponseSchema = z.object({
  items: z.array(z.unknown()),
});

async function fetchCart() {
  const { data } = await api.get<unknown>("/api/cart");
  return CartResponseSchema.parse(data);
}

export function CartPage() {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["cart", "stub"],
    queryFn: fetchCart,
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-text-secondary">
      <h2 className="text-heading-l text-text-primary">Cart</h2>
      {isPending && <p>Loading cart…</p>}
      {isError && <p className="text-error-text">Failed to load cart: {error.message}</p>}
      {data && <p>{data.items.length} item(s) in your cart.</p>}
    </div>
  );
}
