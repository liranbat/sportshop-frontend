import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart/queries";
import { postCheckout } from "@/features/checkout/api";
import type { CheckoutRequest, CheckoutResult } from "@/features/checkout/schema";
import type { ApiError } from "@/lib/api";

// retry: 0 -- never auto-retry checkout; the user drives any retry from the UI.
export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  return useMutation<CheckoutResult, ApiError, CheckoutRequest>({
    mutationFn: postCheckout,
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.full() });
    },
  });
}
