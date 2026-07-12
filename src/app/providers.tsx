import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "@/lib/query";
import { router } from "@/app/router";

// QueryClientProvider must wrap RouterProvider — route guards and lazy pages call query hooks on mount.
export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
