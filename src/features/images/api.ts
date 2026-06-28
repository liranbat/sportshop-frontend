import { api } from "@/lib/api";
import {
  ImageUploadResponseSchema,
  type ImageResourceType,
  type ImageUploadResponse,
} from "@/features/images/schema";

export async function uploadAdminImage(
  resourceType: ImageResourceType,
  file: File,
): Promise<ImageUploadResponse> {
  const body = new FormData();
  body.append("file", file);
  // header needed to override the api instance default of application/json.
  const { data } = await api.post<unknown>(`/api/admin/images/${resourceType}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return ImageUploadResponseSchema.parse(data);
}
