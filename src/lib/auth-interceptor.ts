import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { api, ApiError } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { refresh } from "@/features/auth/api";
import { authQueryKeys } from "@/features/auth/queries";

// Endpoints whose 401 is the expected protocol answer, NOT "your access token timed out":
//   /refresh -- a 401 here IS the refresh failure; another retry would loop.
//   /login   -- a 401 here means wrong credentials; refresh wouldn't help.
//   /me      -- on cold boot a guest's /me 401s by definition; we still attempt refresh
//               (so an expired-but-recoverable session is auto-renewed), but if THAT also
//               401s we treat it as "just a guest" and don't redirect to /sign-in.
const REFRESH_PATH = "/api/auth/refresh";
const LOGIN_PATH = "/api/auth/login";
const ME_PATH = "/api/auth/me";

type RetryableConfig = InternalAxiosRequestConfig & { _retriedAfterRefresh?: boolean };

let installed = false;
let refreshInflight: Promise<void> | null = null;

export function installAuthInterceptor() {
  if (installed) return;
  installed = true;

  api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const axiosError = unwrapAxiosError(error);
      const config = axiosError?.config as RetryableConfig | undefined;
      const status = axiosError?.response?.status;
      const url = config?.url;

      const eligible =
        status === 401 &&
        config !== undefined &&
        !config._retriedAfterRefresh &&
        url !== REFRESH_PATH &&
        url !== LOGIN_PATH;

      if (!eligible) {
        return Promise.reject(error);
      }

      try {
        await runRefreshOnce();
      } catch {
        // Refresh itself failed. For /me this is "just a guest" -- let the 401 propagate
        // so useMeQuery resolves to null without booting the user to /sign-in. For every
        // other endpoint, the session is genuinely dead and we redirect.
        if (url !== ME_PATH) {
          handleSessionDead();
        }
        return Promise.reject(error);
      }

      config._retriedAfterRefresh = true;
      return api.request(config);
    },
  );
}

function unwrapAxiosError(error: unknown): AxiosError | null {
  if (error instanceof AxiosError) return error;
  if (error instanceof ApiError && error.cause instanceof AxiosError) return error.cause;
  return null;
}

// Multiple in-flight requests can 401 simultaneously.
// Single-flight ensures one refresh call, and every caller awaits its result.
function runRefreshOnce(): Promise<void> {
  if (refreshInflight) return refreshInflight;
  refreshInflight = refresh()
    .then((user) => {
      queryClient.setQueryData(authQueryKeys.me(), user);
    })
    .finally(() => {
      refreshInflight = null;
    });
  return refreshInflight;
}

function handleSessionDead(): void {
  queryClient.setQueryData(authQueryKeys.me(), null);
  window.location.assign("/sign-in?reason=expired");
}
