import { useCallback, useState } from "react";
import { Navigate, useParams } from "react-router";
import { BackLink } from "@/components/BackLink";
import { Notice } from "@/components/Notice";
import { PageLoading } from "@/components/PageLoading";
import { RefreshButton } from "@/components/RefreshButton";
import { RoleBadge } from "@/components/RoleBadge";
import { UserStatusBadge } from "@/components/UserStatusBadge";
import { ProfileCard } from "@/features/users/components/ProfileCard";
import { AdminActionsCard } from "@/features/users/components/admin/AdminActionsCard";
import { useAdminUserQuery, useUpdateAdminUserMutation } from "@/features/users/queries";
import { paths } from "@/lib/paths";

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const parsedId = Number(userId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to={paths.admin.users()} replace />;
  }

  return <AdminUserDetailContent userId={parsedId} />;
}

function AdminUserDetailContent({ userId }: { userId: number }) {
  const userQuery = useAdminUserQuery(userId);
  const updateMutation = useUpdateAdminUserMutation(userId);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const handleRefresh = useCallback(() => {
    updateMutation.reset();
    setRefreshNonce((n) => n + 1);
    void userQuery.refetch();
  }, [updateMutation, userQuery]);

  if (userQuery.isPending) {
    return <PageLoading label="Loading user…" />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <main className="h-full overflow-hidden">
        <div className="flex h-full flex-col gap-4 px-6 py-4 lg:px-10 2xl:px-14">
          <Notice
            variant="error"
            message="Could not load this user. They may have been removed, or your connection dropped."
          />
          <BackLink to={paths.admin.users()} label="Back to Users" />
        </div>
      </main>
    );
  }

  const user = userQuery.data;
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const role = user.isAdmin ? "Admin" : "User";
  const isRefreshing = userQuery.isFetching;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-4 px-6 py-4 lg:px-10 2xl:px-14">
        <header className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-body-large font-semibold text-text-primary wrap-break-word">
              Profile - Admin View: {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <UserStatusBadge status={user.isDeleted ? "DELETED" : "ACTIVE"} />
              <RoleBadge role={role} />
            </div>
          </div>
          <RefreshButton
            onClick={handleRefresh}
            isPending={isRefreshing}
            ariaLabel="Refresh user details"
          />
        </header>

        <BackLink to={paths.admin.users()} label="Back to Users" />

        <div
          aria-busy={isRefreshing}
          className={`grid min-h-0 flex-1 grid-cols-1 gap-6 transition-opacity lg:grid-cols-[1fr_44rem] ${
            isRefreshing ? "opacity-60" : ""
          }`}
        >
          <fieldset disabled={isRefreshing} className="contents">
            <div className="min-h-0 overflow-y-auto">
              <ProfileCard key={`profile-${refreshNonce}`} user={user} mutation={updateMutation} />
            </div>
            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
              <AdminActionsCard key={`actions-${refreshNonce}`} user={user} />
            </div>
          </fieldset>
        </div>
      </div>
    </main>
  );
}
