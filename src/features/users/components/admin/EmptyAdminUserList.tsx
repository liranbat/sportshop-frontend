export function EmptyAdminUserList() {
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2 className="text-heading-l text-text-primary">No users yet</h2>
      <p className="max-w-80 text-body-small text-text-secondary">
        There are no users in the system to display.
      </p>
    </div>
  );
}
