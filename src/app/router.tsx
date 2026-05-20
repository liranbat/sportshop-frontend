import { createBrowserRouter } from "react-router";
import App from "@/app/App";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireGuest } from "@/components/RequireGuest";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import("@/features/home");
          return { Component: HomePage };
        },
      },
      {
        Component: RequireGuest,
        children: [
          {
            path: "sign-in",
            lazy: async () => {
              const { SignInPage } = await import("@/features/auth");
              return { Component: SignInPage };
            },
          },
          {
            path: "sign-up",
            lazy: async () => {
              const { SignUpPage } = await import("@/features/auth");
              return { Component: SignUpPage };
            },
          },
        ],
      },
      {
        // Layout route: RequireAuth gates every child; placeholders until the real
        // feature pages ship, so the Navbar links don't dead-end on 404.
        Component: RequireAuth,
        children: [
          {
            path: "cart",
            lazy: async () => {
              const { CartPage } = await import("@/features/cart");
              return { Component: CartPage };
            },
          },
          { path: "orders", element: <PlaceholderPage title="Orders" /> },
          {
            path: "profile",
            lazy: async () => {
              const { ProfilePage } = await import("@/features/profile");
              return { Component: ProfilePage };
            },
          },
        ],
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFound } = await import("@/components/NotFound");
          return { Component: NotFound };
        },
      },
    ],
  },
]);
