import {
  ImageUploadResponseSchema,
  type ImageResourceType,
  type ImageUploadResponse,
} from "@/features/images/schema";
import { postParsed } from "@/lib/api-client";

export function uploadAdminImage(
  resourceType: ImageResourceType,
  file: File,
): Promise<ImageUploadResponse> {
  const body = new FormData();
  body.append("file", file);
  // multipart header needed to override the api instance default of application/json.
  return postParsed(`/admin/images/${resourceType}`, body, ImageUploadResponseSchema, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
