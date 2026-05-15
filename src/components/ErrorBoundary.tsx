import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { cn } from "@/lib/cn";

function getMessage(error: unknown): { title: string; detail: string } {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${String(error.status)} ${error.statusText}`,
      detail: typeof error.data === "string" ? error.data : "Route error",
    };
  }
  if (error instanceof Error) {
    return { title: "Something went wrong", detail: error.message };
  }
  return { title: "Something went wrong", detail: "An unknown error occurred." };
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { title, detail } = getMessage(error);

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100 antialiased">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-slate-400">{detail}</p>
        <Link
          to="/"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition",
            "bg-blue-600 text-white hover:bg-blue-500",
          )}
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
