import type { PropsWithChildren } from 'react';

export function Card({
  children,
  className = '',
}: PropsWithChildren<{
  className?: string;
}>) {
  return <div className={['bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl', className].join(' ')}>{children}</div>;
}

export function CardHeader({
  title,
  right,
  description,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h3 className="font-extrabold text-lg tracking-tight text-white">{title}</h3>
        {description ? <p className="text-gray-500 text-sm mt-1">{description}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

