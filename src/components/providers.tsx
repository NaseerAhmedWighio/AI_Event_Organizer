"use client";

import * as React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster richColors position="top-right" />
    </ToastProvider>
  );
}
