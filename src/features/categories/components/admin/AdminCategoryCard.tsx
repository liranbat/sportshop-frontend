import { StatusBadge } from "@/components/StatusBadge";
import type { Category } from "@/features/categories/schema";
import { cn } from "@/lib/cn";

type Props = {
  category: Category;
  onClick: () => void;
};

export function AdminCategoryCard({ category, onClick }: Props) {
  const isDeleted = category.isDeleted;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isDeleted ? `Edit deleted category ${category.name}` : `Edit category ${category.name}`
      }
      className="group relative flex h-44 w-50 shrink-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl bg-background-card p-5 shadow-elevation-low transition-shadow hover:shadow-elevation-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
    >
      {isDeleted && (
        <div className="absolute top-2 right-2 z-10">
          <StatusBadge state="DELETED" />
        </div>
      )}
      <div
        className={cn(
          "flex w-full flex-col items-center gap-3 transition-opacity",
          isDeleted && "opacity-60",
        )}
      >
        <div className="flex h-19 w-32 items-center justify-center rounded-2xl bg-section-categories">
          {category.icon ? (
            <img src={category.icon} alt="" className="h-12 w-12" />
          ) : (
            <span aria-hidden="true" className="text-heading-lg text-text-secondary">
              {category.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-body-regular text-text-primary">{category.name}</span>
      </div>
    </button>
  );
}
