"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: string;
  message: string;
  variant: "success" | "error";
}

interface ToastContextValue {
  showToast: (message: string, variant?: Toast["variant"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, variant: Toast["variant"] = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto max-w-md rounded-[3px] border px-5 py-3 text-sm shadow-xl backdrop-blur-sm ${
              toast.variant === "success"
                ? "border-gold/30 bg-espresso text-cream"
                : "border-red-900/30 bg-red-900 text-cream"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
