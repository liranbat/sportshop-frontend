import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCategory,
  listAdminCategories,
  listCategories,
  restoreAdminCategory,
  softDeleteAdminCategory,
  updateAdminCategory,
} from "@/features/categories/api";
import type { CategorySoftDeleteRequest, CategoryWriteRequest } from "@/features/categories/schema";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoriesQueryKeys.all, "list"] as const,
  adminList: () => [...categoriesQueryKeys.all, "admin", "list"] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKeys.list(),
    queryFn: listCategories,
  });
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKeys.adminList(),
    queryFn: listAdminCategories,
  });
}

export function useCreateAdminCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryWriteRequest) => createAdminCategory(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useUpdateAdminCategoryMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryWriteRequest) => updateAdminCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useSoftDeleteAdminCategoryMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategorySoftDeleteRequest) => softDeleteAdminCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useRestoreAdminCategoryMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => restoreAdminCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}
