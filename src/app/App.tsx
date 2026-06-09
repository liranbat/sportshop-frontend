import { Suspense } from "react";
import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";

function App() {
  return (
    <div className="flex h-screen flex-col font-sans text-text-primary antialiased">
      <Navbar />
      {/* min-h-0 so the page below can actually scroll inside this flex column */}
      <div className="min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-text-secondary">
              Loading…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
