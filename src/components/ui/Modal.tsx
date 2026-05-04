import { useEffect, type PropsWithChildren } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
}>) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-gray-900 px-7 py-5">
          <h3 className="text-white font-extrabold tracking-tight">{title ?? ''}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/[0.04]"
          >
            닫기
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
}

