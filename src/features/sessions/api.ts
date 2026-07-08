import type { SessionListParams } from "@/features/sessions/filters";
import {
  SessionListPageSchema,
  SessionRevokeAllResponseSchema,
  type SessionListPage,
  type SessionRevokeAllResponse,
} from "@/features/sessions/schema";
import { deleteParsed, deleteVoid, getParsed } from "@/lib/api-client";

export function listAdminSessions(params: SessionListParams): Promise<SessionListPage> {
  return getParsed("/admin/sessions", SessionListPageSchema, { params });
}

export function revokeAdminSession(sessionId: number): Promise<void> {
  return deleteVoid(`/admin/sessions/${sessionId}`);
}

export function revokeAllAdminSessions(): Promise<SessionRevokeAllResponse> {
  return deleteParsed("/admin/sessions", SessionRevokeAllResponseSchema, {
    params: { scope: "others" },
  });
}
