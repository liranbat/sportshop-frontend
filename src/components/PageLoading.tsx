type Props = {
  label?: string;
};

export function PageLoading({ label = "Loading…" }: Props) {
  return (
    <main className="flex h-full items-center justify-center text-text-secondary">{label}</main>
  );
}
