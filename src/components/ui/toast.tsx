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
          toast: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg text-gray-900 dark:text-gray-100",
        },
      }}
    />
  );
}
