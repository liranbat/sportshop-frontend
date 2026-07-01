import path from "node:path";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Prod only: inject <script src="/config.js"> before the app bundle. In dev the
// SPA reads config via import.meta.env.VITE_*, so /config.js isn't needed and
// keeping the tag out avoids a 404 in the console.
const injectRuntimeConfigScript: PluginOption = {
  name: "inject-runtime-config-script",
  apply: "build",
  transformIndexHtml(html) {
    return html.replace("</head>", `    <script src="/config.js"></script>\n  </head>`);
  },
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_APP_PROXY_TARGET ?? "http://localhost:8080";
  // Same-origin in dev: forward /api/* and /images/* to the backend so axios can
  // use relative URLs and cookies stay first-party. changeOrigin=false keeps the
  // Host header as localhost:5173 so the backend's CORS allowlist still applies.
  const proxy = {
    "/api": { target: proxyTarget, changeOrigin: false },
    "/images": { target: proxyTarget, changeOrigin: false },
  };
  return {
    plugins: [react(), tailwindcss(), injectRuntimeConfigScript],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: { proxy },
    // Mirror dev so `vite preview` smoke-tests of dist/ also resolve same-origin.
    preview: { proxy },
  };
});
