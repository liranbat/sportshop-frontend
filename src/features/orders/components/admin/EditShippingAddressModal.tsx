import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { MutationErrorBanner } from "@/components/Notice";
import { StandardModal } from "@/components/StandardModal";
import { ShippingFormSchema, type ShippingForm } from "@/features/checkout/schema";
import { orderQueryKeys, useUpdateShippingAddressMutation } from "@/features/orders/queries";
import type { OrderShipping, OrderStatus } from "@/features/orders/schema";

type Props = {
  orderNumber: string;
  currentStatus: OrderStatus;
  currentShipping: OrderShipping;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditShippingAddressModal({
  orderNumber,
  currentStatus,
  currentShipping,
  open,
  onOpenChange,
}: Props) {
  const formId = useId();
  const queryClient = useQueryClient();
  const mutation = useUpdateShippingAddressMutation(orderNumber);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(ShippingFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    values: currentShipping,
  });
  const values = useWatch({ control });
  const isFormValid = ShippingFormSchema.safeParse(values).success;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (mutation.isError) {
        void queryClient.invalidateQueries({
          queryKey: orderQueryKeys.adminDetail(orderNumber),
        });
      }
      mutation.reset();
      reset(currentShipping);
    }
    onOpenChange(next);
  };

  const close = () => handleOpenChange(false);

  const onSubmit = (formValues: ShippingForm) => {
    mutation.mutate(
      { shipping: formValues, priorStatus: currentStatus },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <StandardModal
      open={open}
      onOpenChange={handleOpenChange}
      width="36rem"
      title="Edit shipping address"
      subtitle="Update the destination for this order."
      errorBanner={<MutationErrorBanner mutation={mutation} />}
      footer={
        mutation.isError ? (
          <div className="flex justify-end">
            <Button type="button" variant="primary" onClick={close}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outlined" onClick={close} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              form={formId}
              isLoading={mutation.isPending}
              disabled={!isFormValid || mutation.isPending}
            >
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        )
      }
    >
      {!mutation.isError && (
        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <InputFieldStacked
            label="Full name"
            autoComplete="name"
            reserveErrorSpace
            disabled={mutation.isPending}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <InputFieldStacked
            label="Email"
            type="email"
            autoComplete="email"
            reserveErrorSpace
            disabled={mutation.isPending}
            error={errors.email?.message}
            {...register("email")}
          />

          <InputFieldStacked
            label="Phone"
            type="tel"
            autoComplete="tel"
            reserveErrorSpace
            disabled={mutation.isPending}
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div className="flex items-start gap-3">
            <InputFieldStacked
              label="Country"
              autoComplete="country-name"
              reserveErrorSpace
              disabled={mutation.isPending}
              error={errors.country?.message}
              {...register("country")}
            />
            <InputFieldStacked
              label="City"
              autoComplete="address-level2"
              reserveErrorSpace
              disabled={mutation.isPending}
              error={errors.city?.message}
              {...register("city")}
            />
          </div>

          <InputFieldStacked
            label="Address"
            autoComplete="street-address"
            reserveErrorSpace
            disabled={mutation.isPending}
            error={errors.addressLine?.message}
            {...register("addressLine")}
          />
        </form>
      )}
    </StandardModal>
  );
}
