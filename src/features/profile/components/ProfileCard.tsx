import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { Notice } from "@/components/Notice";
import type { UserResponse } from "@/features/auth/schema";
import { useUpdateProfileMutation } from "@/features/profile/queries";
import { UpdateProfileRequestSchema, type UpdateProfileRequest } from "@/features/profile/schema";

const SUCCESS_NOTICE_TIMEOUT_MS = 4000;

type Props = {
  user: UserResponse;
};

export function ProfileCard({ user }: Props) {
  const updateMutation = useUpdateProfileMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(UpdateProfileRequestSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    values: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
  });

  const values = useWatch({ control });
  const isFormValid = UpdateProfileRequestSchema.safeParse(values).success;

  useEffect(() => {
    if (!showSuccess) return;
    const timer = window.setTimeout(() => setShowSuccess(false), SUCCESS_NOTICE_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  const onValid = (payload: UpdateProfileRequest) => {
    updateMutation.mutate(payload, {
      onSuccess: (updated) => {
        reset({
          firstName: updated.firstName,
          lastName: updated.lastName,
          phone: updated.phone,
        });
        setShowSuccess(true);
      },
    });
  };

  const onDiscard = () => {
    reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
    updateMutation.reset();
    setShowSuccess(false);
  };

  return (
    <section className="flex w-full flex-col gap-6 rounded-2xl bg-background-card p-6 shadow-card">
      <h2 className="text-heading-m text-text-primary text-center">Personal Details</h2>

      {showSuccess && <Notice variant="success" message="Profile updated." />}
      {updateMutation.isError && !showSuccess && (
        <Notice variant="error" message={updateMutation.error.message} />
      )}

      <form onSubmit={handleSubmit(onValid)} noValidate className="flex flex-col gap-4">
        <div className="flex gap-4">
          <InputFieldStacked
            label="First Name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            containerClassName="flex-1"
            {...register("firstName")}
          />
          <InputFieldStacked
            label="Last Name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            containerClassName="flex-1"
            {...register("lastName")}
          />
        </div>

        <InputFieldStacked
          label="Email"
          type="email"
          value={user.email}
          disabled
          hint="Email cannot be changed — it's your login identifier."
          readOnly
        />

        <InputFieldStacked
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="mt-2 flex gap-3">
          <Button type="submit" isLoading={updateMutation.isPending} disabled={!isFormValid}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onDiscard}
            disabled={updateMutation.isPending}
          >
            Discard
          </Button>
        </div>
      </form>
    </section>
  );
}
