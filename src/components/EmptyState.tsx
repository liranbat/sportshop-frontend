import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-blue-light text-primary-blue"
      >
        {icon}
      </div>
      <h2 className="text-heading-l text-text-primary">{title}</h2>
      {description && <p className="max-w-80 text-body-small text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
