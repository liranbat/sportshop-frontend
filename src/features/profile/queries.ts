import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/queries";
import { changePassword, deleteAccount, updateProfile } from "@/features/profile/api";

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
