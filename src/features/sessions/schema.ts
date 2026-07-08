import { z } from "zod";
import { pageSchema } from "@/lib/schemas/pagination";

export const SessionSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  expiresAt: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

export const SessionListPageSchema = pageSchema(SessionSchema);
export type SessionListPage = z.infer<typeof SessionListPageSchema>;

export const SessionRevokeAllResponseSchema = z.object({
  affectedRowCount: z.number().int().nonnegative(),
});
export type SessionRevokeAllResponse = z.infer<typeof SessionRevokeAllResponseSchema>;
