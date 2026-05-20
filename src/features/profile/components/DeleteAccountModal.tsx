import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { PasswordField } from "@/components/PasswordField";
import { WarningTile } from "@/components/WarningTile";
import { useDeleteAccountMutation } from "@/features/profile/queries";
import {
  DeleteAccountRequestSchema,
  type DeleteAccountRequest,
} from "@/features/profile/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_VALUES: DeleteAccountRequest = { currentPassword: "" };

export function DeleteAccountModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const mutation = useDeleteAccountMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DeleteAccountRequest>({
    resolver: zodResolver(DeleteAccountRequestSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const values = useWatch({ control });
  const isFormValid = DeleteAccountRequestSchema.safeParse(values).success;

  const handleClose = () => {
    reset(EMPTY_VALUES);
    mutation.reset();
    onOpenChange(false);
  };

  const onValid = (payload: DeleteAccountRequest) => {
    mutation.mutate(payload, {
      onSuccess: () => {
        // queryClient.clear() already ran inside the mutation hook
        navigate("/sign-in?reason=deleted", { replace: true });
      },
    });
  };

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      width="36rem"
      icon={<WarningTile />}
      title="Delete your account?"
      subtitle="This removes your profile, saved cart, and active sessions. Orders you have already placed will remain in our records. Your email address will stay reserved and cannot be used to register again."
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
            Keep Account
          </Button>
          <Button
            type="submit"
            form="delete-account-form"
            variant="danger"
            isLoading={mutation.isPending}
            disabled={!isFormValid}
          >
            Delete account
          </Button>
        </div>
      }
    >
      <form
        id="delete-account-form"
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="flex flex-col gap-3"
      >
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          placeholder="Enter your password to confirm"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
      </form>
    </AlertModal>
  );
}
