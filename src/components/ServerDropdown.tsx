import { ChevronDown, Server } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getServers } from '../api/servers';
import { DEFAULT_SERVERS, type ServerItem } from '../types/metrics';

interface Props {
  value: string;
  onChange: (server: string) => void;
}

export default function ServerDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [servers, setServers] = useState<ServerItem[]>(DEFAULT_SERVERS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch(() => setServers(DEFAULT_SERVERS));
  }, []);

  // 서버 목록 로드 후 현재 value가 목록에 없으면 첫 번째 서버로 초기화
  useEffect(() => {
    if (servers.length > 0 && !servers.find((s) => s.server_name === value)) {
      onChange(servers[0].server_name);
    }
  }, [servers, value, onChange]);

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
        <span className="flex-1 text-left">{value || '서버 선택...'}</span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {servers.map((s) => (
            <li key={s.server_name}>
              <button
                onClick={() => {
                  onChange(s.server_name);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-800 ${
                  s.server_name === value ? 'text-blue-400 bg-gray-800/50 font-medium' : 'text-gray-300'
                }`}
              >
                <Server size={13} className={s.server_name === value ? 'text-blue-400' : 'text-gray-600'} />
                <span className="flex-1">{s.server_name}</span>
                <span className="text-[10px] text-gray-500">{s.server_role}</span>
                {s.server_name === value && (
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
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
