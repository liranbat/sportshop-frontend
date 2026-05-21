import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/features/categories/api";
import type { CategoryListParams } from "@/features/categories/schema";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  list: (params: CategoryListParams) => [...categoriesQueryKeys.all, "list", params] as const,
};

export function useCategoriesQuery(params: CategoryListParams) {
  return useQuery({
    queryKey: categoriesQueryKeys.list(params),
    queryFn: () => listCategories(params),
  });
}
