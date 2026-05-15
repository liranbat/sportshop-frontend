import { z } from "zod";

const EnvSchema = z.object({
  VITE_API_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(import.meta.env);
