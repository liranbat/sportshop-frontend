import { useState } from "react";
import { Button } from "@/components/Button";
import type { UserResponse } from "@/features/auth/schema";
import { AdminUserDemoteModal } from "@/features/users/components/admin/AdminUserDemoteModal";
import { AdminUserPromoteModal } from "@/features/users/components/admin/AdminUserPromoteModal";

type Props = {
  user: UserResponse;
};

// hidden entirely for soft-deleted users
export function AdminActionsCard({ user }: Props) {
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [demoteOpen, setDemoteOpen] = useState(false);

  const showPromote = !user.isAdmin && !user.isDeleted;
  const showDemote = user.isAdmin && !user.isDeleted;

  if (!showPromote && !showDemote) {
    return null;
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl bg-background-card p-6 shadow-card">
      <h2 className="text-heading-m text-text-primary text-center">Admin Actions</h2>

      {showPromote && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-body-small-bold text-text-primary">Promote to Admin</p>
            <p className="text-body-small text-text-secondary">
              Grant admin privileges to this user.
            </p>
          </div>
          <Button variant="outlined" onClick={() => setPromoteOpen(true)} className="w-32 shrink-0">
            Promote
          </Button>
        </div>
      )}

      {showDemote && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-body-small-bold text-text-primary">Demote from Admin</p>
            <p className="text-body-small text-text-secondary">
              Remove admin privileges from this user.
            </p>
          </div>
          <Button
            variant="outlined"
            onClick={() => setDemoteOpen(true)}
            className="w-32 shrink-0 border-error-red text-error-red hover:bg-error-bg"
          >
            Demote
          </Button>
        </div>
      )}

      <AdminUserPromoteModal open={promoteOpen} onOpenChange={setPromoteOpen} user={user} />
      <AdminUserDemoteModal open={demoteOpen} onOpenChange={setDemoteOpen} user={user} />
    </section>
  );
}
