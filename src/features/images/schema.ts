import { z } from "zod";

export const ImageUploadResponseSchema = z.object({
  url: z.string().min(1),
});
export type ImageUploadResponse = z.infer<typeof ImageUploadResponseSchema>;

export type ImageResourceType = "products" | "categories";
