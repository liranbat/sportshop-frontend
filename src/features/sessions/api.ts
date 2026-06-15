import { api } from "@/lib/api";
import type { SessionListParams } from "@/features/sessions/filters";
import {
  SessionListPageSchema,
  SessionRevokeAllResponseSchema,
  type SessionListPage,
  type SessionRevokeAllResponse,
} from "@/features/sessions/schema";

export async function listAdminSessions(params: SessionListParams): Promise<SessionListPage> {
  const { data } = await api.get<unknown>("/api/admin/sessions", { params });
  return SessionListPageSchema.parse(data);
}

export async function revokeAdminSession(sessionId: number): Promise<void> {
  await api.delete(`/api/admin/sessions/${sessionId}`);
}

export async function revokeAllAdminSessions(): Promise<SessionRevokeAllResponse> {
  const { data } = await api.delete<unknown>("/api/admin/sessions", {
    params: { scope: "others" },
  });
  return SessionRevokeAllResponseSchema.parse(data);
}
