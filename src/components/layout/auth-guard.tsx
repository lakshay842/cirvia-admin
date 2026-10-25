"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { canAccessAdminPanel } from "@/lib/admin-user";
import { syncAuthSessionCookie } from "@/lib/auth-session";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_ROUTES = [ROUTES.login];

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [hydrated, setHydrated] = useState(false);

  const isAdmin = Boolean(user && canAccessAdminPanel(user));
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const finishHydration = () => setHydrated(true);
    if (useAuthStore.persist.hasHydrated()) {
      finishHydration();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(finishHydration);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (isAuthenticated && user && !isAdmin) {
      void clearAuth().then(() => {
        router.replace(`${ROUTES.login}?error=access_denied`);
      });
      return;
    }

    if (!isAuthenticated && !isPublic) {
      // Clear stale middleware cookie so /login is not bounced back to /dashboard
      void (async () => {
        try {
          await syncAuthSessionCookie(false);
        } catch {
          // Still attempt redirect
        }
        const redirect =
          pathname !== ROUTES.dashboard ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.replace(`${ROUTES.login}${redirect}`);
      })();
      return;
    }

    if (isAuthenticated && isAdmin && pathname === ROUTES.login) {
      router.replace(ROUTES.dashboard);
    }
  }, [hydrated, isAuthenticated, isAdmin, user, pathname, isPublic, router, clearAuth]);

  if (!hydrated) {
    return <AuthLoading />;
  }

  if (isAuthenticated && user && !isAdmin) {
    return <AuthLoading />;
  }

  if (!isAuthenticated && !isPublic) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
