import { Link } from "react-router";

type Variant = "outlined" | "filled" | "subtle";

type LinkProps = {
  label: string;
  variant: Variant;
  to: string;
};

type ButtonProps = {
  label: string;
  variant: Variant;
  onClick: () => void;
};

type Props = LinkProps | ButtonProps;

const VARIANT_CLASSES: Record<Variant, string> = {
  outlined:
    "border border-primary-blue text-primary-blue hover:bg-primary-blue-light",
  filled: "bg-primary-blue text-white hover:bg-primary-blue-hover",
  subtle:
    "border border-border-default text-text-primary hover:bg-background-page",
};

export function NavButton(props: Props) {
  const className = `inline-flex h-8 items-center justify-center rounded-md px-3 text-body-small transition-colors ${VARIANT_CLASSES[props.variant]}`;

  if ("onClick" in props) {
    return (
      <button type="button" onClick={props.onClick} className={className}>
        {props.label}
      </button>
    );
  }
  return (
    <Link to={props.to} className={className}>
      {props.label}
    </Link>
  );
}
