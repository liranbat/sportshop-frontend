import { useMutation } from "@tanstack/react-query";
import { uploadAdminImage } from "@/features/images/api";
import type { ImageResourceType } from "@/features/images/schema";

export function useImageUploadMutation(resourceType: ImageResourceType) {
  return useMutation({
    mutationFn: (file: File) => uploadAdminImage(resourceType, file),
  });
}
