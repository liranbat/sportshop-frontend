import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMeQuery } from "@/features/auth/queries";
import {
  addCartItem,
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

export function useCartQuery() {
  const { data: user } = useMeQuery();
  return useQuery<CartView>({
    queryKey: cartKeys.full(),
    queryFn: syncCart,
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, AddCartItemRequest>({
    mutationFn: addCartItem,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.full() });
    },
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.full() });
    },
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
