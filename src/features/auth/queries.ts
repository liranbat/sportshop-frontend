import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "@/features/auth/api";
import type { UserResponse } from "@/features/auth/schema";
import { ApiError } from "@/lib/api";

export const authQueryKeys = {
  all: ["auth"] as const,
  me: () => [...authQueryKeys.all, "me"] as const,
};

type UseMeQueryOptions = {
  // Pass 'always' from pages that need a fresh /me on every mount (e.g. /profile,
  // where stale data from an admin-side edit would be confusing). Default: undefined,
  // which keeps the cached value and never refetches on mount (Navbar behavior).
  refetchOnMount?: boolean | "always";
};

export function useMeQuery(options?: UseMeQueryOptions) {
  return useQuery<UserResponse | null>({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err) {
        // Anonymous session is a normal state, not an error -- resolve to null
        // so callers can render guest UI without a try/catch.
        if (err instanceof ApiError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    // login/logout/refresh write this cache directly via setQueryData, so auto-refetch
    // would only fire useless /me (and on logout, /refresh) calls.
    staleTime: Infinity,
    refetchOnMount: options?.refetchOnMount,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me(), user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: register });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me(), null);
    },
  });
}

export function useRefreshMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refresh,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me(), user);
    },
  });
}
