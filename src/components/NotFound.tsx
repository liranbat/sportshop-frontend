export function NotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-heading-l text-text-primary">404 — page not found</h2>
        <p className="text-body-small text-text-secondary">
          The page you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  );
}
