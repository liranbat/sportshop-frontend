import { Navigate } from "react-router";
import { useMeQuery } from "@/features/auth/queries";
import { ProfileCard } from "@/features/profile/components/ProfileCard";
import { SecurityCard } from "@/features/profile/components/SecurityCard";

export function ProfilePage() {
  // refetchOnMount: 'always' forces a fresh /me on every visit so the form never
  // shows stale data (e.g. after an admin-side edit during the user's session).
  // isFetching covers both the first-ever fetch and the forced refetch.
  const { data: user, isFetching } = useMeQuery({ refetchOnMount: "always" });

  if (isFetching) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    // /me 401 is caught in queryFn and resolved to null -> redirect.
    // Network errors keep `data` pointing at the last successful value, so we
    // silently fall back to the cached user instead of redirecting.
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <main className="h-full overflow-y-auto bg-background-page">
      <div className="mx-auto flex w-full max-w-150 flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-heading-l text-text-primary">My Profile</h1>
          <p className="text-body-small text-text-secondary">
            Manage your personal details, password, and account.
          </p>
        </header>

        <ProfileCard user={user} />
        <SecurityCard />
      </div>
    </main>
  );
}
