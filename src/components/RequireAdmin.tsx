import { Navigate, Outlet } from "react-router";
import { NotFound } from "@/components/NotFound";
import { useMeQuery } from "@/features/auth/queries";
import { paths } from "@/lib/paths";

export function RequireAdmin() {
  const { data: user, isPending } = useMeQuery();

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">Loading…</div>
    );
  }

  if (!user) {
    return <Navigate to={paths.signIn()} replace />;
  }

  if (!user.isAdmin) {
    return <NotFound />;
  }

  return <Outlet />;
}
