"use client";

import { Toaster } from "sonner";

export { toast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  );
}
