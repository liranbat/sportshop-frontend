import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/queries";
import {
  changePassword,
  deleteAccount,
  demoteAdminUser,
  getAdminUser,
  listUsers,
  promoteAdminUser,
  restoreAdminUser,
  softDeleteAdminUser,
  updateAdminUser,
  updateProfile,
} from "@/features/users/api";
import type { UserListParams } from "@/features/users/filters";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
};

export function useUsersListQuery(params: UserListParams) {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUserQuery(id: number) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getAdminUser(id),
    refetchOnMount: "always",
  });
}

/** PATCH /api/users/me returns the updated user. Writes the me cache so Navbar/Profile re-render. */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me(), user);
    },
  });
}

export function useUpdateAdminUserMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateAdminUser>[1]) => updateAdminUser(id, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

export function usePromoteAdminUserMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => promoteAdminUser(id),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

// self-demote: auth-interceptor flips me.isAdmin from X-Auth-Role; no me-cache write needed
export function useDemoteAdminUserMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => demoteAdminUser(id),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

export function useSoftDeleteAdminUserMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => softDeleteAdminUser(id),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

export function useRestoreAdminUserMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => restoreAdminUser(id),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

/** POST /api/users/me/password backend rotates the refresh cookie; the session stays valid. */
export function useChangePasswordMutation() {
  return useMutation({ mutationFn: changePassword });
}

/** DELETE /api/users/me clears the entire query cache. Navigation is left to the caller. */
export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
