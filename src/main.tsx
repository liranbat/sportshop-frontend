import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/app/providers";
import { installAuthInterceptor } from "@/lib/auth-interceptor";
import "@fontsource-variable/inter";
import "@/styles/index.css";

// Install BEFORE rendering so the very first /me call from the Navbar can already
// benefit from the 401-refresh-retry flow.
installAuthInterceptor();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
