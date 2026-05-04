import { ChevronDown, Server } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { SERVERS, type ServerName } from '../types/metrics';

interface Props {
  value: ServerName;
  onChange: (server: ServerName) => void;
}

export default function ServerDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full md:w-64">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl text-sm text-gray-200 hover:border-gray-600 transition-colors"
      >
        <Server size={15} className="text-blue-400 shrink-0" />
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {SERVERS.map((s) => (
            <li key={s}>
              <button
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-800 ${
                  s === value ? 'text-blue-400 bg-gray-800/50 font-medium' : 'text-gray-300'
                }`}
              >
                <Server size={13} className={s === value ? 'text-blue-400' : 'text-gray-600'} />
                {s}
                {s === value && (
                  <span className="ml-auto text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                    선택됨
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
