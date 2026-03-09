"use client";

import { Toaster } from "sonner";

export { toast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "bg-card border border-border rounded-lg shadow-lg text-card-foreground",
        },
      }}
    />
  );
}
