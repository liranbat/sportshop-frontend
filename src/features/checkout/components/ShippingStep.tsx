import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/Button";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { ShippingFormSchema, type ShippingForm } from "../schema";
import { CheckoutFooter } from "./CheckoutFooter";

type ShippingStepProps = {
  initialData: ShippingForm | null;
  onBackToCart: () => void;
  onComplete: (data: ShippingForm) => void;
};

const EMPTY_SHIPPING: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  addressLine: "",
};

export function ShippingStep({ initialData, onBackToCart, onComplete }: ShippingStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(ShippingFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: initialData ?? EMPTY_SHIPPING,
  });

  const values = useWatch({ control });
  const isFormValid = ShippingFormSchema.safeParse(values).success;

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="flex flex-1 flex-col gap-4">
      <h3 className="text-heading-m text-text-primary">Shipping address</h3>

      <InputFieldStacked
        label="Full Name"
        placeholder="John Smith"
        autoComplete="name"
        reserveErrorSpace
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <div className="flex items-start gap-3">
        <InputFieldStacked
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          reserveErrorSpace
          error={errors.email?.message}
          {...register("email")}
        />
        <InputFieldStacked
          label="Phone"
          type="tel"
          placeholder="0521234567"
          autoComplete="tel"
          reserveErrorSpace
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="flex items-start gap-3">
        <InputFieldStacked
          label="Country"
          placeholder="Israel"
          autoComplete="country-name"
          reserveErrorSpace
          error={errors.country?.message}
          {...register("country")}
        />
        <InputFieldStacked
          label="City"
          placeholder="Tel Aviv"
          autoComplete="address-level2"
          reserveErrorSpace
          error={errors.city?.message}
          {...register("city")}
        />
      </div>

      <InputFieldStacked
        label="Address"
        placeholder="Street name, building, apartment"
        autoComplete="street-address"
        reserveErrorSpace
        error={errors.addressLine?.message}
        {...register("addressLine")}
      />

      <CheckoutFooter
        left={
          <Button variant="outlined" onClick={onBackToCart}>
            Back to Cart
          </Button>
        }
        right={
          <Button type="submit" disabled={!isFormValid}>
            Next: Payment
          </Button>
        }
      />
    </form>
  );
}
