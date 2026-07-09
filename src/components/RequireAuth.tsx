import { Navigate, Outlet } from "react-router";
import { useMeQuery } from "@/features/auth";
import { paths } from "@/lib/paths";

export function RequireAuth() {
  const { data: user, isPending } = useMeQuery();

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">Loading…</div>
    );
  }

  if (!user) {
    return <Navigate to={paths.signIn()} replace />;
  }

  return <Outlet />;
}
