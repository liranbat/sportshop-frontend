// Dev: iterate VITE_APP_* from .env. Prod: read window.APP_CONFIG written by
// entrypoint.sh from APP_* container env. Adding a value = only .env + .env.prod.

declare global {
  interface Window {
    APP_CONFIG?: Record<string, string>;
  }
}

const DEV_PREFIX = "VITE_APP_";

function buildFromViteEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith(DEV_PREFIX) && typeof value === "string") {
      out[key.slice(DEV_PREFIX.length)] = value;
    }
  }
  return out;
}

export const config: Record<string, string> = import.meta.env.DEV
  ? buildFromViteEnv()
  : (window.APP_CONFIG ?? {});
