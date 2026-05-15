import { Link } from "react-router";

type Variant = "outlined" | "filled";

type Props = {
  to: string;
  label: string;
  variant: Variant;
};

export function NavButton({ to, label, variant }: Props) {
  const baseClasses =
    "inline-flex h-8 items-center justify-center rounded-md px-3 text-body-small transition-colors";

  const variantClasses =
    variant === "filled"
      ? "bg-primary-blue text-white hover:bg-primary-blue-hover"
      : "border border-primary-blue text-primary-blue hover:bg-primary-blue-light";

  return (
    <Link to={to} className={`${baseClasses} ${variantClasses}`}>
      {label}
    </Link>
  );
}
