import { useState } from "react";
import sportshopHorizontal from "@/assets/sportshop-logos/sportshop-horizontal.png";
import { NavButton } from "@/components/NavButton";
import { RoleBadge } from "@/components/RoleBadge";

type NavMode = "guest" | "user" | "admin";

const NEXT_MODE: Record<NavMode, NavMode> = {
  guest: "user",
  user: "admin",
  admin: "guest",
};

const MODE_LABEL: Record<NavMode, string> = {
  guest: "Guest",
  user: "User",
  admin: "Admin",
};

// TEMPORARY: dev toggle cycles Guest -> LoggedIn (User) -> LoggedInAdmin so the
// Navbar variants can be visually approved before Phase 3 wires real auth.
// Default starts on "user" to surface the new pieces (RoleBadge + filled Sign Out).
// Removed in Phase 3 along with this whole branching switch -- Navbar will read
// useMeQuery and pick the variant from session state instead.
export function Navbar() {
  const [mode, setMode] = useState<NavMode>("user");

  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border-default bg-background-card pr-8">
      <div className="flex h-full items-center gap-3">
        {/* explicit h-12 because <img> ignores h-full inside flex sometimes.
            scale-x-90 + origin-left = 10% narrower, anchored to the left edge */}
        <img
          src={sportshopHorizontal}
          alt="SportShop"
          className="block h-12 w-auto origin-left scale-x-90"
        />
        {/* TEMPORARY dev mode toggle -- delete in Phase 3 */}
        <button
          type="button"
          onClick={() => setMode(NEXT_MODE[mode])}
          aria-label="Cycle Navbar variant (dev only)"
          title="Cycle Navbar variant (dev only -- removed in Phase 3)"
          className="inline-flex h-6 items-center rounded-md border border-dashed border-text-secondary px-2 text-caption-regular text-text-secondary hover:bg-background-page"
        >
          DEV: {MODE_LABEL[mode]}
        </button>
        {mode === "user" && <RoleBadge role="User" />}
        {mode === "admin" && <RoleBadge role="Admin" />}
      </div>

      <nav aria-label="Primary" className="flex items-center gap-3">
        {mode === "guest" ? (
          <>
            <NavButton to="/" label="Home" variant="outlined" />
            <NavButton to="/catalog" label="Catalog" variant="outlined" />
            <NavButton to="/sign-in" label="Sign In" variant="outlined" />
            <NavButton to="/sign-up" label="Sign Up" variant="filled" />
          </>
        ) : (
          <>
            <NavButton to="/" label="Home" variant="outlined" />
            <NavButton to="/catalog" label="Catalog" variant="outlined" />
            {/* Cart rendered as a plain outlined button for now; the iconified
                Nav/CartButton with quantity badge ships with the Cart feature. */}
            <NavButton to="/cart" label="Cart" variant="outlined" />
            <NavButton to="/orders" label="Orders" variant="outlined" />
            <NavButton to="/profile" label="Profile" variant="outlined" />
            {mode === "admin" && (
              <>
                <NavButton to="/admin/users" label="Users" variant="outlined" />
                <NavButton
                  to="/admin/sessions"
                  label="Sessions"
                  variant="outlined"
                />
              </>
            )}
            <NavButton
              onClick={() => {
                /* Phase 3: wire to real logout mutation */
              }}
              label="Sign Out"
              variant="filled"
            />
          </>
        )}
      </nav>
    </header>
  );
}
