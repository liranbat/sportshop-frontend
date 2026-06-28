type Props = {
  filtered: boolean;
  onClearFilters: () => void;
};

export function EmptyStockManagementList({ filtered, onClearFilters }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-blue-light text-primary-blue"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M3.27 6.96 12 12.01l8.73-5.05" />
          <path d="M12 22.08V12" />
        </svg>
      </div>
      {filtered ? (
        <>
          <h2 className="text-heading-l text-text-primary">No stock rows match your filters</h2>
          <p className="max-w-80 text-body-small text-text-secondary">
            Try clearing the filters to see all rows.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-body-small font-semibold text-primary-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h2 className="text-heading-l text-text-primary">No stock to manage yet</h2>
          <p className="max-w-80 text-body-small text-text-secondary">
            Stock rows show up here once products with sizes exist.
          </p>
        </>
      )}
    </div>
  );
}
