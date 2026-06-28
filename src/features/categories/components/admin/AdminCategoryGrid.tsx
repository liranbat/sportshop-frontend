import type { Category } from "@/features/categories/schema";
import { AdminCategoryCard } from "@/features/categories/components/admin/AdminCategoryCard";

type Props = {
  active: readonly Category[];
  deleted: readonly Category[];
  onCardClick: (category: Category) => void;
};

export function AdminCategoryGrid({ active, deleted, onCardClick }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <CardZone categories={active} onCardClick={onCardClick} />

      {deleted.length > 0 && (
        <>
          <DeletedDivider count={deleted.length} />
          <CardZone categories={deleted} onCardClick={onCardClick} />
        </>
      )}
    </div>
  );
}

function CardZone({
  categories,
  onCardClick,
}: {
  categories: readonly Category[];
  onCardClick: (category: Category) => void;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-6">
      {categories.map((category) => (
        <AdminCategoryCard
          key={category.id}
          category={category}
          onClick={() => onCardClick(category)}
        />
      ))}
    </div>
  );
}

function DeletedDivider({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border-default" />
      <span className="text-body-small text-text-secondary">Deleted ({count})</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}
