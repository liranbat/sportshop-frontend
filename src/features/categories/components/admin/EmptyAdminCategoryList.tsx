export function EmptyAdminCategoryList() {
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
          <path d="M3 7h18" />
          <path d="M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      </div>
      <h2 className="text-heading-l text-text-primary">No categories yet</h2>
      <p className="max-w-80 text-body-small text-text-secondary">
        Click [+ New Category] to add your first one.
      </p>
    </div>
  );
}
