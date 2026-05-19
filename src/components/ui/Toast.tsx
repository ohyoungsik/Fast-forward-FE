import { useEffect } from 'react';

type ToastVariant = 'error' | 'warning' | 'success';

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

const STYLES: Record<ToastVariant, string> = {
  error:   'bg-red-950/95 border-red-800/60 text-red-200',
  warning: 'bg-yellow-950/95 border-yellow-700/60 text-yellow-200',
  success: 'bg-green-950/95 border-green-800/60 text-green-200',
};

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ toast, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDismiss, duration);
    return () => clearTimeout(id);
  }, [toast, duration, onDismiss]);

  if (!toast) return null;

  return (
    <div
      className={[
        'fixed top-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 border px-5 py-3.5 rounded-2xl shadow-2xl',
        'text-sm font-medium animate-fade-in',
        STYLES[toast.variant],
      ].join(' ')}
    >
      <span>{toast.message}</span>
      <button
        onClick={onDismiss}
        className="opacity-50 hover:opacity-100 transition-opacity ml-1 text-base leading-none"
      >
        ✕
      </button>
    </div>
  );
}
