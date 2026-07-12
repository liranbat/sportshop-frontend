import { Suspense } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { PageLoading } from "@/components/PageLoading";

function App() {
  return (
    <div className="flex h-screen flex-col font-sans text-text-primary antialiased">
      <Navbar />
      {/* min-h-0 so the page below can actually scroll inside this flex column */}
      <div className="min-h-0 flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </div>
      <Toaster position="top-center" closeButton richColors duration={5000} />
    </div>
  );
}

export default App;
