import { createBrowserRouter } from "react-router";
import App from "@/app/App";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RequireAdmin } from "@/components/RequireAdmin";
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
        path: "catalog",
        lazy: async () => {
          const { CatalogPage } = await import("@/features/catalog");
          return { Component: CatalogPage };
        },
      },
      {
        path: "products/:id",
        lazy: async () => {
          const { ProductDetailsPage } = await import("@/features/catalog");
          return { Component: ProductDetailsPage };
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
        Component: RequireAuth,
        children: [
          {
            path: "cart",
            lazy: async () => {
              const { CartPage } = await import("@/features/cart");
              return { Component: CartPage };
            },
          },
          {
            path: "orders",
            lazy: async () => {
              const { OrderHistoryPage } = await import("@/features/orders");
              return { Component: OrderHistoryPage };
            },
          },
          {
            path: "orders/:orderNumber",
            lazy: async () => {
              const { OrderDetailPage } = await import("@/features/orders");
              return { Component: OrderDetailPage };
            },
          },
          {
            path: "profile",
            lazy: async () => {
              const { ProfilePage } = await import("@/features/users");
              return { Component: ProfilePage };
            },
          },
          {
            Component: RequireAdmin,
            children: [
              {
                path: "admin/users",
                lazy: async () => {
                  const { AdminUserListPage } = await import("@/features/users");
                  return { Component: AdminUserListPage };
                },
              },
              {
                path: "profile/:userId",
                lazy: async () => {
                  const { AdminUserDetailPage } = await import("@/features/users");
                  return { Component: AdminUserDetailPage };
                },
              },
            ],
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
