import { Link } from "react-router";
import { cn } from "@/lib/cn";

export function NotFound() {
  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100 antialiased">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">404 — page not found</h1>
        <p className="text-slate-400">The page you’re looking for doesn’t exist.</p>
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
