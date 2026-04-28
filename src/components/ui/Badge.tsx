const styles = {
  base: 'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide',
  INFO: 'border-blue-900/60 bg-blue-950/40 text-blue-300',
  WARN: 'border-yellow-900/60 bg-yellow-950/40 text-yellow-300',
  ERROR: 'border-red-900/60 bg-red-950/40 text-red-300',
  CRITICAL: 'border-red-800/80 bg-red-950/70 text-red-200',
  SUCCESS: 'border-emerald-900/60 bg-emerald-950/40 text-emerald-300',
} as const;

export type BadgeVariant = keyof Omit<typeof styles, 'base'>;

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return <span className={[styles.base, styles[variant]].join(' ')}>{children}</span>;
}

