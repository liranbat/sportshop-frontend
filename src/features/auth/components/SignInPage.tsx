import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { BrandPanel } from "@/components/BrandPanel";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Notice } from "@/components/Notice";
import { PasswordField } from "@/components/PasswordField";
import { useLoginMutation } from "@/features/auth/queries";
import { LoginRequestSchema, type LoginRequest } from "@/features/auth/schema";

type ReasonNotice = { message: string; variant: "warning" | "success" };

const REASON_NOTICES: Record<string, ReasonNotice> = {
  expired: { message: "Your session expired. Sign in again to continue.", variant: "warning" },
  registered: { message: "Account created. Sign in with your new credentials.", variant: "success" },
  deleted: { message: "Your account has been deleted.", variant: "success" },
};

export function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginMutation = useLoginMutation();

  const reason = searchParams.get("reason");
  const reasonNotice = reason ? REASON_NOTICES[reason] : undefined;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  // Decouple submit-enable from RHF's touched-based isValid so the button reflects
  // real schema validity even on first render (when nothing has been blurred yet).
  const values = useWatch({ control });
  const isFormValid = LoginRequestSchema.safeParse(values).success;

  const onValid = (values: LoginRequest) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate("/", { replace: true }),
    });
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

          {reasonNotice && (
            <Notice
              message={reasonNotice.message}
              variant={reasonNotice.variant}
              className="mt-6"
            />
          )}
          {loginMutation.isError && (
            <Notice
              variant="error"
              message={loginMutation.error.message}
              className="mt-3"
            />
          )}

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
            isLoading={loginMutation.isPending}
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
