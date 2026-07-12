import { useMemo, useState } from "react";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { RefreshButton } from "@/components/RefreshButton";
import { useAdminCategoriesQuery } from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";
import { AdminCategoryDeleteModal } from "@/features/categories/components/admin/AdminCategoryDeleteModal";
import { AdminCategoryFormModal } from "@/features/categories/components/admin/AdminCategoryFormModal";
import { AdminCategoryGrid } from "@/features/categories/components/admin/AdminCategoryGrid";
import { AdminCategoryRestoreModal } from "@/features/categories/components/admin/AdminCategoryRestoreModal";
import { EmptyAdminCategoryList } from "@/features/categories/components/admin/EmptyAdminCategoryList";
import { paths } from "@/lib/paths";

type EditTarget = Category | "create" | null;

export function CategoryManagementPage() {
  const query = useAdminCategoriesQuery();
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<Category | null>(null);

  const categories = useMemo(() => query.data ?? [], [query.data]);
  const active = useMemo(
    () =>
      categories
        .filter((c) => !c.isDeleted)
        .slice()
        .sort(byNameAsc),
    [categories],
  );
  const deleted = useMemo(
    () =>
      categories
        .filter((c) => c.isDeleted)
        .slice()
        .sort(byNameAsc),
    [categories],
  );

  const isTrueEmpty = query.isSuccess && categories.length === 0;

  const handleDeleteRequest = (category: Category) => {
    setEditTarget(null);
    setDeleteTarget(category);
  };
  const handleRestoreRequest = (category: Category) => {
    setEditTarget(null);
    setRestoreTarget(category);
  };

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <section
          aria-label="Admin category management header"
          className="flex items-center justify-between gap-2"
        >
          <h1 className="text-body-large font-semibold text-text-primary">Categories</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              className="h-7 px-3 text-body-small"
              onClick={() => setEditTarget("create")}
              disabled={query.isFetching}
            >
              + New Category
            </Button>
            <RefreshButton
              onClick={() => void query.refetch()}
              isPending={query.isFetching}
              ariaLabel="Refresh category list"
            />
          </div>
        </section>

        <BackLink to={paths.catalog()} label="Back to Catalog" />

        <div
          aria-busy={query.isFetching}
          className={`min-h-0 flex-1 overflow-y-auto py-2 transition-opacity ${
            query.isFetching ? "opacity-60" : ""
          }`}
        >
          <fieldset disabled={query.isFetching} className="contents">
            {query.isError ? (
              <div className="flex h-full items-center justify-center">
                <Notice
                  variant="error"
                  message="Could not load categories. Please refresh and try again."
                />
              </div>
            ) : isTrueEmpty ? (
              <EmptyAdminCategoryList />
            ) : (
              <AdminCategoryGrid
                active={active}
                deleted={deleted}
                onCardClick={(category) => setEditTarget(category)}
              />
            )}
          </fieldset>
        </div>
      </div>

      {editTarget !== null && (
        <AdminCategoryFormModal
          key={editTarget === "create" ? "create" : `edit-${editTarget.id}`}
          onClose={() => setEditTarget(null)}
          category={editTarget === "create" ? null : editTarget}
          onDeleteRequest={handleDeleteRequest}
          onRestoreRequest={handleRestoreRequest}
        />
      )}

      <AdminCategoryDeleteModal
        open={deleteTarget !== null}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
        category={deleteTarget}
        allCategories={categories}
      />

      <AdminCategoryRestoreModal
        open={restoreTarget !== null}
        onOpenChange={(next) => {
          if (!next) setRestoreTarget(null);
        }}
        category={restoreTarget}
      />
    </main>
  );
}

function byNameAsc(a: Category, b: Category): number {
  return a.name.localeCompare(b.name);
}
