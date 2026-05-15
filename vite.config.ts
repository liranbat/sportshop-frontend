import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const IMAGES_DIR = path.resolve(import.meta.dirname, "../images");

const MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// dev-only: serves workspace-root /images/** so the backend's relative icon
// URLs resolve against the frontend origin.
function serveWorkspaceImages(): Plugin {
  return {
    name: "serve-workspace-images",
    configureServer(server) {
      server.middlewares.use("/images", (req, res, next) => {
        const rawUrl = (req.url ?? "/").split("?")[0];
        const relative = decodeURIComponent(rawUrl).replace(/^\/+/, "");
        const filePath = path.resolve(IMAGES_DIR, relative);

        if (filePath !== IMAGES_DIR && !filePath.startsWith(IMAGES_DIR + path.sep)) {
          res.statusCode = 403;
          res.end();
          return;
        }

        fs.stat(filePath, (err, stat) => {
          if (err || !stat.isFile()) {
            next();
            return;
          }
          res.setHeader(
            "Content-Type",
            MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
          );
          res.setHeader("Cache-Control", "no-cache");
          fs.createReadStream(filePath).pipe(res);
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), serveWorkspaceImages()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
