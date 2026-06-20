import { useNavigate } from "react-router";
import sportshopHorizontal from "@/assets/sportshop-logos/sportshop-horizontal.png";
import { NavButton } from "@/components/NavButton";
import { NavCartButton } from "@/components/NavCartButton";
import { RoleBadge } from "@/components/RoleBadge";
import { useLogoutMutation, useMeQuery } from "@/features/auth";

export function Navbar() {
  const { data: user, isPending } = useMeQuery();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleSignOut = () => {
    navigate("/", { replace: true });
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
        {user?.isAdmin === true && <RoleBadge role="Admin" />}
        {user && !user.isAdmin && <RoleBadge role="User" />}
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
      <NavButton to="/" label="Home" variant="outlined" />
      <NavButton to="/catalog" label="Catalog" variant="outlined" />
      <NavButton to="/sign-in" label="Sign In" variant="outlined" />
      <NavButton to="/sign-up" label="Sign Up" variant="filled" />
    </>
  );
}

function AuthedLinks({ isAdmin, onSignOut }: { isAdmin: boolean; onSignOut: () => void }) {
  return (
    <>
      <NavButton to="/" label="Home" variant="outlined" />
      <NavButton to="/catalog" label="Catalog" variant="outlined" />
      <NavCartButton />
      <NavButton to="/orders" label="Orders" variant="outlined" />
      <NavButton to="/profile" label="Profile" variant="outlined" />
      {isAdmin && (
        <>
          <NavButton to="/admin/users" label="Users" variant="outlined" />
          <NavButton to="/admin/sessions" label="Sessions" variant="outlined" />
          {/* TEMP: Phase 1 entry point. Sub-topic 9.8 reserves the entry for the
              Catalog admin variant header (Phase 2.B); remove this link then. */}
          <NavButton to="/admin/category-management" label="Categories" variant="outlined" />
        </>
      )}
      <NavButton onClick={onSignOut} label="Sign Out" variant="filled" />
    </>
  );
}
