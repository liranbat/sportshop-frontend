import { useNavigate } from "react-router";
import sportshopHorizontal from "@/assets/sportshop-logos/sportshop-horizontal.png";
import { Badge } from "@/components/Badge";
import { NavButton } from "@/components/NavButton";
import { NavCartButton } from "@/components/NavCartButton";
import { config } from "@/config";
import { useLogoutMutation, useMeQuery } from "@/features/auth/queries";
import { paths } from "@/lib/paths";

export function Navbar() {
  const { data: user, isPending } = useMeQuery();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleSignOut = () => {
    navigate(paths.home(), { replace: true });
    logoutMutation.mutate();
  };

  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border-default bg-background-card pr-8">
      <div className="flex h-full items-center gap-3">
        {/* explicit h-12 because <img> ignores h-full inside flex sometimes */}
        <img
          src={sportshopHorizontal}
          alt="SportShop"
          className="block h-12 w-auto origin-left scale-x-90"
        />
        {config.ENV_LABEL && config.ENV_LABEL !== "prod" && (
          <span
            aria-label={`Environment: ${config.ENV_LABEL}`}
            className="rounded bg-primary-blue-light px-1.5 py-0.5 text-caption font-semibold tracking-wide text-primary-blue uppercase"
          >
            {config.ENV_LABEL}
          </span>
        )}
        {user?.isAdmin === true && <Badge kind="ROLE_ADMIN" label="Admin" />}
        {user && !user.isAdmin && <Badge kind="ROLE_USER" label="User" />}
      </div>

      <nav aria-label="Primary" className="flex items-center gap-3">
        {!isPending &&
          (!user ? (
            <GuestLinks />
          ) : (
            <AuthedLinks isAdmin={user.isAdmin} onSignOut={handleSignOut} />
          ))}
      </nav>
    </header>
  );
}

function GuestLinks() {
  return (
    <>
      <NavButton to={paths.home()} label="Home" variant="outlined" />
      <NavButton to={paths.catalog()} label="Catalog" variant="outlined" />
      <NavButton to={paths.signIn()} label="Sign In" variant="outlined" />
      <NavButton to={paths.signUp()} label="Sign Up" variant="filled" />
    </>
  );
}

function AuthedLinks({ isAdmin, onSignOut }: { isAdmin: boolean; onSignOut: () => void }) {
  return (
    <>
      <NavButton to={paths.home()} label="Home" variant="outlined" />
      <NavButton to={paths.catalog()} label="Catalog" variant="outlined" />
      <NavCartButton />
      <NavButton to={paths.orders.list()} label="Orders" variant="outlined" />
      <NavButton to={paths.profile.me()} label="Profile" variant="outlined" />
      {isAdmin && (
        <>
          <NavButton to={paths.admin.users()} label="Users" variant="outlined" />
          <NavButton to={paths.admin.sessions()} label="Sessions" variant="outlined" />
        </>
      )}
      <NavButton onClick={onSignOut} label="Sign Out" variant="filled" />
    </>
  );
}
