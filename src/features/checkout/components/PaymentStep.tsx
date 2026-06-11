import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/Button";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { PaymentFormSchema, type PaymentForm } from "../schema";
import { CheckoutFooter } from "./CheckoutFooter";

type PaymentStepProps = {
  subtotal: number;
  onBack: () => void;
  onBackToCart: () => void;
  onComplete: (data: PaymentForm) => void;
};

const EMPTY_PAYMENT: PaymentForm = {
  cardNumber: "",
  cardholderName: "",
  expiry: "",
  cvc: "",
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function PaymentStep({ subtotal, onBack, onBackToCart, onComplete }: PaymentStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(PaymentFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: EMPTY_PAYMENT,
  });

  const values = useWatch({ control });
  const isFormValid = PaymentFormSchema.safeParse(values).success;

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="flex flex-1 flex-col gap-4">
      <h3 className="text-heading-m text-text-primary">Payment details</h3>

      <InputFieldStacked
        label="Card Number"
        inputMode="numeric"
        placeholder="1234 5678 9012 3456"
        autoComplete="cc-number"
        reserveErrorSpace
        error={errors.cardNumber?.message}
        {...register("cardNumber")}
      />

      <div className="flex items-start gap-3">
        <InputFieldStacked
          label="Expiry"
          inputMode="numeric"
          placeholder="MM/YY"
          autoComplete="cc-exp"
          reserveErrorSpace
          error={errors.expiry?.message}
          {...register("expiry")}
        />
        <InputFieldStacked
          label="CVV"
          inputMode="numeric"
          placeholder="123"
          autoComplete="cc-csc"
          reserveErrorSpace
          error={errors.cvc?.message}
          {...register("cvc")}
        />
      </div>

      <InputFieldStacked
        label="Name on Card"
        placeholder="John Smith"
        autoComplete="cc-name"
        reserveErrorSpace
        error={errors.cardholderName?.message}
        {...register("cardholderName")}
      />

      <CheckoutFooter
        left={
          <Button variant="outlined" onClick={onBackToCart}>
            Back to Cart
          </Button>
        }
        middle={
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
        }
        right={
          <Button type="submit" disabled={!isFormValid}>
            Complete Payment -- {priceFormatter.format(subtotal)}
          </Button>
        }
      />
    </form>
  );
}
