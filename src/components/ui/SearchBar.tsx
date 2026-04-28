import { Search } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = '검색...',
  right,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-7">
      <div className="flex-1 flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl shadow-inner">
        <Search className="text-gray-600" size={18} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm focus:outline-none text-gray-200 placeholder:text-gray-600"
        />
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

