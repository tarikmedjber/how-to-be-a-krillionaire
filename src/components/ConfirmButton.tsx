import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
  onConfirm: () => void;
}

const RESET_MS = 3000;

/** Two-click confirmation, since dialogs like confirm() are easy to dismiss by accident. */
export function ConfirmButton({ children, confirmLabel = "Click again to confirm", className, onConfirm }: Props) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), RESET_MS);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
