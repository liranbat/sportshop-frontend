import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  listAdminSessions,
  revokeAdminSession,
  revokeAllAdminSessions,
} from "@/features/sessions/api";
import type { SessionListParams } from "@/features/sessions/filters";

export const sessionQueryKeys = {
  all: ["admin-sessions"] as const,
  lists: () => [...sessionQueryKeys.all, "list"] as const,
  list: (params: SessionListParams) => [...sessionQueryKeys.lists(), params] as const,
};

export function useAdminSessionsListQuery(params: SessionListParams) {
  return useQuery({
    queryKey: sessionQueryKeys.list(params),
    queryFn: () => listAdminSessions(params),
    placeholderData: keepPreviousData,
  });
}

// fire-and-tell-me: cache invalidation/refetch is owned by the caller so it can
// avoid a redundant fetch of the now-stale page when it also wants to clamp pagination.
export function useRevokeAdminSessionMutation() {
  return useMutation({
    mutationFn: (sessionId: number) => revokeAdminSession(sessionId),
  });
}

export function useRevokeAllAdminSessionsMutation() {
  return useMutation({
    mutationFn: revokeAllAdminSessions,
  });
}
