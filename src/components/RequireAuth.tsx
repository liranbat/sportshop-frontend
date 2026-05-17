import { Navigate, Outlet } from "react-router";
import { useMeQuery } from "@/features/auth";

export function RequireAuth() {
  const { data: user, isPending } = useMeQuery();

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
