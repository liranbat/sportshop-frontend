import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { PasswordField } from "@/components/PasswordField";
import { useChangePasswordMutation } from "@/features/users/queries";
import {
  ChangePasswordFormSchema,
  type ChangePasswordFormValues,
  type ChangePasswordRequest,
} from "@/features/users/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordModal({ open, onOpenChange }: Props) {
  const mutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const values = useWatch({ control });
  const isFormValid = ChangePasswordFormSchema.safeParse(values).success;

  const handleClose = () => {
    reset(EMPTY_VALUES);
    mutation.reset();
    onOpenChange(false);
  };

  const onValid = (form: ChangePasswordFormValues) => {
    const payload: ChangePasswordRequest = {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    };
    mutation.mutate(payload, {
      onSuccess: handleClose,
    });
  };

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      title="Change Password"
      subtitle="Enter your current password and choose a new one."
      errorBanner={
        mutation.isError ? <Notice variant="error" message={mutation.error.message} /> : undefined
      }
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            isLoading={mutation.isPending}
            disabled={!isFormValid}
          >
            Update Password
          </Button>
        </div>
      }
    >
      <form
        id="change-password-form"
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="flex flex-col gap-3"
      >
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          placeholder="Enter current password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          placeholder="Enter new password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </form>
    </AlertModal>
  );
}
