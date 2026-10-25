"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ACTIVE_NAV } from "@/constants/navigation";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/auth-store";
import { useHasAnyPermission } from "@/hooks/use-permission";

export function PermissionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const navItem = ACTIVE_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const allowed = useHasAnyPermission(navItem?.permission ? [navItem.permission] : []);

  useEffect(() => {
    if (user && navItem?.permission && !allowed) {
      router.replace(ROUTES.dashboard);
    }
  }, [allowed, navItem?.permission, router, user]);

  if (user && navItem?.permission && !allowed) {
    return null;
  }

  return <>{children}</>;
}
