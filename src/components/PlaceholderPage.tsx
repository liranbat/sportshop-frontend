type Props = {
  title: string;
};

export function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-background-page">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-heading-l text-text-primary">{title}</h2>
        <p className="text-body-small text-text-secondary">Coming soon.</p>
      </div>
    </div>
  );
}
