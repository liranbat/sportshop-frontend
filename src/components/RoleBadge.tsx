import { cn } from "@/lib/cn";

type Props = {
  role: "User" | "Admin";
};

// Sizing and palette match Figma `Nav/RoleBadge`; rendered immediately right
// of the logo on logged-in Navbar variants.
export function RoleBadge({ role }: Props) {
  return (
    <span
      aria-label={`Role: ${role}`}
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-body-small-bold",
        role === "Admin"
          ? "bg-primary-blue text-white"
          : "bg-primary-blue-light text-primary-blue",
      )}
    >
      {role}
    </span>
  );
}
