import { Link, Navigate, useParams } from "react-router";
import { Notice } from "@/components/Notice";
import { RoleBadge } from "@/components/RoleBadge";
import { UserStatusBadge } from "@/components/UserStatusBadge";
import { ProfileCard } from "@/features/users/components/ProfileCard";
import { useAdminUserQuery, useUpdateAdminUserMutation } from "@/features/users/queries";

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const parsedId = Number(userId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to="/admin/users" replace />;
  }

  return <AdminUserDetailContent userId={parsedId} />;
}

function AdminUserDetailContent({ userId }: { userId: number }) {
  const userQuery = useAdminUserQuery(userId);
  const updateMutation = useUpdateAdminUserMutation(userId);

  if (userQuery.isPending) {
    return (
      <main className="flex h-full items-center justify-center text-text-secondary">
        Loading user…
      </main>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <main className="h-full overflow-hidden">
        <div className="flex h-full flex-col gap-4 px-6 py-4 lg:px-10 2xl:px-14">
          <Notice
            variant="error"
            message="Could not load this user. They may have been removed, or your connection dropped."
          />
          <BackRow />
        </div>
      </main>
    );
  }

  const user = userQuery.data;
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const role = user.isAdmin ? "Admin" : "User";

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
        </header>

        <BackRow />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_44rem]">
          <div className="min-h-0 overflow-y-auto">
            <ProfileCard user={user} mutation={updateMutation} />
          </div>
          {/* sidebar reserved for the Admin Actions card landing in §2.5 / §2.7 */}
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto" />
        </div>
      </div>
    </main>
  );
}

function BackRow() {
  return (
    <nav aria-label="Breadcrumb">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1 text-caption-regular text-text-secondary hover:text-primary-blue hover:underline focus-visible:text-primary-blue focus-visible:outline-none"
      >
        <ChevronLeft />
        Back to Users
      </Link>
    </nav>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
