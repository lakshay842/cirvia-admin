import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiAuthUser } from "@/lib/admin-user";
import { canAccessAdminPanel, normalizeAdminUser } from "@/lib/admin-user";
import type { AdminUser } from "@/types";
import { syncAuthSessionCookie } from "@/lib/auth-session";

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: ApiAuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
}

async function clearSessionCookieWithRetry(): Promise<void> {
  try {
    await syncAuthSessionCookie(false);
  } catch {
    // Retry once so middleware does not keep treating the user as logged in
    try {
      await syncAuthSessionCookie(false);
    } catch {
      // Client clear still proceeds; AuthGuard clears stale cookie on next guard pass
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: async (user, accessToken, refreshToken) => {
        const normalized = normalizeAdminUser(user);
        if (!canAccessAdminPanel(normalized)) {
          return;
        }
        set({ user: normalized, accessToken, refreshToken, isAuthenticated: true });
        try {
          await syncAuthSessionCookie(true);
        } catch {
          // Middleware falls back to client guard when cookie sync fails
        }
      },
      clearAuth: async () => {
        // Must finish before navigating to /login — middleware checks this cookie
        await clearSessionCookieWithRetry();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "cirvia-admin-auth",
      onRehydrateStorage: () => (state) => {
        if (!state?.user) return;
        state.user = normalizeAdminUser(state.user as ApiAuthUser);
        if (!canAccessAdminPanel(state.user)) {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      },
    },
  ),
);
