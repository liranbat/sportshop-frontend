import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { Notice } from "@/components/Notice";
import { useMeQuery } from "@/features/auth/queries";
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
import { useAdminProductsQuery, useProductsQuery } from "@/features/catalog/queries";
import { paths } from "@/lib/paths";

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

  const meQuery = useMeQuery();
  const isAdmin = meQuery.data?.isAdmin === true;
  const isAuthResolved = meQuery.isSuccess || meQuery.isError;

  const [intentCategoryId] = useState(() => readIntent(location.state));

  const [staged, setStaged] = useState<StagedFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedFilters>(DEFAULT_FILTERS);

  const [page, setPage] = useState(0);

  const [intentResolved, setIntentResolved] = useState(intentCategoryId === null);
  const view = isAdmin ? "admin" : "user";
  const [prevView, setPrevView] = useState(view);

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  if (prevView !== view) {
    setPrevView(view);
    setStaged(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(0);
  }

  if (!intentResolved && categoriesQuery.isSuccess) {
    if (intentCategoryId !== null && categories.some((c) => c.id === intentCategoryId)) {
      const seeded: StagedFilters = { ...DEFAULT_FILTERS, categoryIds: [intentCategoryId] };
      setStaged(seeded);
      setApplied(seeded);
    }
    setIntentResolved(true);
  }

  const appliedParams = useMemo(
    () => toProductListParams(applied, page, isAdmin),
    [applied, page, isAdmin],
  );

  const queryEnabled = intentResolved && isAuthResolved;
  const userProductsQuery = useProductsQuery(appliedParams, { enabled: queryEnabled && !isAdmin });
  const adminProductsQuery = useAdminProductsQuery(appliedParams, {
    enabled: queryEnabled && isAdmin,
  });
  const productsQuery = isAdmin ? adminProductsQuery : userProductsQuery;

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

  const isRefreshing = productsQuery.isFetching || categoriesQuery.isFetching;

  // categories first so we can prune soft-deleted IDs from staged/applied before
  // products refetches. toolbar+pagination are disabled during refresh, so the
  // staged/applied closure snapshots can't be raced.
  const handleRefresh = async () => {
    const result = await categoriesQuery.refetch();

    if (result.isError || !result.data) {
      // categories refetch failed — still honor the click by refreshing products
      void productsQuery.refetch();
      return;
    }

    const knownIds = new Set(result.data.map((c) => c.id));
    const nextStagedIds = staged.categoryIds.filter((id) => knownIds.has(id));
    const nextAppliedIds = applied.categoryIds.filter((id) => knownIds.has(id));

    const stagedChanged = nextStagedIds.length !== staged.categoryIds.length;
    const appliedChanged = nextAppliedIds.length !== applied.categoryIds.length;

    if (stagedChanged) setStaged({ ...staged, categoryIds: nextStagedIds });
    if (appliedChanged) setApplied({ ...applied, categoryIds: nextAppliedIds });
    if (!appliedChanged) void productsQuery.refetch();
  };

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        {isAdmin && (
          <section
            aria-label="Admin catalog header"
            className="flex items-center justify-between gap-2"
          >
            <h1 className="text-body-large font-semibold text-text-primary">Catalog</h1>
            <div className="flex items-center gap-2">
              <Link
                to={paths.products.create()}
                className="inline-flex h-7 items-center justify-center rounded-lg border border-primary-blue bg-transparent px-3 text-body-small font-semibold text-primary-blue transition-colors hover:bg-primary-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
              >
                + New Product
              </Link>
              <Link
                to={paths.admin.categories()}
                className="inline-flex h-7 items-center justify-center rounded-lg border border-primary-blue bg-transparent px-3 text-body-small font-semibold text-primary-blue transition-colors hover:bg-primary-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
              >
                Category Management
              </Link>
              <Link
                to={paths.admin.stock()}
                className="inline-flex h-7 items-center justify-center rounded-lg border border-primary-blue bg-transparent px-3 text-body-small font-semibold text-primary-blue transition-colors hover:bg-primary-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
              >
                Stock Management
              </Link>
            </div>
          </section>
        )}

        <CatalogToolbar
          staged={staged}
          setStaged={setStaged}
          categories={categories}
          hasPendingEdits={hasPendingEdits}
          isRefreshing={isRefreshing}
          onApply={handleApply}
          onClear={handleClear}
          onRefresh={handleRefresh}
          isAdmin={isAdmin}
          showTitle={!isAdmin}
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
            <CatalogGrid
              products={products}
              categories={categories}
              pageSize={applied.pageSize}
              view={isAdmin ? "admin" : "user"}
            />
          )}
        </div>

        <CatalogPagination
          page={page}
          pageSize={staged.pageSize}
          totalPages={totalPages}
          disabled={isRefreshing}
          onPageChange={setPage}
          onPageSizeChange={handleStagePageSize}
        />
      </div>
    </main>
  );
}
