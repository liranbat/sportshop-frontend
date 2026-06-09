import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { BrandPanel } from "@/components/BrandPanel";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Notice } from "@/components/Notice";
import { PasswordField } from "@/components/PasswordField";
import { useRegisterMutation } from "@/features/auth/queries";
import {
  SignUpFormSchema,
  type RegisterRequest,
  type SignUpFormValues,
} from "@/features/auth/schema";

export function SignUpPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Decouple submit-enable from RHF's touched-based isValid so the button reflects
  // real schema validity even on first render (when nothing has been blurred yet).
  const values = useWatch({ control });
  const isFormValid = SignUpFormSchema.safeParse(values).success;

  const onValid = (values: SignUpFormValues) => {
    // confirmPassword is form-only; build the API payload explicitly so it can't leak.
    const payload: RegisterRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };
    registerMutation.mutate(payload, {
      onSuccess: () => navigate("/sign-in?reason=registered", { replace: true }),
    });
  };

  return (
    <div className="flex h-full w-full">
      <BrandPanel />
      <div className="flex flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="m-auto flex w-120 flex-col rounded-2xl bg-background-card p-8 shadow-card"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-heading-l text-text-primary">Create Account</h2>
            <p className="text-body-small text-text-secondary">Join SportShop today</p>
          </div>

          {registerMutation.isError && (
            <Notice variant="error" message={registerMutation.error.message} className="mt-6" />
          )}

          <InputField
            label="First Name"
            autoComplete="given-name"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            containerClassName="mt-8"
            {...register("firstName")}
          />
          <InputField
            label="Last Name"
            autoComplete="family-name"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            containerClassName="mt-3"
            {...register("lastName")}
          />
          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            containerClassName="mt-3"
            {...register("email")}
          />
          <InputField
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone"
            error={errors.phone?.message}
            containerClassName="mt-3"
            {...register("phone")}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            containerClassName="mt-3"
            {...register("password")}
          />
          <PasswordField
            label="Confirm Password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            containerClassName="mt-3"
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            isLoading={registerMutation.isPending}
            disabled={!isFormValid}
            className="mx-auto mt-4 w-95"
          >
            Create Account
          </Button>

          <p className="mt-8 text-center text-body-small text-text-secondary">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-semibold text-primary-blue hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
