"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:block"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">Enterprise control center</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Premium admin experience for the{" "}
            <span className="text-gradient">Cirvia platform</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Secure access to users, hosts, events, bookings, payments, and system health —
            designed for scale and clarity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
