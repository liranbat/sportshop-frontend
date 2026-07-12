import { useCallback, useState } from "react";
import { PageLoading } from "@/components/PageLoading";
import { RefreshButton } from "@/components/RefreshButton";
import { useMeQuery } from "@/features/auth/queries";
import { ProfileCard } from "@/features/users/components/ProfileCard";
import { SecurityCard } from "@/features/users/components/SecurityCard";
import { useUpdateProfileMutation } from "@/features/users/queries";

export function ProfilePage() {
  const { data: user, isPending, isFetching, refetch } = useMeQuery({ refetchOnMount: "always" });
  const updateMutation = useUpdateProfileMutation();
  const [refreshNonce, setRefreshNonce] = useState(0);

  const handleRefresh = useCallback(() => {
    updateMutation.reset();
    setRefreshNonce((n) => n + 1);
    void refetch();
  }, [updateMutation, refetch]);

  if (isPending || !user) {
    return <PageLoading label="Loading profile…" />;
  }

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-4 px-6 py-4 lg:px-10 2xl:px-14">
        <header className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-body-large font-semibold text-text-primary">My Profile</h1>
            <p className="text-body-small text-text-secondary">
              Manage your personal details, password, and account.
            </p>
          </div>
          <RefreshButton
            onClick={handleRefresh}
            isPending={isFetching}
            ariaLabel="Refresh profile"
          />
        </header>

        <div
          aria-busy={isFetching}
          className={`grid min-h-0 flex-1 grid-cols-1 gap-6 transition-opacity lg:grid-cols-[1fr_44rem] ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <fieldset disabled={isFetching} className="contents">
            <div className="min-h-0 overflow-y-auto">
              <ProfileCard key={`profile-${refreshNonce}`} user={user} mutation={updateMutation} />
            </div>
            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
              <SecurityCard key={`security-${refreshNonce}`} />
            </div>
          </fieldset>
        </div>
      </div>
    </main>
  );
}
