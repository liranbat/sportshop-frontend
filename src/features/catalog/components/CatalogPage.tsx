import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { Notice } from "@/components/Notice";
import { useCategoriesQuery } from "@/features/categories";
import { CatalogGrid } from "@/features/catalog/components/CatalogGrid";
import { CatalogToolbar } from "@/features/catalog/components/CatalogToolbar";
import {
  DEFAULT_FILTERS,
  toProductListParams,
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

  const [intentResolved, setIntentResolved] = useState(intentCategoryId === null);

  const categoriesQuery = useCategoriesQuery({ active: true });
  const categories = categoriesQuery.data ?? [];

  if (!intentResolved && categoriesQuery.isSuccess) {
    if (intentCategoryId !== null && categories.some((c) => c.id === intentCategoryId)) {
      const seeded: StagedFilters = { ...DEFAULT_FILTERS, categoryIds: [intentCategoryId] };
      setStaged(seeded);
      setApplied(seeded);
    }
    setIntentResolved(true);
  }

  const appliedParams = useMemo(() => toProductListParams(applied), [applied]);
  const productsQuery = useProductsQuery(appliedParams, { enabled: intentResolved });
  const products = productsQuery.data ?? [];

  return (
    <main className="h-full overflow-y-auto bg-background-page">
      <div className="flex flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <CatalogToolbar
          staged={staged}
          setStaged={setStaged}
          categories={categories}
          onApply={() => setApplied(staged)}
          onClear={() => {
            setStaged(DEFAULT_FILTERS);
            setApplied(DEFAULT_FILTERS);
          }}
        />
        {productsQuery.isError ? (
          <Notice
            variant="error"
            message="Could not load products. Please refresh and try again."
          />
        ) : (
          <CatalogGrid products={products} categories={categories} />
        )}
      </div>
    </main>
  );
}
