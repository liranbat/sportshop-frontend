import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { Notice } from "@/components/Notice";
import { useCategoriesQuery } from "@/features/categories";
import { CatalogGrid } from "@/features/catalog/components/CatalogGrid";
import { CatalogPagination } from "@/features/catalog/components/CatalogPagination";
import { CatalogToolbar } from "@/features/catalog/components/CatalogToolbar";
import {
  DEFAULT_FILTERS,
  filtersEqual,
  toProductListParams,
  type PageSize,
  type StagedFilters,
} from "@/features/catalog/filters";
import { useProductsQuery } from "@/features/catalog/queries";

type CatalogIntentState = { categoryId: number };

function readIntent(state: unknown): number | null {
  if (typeof state !== "object" || state === null) return null;
  const candidate = (state as Partial<CatalogIntentState>).categoryId;
  return typeof candidate === "number" && Number.isInteger(candidate) && candidate > 0
    ? candidate
    : null;
}

export function CatalogPage() {
  const location = useLocation();

  const [intentCategoryId] = useState(() => readIntent(location.state));

  const [staged, setStaged] = useState<StagedFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedFilters>(DEFAULT_FILTERS);

  const [page, setPage] = useState(0);

  const [intentResolved, setIntentResolved] = useState(intentCategoryId === null);

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  if (!intentResolved && categoriesQuery.isSuccess) {
    if (intentCategoryId !== null && categories.some((c) => c.id === intentCategoryId)) {
      const seeded: StagedFilters = { ...DEFAULT_FILTERS, categoryIds: [intentCategoryId] };
      setStaged(seeded);
      setApplied(seeded);
    }
    setIntentResolved(true);
  }

  const appliedParams = useMemo(() => toProductListParams(applied, page), [applied, page]);
  const productsQuery = useProductsQuery(appliedParams, { enabled: intentResolved });
  const productPage = productsQuery.data;
  const products = productPage?.items ?? [];
  const totalPages = productPage?.totalPages ?? 0;

  const hasPendingEdits = !filtersEqual(staged, applied);

  const handleApply = () => {
    setPage(0);
    setApplied(staged);
  };

  const handleClear = () => {
    setPage(0);
    setStaged(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  };

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <CatalogToolbar
          staged={staged}
          setStaged={setStaged}
          categories={categories}
          hasPendingEdits={hasPendingEdits}
          onApply={handleApply}
          onClear={handleClear}
        />

        <div className="min-h-0 flex-1">
          {productsQuery.isError ? (
            <div className="flex h-full items-center justify-center">
              <Notice
                variant="error"
                message="Could not load products. Please refresh and try again."
              />
            </div>
          ) : (
            <CatalogGrid products={products} categories={categories} pageSize={applied.pageSize} />
          )}
        </div>

        <CatalogPagination
          page={page}
          pageSize={staged.pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={handleStagePageSize}
        />
      </div>
    </main>
  );
}
