import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SalesCard({ title, subtitle, children }: Props) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <header className="flex items-baseline justify-between gap-2 border-b border-cart-line-divider px-4 py-3">
        <h2 className="text-body-small-bold text-text-primary">{title}</h2>
        {subtitle && <span className="text-caption-regular text-text-secondary">{subtitle}</span>}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  );
}

export function SalesCardMessage({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-40 items-center justify-center text-body-small text-text-secondary"
    >
      {message}
    </div>
  );
}
