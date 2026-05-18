export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  emptyText = '표시할 데이터가 없습니다.',
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/20">
          <tr className="text-gray-400">
            {columns.map((c) => (
              <th key={c.key} className={['px-4 py-3 text-xs font-semibold uppercase tracking-wider', c.className ?? ''].join(' ')}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={['hover:bg-white/[0.03] transition-colors', onRowClick ? 'cursor-pointer' : ''].join(' ')}
              >
                {columns.map((c) => (
                  <td key={c.key} className={['px-4 py-3 align-top text-gray-200', c.className ?? ''].join(' ')}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

