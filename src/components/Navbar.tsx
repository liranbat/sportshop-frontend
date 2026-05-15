import sportshopHorizontal from "@/assets/sportshop-logos/sportshop-horizontal.png";
import { NavButton } from "@/components/NavButton";

// TODO: render LoggedIn / LoggedInAdmin variants once auth is wired up
export function Navbar() {
  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border-default bg-background-card pr-8">
      {/* explicit h-12 because <img> ignores h-full inside flex sometimes.
          scale-x-90 + origin-left = 10% narrower, anchored to the left edge */}
      <img
        src={sportshopHorizontal}
        alt="SportShop"
        className="block h-12 w-auto origin-left scale-x-90"
      />

      <nav aria-label="Primary" className="flex items-center gap-3">
        <NavButton to="/" label="Home" variant="outlined" />
        <NavButton to="/catalog" label="Catalog" variant="outlined" />
        <NavButton to="/sign-in" label="Sign In" variant="outlined" />
        <NavButton to="/sign-up" label="Sign Up" variant="filled" />
      </nav>
    </header>
  );
}
