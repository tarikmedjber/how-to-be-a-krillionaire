import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ToastContext } from "./toastContext.ts";

const TOAST_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const show = useCallback((message: string) => setToast({ message, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
