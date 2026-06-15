import { z } from "zod";

export const SessionSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  expiresAt: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

export const SessionListPageSchema = z.object({
  items: z.array(SessionSchema),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type SessionListPage = z.infer<typeof SessionListPageSchema>;

export const SessionRevokeAllResponseSchema = z.object({
  affectedRowCount: z.number().int().nonnegative(),
});
export type SessionRevokeAllResponse = z.infer<typeof SessionRevokeAllResponseSchema>;
