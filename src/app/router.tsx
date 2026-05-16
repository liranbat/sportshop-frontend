import { createBrowserRouter } from "react-router";
import App from "@/app/App";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
