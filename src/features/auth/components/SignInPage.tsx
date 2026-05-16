import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { BrandPanel } from "@/components/BrandPanel";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { PasswordField } from "@/components/PasswordField";
import { SignInRequestSchema, type SignInRequest } from "@/features/auth/schema";

export function SignInPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>({
    resolver: zodResolver(SignInRequestSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  // Decouple submit-enable from RHF's touched-based isValid so the button reflects
  // real schema validity even on first render (when nothing has been blurred yet).
  const values = useWatch({ control });
  const isFormValid = SignInRequestSchema.safeParse(values).success;

  // Phase 1: no-op submit. Phase 3 will replace with useLoginMutation.
  const onValid = (values: SignInRequest) => {
    console.log("[SignIn] submit (Phase 1 no-op)", values);
  };

  return (
    <div className="flex h-full w-full">
      <BrandPanel />
      <div className="flex flex-1 overflow-y-auto bg-background-page">
        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="m-auto flex w-[480px] flex-col rounded-2xl bg-background-card p-8 shadow-card"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-heading-l text-text-primary">Welcome</h2>
            <p className="text-body-small text-text-secondary">Sign in to your account</p>
          </div>

          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            containerClassName="mt-8"
            {...register("email")}
          />
          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            containerClassName="mt-3"
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isFormValid}
            className="mx-auto mt-4 w-[380px]"
          >
            Sign In
          </Button>

          <p className="mt-8 text-center text-body-small text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="font-semibold text-primary-blue hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
