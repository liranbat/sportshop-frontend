import { useState } from "react";
import { Button } from "@/components/Button";
import { ChangePasswordModal } from "@/features/profile/components/ChangePasswordModal";
import { DeleteAccountModal } from "@/features/profile/components/DeleteAccountModal";

export function SecurityCard() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl bg-background-card p-6 shadow-card">
      <h2 className="text-heading-m text-text-primary text-center">Security</h2>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-small-bold text-text-primary">Password</p>
          <p className="text-body-small text-text-secondary">
            Change the password you use to sign in.
          </p>
        </div>
        <Button
          variant="outlined"
          onClick={() => setChangePasswordOpen(true)}
          className="w-44 shrink-0"
        >
          Change Password
        </Button>
      </div>

      <hr className="border-border-default" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-small-bold text-text-primary">Delete account</p>
          <p className="text-body-small text-text-secondary">
            Your data will be removed and you won&apos;t be able to sign in again. Orders you
            have already placed are kept for record.
          </p>
        </div>
        <Button
          variant="outlined"
          onClick={() => setDeleteAccountOpen(true)}
          className="w-44 shrink-0 border-error-red text-error-red hover:bg-error-bg"
        >
          Delete Account
        </Button>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <DeleteAccountModal open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen} />
    </section>
  );
}
