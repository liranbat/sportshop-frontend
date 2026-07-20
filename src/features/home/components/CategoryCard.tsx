import { Link } from "react-router";
import { paths } from "@/lib/paths";

type Props = {
  id: number;
  name: string;
  iconSrc: string | null;
};

export function CategoryCard({ id, name, iconSrc }: Props) {
  return (
    <Link
      to={paths.catalog()}
      state={{ categoryId: id }}
      aria-label={`Browse ${name}`}
      className="flex h-44 w-50 shrink-0 flex-col items-center justify-center gap-3 rounded-xl bg-background-card p-5 shadow-elevation-low transition-shadow hover:shadow-elevation-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
    >
      <div className="flex h-19 w-32 items-center justify-center rounded-2xl bg-section-categories">
        {iconSrc ? (
          <img src={iconSrc} alt="" className="h-12 w-12" />
        ) : (
          <span aria-hidden="true" className="text-heading-lg text-text-secondary">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-body-regular text-text-primary">{name}</span>
    </Link>
  );
}
