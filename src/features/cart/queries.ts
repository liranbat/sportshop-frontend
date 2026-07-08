import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useMeQuery } from "@/features/auth/queries";
import {
  addCartItem,
  getCart,
  getCartCount,
  removeCartItem,
  syncCart,
  updateCartItem,
  validateCart,
} from "@/features/cart/api";
import type {
  AddCartItemRequest,
  CartCount,
  CartValidationResult,
  CartView,
} from "@/features/cart/schema";

export const cartKeys = {
  all: ["cart"] as const,
  count: () => [...cartKeys.all, "count"] as const,
  full: () => [...cartKeys.all, "full"] as const,
};

export function invalidateCartQueries(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: cartKeys.count() });
  queryClient.invalidateQueries({ queryKey: cartKeys.full() });
}

type UpdateCartItemArgs = { productId: number; size: string; quantity: number };
type RemoveCartItemArgs = { productId: number; size: string };

/** Cheap navbar badge query. Only enabled when the user is authed. */
export function useCartCountQuery() {
  const { data: user } = useMeQuery();
  return useQuery<CartCount>({
    queryKey: cartKeys.count(),
    queryFn: getCartCount,
    enabled: !!user,
    staleTime: 90_000,
  });
}

// First call per fresh mount goes through sync (so every navigation into /cart
// acknowledges seller-side version bumps). All subsequent refetches while still
// mounted -- triggered by +/-/remove invalidations -- go through the read-only
// GET so quantity tweaks don't silently bump versions.
export function useCartQuery() {
  const { data: user } = useMeQuery();
  const isFirstFetchRef = useRef(true);
  // ref is a per-mount flag, intentionally not part of the cache identity
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  return useQuery<CartView>({
    queryKey: cartKeys.full(),
    queryFn: () => {
      if (isFirstFetchRef.current) {
        isFirstFetchRef.current = false;
        return syncCart();
      }
      return getCart();
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, AddCartItemRequest>({
    mutationFn: addCartItem,
    onSettled: () => invalidateCartQueries(queryClient),
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateCartItemArgs>({
    mutationFn: ({ productId, size, quantity }) => updateCartItem(productId, size, { quantity }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.full() });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RemoveCartItemArgs>({
    mutationFn: ({ productId, size }) => removeCartItem(productId, size),
    onSettled: () => invalidateCartQueries(queryClient),
  });
}

/** Refresh-icon button on the cart header + the modal's "Update Cart". */
export function useSyncCartMutation() {
  const queryClient = useQueryClient();
  return useMutation<CartView, Error, void>({
    mutationFn: syncCart,
    onSuccess: (cart) => {
      queryClient.setQueryData<CartView>(cartKeys.full(), cart);
      queryClient.setQueryData<CartCount>(cartKeys.count(), { itemCount: cart.itemCount });
    },
  });
}

/** Proceed-to-Checkout entry point. Writes the cart back so the page shows the latest states behind the modal. */
export function useValidateCartMutation() {
  const queryClient = useQueryClient();
  return useMutation<CartValidationResult, Error, void>({
    mutationFn: validateCart,
    onSuccess: (result) => {
      queryClient.setQueryData<CartView>(cartKeys.full(), result.cart);
      queryClient.setQueryData<CartCount>(cartKeys.count(), {
        itemCount: result.cart.itemCount,
      });
    },
  });
}
