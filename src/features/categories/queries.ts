import { useQuery } from "@tanstack/react-query";
import { listActiveCategories } from "@/features/categories/api";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  active: () => [...categoriesQueryKeys.all, "active"] as const,
};

export function useActiveCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKeys.active(),
    queryFn: listActiveCategories,
  });
}
